import { Client, Wallet, Payment } from 'xrpl';

// XRPL Testnet client
const TESTNET_URL = 'https://s.altnet.rippletest.net:51234';

let client: Client | null = null;

export async function getXrplClient(): Promise<Client> {
  if (!client) {
    client = new Client(TESTNET_URL);
    await client.connect();
  }
  return client;
}

// Generate a new testnet wallet
export function generateWallet(): Wallet {
  return Wallet.generate();
}

// Get wallet from seed
export function walletFromSeed(seed: string): Wallet {
  return Wallet.fromSeed(seed);
}

// Send a payment transaction
export async function sendPayment(
  wallet: Wallet,
  toAddress: string,
  amount: number // in XRP
): Promise<string> {
  const client = await getXrplClient();
  
  const payment: Payment = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Destination: toAddress,
    Amount: (amount * 1000000).toString(), // Convert XRP to drops
  };
  
  const result = await client.submitAndWait(payment, { wallet });
  return result.result.hash!;
}

// Get account info
export async function getAccountInfo(address: string) {
  const client = await getXrplClient();
  return await client.request({
    command: 'account_info',
    account: address,
  });
}

// Get testnet funding (faucet)
export async function fundWallet(address: string): Promise<string> {
  const client = await getXrplClient();
  
  // Use the standard faucet endpoint
  const response = await fetch('https://faucet.altnet.rippletest.net/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destination: address }),
  });
  
  const data = await response.json();
  return data.account?.seed || '';
}

export async function disconnectClient() {
  if (client) {
    await client.disconnect();
    client = null;
  }
}
