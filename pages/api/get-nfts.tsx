//import dotenv from "dotenv";
import type { NextApiRequest, NextApiResponse } from "next";
import {
    ThirdwebSDK,
    NFTMetadataOwner,
    PayloadToSign721,
  } from "@thirdweb-dev/sdk";
    
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let nfts = [
    {
      id: 0, // Unique ID for each NFT corresponding to its position in the array
      name: "NFT 1", // A name for the NFT
      description: "This is our first amazing NFT", // Description for the NFT
      url: "https://bafybeihgfxd5f5sqili34vyjyfai6kezlagrya43e6bkgw6hnxucxug5ya.ipfs.nftstorage.link/", // URL for the NFT image
      price: 0.01, // The price of the NFT
      minted: false, // A variable to indicate if the NFT has been minted
    },
    // Add more NFTs here...
  ];

//  dotenv.config();
    //const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
    //const NETWORK = process.env.NETWORK as string;
    const PRIVATE_KEY = "57bca59a3d44e35f415bc72db3e7a24303bf76d1c761f3147406d65136235156";
    const NETWORK = "mumbai";

  // Connect to SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    // Learn more about securely accessing your private key: https://portal.thirdweb.com/web3-sdk/set-up-the-sdk/securing-your-private-key
    PRIVATE_KEY,
    NETWORK,
  );

  // Set variable for the NFT collection contract address which can be found after creating an NFT collection in the dashboard
  //const nftCollectionAddress = process.env.COLLECTION_CONTRACT_ADDRESS as string;
  const nftCollectionAddress = "0xcCD45AA5c75Db4e3ff7865699b1fc70AA15921d7";

  // Initialize the NFT collection with the contract address
  const nftCollection = sdk.getContract(nftCollectionAddress, "nft-collection");
//  const nftCollection = sdk.getNFTCollection(nftCollectionAddress);

  switch (req.method) {
    case "GET":
      try {
        // Get all the NFTs that have been minted from the contract
        const mintedNfts: NFTMetadataOwner[] = await nftCollection?.getAll();
        // If no NFTs have been minted, return the array of NFT metadata
        if (!mintedNfts) {
          res.status(200).json(nfts);
        }
        // If there are NFTs that have been minted, go through each of them
        mintedNfts.forEach((nft) => {
          if (nft.metadata.attributes) {
            // Find the id attribute of the current NFT
            // @ts-expect-error
            const positionInMetadataArray = nft.metadata.attributes.id;
            // Change the minted status of the NFT metadata at the position of ID in the NFT metadata array
            nfts[positionInMetadataArray].minted = true;
          }
        });
      } catch (error) {
        console.error(error);
      }
      res.status(200).json(nfts);
      break;
      case "POST":
        // Get ID of the NFT to mint and address of the user from request body
        const { id, address } = req.body;
    
        // Ensure that the requested NFT has not yet been minted
        if (nfts[id].minted === true) {
          res.status(400).json({ message: "Invalid request" });
        }
    
        // Allow the minting to happen anytime from now
        const startTime = new Date(0);
    
        // Find the NFT to mint in the array of NFT metadata using the ID
        const nftToMint = nfts[id];
    
        // Set up the NFT metadata for signature generation
        const metadata: PayloadToSign721 = {
          metadata: {
            name: nftToMint.name,
            description: nftToMint.description,
            image: nftToMint.url,
            // Set the id attribute which we use to find which NFTs have been minted
            attributes: { id },
          },
          price: nftToMint.price,
          mintStartTime: startTime,
          to: address,
        };
    
      try {
          const response = await nftCollection?.signature.generate(metadata);
    
          // Respond with the payload and signature which will be used in the frontend to mint the NFT
          res.status(201).json({
            payload: response?.payload,
            signature: response?.signature,
          });
      } catch (error) {
          res.status(500).json({ error });
          console.error(error);
      }
      break;
    default:
      res.status(200).json(nfts);
  }
}