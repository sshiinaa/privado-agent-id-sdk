"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivadoCallback = void 0;
exports.createPrivadoCallback = createPrivadoCallback;
const base_1 = require("@langchain/core/callbacks/base");
const lit_node_client_1 = require("@lit-protocol/lit-node-client");
const ethers_1 = require("ethers");
/**
 * PrivadoCallback class extends BaseCallbackHandler to handle agent callbacks
 * and sign messages using Lit Protocol
 */
class PrivadoCallback extends base_1.BaseCallbackHandler {
    /**
     * Initialize the callback handler with configuration
     * @param config - Configuration object containing ethereumPrivateKey and litPkpPublicKey
     */
    constructor(config) {
        super();
        this.name = "privado_callback";
        this.config = config;
        this.litNodeClient = new lit_node_client_1.LitNodeClient({
            litNetwork: "cayenne",
        });
    }
    /**
     * Called when the agent finishes its execution
     * Signs the final response using Lit Protocol
     */
    async onAgentFinish(output, runId, parentRunId, tags) {
        var _a;
        const finalResponse = ((_a = output.returnValues) === null || _a === void 0 ? void 0 : _a.output) || (output === null || output === void 0 ? void 0 : output.output);
        if (!finalResponse)
            return;
        try {
            const { signedMessage, did } = await this.signMessage(finalResponse);
            output.returnValues.signedMessage = signedMessage;
            output.returnValues.agentDID = did;
            console.log("Response signed by agent:", did);
        }
        catch (err) {
            console.error("Failed to sign message via Lit Protocol", err);
        }
    }
    /**
     * Signs a message using the configured Ethereum wallet
     * @param message - The message to be signed
     * @returns Object containing the signed message and DID
     */
    async signMessage(message) {
        // Connect to Lit Protocol network
        await this.litNodeClient.connect();
        // Create wallet instance using the configured private key
        const wallet = new ethers_1.Wallet(this.config.ethereumPrivateKey);
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
exports.PrivadoCallback = PrivadoCallback;
/**
 * Factory function to create a new PrivadoCallback instance
 * @param config - Configuration object for the callback
 * @returns A new instance of PrivadoCallback
 */
function createPrivadoCallback(config) {
    return new PrivadoCallback(config);
}
