import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import driveUser from "./wallet.json";
import fs from "fs";

// 002 output PublicKey
const storageAccPublicKey = "";

// 003 output
const image_uri = "";

// about your NFT
const nft_name = "";
const symbol = "";
const description = "";
const external_url = "";

// about collection
const collection_name = "";
const collection_family = "";

// creator address
// https://metaplex-foundation.github.io/js/interfaces/actions.MintNFTParams.html#uri
// > the properties field has to contain at least one creator and one of the provided
// > creators must have the same public key as the provided wallet.
const creator_address = "";

const metadata = {
  name: nft_name,
  symbol: symbol,
  description: description,
  seller_fee_basis_points: 500, // Royalty: 5%
  image: image_uri,
  attributes: [
    {
      trait_type: "name",
      value: nft_name,
    },
    // NFT Attributes
  ],
  external_url: external_url,
  properties: {
    files: [
      {
        uri: image_uri,
        type: "image/png",
      },
    ],
    category: "image",
    creators: [
      {
        address: creator_address,
        share: 100,
      },
    ],
  },
  collection: {
    name: collection_name,
    family: collection_family,
  },
};

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
  const metadata_file = "metaplex_metadata.json";
  fs.writeFileSync(metadata_file, JSON.stringify(metadata));

  let file = {
    name: metadata_file,
    file: fs.readFileSync("./" + metadata_file),
  };
  const upload = await drive.uploadFile(acc, file);
  console.log(upload);
})();
