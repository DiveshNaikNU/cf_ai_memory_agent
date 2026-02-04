# cf_ai_memory_agent

An AI-powered conversational agent with persistent memory, built on Cloudflare's edge infrastructure using Workers AI and the Agents SDK.

## 🚀 Live Demo

**[https://cloudflare-ai-agent.iamdiv99.workers.dev](https://cloudflare-ai-agent.iamdiv99.workers.dev)**

| Requirement | Implementation |
|-------------|----------------|
| **LLM** | Llama 3.1 8B via Cloudflare Workers AI |
| **Workflow/Coordination** | Cloudflare Agents SDK + Durable Objects |
| **User Input (Chat)** | Real-time WebSocket chat interface |
| **Memory/State** | SQLite persistence in Durable Objects |

## 🏗️ Architecture

```
┌─────────────────┐     WebSocket      ┌──────────────────┐
│   Browser UI    │◄──────────────────►│  Cloudflare      │
│   (React Chat)  │                    │  Worker          │
└─────────────────┘                    └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │  Chat Agent      │
                                       │  (Durable Object)│
                                       │  ┌────────────┐  │
                                       │  │  SQLite    │  │
                                       │  │  Memory    │  │
                                       │  └────────────┘  │
                                       └────────┬─────────┘
                                                │
                                                ▼
                                       ┌──────────────────┐
                                       │   Workers AI     │
                                       │  (Llama 3.1 8B)  │
                                       └──────────────────┘
```

## 🌟 Features

- **Real-time Chat**: WebSocket-based instant messaging
- **Persistent Memory**: Conversations saved across sessions using Durable Objects SQLite
- **Edge Deployment**: Runs globally on Cloudflare's network
- **No API Keys**: Uses free Workers AI (no OpenAI key required)
- **Modern UI**: Clean, responsive chat interface

## 📁 Project Structure

```
cf_ai_memory_agent/
├── src/
│   ├── server.ts       # Main agent + worker entry point
│   ├── app.tsx         # React chat UI
│   ├── tools.ts        # Tool definitions
│   └── utils.ts        # Utility functions
├── public/             # Static assets
├── wrangler.jsonc      # Cloudflare configuration
├── package.json        # Dependencies
├── README.md           # This file
└── PROMPTS.md          # AI prompts used in development
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- Cloudflare account (free tier works)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cf_ai_memory_agent.git
cd cf_ai_memory_agent

# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Deploy to Production

```bash
npm run deploy
```

## 🔧 Configuration

### wrangler.jsonc

The project uses these Cloudflare bindings:

```jsonc
{
  "ai": {
    "binding": "AI"
  },
  "durable_objects": {
    "bindings": [
      {
        "name": "Chat",
        "class_name": "Chat"
      }
    ]
  }
}
```

## 💬 How It Works

1. **User connects** via WebSocket to their unique chat agent instance
2. **Messages are saved** to the Durable Object's SQLite database
3. **Context is built** from conversation history
4. **Llama 3.1** generates responses via Workers AI
5. **Responses stream** back to the user in real-time

## 🔗 Technologies Used

- **Cloudflare Workers** - Serverless compute
- **Cloudflare Workers AI** - LLM inference (Llama 3.1 8B)
- **Cloudflare Durable Objects** - Stateful storage
- **Agents SDK** - Agent framework
- **React** - Frontend UI
- **Vite** - Build tool
- **TypeScript** - Type safety

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/)
- Powered by [Workers AI](https://developers.cloudflare.com/workers-ai/)
