import { Client, Wallet, Payment } from 'xrpl';

// XRPL Testnet client
const TESTNET_URL = 'https://s.altnet.rippletest.net:51234';

let client: Client | null = null;

export async function getXrplClient(): Promise<Client> {
  if (!client) {
    client = new Client(TESTNET_URL);
    try {
      await client.connect();
    } catch (error) {
      console.error('Failed to connect to XRPL testnet:', error);
      throw new Error('XRPL network unavailable. Please try again later.');
    }
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
  
  try {
    const result = await client.submitAndWait(payment, { wallet });
    return result.result.hash!;
  } catch (error) {
    console.error('Payment failed:', error);
    throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
export async function fundWallet(): Promise<{ address: string; seed: string }> {
  const client = await getXrplClient();
  
  // Use the standard faucet endpoint - generates new wallet with funds
  const response = await fetch('https://faucet.altnet.rippletest.net/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  
  const data = await response.json();
  
  if (!data.account) {
    throw new Error('Faucet request failed: ' + JSON.stringify(data));
  }
  
  return {
    address: data.account.address,
    seed: data.account.secret,
  };
}

export async function disconnectClient() {
  if (client) {
    await client.disconnect();
    client = null;
  }
}
