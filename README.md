# Privado LangChain Plugin

A LangChain plugin that integrates with Privado for message signing and DID generation.

## Features

- Message signing using Lit Protocol
- DID generation for agents
- Integration with LangChain callbacks

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with the following variables:

```
LIT_PKP_PUBLIC_KEY=your_lit_pkp_public_key
ETHEREUM_PRIVATE_KEY=your_ethereum_private_key
```

## Usage

See `examples/basic-usage.js` for a complete example.

```javascript
const { createPrivadoCallback } = require("privado-langchain-plugin");

const privadoCallback = createPrivadoCallback({
    litPkpPublicKey: process.env.LIT_PKP_PUBLIC_KEY,
    ethereumPrivateKey: process.env.ETHEREUM_PRIVATE_KEY,
});
```

## License

MIT 