import {
  API_URL_DEV,
  API_URL_PROD,
  configureClient,
} from "@0xintuition/graphql";
import {
  getMultiVaultAddressFromChainId,
  intuitionMainnet,
} from "@0xintuition/sdk";
import dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
dotenv.config();

// Set GraphQL endpoint based on environment
const apiUrl =
  process.env.NODE_ENV === "production" ? API_URL_PROD : API_URL_DEV;
configureClient({
  apiUrl,
});

// This should be the logged in account (Metamask, etc)
// Read private key from environment variable
const privateKey = process.env.SIGNER;

if (!privateKey) {
  throw new Error(
    "SIGNER environment variable is required. Please add SIGNER=0x... to your .env file"
  );
}

if (!privateKey.startsWith("0x")) {
  throw new Error("SIGNER must be a valid hex private key starting with 0x");
}

export const account = privateKeyToAccount(privateKey as `0x${string}`);
console.log("Using account: ", account.address);

const intuitionTestnet = defineChain({
  id: 13579,
  name: "Intuition testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Test Trust",
    symbol: "tTRUST",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.intuition.systems/http"],
      webSocket: ["wss://testnet.rpc.intuition.systems/ws"],
    },
  },
  blockExplorers: {
    default: {
      name: "Intuition Explorer",
      url: "https://testnet.explorer.intuition.systems",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
    },
  },
});

const chain =
  process.env.NODE_ENV === "production" ? intuitionMainnet : intuitionTestnet;

export const walletClient = createWalletClient({
  chain: chain,
  transport: http(),
  account: account,
});

export const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

export const config: any = {
  walletClient,
  publicClient,
  address: getMultiVaultAddressFromChainId(chain.id),
};
