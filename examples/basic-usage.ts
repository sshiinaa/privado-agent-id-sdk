import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createPrivadoCallback } from "../src";

async function main() {
    // Create PrivadoCallback instance
    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY || "",
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY || "",
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
    const response = await executor.run("What is the capital of France?");
    const result = {
        output: response as string,
        signedMessage: (response as any).signedMessage,
        agentDID: (response as any).agentDID
    };

    // Log results
    console.log("Agent response:", result.output);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}

main().catch(console.error); 