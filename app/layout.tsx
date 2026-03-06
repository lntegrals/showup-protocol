import './globals.css'

export const metadata = {
  title: 'ShowUp Protocol - Put Money Behind Your Word',
  description: 'Decentralized commitment staking on XRPL + IPFS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
