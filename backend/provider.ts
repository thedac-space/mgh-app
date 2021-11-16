import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useAppDispatch } from "../state/hooks";
import { connect } from "../state/account";


export const connectWallet = async () => {

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "03bfd7b76f3749c8bb9f2c91bdba37f3",
      }
    }
  };

  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });

  const provider = await web3Modal.connect();
  console.log(provider)

  const web3Provider = new ethers.providers.Web3Provider(provider)
  console.log("provider: ", web3Provider)
  const network = await web3Provider.getNetwork()
  console.log("network: ", network)

  // Subscribe to accounts change
  web3Provider.on("accountsChanged", (accounts: string[]) => {
    console.log(accounts);
  });

  // Subscribe to chainId change
  web3Provider.on("chainChanged", (chainId: number) => {
    console.log(chainId);
  });

  // Subscribe to provider connection
  web3Provider.on("connect", (info: { chainId: number }) => {
    console.log(info);
  });

  // Subscribe to provider disconnection
  web3Provider.on("disconnect", (error: { code: number; message: string }) => {
    console.log(error);
  });
  return web3Provider
}
