# PROMPTS.md - AI Prompts Used During Development

This document records the AI prompts and assistance used during the development of this project, as required by the assignment guidelines.

## Project Setup

### Prompt 1: Initial Project Creation
```
I need to build an AI-powered application on Cloudflare that includes:
- LLM (Llama 3.3 on Workers AI)
- Workflow/coordination (Durable Objects)
- User input via chat
- Memory or state

Help me design the architecture and create the project using the Cloudflare Agents starter template.
```

### Prompt 2: Starter Template
```
npm create cloudflare@latest cloudflare-ai-agent -- --template=cloudflare/agents-starter
```

## Converting from OpenAI to Workers AI

### Prompt 3: Switching LLM Provider
```
The starter template uses OpenAI by default. How do I switch it to use 
Cloudflare Workers AI with Llama 3.3 instead? I don't want to use an API key.
```

### Prompt 4: Fixing TypeScript Errors
```
I'm getting this TypeScript error:
"Argument of type '@cf/meta/llama-3.3-70b-instruct-fp8-fast' is not assignable to parameter of type 'TextGenerationModels'"

How do I fix this while still using the Llama model?
```

**Solution:** Added `@ts-ignore` comment to bypass TypeScript's strict model checking.

### Prompt 5: Fixing Tool Calling Error
```
I'm getting this error in the logs:
"Error: jsonSchema not initialized"

The chat works for the first message but fails after that.
```

**Solution:** Removed the `tools` parameter from `streamText()` because Llama models on Workers AI don't support OpenAI-style function/tool calling.

## Server Configuration

### Prompt 6: Final Server Implementation
```
Create a simplified server.ts that:
1. Uses workers-ai-provider package
2. Uses Llama 3.1 8B model
3. Doesn't use tool calling (to avoid jsonSchema errors)
4. Has a friendly system prompt
5. Properly handles the chat message stream
```

## System Prompt Development

### Prompt 7: AI System Prompt
The final system prompt used in the agent:

```
You are a friendly and helpful AI assistant powered by Llama running on Cloudflare Workers AI.

Guidelines:
- Be conversational, warm, and helpful
- Give direct, informative answers to questions
- If someone greets you, greet them back warmly
- Keep responses concise but informative
- You can help with general knowledge, coding, math, writing, explanations, and more
- Always provide a substantive response

Current date: [dynamic date]
```

## Deployment

### Prompt 8: Deploying to Cloudflare
```
How do I deploy this to Cloudflare Workers and get a live URL?
```

**Commands used:**
```bash
npx wrangler login
npm run deploy
```

## Debugging

### Prompt 9: Checking Logs
```
The AI responses are empty. How do I debug what's happening?
```

**Solution:** Used `npx wrangler tail` to view live logs and identified the `jsonSchema not initialized` error.

### Prompt 10: Workers.dev Subdomain
```
I'm getting an error about needing to register a workers.dev subdomain.
How do I set this up?
```

**Solution:** Registered subdomain through Cloudflare dashboard at Workers & Pages settings.

---

## AI Tools Used

- **Claude (Anthropic)**: Primary development assistant for:
  - Architecture design
  - Code generation and debugging
  - TypeScript error resolution
  - Documentation writing

## Summary of AI-Assisted Changes

| File | AI Assistance |
|------|---------------|
| `src/server.ts` | Complete rewrite to use Workers AI instead of OpenAI |
| `README.md` | Generated project documentation |
| `PROMPTS.md` | This file documenting AI usage |

## Key Learnings

1. Cloudflare's Agents SDK starter uses OpenAI by default
2. `workers-ai-provider` package enables Vercel AI SDK compatibility with Workers AI
3. Llama models don't support OpenAI-style tool/function calling
4. TypeScript types may not include all available model names (use `@ts-ignore`)
5. Workers AI requires remote mode and a registered workers.dev subdomain
