require('dotenv').config();
const { createPrivadoCallback } = require('../src');
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { ChatOpenAI } = require("@langchain/openai");

async function main() {
    // Create callback handler
    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
    });

    // Initialize AI model
    const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo",
    });

    // Create AI agent
    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [], // Tools can be added here
    });

    // Create executor
    const executor = new AgentExecutor({
        agent,
        tools: [],
        callbacks: [privadoCallback],
    });

    // Run AI agent
    const result = await executor.invoke({
        input: "What is the capital of France?"
    });

    // Output results
    console.log("Agent response:", result);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}

// Run test
main().catch(console.error); 