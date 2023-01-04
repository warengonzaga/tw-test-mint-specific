//import dotenv from "dotenv";
import {
    Box,
    SimpleGrid,
    Button,
    Flex,
    Image,
    Heading,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { ConnectWallet } from "@thirdweb-dev/react";
  import {
    useAddress,
    useNFTCollection,
    useContract,
    useMetamask,
    useChainId,
    ChainId,
  } from "@thirdweb-dev/react";
  
  const Nfts = () => {
    // State to set when we are loading
    const [loading, setLoading] = useState(false);
    // State for nft metadata
    const [nftMetadata, setNftMetadata] = useState([null]);
    // State to track if the NFTs have been fetched
    const [fetchedNfts, setFetchedNfts] = useState(false);
  
    // Function to fetch NFTs from the backend
    const fetchNfts = async () => {
      try {
        const response = await fetch("/api/get-nfts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // Save NFTs to the state variable
        setNftMetadata(data);
        // Record that the NFTs have been fetched
        setFetchedNfts(true);
      } catch (error) {
        console.error(error);
      }
    };

    // useEffect hook to get NFTs from API
    useEffect(() => {
      fetchNfts();
    }, [loading]);
  
//    dotenv.config();
//    const NETWORK = process.env.NETWORK as string;
//    const CHAIN_ID_STR = process.env.CHAIN_ID as string;
//    const CHAIN_ID = Number(CHAIN_ID_STR);
    const NETWORK = "mumbai";
    const CHAIN_ID = ChainId.Mumbai;
    // Set variable for the NFT collection contract address which can be found after creating an NFT collection in the dashboard
    const nftCollectionAddress = "0xcCD45AA5c75Db4e3ff7865699b1fc70AA15921d7";

    // Connect to contract using the address
    //const nftCollection = useContract(nftCollectionAddress, "nft-collection");
    const nftCollection = useNFTCollection(nftCollectionAddress);

  // Function which generates signature and mints NFT
  const mintNft = async (id: number) => {
    setLoading(true);
    connectWithMetamask;

    try {
      // Call API to generate signature and payload for minting
      const response = await fetch("/api/get-nfts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, address }),
      });

      if (response) {
        connectWithMetamask;
        const data = await response.json();
        const mintInput = {
          signature: data.signature,
          payload: data.payload,
        };

        await nftCollection?.signature.mint(mintInput);

        alert("NFT successfully minted!");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Failed to mint NFT!");
    }
  };

  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const chainId = useChainId();

  if (chainId !== CHAIN_ID) {
    return (
      <Flex mt="5rem" alignItems="center" flexDir="column">
        <Heading fontSize="md">Please connect to the {NETWORK} network</Heading>
        <ConnectWallet />
      </Flex>
    );
  }

  if (fetchedNfts) {
        return (
          <SimpleGrid m="2rem" justifyItems="center" columns={3} spacing={10}>
            {nftMetadata?.map((nft: any) => (
              <Box
                key={nftMetadata.indexOf(nft)}
                maxW="sm"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
              >
                <Image width="30rem" height="15rem" src={nft?.url} alt="NFT image" />
      
                <Flex p="1rem" alignItems="center" flexDir="column">
                  <Box
                    mt="1"
                    fontWeight="bold"
                    lineHeight="tight"
                    fontSize="20"
                    isTruncated
                    m="0.5rem"
                  >
                    {nft?.name}
                  </Box>
      
                  <Box fontSize="16" m="0.5rem">
                    {nft?.description}
                  </Box>
                  <Box fontSize="16" m="0.5rem">
                    {nft?.price}
                  </Box>
                  {loading ? (
                    <p>Minting... You will need to approve 1 transaction</p>
                  ) : nft?.minted ? (
                    <b>This NFT has already been minted</b>
                  ) : (
                    <Button
                      colorScheme="purple"
                      m="0.5rem"
                      onClick={() => mintNft(nft?.id)}
                    >
                      Mint
                    </Button>
                  )}
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        );
      } else {
        return <Heading>Loading...</Heading>;
      }
  };

  export default Nfts;