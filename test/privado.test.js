const { PrivadoCallback, createPrivadoCallback } = require('../src');

// Mock LitNodeClient
jest.mock('@lit-protocol/lit-node-client', () => ({
    LitNodeClient: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValue(true)
    }))
}));

describe('PrivadoCallback', () => {
    let privadoCallback;
    const mockConfig = {
        litPkpPublicKey: '0x1234567890abcdef',
        ethereumPrivateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    };

    beforeEach(() => {
        privadoCallback = createPrivadoCallback(mockConfig);
    });

    test('should create callback instance', () => {
        expect(privadoCallback).toBeInstanceOf(PrivadoCallback);
    });

    test('should sign message and generate DID', async () => {
        const mockOutput = {
            returnValues: {
                output: 'Test message'
            }
        };

        // Mock signMessage method
        privadoCallback.signMessage = jest.fn().mockResolvedValue({
            signedMessage: 'mocked-signature',
            did: `did:privado:${mockConfig.litPkpPublicKey}`
        });

        await privadoCallback.onAgentFinish(mockOutput);

        expect(mockOutput.returnValues.signedMessage).toBeDefined();
        expect(mockOutput.returnValues.agentDID).toBeDefined();
        expect(mockOutput.returnValues.agentDID).toContain('did:privado:');
    });

    test('should handle empty output', async () => {
        const mockOutput = {};
        await privadoCallback.onAgentFinish(mockOutput);
        expect(mockOutput.returnValues).toBeUndefined();
    });

    test('should handle error during signing', async () => {
        const mockOutput = {
            returnValues: {
                output: 'Test message'
            }
        };

        // Mock signMessage to throw error
        privadoCallback.signMessage = jest.fn().mockRejectedValue(new Error('Signing failed'));

        await privadoCallback.onAgentFinish(mockOutput);

        expect(mockOutput.returnValues.signedMessage).toBeUndefined();
        expect(mockOutput.returnValues.agentDID).toBeUndefined();
    });
}); 