import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { HELIUS_ENDPOINT } from '../constants';
// import secret from './guideSecret.json';



export async function mintTkeTokens() {
    console.log('Minting TKE tokens...')
    console.log('duck', process.env.WALLET_SECRET_KEY)
    try {
        const umi = createUmi(HELIUS_ENDPOINT); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(JSON.parse(process.env.WALLET_SECRET_KEY!)));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

// umi.use(irysUploader());
// umi.use(signerIdentity(userWalletSigner));

umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())
        // const umi = createUmi(HELIUS_ENDPOINT)
        const mint = generateSigner(umi)
        umi.use(mplTokenMetadata())

        const result = await createAndMint(umi, {
            mint,
            authority: umi.identity,
            name: "Takes Avenue",
            symbol: "TKE",
            uri: "https://res.cloudinary.com/dqyvxv9fr/image/upload/v1742233115/logo_mjermi.png",
            sellerFeeBasisPoints: percentAmount(0),
            decimals: 6,
            amount: 5000000000_000000,//5 billions
            tokenOwner: userWalletSigner.publicKey,
            tokenStandard: TokenStandard.Fungible,
        }).sendAndConfirm(umi)

        return {
            success: true,
            mintAddress: mint.publicKey,
            signature: result.signature
        }

    } catch (error) {
        console.error("Error minting tokens:", error)
        throw new Error(`Failed to mint tokens: ${error}`)
    }
}