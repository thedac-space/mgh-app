import { providers, ethers, constants } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'

import React, { useContext, useEffect, useState } from 'react'
import PurchaseActionButton from './PurchaseActionButton'
import changeChain from '../../backend/changeChain'
import { Chains } from '../../lib/chains'
import { createERC20Contract, getAllowanceAndBalanceERC20 } from '../../lib/ERC20utils'
import { makeOwnProvider } from '../../lib/utilities'
import { useAppSelector } from '../../state/hooks'
import { purchaseCoinOptions, devMumbaiPurchaseCoinOptions } from './purchaseCoinOptions'
import { purchaseContext } from './purchaseContext'
import PurchaseAbi from '../../backend/abi/purchaseAbi.json'
import { Interface } from '@ethersproject/abi'

const PurchaseBuyForm = ({ web3Provider, option }: { web3Provider: providers.Web3Provider, option: number }) => {
    const { address, chainId } = useAppSelector((state) => state.account)
    const { monthlyChoice, coin } = useContext(purchaseContext)

    const [allowance, setAllowance] = useState('')
    const [balance, setBalance] = useState('')
    const [paymentAmount, setPaymentAmount] = useState('')

    const contractAddress = "0xe1879f748561bC1A103F9d8529626b8f7a627B6A"; // Mumbai Address
    const contractAbi = new Interface(PurchaseAbi)

    const coinOptions = () => {
        if(!coin) return devMumbaiPurchaseCoinOptions['matic'];
        return chainId === 137 
            ? purchaseCoinOptions[coin]
            : devMumbaiPurchaseCoinOptions[coin]
    }
    
    useEffect(() => {
        console.log("use Effect: ", {address})
        if(!address || !coin) return

        const coinInfo = coinOptions()

        const updateAllowanceAndBalance = () => {
            return new Promise( async (resolve) => {
                const ownProvider = makeOwnProvider(coinInfo.chain)

                if(coinInfo.contractAddress === '') {
                    setBalance(formatEther(await ownProvider.getBalance(address)));
                    setAllowance(formatEther(constants.MaxUint256.toString()))
                    resolve(true);
                } else {
                    const [rawAllowance, rawBalance] = await getAllowanceAndBalanceERC20(
                        ownProvider,
                        coinInfo.contractAddress,
                        address,
                        contractAddress
                    )
                    console.log({rawAllowance, rawBalance})
                    setBalance(formatUnits(rawBalance, coinInfo.decimals))
                    setAllowance(formatUnits(rawAllowance, coinInfo.decimals))
                    resolve(true)
                }
            })
        }
        updateAllowanceAndBalance().then(() => {
            calculatePaymentAmount()
        })
    }, [coin])

    useEffect(() => {
        calculatePaymentAmount()
    }, [option])

    const approveToken = async () => {
        const coinInfo = coinOptions()
        if (!web3Provider || !coin || !monthlyChoice || coinInfo.contractAddress === '') return

        const coinContract = createERC20Contract(
            web3Provider.getSigner(),
            coinInfo.contractAddress
        )

        const tx = await coinContract.approve(
            contractAddress,
            ethers.constants.MaxUint256
        )

        await tx.wait()

        setAllowance(formatUnits(ethers.constants.MaxUint256, coinInfo.decimals))
        calculatePaymentAmount()
    }

    const transferToken = async () => {
        if (!coin || !web3Provider || !address || !monthlyChoice) return

        const coinInfo = coinOptions()
        const contract = new ethers.Contract(contractAddress, contractAbi, web3Provider.getSigner())

        const currencyAddress = coinInfo.contractAddress ?? constants.AddressZero;
        const value = coinInfo.contractAddress 
            ? 0
            : parseEther((+paymentAmount * 1.02).toString());

        // native currency case
        if (coinOptions().contractAddress === '') {
            const tx = await contract.purchaseRole(
                [address, 1, 5, option],
                currencyAddress,
                [],
                { value }
            )
            await tx.wait()
        } else {
            const tx = await contract.purchaseRole(
                [address, 1, 5, option],
                coinOptions().contractAddress,
                [],
            )
            await tx.wait()
        }
        setBalance((+balance - +paymentAmount).toString())
    }

    const calculatePaymentAmount = async () => {
        const coinInfo = coinOptions();

        const contract = new ethers.Contract(contractAddress, contractAbi, makeOwnProvider(coinInfo.chain))

        const paymentCurrency = coinInfo.contractAddress === '' 
            ? constants.AddressZero 
            : coinInfo.contractAddress;

        const value = paymentCurrency === constants.AddressZero 
            ? parseEther((+balance - 0.1).toString())
            : 0;

            try {
                setPaymentAmount(
                    formatUnits(
                        await contract.callStatic.purchaseRole(
                            [address, 1, 5, option],
                            paymentCurrency,
                            [],
                            { value, from: address }
                        ),
                        coinInfo.decimals
                    )
                )
            } catch (error: any) {
                setPaymentAmount('')
                console.log("handled error in calculatePaymentAmount: ", {error})
            }
        }

    return (
        <>
            <div className="w-fit m-auto">
                {/* Show Amount */}
                <h3>Balance: {coin === 'eth' ? (+balance).toFixed(4) : (+balance).toFixed(2)} {coin?.toUpperCase()}</h3>
                <p className="text-red-500 self-center font-medium pt-0.5 h-2">
                            {(paymentAmount == '' && +allowance != 0)
                                ? "You don't have enough tokens."
                                : ''}
                </p>
                {paymentAmount && <h3>
                    To Pay: {coin === 'eth' ? (+paymentAmount).toFixed(4) : (+paymentAmount).toFixed(2)} {coin?.toUpperCase()}
                </h3>}

                {/* Action Buttons */}
                {+allowance == 0 && (
                    <>
                        <PurchaseActionButton
                            onClick={approveToken}
                            disabled={false}
                            text="Approve Token"
                        />
                        <p className="text-red-500 self-center font-medium pt-0.5 h-2">
                            You have to set an allowance.
                        </p>
                    </>
                )}

                {coin && paymentAmount && (
                    <>
                        <PurchaseActionButton
                            onClick={transferToken}
                            disabled={+balance < +paymentAmount}
                            text="Buy"
                        />
                    </>
                )}

                {chainId !== Chains.MATIC_TESTNET.chainId && (
                    <PurchaseActionButton
                        onClick={() => {
                            changeChain(
                                web3Provider.provider,
                                Chains.MATIC_TESTNET.chainId
                            )
                        }}
                        disabled={false}
                        text="Switch to Mumbai"
                    />
                )}
            </div>
        </>
    )
}

export default PurchaseBuyForm