import { Connection } from "@solana/web3.js";

export const APP_NAME = "takesavenue"

export const USER_TABLE = "users"

export const TAKE_TABLE = "takes"

export const VOTE_TABLE = "votes"

export const HELIUS_ENDPOINT = "https://api.testnet.sonic.game";//"https://sonic.helius-rpc.com/?api-key=" + process.env.NEXT_PUBLIC_HELIUS_API_KEY;

export const APP_CONNECTION: Connection = new Connection("https://devnet.sonic.game", "confirmed");

export const INITIAL_CREDIT  = 30;