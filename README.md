# Privado LangChain SDK

A TypeScript SDK for integrating Privado ID with LangChain using Lit Protocol.

## Installation

```bash
npm install @privado/privado-langchain-sdk
```

## Usage

```typescript
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createPrivadoCallback } from "@privado/privado-langchain-sdk";

// Create PrivadoCallback instance
const privadoCallback = createPrivadoCallback({
  litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
  ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
});

// Initialize agent executor
const executor = await initializeAgentExecutorWithOptions(
  [], // tools array
  new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  }),
  {
    agentType: "openai-functions",
    callbacks: [privadoCallback],
  }
);

// Run the agent
const result = await executor.run("What is the capital of France?");

// Access signed response and DID
console.log("Agent response:", result);
console.log("Signed message:", result.signedMessage);
console.log("Agent DID:", result.agentDID);
```

## Configuration

The SDK requires the following environment variables:

- `LIT_PKP_PUBLIC_KEY`: Your Lit Protocol PKP public key
- `ETHEREUM_PRIVATE_KEY`: Your Ethereum private key for signing messages

## Features

- Integration with LangChain agents
- Message signing using Lit Protocol
- DID (Decentralized Identifier) generation
- TypeScript support
- Comprehensive error handling

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the SDK
npm run build

# Lint code
npm run lint
```

## License

MIT 