import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { createPrivadoCallback } from "../src";
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function main() {
    // Create PrivadoCallback instance
    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY || "",
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY || "",
    });

    const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo",
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful AI assistant."],
        ["human", "{input}"],
    ]);

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [],
        prompt,
    });

    const executor = new AgentExecutor({
        agent,
        tools: [],
        callbacks: [privadoCallback],
    });

    const result = await executor.invoke({
        input: "What is the capital of France?"
    });

    // Log results
    console.log("Agent response:", result);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}

main().catch(console.error); 