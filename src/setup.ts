import {
  createPublicClient,
  createWalletClient,
  http,
} from 'viem'
import { baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { configureClient, API_URL_DEV } from '@0xintuition/graphql'
import {
  getEthMultiVaultAddressFromChainId
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

const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(process.env.RPC_URL),
  account: account,
})

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.RPC_URL),
})

export const config = {
  walletClient,
  publicClient,
  address: getEthMultiVaultAddressFromChainId(baseSepolia.id),
}

