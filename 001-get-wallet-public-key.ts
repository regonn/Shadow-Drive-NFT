import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import driveUser from "./wallet.json";

(async () => {
  const connection = new solanaWeb3.Connection(
    "https://ssc-dao.genesysgo.net/"
  );
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(driveUser))
  );
  console.log(wallet.publicKey.toString());
})();
