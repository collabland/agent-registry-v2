import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { configureClient, API_URL_DEV } from '@0xintuition/graphql'
import {
  // intuitionTestnet,
  getMultiVaultAddressFromChainId,
} from '@0xintuition/sdk'
import dotenv from 'dotenv'
dotenv.config()

// Set Base Sepolia GraphQL endpoint
configureClient({
  apiUrl: API_URL_DEV
})

// This should be the logged in account (Metamask, etc)
export const account = privateKeyToAccount(
  '0x6c25488133b8ca4ba754ea64886b1bfa4c4b05e7fea057c61f9951fe76f1d657',
)
console.log('Using account: ', account.address)

const intuitionTestnet = defineChain({
  id: 13579,
  name: 'Intuition testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test Trust',
    symbol: 'tTRUST',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.intuition.systems/http'],
      webSocket: ['wss://testnet.rpc.intuition.systems/ws']
    },
  },
  blockExplorers: {
    default: {
      name: 'Intuition Explorer',
      url: 'https://testnet.explorer.intuition.systems',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
})

const walletClient = createWalletClient({
  chain: intuitionTestnet,
  transport: http(),
  account: account,
})

const publicClient = createPublicClient({
  chain: intuitionTestnet,
  transport: http(),
})

export const config: any = {
  walletClient,
  publicClient,
  address: getMultiVaultAddressFromChainId(intuitionTestnet.id),
}

