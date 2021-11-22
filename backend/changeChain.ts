const changeChain = async (provider: any) => {
    // Check if MetaMask is installed
    // MetaMask injects the global API into window.ethereum
    try {
        // check if the chain to connect to is installed
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
        });
    } catch (error: any) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
            try {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x89',
                            chainName: "Matic Mainnet",
                            nativeCurrency: {
                                name: "Polygon",
                                symbol: "MATIC", // 2-6 characters long
                                decimals: 18,
                              },
                            rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                            blockExplorerUrls: ['https://explorer.matic.network/']
                        },
                    ],
                });
            } catch (addError) {
                console.error(addError);
            }
        }
        console.error(error);
    }

}

export default changeChain