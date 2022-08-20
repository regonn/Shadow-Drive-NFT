import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import my_wallet from "./wallet.json";
import fs from "fs";

const storage_account_name = "";
const storage_size = ""; // e.g) 10MB, 2KB

(async () => {
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "max");
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(my_wallet))
  );
  const drive = await new ShdwDrive(connection, wallet).init();
  const createStorageResponse = await drive.createStorageAccount(
    storage_account_name,
    storage_size,
    "v2"
  );
  const acc = new PublicKey(createStorageResponse.shdw_bucket);
  console.log(`storageAccPublicKey: ${acc.toString()}`);

  const output_data = {
    storageAccPublicKey: acc.toString(),
    storageAccName: storage_account_name,
    size: storage_size,
    transaction: createStorageResponse.transaction_signature,
  };

  fs.writeFileSync("output-002.json", JSON.stringify(output_data));
})();
