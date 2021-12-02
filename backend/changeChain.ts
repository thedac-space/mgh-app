import { Web3Provider } from "@ethersproject/providers";
import { getChainData } from "../lib/utilities";
import { useAppDispatch } from "../state/hooks";
import { setError } from "../state/network";

const dispatch = useAppDispatch()

const changeChain = async (provider: any, newChain: number | undefined) => {
    if (!newChain) {
        return
    }
    
    const chainData = getChainData(newChain)

    try {
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x3' }],
        });
    } catch (error: any) {
        dispatch(setError(error))
        if (error.code === 4902) {
            try {
                await provider.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: chainData?.chainIdHex,
                            chainName: chainData?.name,
                            rpcUrls: [chainData?.rpcUrl],
                            nativeCurrency: {
                                name: chainData?.nativeCurrency.name,
                                symbol: chainData?.nativeCurrency.symbol,
                                decimals: 18,
                            },
                            blockExplorerUrls: [chainData?.blockExplorer],
                        },
                    ],
                });
            } catch (error: any) {
                dispatch(setError(error))
                console.log(error.message);
            }
        }
    }
}


export default changeChain
