import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import driveUser from "./wallet.json";
import fs from "fs";

// 003 output json_locations
const collection_json_uri = "";

const nft_name = "";
const seller_fee_basis_points = 500; // 5%

(async () => {
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "max");
  const metaplex = new Metaplex(connection).use(
    keypairIdentity(web3.Keypair.fromSecretKey(new Uint8Array(driveUser)))
  );

  const collection_nft = await metaplex
    .nfts()
    .create({
      uri: collection_json_uri,
      name: nft_name,
      sellerFeeBasisPoints: seller_fee_basis_points,
      isCollection: true,
    })
    .run();

  console.log(collection_nft);

  const output_data = {
    collection_nft: collection_nft,
  };

  fs.writeFileSync("output-004.json", JSON.stringify(output_data));
})();
