import { Connection, PublicKey } from "@solana/web3.js";
import { Wallet, web3 } from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import my_wallet from "./wallet.json";
import fs from "fs";

// 002 output storageAccPublicKey
const storageAccPublicKey = "";

const collection_name = "";
const symbol = "";
const nft_description = "";
const external_url = "";

(async () => {
  const connection = new Connection("https://ssc-dao.genesysgo.net/", "max");
  const wallet = new Wallet(
    web3.Keypair.fromSecretKey(new Uint8Array(my_wallet))
  );
  const drive = await new ShdwDrive(connection, wallet).init();
  const acc = new PublicKey(storageAccPublicKey);
  let image_file = {
    name: "collection.png",
    file: fs.readFileSync("./assets/collection.png"),
  };
  const uploadImageResponse = await drive.uploadFile(acc, image_file, "v2");

  if (uploadImageResponse.upload_errors.length > 0) {
    console.error("failed image upload");
    console.error(uploadImageResponse.upload_errors);
    return;
  }

  console.log(uploadImageResponse);

  const image_uri = uploadImageResponse.finalized_locations[0];

  const collection_metadata_file = "./assets/collection.json";
  const collection_metadata = {
    name: collection_name,
    symbol: symbol,
    description: nft_description,
    external_url: external_url,
    image: image_uri,
    attributes: [],
    properties: {
      files: [
        {
          uri: image_uri,
          type: "image/png",
        },
      ],
    },
  };

  fs.writeFileSync(
    collection_metadata_file,
    JSON.stringify(collection_metadata)
  );

  const json_file = {
    name: "collection.json",
    file: fs.readFileSync(collection_metadata_file),
  };

  const uploadJsonResponse = await drive.uploadFile(acc, json_file, "v2");

  if (uploadJsonResponse.upload_errors.length > 0) {
    console.error("failed json upload");
    console.error(uploadJsonResponse.upload_errors);
    return;
  }

  console.log(uploadJsonResponse);

  const output_data = {
    storageAccPublicKey: acc.toString(),
    image_locations: uploadImageResponse.finalized_locations,
    imageUploadMessage: uploadImageResponse.message,
    json_locations: uploadJsonResponse.finalized_locations,
    jsonUploadMessage: uploadJsonResponse.message,
  };

  fs.writeFileSync("output-003.json", JSON.stringify(output_data));
})();
