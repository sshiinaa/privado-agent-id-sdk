import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { Wallet } from "ethers";

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
export class PrivadoCallback extends BaseCallbackHandler {
    private config: PrivadoConfig;
    private litNodeClient: LitNodeClient;
    name = "privado_callback";

    /**
     * Initialize the callback handler with configuration
     * @param config - Configuration object containing ethereumPrivateKey and litPkpPublicKey
     */
    constructor(config: PrivadoConfig) {
        super();
        this.config = config;
        this.litNodeClient = new LitNodeClient({
            litNetwork: "cayenne",
        });
    }

    /**
     * Called when the agent finishes its execution
     * Signs the final response using Lit Protocol
     */
    async onAgentFinish(output: any, runId?: string, parentRunId?: string, tags?: string[]): Promise<void> {
        const finalResponse = output.returnValues?.output || output?.output;
        if (!finalResponse) return;

        try {
            const { signedMessage, did } = await this.signMessage(finalResponse);
            output.returnValues.signedMessage = signedMessage;
            output.returnValues.agentDID = did;
            console.log("Response signed by agent:", did);
        } catch (err) {
            console.error("Failed to sign message via Lit Protocol", err);
        }
    }

    /**
     * Signs a message using the configured Ethereum wallet
     * @param message - The message to be signed
     * @returns Object containing the signed message and DID
     */
    async signMessage(message: string): Promise<SignMessageResult> {
        // Connect to Lit Protocol network
        await this.litNodeClient.connect();

        // Create wallet instance using the configured private key
        const wallet = new Wallet(this.config.ethereumPrivateKey);

        // Sign the message using the wallet
        const signedMessage = await wallet.signMessage(message);

        // Generate DID using the configured Lit PKP public key
        const did = `did:privado:${this.config.litPkpPublicKey}`;

        return {
            signedMessage,
            did,
        };
    }
}

/**
 * Factory function to create a new PrivadoCallback instance
 * @param config - Configuration object for the callback
 * @returns A new instance of PrivadoCallback
 */
export function createPrivadoCallback(config: PrivadoConfig): PrivadoCallback {
    return new PrivadoCallback(config);
} 