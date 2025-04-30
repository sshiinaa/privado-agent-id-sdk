const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { createPrivadoCallback } = require("../src");

async function main() {

    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
    });


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


    const result = await executor.run("What is the capital of France?");


    console.log("Agent response:", result);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}

main().catch(console.error); 