import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";


export const connectWallet = async () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    }
  };

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });

  const provider = await web3Modal.connect();

  // const provider = new ethers.providers.Web3Provider(modalProvider)
  console.log(provider)

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts: string[]) => {
    console.log(accounts);
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId: number) => {
    console.log(chainId);
  });

  // Subscribe to provider connection
  provider.on("connect", (info: { chainId: number }) => {
    console.log(info);
  });

  // Subscribe to provider disconnection
  provider.on("disconnect", (error: { code: number; message: string }) => {
    console.log(error);
  });
}
