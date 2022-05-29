import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import driveUser from "./wallet.json";
import fs from "fs";

// 002 output PublicKey
const storageAccPublicKey = "";

(async () => {
  const connection = new solanaWeb3.Connection(
    "https://ssc-dao.genesysgo.net/",
    "max"
  );
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(driveUser))
  );
  const drive = await new ShdwDrive(connection, wallet).init();
  const acc = new solanaWeb3.PublicKey(storageAccPublicKey);
  let file = {
    name: "image.png",
    file: fs.readFileSync("./image.png"),
  };
  const upload = await drive.uploadFile(acc, file);
  console.log(upload);
})();
