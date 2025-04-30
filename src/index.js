const { BaseCallbackHandler } = require("@langchain/core/callbacks/base");
const { LitNodeClient } = require("@lit-protocol/lit-node-client");
const { Wallet } = require("ethers");

/**
 * PrivadoCallback class extends BaseCallbackHandler to handle agent callbacks
 * and sign messages using Lit Protocol
 */
class PrivadoCallback extends BaseCallbackHandler {
    /**
     * Initialize the callback handler with configuration
     * @param {Object} config - Configuration object containing ethereumPrivateKey and litPkpPublicKey
     */
    constructor(config) {
        super();
        this.config = config;
        this.litNodeClient = new LitNodeClient({
            litNetwork: "cayenne",
        });
    }

    /**
     * Called when the agent finishes its execution
     * Signs the final response using Lit Protocol
     * @param {Object} output - The output from the agent
     * @param {string} runId - The ID of the current run
     * @param {string} parentRunId - The ID of the parent run
     * @param {Array} tags - Tags associated with the run
     */
    async onAgentFinish(output, runId, parentRunId, tags) {
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
     * @param {string} message - The message to be signed
     * @returns {Object} Object containing the signed message and DID
     */
    async signMessage(message) {
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
 * @param {Object} config - Configuration object for the callback
 * @returns {PrivadoCallback} A new instance of PrivadoCallback
 */
function createPrivadoCallback(config) {
    return new PrivadoCallback(config);
}

module.exports = {
    PrivadoCallback,
    createPrivadoCallback,
}; 