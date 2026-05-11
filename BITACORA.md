# Bitácora de cambios — Fase 3: Telegram Agent UI

Registro de todos los cambios realizados para lograr que el bot funcionara correctamente
con Groq como proveedor LLM y la UI web integrada.

---

## Cambio 1 — Creación de `application.properties`

**Archivo:** `src/main/resources/application.properties`
**Tipo:** Archivo nuevo (antes solo existía `.example`)

El proyecto solo traía un archivo `.example` como plantilla. Se creó el archivo real
con la configuración apuntando a Groq como proveedor LLM.

**Configuración final:**

```properties
spring.application.name=telegram-agent-ui-phase3

telegram.bot.name=${TELEGRAM_BOT_NAME:oracle_demo_bot}
telegram.bot.token=${TELEGRAM_BOT_TOKEN:...}

agent.ai.enabled=true
agent.ai.base-url=https://api.groq.com/openai/v1
agent.ai.api-key=${AGENT_AI_API_KEY:...}
agent.ai.model=llama-3.3-70b-versatile

logging.level.root=INFO
logging.level.com.oraclebot=DEBUG
```

**Por qué Groq funciona con esta configuración:**
Groq expone una API 100% compatible con OpenAI (`/v1/chat/completions`).
El código original fue escrito para OpenAI pero al cambiar solo el `base-url` y el `model`
funciona sin modificar la lógica de negocio.

---

## Cambio 2 — Corrección de sintaxis en `application.properties`

**Archivo:** `src/main/resources/application.properties`
**Tipo:** Bug fix

Al ingresar las credenciales, la propiedad `telegram.bot.name` quedó con la llave
de cierre `}` faltante, lo que podría causar errores en la resolución de propiedades
de Spring.

```properties
# Antes (inválido)
telegram.bot.name=${TELEGRAM_BOT_NAME:oracle_demo_bot

# Después (correcto)
telegram.bot.name=${TELEGRAM_BOT_NAME:oracle_demo_bot}
```

---

## Cambio 3 — Bug fix de URI en `LlmIntentParser`

**Archivo:** `src/main/java/com/oraclebot/phase3/agent/LlmIntentParser.java`
**Tipo:** Bug crítico — causa raíz: 404 Not Found

### Problema

El código original usaba `URI.create("/chat/completions")` como URI relativa del `RestClient`.
Cuando Spring resuelve una URI relativa con barra inicial (`/`) contra una URL base que
tiene path (`/openai/v1`), Java descarta el path base y reemplaza todo:

```
Base:     https://api.groq.com/openai/v1
+ URI:    /chat/completions
= Resultado: https://api.groq.com/chat/completions   ← INCORRECTO (404)
```

En el segundo intento se cambió a `"chat/completions"` (sin barra), pero Spring
simplemente concatena sin separador:

```
Base:     https://api.groq.com/openai/v1
+ URI:    chat/completions
= Resultado: https://api.groq.com/openai/v1chat/completions  ← INCORRECTO (404)
```

### Solución

Se eliminó el uso de `.baseUrl()` en el `RestClient` y se construye la URL completa
de forma explícita antes de la llamada:

```java
// Antes
RestClient client = RestClient.builder()
    .baseUrl(aiProps.getBaseUrl())
    ...
    .build();

client.post()
    .uri(URI.create("/chat/completions"))  // ← problemático
    ...

// Después
String endpoint = aiProps.getBaseUrl().replaceAll("/$", "") + "/chat/completions";

RestClient client = RestClient.builder()  // sin baseUrl
    ...
    .build();

client.post()
    .uri(endpoint)  // URL completa y explícita
    ...
```

**URL resultante correcta:** `https://api.groq.com/openai/v1/chat/completions` ✅

---

## Cambio 4 — Añadir `response_format` para forzar JSON

**Archivo:** `src/main/java/com/oraclebot/phase3/agent/LlmIntentParser.java`
**Tipo:** Mejora de robustez

Se añadió el parámetro `response_format` al payload del request. Groq lo soporta
y garantiza que el modelo devuelva siempre JSON válido, evitando fallos en el
`objectMapper.readValue()` cuando el modelo añade texto adicional fuera del JSON.

```java
payload.put("response_format", Map.of("type", "json_object"));
```

---

## Cambio 5 — Reemplazar `Map.of()` por `HashMap` en el payload

**Archivo:** `src/main/java/com/oraclebot/phase3/agent/LlmIntentParser.java`
**Tipo:** Bug preventivo

`Map.of()` de Java lanza `NullPointerException` si cualquier valor es `null`.
Si alguna propiedad no estuviera configurada (p. ej. `model` nulo) o si el mensaje
llegara vacío, el crash ocurría dentro del `try-catch` y era silencioso (fallback),
pero en condiciones de borde podía escapar.

Se reemplazaron todos los `Map.of()` del payload por `HashMap` que sí aceptan `null`,
y se añadió una guardia explícita para `messageText`:

```java
// Antes
Map<String, Object> payload = Map.of(
    "model", aiProps.getModel(),
    "messages", List.of(
        Map.of("role", "user", "content", messageText)  // NPE si messageText es null
    ),
    ...
);

// Después
Map<String, Object> userMsg = new HashMap<>();
userMsg.put("role", "user");
userMsg.put("content", messageText == null ? "" : messageText);  // guardia explícita

Map<String, Object> payload = new HashMap<>();
payload.put("model", aiProps.getModel());
payload.put("messages", messages);
...
```

---

## Resumen de errores resueltos

| # | Error | Causa | Solución |
|---|-------|-------|----------|
| 1 | `404 Not Found: Unknown request URL: POST /openai/v1chat/completions` | URI relativa concatenada sin `/` | Construir URL completa explícita |
| 2 | `404 Not Found: Unknown request URL: POST /chat/completions` | URI con `/` inicial descarta el path base | Misma solución anterior |
| 3 | `401 Unauthorized: expired_api_key` | API key de Groq vencida | Regenerar key en console.groq.com/keys |

---

## Estado final

- Bot de Telegram: **funcional** ✅
- UI Web (`http://localhost:8080`): **funcional** ✅
- Parser LLM con Groq (`llama-3.3-70b-versatile`): **funcional** ✅ (requiere API key vigente)
- Fallback rule-based: **activo automáticamente** si el LLM falla ✅

## Cambio 6 — Hardening de configuración y README

**Archivos:**
- `telegram-agent-ui-phase3 original/src/main/resources/application.properties`
- `telegram-agent-ui-phase3 original/README.md`

**Tipo:** Alineación operativa + seguridad de credenciales

Se dejó el archivo `application.properties` creado y funcional, pero sin secretos hardcodeados.
Los valores sensibles (`TELEGRAM_BOT_TOKEN`, `AGENT_AI_API_KEY`) se consumen por variables de entorno.

También se corrigió la documentación de arranque para quitar la ruta `starter/...` que no existe
en esta versión del workspace.

**Resultado:**
- Setup local más seguro (sin llaves en repo) ✅
- Instrucciones de ejecución consistentes con la estructura actual ✅

## Arranque

```bash
cd "telegram-agent-ui-phase3 original"
mvn spring-boot:run
```
