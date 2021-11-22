import { ethers } from "ethers";
import { useAppDispatch } from "../state/hooks";
import { disconnect, setAddress, setChain } from "../state/account";
import { removeLocal } from "../lib/local";
import { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import useProvider from "./provider";
import { Provider } from "../state/types";


export default function useConnectWallet() {
  const [walletProvider, setProvider] = useState<Web3Provider>()
  const dispatch = useAppDispatch()
  const provider = useProvider()
  console.log("useConnectWallet", provider)

  useEffect(() => {
    console.log("useEffect useConnectWallet", provider)
    if (!provider) {
      return
    }

    const web3Provider = new ethers.providers.Web3Provider(provider, "any");

    setProvider(web3Provider)

    web3Provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    })
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      // dispatch(setAddress(accounts[0]))
      if (accounts.length === 0) {
        disconnectWallet()
        // removeLocal("provider")
        // dispatch(disconnect())
      }
      console.log("accountsChanged", accounts);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error);
    });

    web3Provider.listAccounts().then(res=>{
      console.log("address",res,res[0])
      dispatch(setAddress(res[0]))
    })

    web3Provider.getNetwork().then(res=>{
      console.log("chainId", res.chainId)
      dispatch(setChain(res.chainId))
    })
    
  }, [provider])

  const disconnectWallet = async () => {
    if (provider === Provider.WALLETCONNECT) {
      await provider.disconnect()
    }
    removeLocal("provider")
    dispatch(disconnect())
  }

  const getAddress = async () => {
    const address = await walletProvider?.listAccounts()
    return address ? address[0] : null
  }

  const getChainId = async () => {
    const network = await walletProvider?.getNetwork()
    return network ? network.chainId : null
  }

  return { walletProvider, provider, getAddress, getChainId, disconnectWallet }

}
