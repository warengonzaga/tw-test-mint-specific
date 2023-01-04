import { Flex, Heading, Button } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Nfts from "../components/Nfts";
//import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  // Use address and connect with metamask
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  return (
    <div>
      {address ? (
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <Heading mb="2.5rem">Select an NFT to Mint</Heading>
          <Nfts />
        </Flex>
      ) : (
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <ConnectWallet />
        </Flex>
      )}
    </div>
  );
};

export default Home;
