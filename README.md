# router-demo

The Reservoir client SDK contains helper functions to execute common actions for an NFT marketplace.

Read the [`@reservoir0x/client-sdk` source code](https://github.com/reservoirprotocol/client-sdk).

## Install

To install [@reservoir0x/client-sdk](https://www.npmjs.com/package/@reservoir0x/client-sdk), run the following commands in your terminal:

```bs
npm install @reservoir0x/client-sdk
```

or

```bs
yarn add @reservoir0x/client-sdk
```

## Tutorial

The actions follow this dataflow:

1. An SDK action is called and an Ethereum Signer and a query object are passed as arguments
2. The query object is used to construct an HTTP request to the Reservoir API
3. The API responds with an array of steps to be completed using the Signer object
4. The user is prompted to sign transactions as needed

## Buy a token

To buy a token, call [`buyToken()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/buyToken.ts). The SDK will make a GET request to [`/execute/buy/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteBuyV1). See an example using `buyToken()` on [`/components/Buy.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/Buy.tsx#L97-L107)

## List for sale

To list a token for sale, call [`listToken()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/listToken.ts). The SDK will make a GET request to [`/execute/list/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteListV1). See an example using `listToken()` on [`/components/List.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/List.tsx#L94-L119)

## Cancel an order

To cancel an order, call [`cancelOrder()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/cancelOrder.ts). The SDK will make a GET request to [`/execute/cancel/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteCancelV1). See an example using `cancelOrder()` on [`/components/Cancel.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/Cancel.tsx#L87-L97)

## Accept an offer

To accept an offer, call [`acceptOffer()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/acceptOffer.ts). The SDK will make a GET request to [`/execute/sell/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteSellV1). See an example using `acceptOffer()` on [`/components/Accept.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/Accept.tsx#L87-L97)

## Make a single token offer

To make a single token offer, call [`placeBid()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/placeBid.ts). The SDK will make a GET request to [`/execute/bid/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteBidV1). See an example using `placeBid()` on [`/components/TokenOffer.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/TokenOffer.tsx#L100-L124)

## Make a collection wide offer

To make a collection wide offer, call [`placeBid()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/placeBid.ts). The SDK will make a GET request to [`/execute/bid/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteBidV1). See an example using `placeBid()` on [`/components/CollectionOffer.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/CollectionOffer.tsx#L81-L103)

## Make an attribute wide offer

To an attribute wide offer, call [`placeBid()`](https://github.com/reservoirprotocol/client-sdk/blob/main/src/actions/placeBid.ts). The SDK will make a GET request to [`/execute/bid/v1`](https://api.reservoir.tools/#/3.%20Router/getExecuteBidV1). See an example using `placeBid()` on [`/components/AttributeOffer.tsx`](https://github.com/reservoirprotocol/router-demo/blob/main/components/AttributeOffer.tsx#L81-L107)
