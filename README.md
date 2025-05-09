# @privado/agent-id-sdk

A SDK for signing and verifying AI agent responses using Lit Protocol.

## Installation

```bash
npm install @privado/agent-id-sdk
```

## Quick Start

```javascript
const { createPrivadoCallback } = require('@privado/agent-id-sdk');
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { ChatOpenAI } = require("langchain/chat_models/openai");

async function main() {
    // Create callback handler
    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
    });

    // Initialize agent
    const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo",
    });

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [],
    });

    const executor = new AgentExecutor({
        agent,
        tools: [],
        callbacks: [privadoCallback],
    });

    // Run the agent
    const result = await executor.invoke({
        input: "What is the capital of France?"
    });

    console.log("Agent response:", result);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}
```

## Configuration

The SDK requires two environment variables:

- `LIT_PKP_PUBLIC_KEY`: Your Lit Protocol PKP public key
- `ETHEREUM_PRIVATE_KEY`: Your Ethereum private key

## Features

- Sign AI agent responses using Ethereum private keys
- Generate Decentralized Identifiers (DIDs) for agent responses
- Verify the authenticity of agent responses
- Seamless integration with LangChain

## API Reference

### createPrivadoCallback(config)

Creates a new PrivadoCallback instance.

#### Parameters

- `config` (Object):
  - `litPkpPublicKey` (string): Your Lit Protocol PKP public key
  - `ethereumPrivateKey` (string): Your Ethereum private key

#### Returns

- `PrivadoCallback`: A callback handler instance

## License

MIT 