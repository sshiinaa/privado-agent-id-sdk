declare module '@privado/agent-id-sdk' {
    interface PrivadoConfig {
        litPkpPublicKey: string;
        ethereumPrivateKey: string;
    }

    interface SignMessageResult {
        signedMessage: string;
        did: string;
    }

    class PrivadoCallback {
        constructor(config: PrivadoConfig);
        onAgentFinish(output: any, runId: string, parentRunId: string, tags: string[]): Promise<void>;
        signMessage(message: string): Promise<SignMessageResult>;
    }

    export function createPrivadoCallback(config: PrivadoConfig): PrivadoCallback;
    export { PrivadoCallback };
} 