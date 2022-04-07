# client-sdk-demo

The Reservoir client SDK contains helper functions to execute common actions for an NFT marketplace.

## Buy

To buy a token, call `buyToken()`. Provide a valid token to be bought and the SDK will call `/execute/buy/v1` with the data you provided. The SDK will use the provided Signer to prompt the user to sign Ethereum transactions.

## List for sale

To list a token for sale, call `listToken()`. Provide a valid token to be listed and its price. The SDK will call `/execute/list/v1` with the data you provided. The SDK will use the provided Signer to prompt the user to sign Ethereum transactions.

##
