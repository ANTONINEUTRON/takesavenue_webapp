# TakesAvenue Backend

A backend for TakesAvenue, powering social banter tokenization on Solana.

## Tech Stack

- Next.js 14 (API Routes)
- Supabase (Database)
- Solana (Blockchain)
- Anchor Framework
- TypeScript

## Prerequisites

- Node.js v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher
- pnpm 8.x or higher

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/takesavenue_backend.git
cd takesavenue_backend
```

2. Install Dependencies

```shell
npm install
```
3. Set up environment variables

```shell
cp .env.example .env.local
```

4. Configure Solana

```shell
solana config set --url devnet
solana-keygen new -o wallet.json
```


