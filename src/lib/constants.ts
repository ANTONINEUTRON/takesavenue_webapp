import { Connection } from "@solana/web3.js";

export const APP_NAME = "takesavenue"

export const APP_URL = "https://beta.setita.com"

export const USER_TABLE = "users"

export const TAKE_TABLE = "takes"

export const VOTE_TABLE = "votes"

export const HELIUS_ENDPOINT = "https://devnet.helius-rpc.com/?api-key=" + process.env.NEXT_PUBLIC_HELIUS_API_KEY;
// https://mainnet.helius-rpc.com/?api-key=ammmmmm

export const APP_CONNECTION: Connection = new Connection(HELIUS_ENDPOINT, "confirmed");

export const INITIAL_CREDIT  = 30;