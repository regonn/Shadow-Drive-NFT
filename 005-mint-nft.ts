import { Connection, actions } from "@metaplex/js";
import * as anchor from "@project-serum/anchor";
import driveUser from "./wallet.json";

// 004 output
const uri = "";

(async () => {
  const connection = new Connection("mainnet-beta");
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(driveUser))
  );

  const response = await actions.mintNFT({
    connection,
    wallet,
    uri,
  });

  console.log(`txID: ${response.txId}`);
  console.log(`mint: ${response.mint.toString()}`);
  console.log(`metadata: ${response.metadata.toString()}`);
  console.log(`edition: ${response.edition.toString()}`);
})();
