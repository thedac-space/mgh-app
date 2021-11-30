const switchNetworkMumbai = async (provider: any) => {
    try {
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
        });
    } catch (error: any) {
        if (error.code === 4902) {
            try {
                await provider.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: "0x13881",
                            chainName: "Polygon Testnet Mumbai",
                            rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                            nativeCurrency: {
                                name: "MATIC",
                                symbol: "MATIC",
                                decimals: 18,
                            },
                            blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                        },
                    ],
                });
            } catch (error: any) {
                alert(error.message);
            }
        }
    }
}

export default switchNetworkMumbai