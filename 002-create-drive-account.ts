import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import driveUser from "./wallet.json";

const storage_account_name = "";
const storage_size = ""; // e.g) 10MB, 2KB

(async () => {
  const connection = new solanaWeb3.Connection(
    "https://ssc-dao.genesysgo.net/",
    "max"
  );
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(driveUser))
  );
  const drive = await new ShdwDrive(connection, wallet).init();
  const storageAcc = await drive.createStorageAccount(
    storage_account_name,
    storage_size
  );
  const acc = new solanaWeb3.PublicKey(storageAcc.shdw_bucket);
  console.log(`storageAccPublicKey: ${acc.toString()}`);
})();
