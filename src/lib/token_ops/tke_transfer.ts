import { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import { 
    TOKEN_PROGRAM_ID,
    createTransferInstruction,
    getOrCreateAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress
} from '@solana/spl-token';
import { APP_CONNECTION, HELIUS_ENDPOINT } from '../constants';

export async function transferTkeTokens(
    recipientAddress: string, 
    amount: number
) {
    try {
        const connection = APP_CONNECTION;;

        const walletSecretKey = JSON.parse(process.env.WALLET_SECRET_KEY!);
        const wallet = Keypair.fromSecretKey(
            Uint8Array.from(walletSecretKey)
        );

        const mint = new PublicKey(process.env.TOKEN_MINT_ADDRESS!);
        const recipient = new PublicKey(recipientAddress);

        // Get ATA addresses
        const senderAtaAddress = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );
        
        const recipientAtaAddress = await getAssociatedTokenAddress(
            mint,
            recipient
        );

        // Create transaction
        const transaction = new Transaction();

        // Check and create sender ATA if needed
        try {
            await connection.getTokenAccountBalance(senderAtaAddress);
        } catch {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    senderAtaAddress,
                    wallet.publicKey,
                    mint
                )
            );
        }

        // Check and create recipient ATA if needed
        try {
            await connection.getTokenAccountBalance(recipientAtaAddress);
        } catch {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    recipientAtaAddress,
                    recipient,
                    mint
                )
            );
        }

        // Add transfer instruction
        transaction.add(
            createTransferInstruction(
                senderAtaAddress,
                recipientAtaAddress,
                wallet.publicKey,
                amount,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet]
        );

        return {
            success: true,
            signature,
            recipientAta: recipientAtaAddress.toString()
        };

    } catch (error) {
        console.error("Token transfer failed:", error);
        throw new Error(`Transfer failed: ${error}`);
    }
}