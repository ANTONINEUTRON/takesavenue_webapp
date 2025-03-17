import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Takesavenue } from '../target/types/takesavenue'

describe('takesavenue test', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.Basic as Program<Basic>

  it('should run the program', async () => {
    // Add your test here.
    const tx = await program.methods.greet().rpc()
    console.log('Your transaction signature', tx)
  })
})
