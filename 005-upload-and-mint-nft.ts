import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import my_wallet from "./wallet.json";
import fs from "fs";

// 002 output storageAccPublicKey
const storageAccPublicKey = "";

// 004 output ['collection_nft']['nft']['address]
const collection_nft_address = "";

const symbol = "";
const description = "";
const image_file_name = "";
const id = image_file_name.split(".")[0]; // remove extension
const nft_name = `${id}`;
const seller_fee_basis_points = 500; // 5%

(async () => {
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "max");
  const wallet = new Wallet(
    web3.Keypair.fromSecretKey(new Uint8Array(my_wallet))
  );

  const drive = await new ShdwDrive(connection, wallet).init();
  const acc = new PublicKey(storageAccPublicKey);
  let image_file = {
    name: image_file_name,
    file: fs.readFileSync(`./assets/${image_file_name}`),
  };

  const uploadImageResponse = await drive.uploadFile(acc, image_file, "v2");

  if (uploadImageResponse.upload_errors.length > 0) {
    console.error("failed image upload");
    console.error(uploadImageResponse.upload_errors);
    return;
  }

  console.log(uploadImageResponse);

  const image_uri = uploadImageResponse.finalized_locations[0];

  const metadata_json_file = `./assets/${id}.json`;
  const metadata = {
    name: nft_name,
    symbol: symbol,
    description: description,
    image: image_uri,
    attributes: [{ trait_type: "id", value: id }],
    properties: { files: [{ uri: image_uri, type: "image/png" }] },
  };
  fs.writeFileSync(metadata_json_file, JSON.stringify(metadata));

  let json_file = {
    name: `${id}.json`,
    file: fs.readFileSync(metadata_json_file),
  };
  const uploadJsonResponse = await drive.uploadFile(acc, json_file, "v2");

  if (uploadJsonResponse.upload_errors.length > 0) {
    console.error("failed image upload");
    console.error(uploadJsonResponse.upload_errors);
    return;
  }

  console.log(uploadJsonResponse);

  const json_uri = uploadJsonResponse.finalized_locations[0];

  const metaplex = new Metaplex(connection).use(
    keypairIdentity(web3.Keypair.fromSecretKey(new Uint8Array(my_wallet)))
  );

  const nft = await metaplex
    .nfts()
    .create({
      uri: json_uri,
      name: nft_name,
      sellerFeeBasisPoints: seller_fee_basis_points,
      collection: new PublicKey(collection_nft_address),
      collectionAuthority: metaplex.identity(),
    })
    .run();

  console.log(nft);

  const output_data = {
    image: uploadImageResponse,
    metadata: uploadJsonResponse,
    nft: nft,
  };

  fs.writeFileSync("output-005.json", JSON.stringify(output_data));
})();
