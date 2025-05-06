import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
export interface PrivadoConfig {
    litPkpPublicKey: string;
    ethereumPrivateKey: string;
}
export interface SignMessageResult {
    signedMessage: string;
    did: string;
}
/**
 * PrivadoCallback class extends BaseCallbackHandler to handle agent callbacks
 * and sign messages using Lit Protocol
 */
export declare class PrivadoCallback extends BaseCallbackHandler {
    private config;
    private litNodeClient;
    name: string;
    /**
     * Initialize the callback handler with configuration
     * @param config - Configuration object containing ethereumPrivateKey and litPkpPublicKey
     */
    constructor(config: PrivadoConfig);
    /**
     * Called when the agent finishes its execution
     * Signs the final response using Lit Protocol
     */
    onAgentFinish(output: any, runId?: string, parentRunId?: string, tags?: string[]): Promise<void>;
    /**
     * Signs a message using the configured Ethereum wallet
     * @param message - The message to be signed
     * @returns Object containing the signed message and DID
     */
    signMessage(message: string): Promise<SignMessageResult>;
}
/**
 * Factory function to create a new PrivadoCallback instance
 * @param config - Configuration object for the callback
 * @returns A new instance of PrivadoCallback
 */
export declare function createPrivadoCallback(config: PrivadoConfig): PrivadoCallback;
