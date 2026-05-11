# Telegram Agent UI Phase 3

Tercera variante del ejemplo didactico.

Esta version toma como base el sistema agentico de `telegram-agent-phase2` y agrega una interfaz web para:

- gestionar tareas desde navegador
- consultar el sistema desde un panel de chat
- reutilizar el mismo asistente que responde en Telegram

## Objetivo

Mostrar una evolucion completa:

1. bot con comandos
2. bot agente con lenguaje natural
3. sistema multicanal: Telegram + UI web + asistente web

## Canales incluidos

- Telegram: mensajes al bot
- Web UI: lista y alta de tareas
- Web Chat: asistente que consulta y actua sobre el sistema

## Arquitectura

- `bot/TelegramAgentBot.java`: canal Telegram
- `agent/AgentOrchestrator.java`: cerebro del asistente
- `service/InMemoryProjectWorkspaceService.java`: dominio demo
- `controller/TaskController.java`: API REST de tareas
- `controller/AssistantController.java`: API REST del chat
- `src/main/resources/static/index.html`: UI web
- `src/main/resources/static/app.js`: frontend de tareas y chat
- `src/main/resources/static/styles.css`: estilos

## Que demuestra

- un mismo orquestador puede servir a multiples interfaces
- Telegram no tiene que ser el unico canal del bot
- la UI web y el bot pueden compartir servicios y reglas

## Configuracion

Entrar al proyecto:

```bash
cd "telegram-agent-ui-phase3 original"
```

Copiar propiedades:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Editar:

```properties
telegram.bot.name=${TELEGRAM_BOT_NAME:oracle_demo_bot}
telegram.bot.token=${TELEGRAM_BOT_TOKEN:}
```

Opcional para parser con LLM:

```properties
agent.ai.enabled=${AGENT_AI_ENABLED:true}
agent.ai.base-url=${AGENT_AI_BASE_URL:https://api.groq.com/openai/v1}
agent.ai.api-key=${AGENT_AI_API_KEY:}
agent.ai.model=${AGENT_AI_MODEL:llama-3.3-70b-versatile}
```

Exportar variables recomendadas antes de ejecutar:

```bash
export TELEGRAM_BOT_TOKEN=TU_TOKEN
export AGENT_AI_API_KEY=TU_GROQ_API_KEY
```

En PowerShell:

```powershell
$env:TELEGRAM_BOT_TOKEN="TU_TOKEN"
$env:AGENT_AI_API_KEY="TU_GROQ_API_KEY"
cd "telegram-agent-ui-phase3 original"
mvn spring-boot:run
```

## Ejecutar localmente

```bash
mvn spring-boot:run
```

## Probar

- UI web: [http://localhost:8080](http://localhost:8080)
- Telegram: escribir al bot

## Flujo recomendado en clase

1. crear tareas desde la UI
2. consultarlas desde el chat web
3. consultarlas tambien desde Telegram
4. explicar que ambos canales usan el mismo `AgentOrchestrator`

## Siguiente evolucion

Reemplazar la implementacion en memoria por una capa real conectada al backend y la base de datos del proyecto.

