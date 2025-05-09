require('dotenv').config();
const { createPrivadoCallback } = require('../src');
const { createOpenAIFunctionsAgent, AgentExecutor } = require("langchain/agents");
const { ChatOpenAI } = require("@langchain/openai");

async function main() {
    // 创建回调处理器
    const privadoCallback = createPrivadoCallback({
        litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
        ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
    });

    // 初始化 AI 模型
    const llm = new ChatOpenAI({
        temperature: 0,
        modelName: "gpt-3.5-turbo",
    });

    // 创建 AI 代理
    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: [], // 这里可以添加工具
    });

    // 创建执行器
    const executor = new AgentExecutor({
        agent,
        tools: [],
        callbacks: [privadoCallback],
    });

    // 运行 AI 代理
    const result = await executor.invoke({
        input: "What is the capital of France?"
    });

    // 输出结果
    console.log("Agent response:", result);
    console.log("Signed message:", result.signedMessage);
    console.log("Agent DID:", result.agentDID);
}

// 运行测试
main().catch(console.error); 