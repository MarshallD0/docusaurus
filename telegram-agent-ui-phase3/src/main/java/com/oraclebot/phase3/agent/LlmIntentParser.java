package com.oraclebot.phase3.agent;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oraclebot.phase3.config.AiProps;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class LlmIntentParser implements IntentParser {

    private static final Logger logger = LoggerFactory.getLogger(LlmIntentParser.class);

    private final AiProps aiProps;
    private final ObjectMapper objectMapper;
    private final RuleBasedIntentParser fallbackParser;

    public LlmIntentParser(AiProps aiProps, ObjectMapper objectMapper, RuleBasedIntentParser fallbackParser) {
        this.aiProps = aiProps;
        this.objectMapper = objectMapper;
        this.fallbackParser = fallbackParser;
    }

    @Override
    public ParsedIntent parse(String messageText) {
        if (messageText == null || messageText.isBlank()) {
            return fallbackParser.parse("");
        }

        if (!aiProps.isEnabled() || aiProps.getApiKey() == null || aiProps.getApiKey().isBlank()) {
            return fallbackParser.parse(messageText);
        }

        try {
            String endpoint = aiProps.getBaseUrl().replaceAll("/$", "") + "/chat/completions";

            RestClient client = RestClient.builder()
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + aiProps.getApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

            String systemPrompt = """
                Eres un clasificador de intenciones para un asistente de gestion agile.
                Debes responder solo JSON valido.
                Intenciones permitidas:
                HELP
                LIST_TASKS
                LIST_TASKS_BY_ASSIGNEE
                LIST_TASKS_BY_STATUS
                CREATE_TASK
                CURRENT_SPRINT_SUMMARY
                TEAM_LOAD_SUMMARY
                UNKNOWN

                Devuelve JSON con:
                intent, assignee, status, title, storyPoints, sprintName, clarificationNeeded, clarificationQuestion.
                Si falta informacion importante, pide aclaracion.
                """;

            Map<String, Object> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);

            Map<String, Object> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", messageText == null ? "" : messageText);

            List<Map<String, Object>> messages = new ArrayList<>();
            messages.add(systemMsg);
            messages.add(userMsg);

            Map<String, Object> responseFormat = new HashMap<>();
            responseFormat.put("type", "json_object");

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", aiProps.getModel());
            payload.put("messages", messages);
            payload.put("temperature", 0);
            payload.put("response_format", responseFormat);

            String responseBody = client.post()
                .uri(endpoint)
                .body(payload)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isMissingNode() || content.asText().isBlank()) {
                return fallbackParser.parse(messageText);
            }

            return objectMapper.readValue(content.asText(), ParsedIntent.class);
        } catch (Exception ex) {
            logger.warn("Fallo el parser LLM. Uso fallback local.", ex);
            return fallbackParser.parse(messageText);
        }
    }
}

