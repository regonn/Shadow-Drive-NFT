import { Connection } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import my_wallet from "./wallet.json";
import fs from "fs";

(async () => {
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "max");
  const wallet = new Wallet(
    web3.Keypair.fromSecretKey(new Uint8Array(my_wallet))
  );

  console.log(wallet.publicKey.toString());

  const output_data = {
    walletPublicKey: wallet.publicKey.toString(),
  };
  fs.writeFileSync("output-001.json", JSON.stringify(output_data));
})();
