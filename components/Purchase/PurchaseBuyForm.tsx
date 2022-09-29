import { BigNumber, ethers } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { apiTokenNames, PurchaseActionButton } from '.'
import changeChain from '../../backend/changeChain'
import useProvider from '../../backend/provider'
import { Chains } from '../../lib/chains'
import { createERC20Contract } from '../../lib/ERC20utils'
import { makeOwnProvider } from '../../lib/utilities'
import { useAppSelector } from '../../state/hooks'
import { purchaseCoinOptions } from './purchaseCoinOptions'
import { purchaseContext } from './purchaseContext'
import PurchaseAbi from '../../backend/abi/purchaseAbi.json'
import { Interface } from "@ethersproject/abi";

const PurchaseBuyForm = ({
  option
}: {
  option: number
}) => {
  const { address, chainId } = useAppSelector((state) => state.account)
  const { monthlyChoice, coin } = useContext(purchaseContext)
  const [allowance, setAllowance] = useState(NaN)
  const provider = useProvider()
  const mghWallet = '0xe1879f748561bC1A103F9d8529626b8f7a627B6A' // change to proper address
  const ETHWallet = '0xBE780FD39A192c864F47f60F7ad842AFEf6aaff9'
  const USDWallet = '0x4624e0295b610a89d12FE918C6fBD188F862e1a8'
  let amount = 0;
  let coinAddress = '';
  const isERC20 = coin && !['eth', 'matic'].includes(coin)
  const [USDAllowance, setUSDAllowance] = useState(0)

  const contractAbi = new Interface(PurchaseAbi)
  
  const contract = new ethers.Contract(
    mghWallet,
    contractAbi,
    provider
  );

  useEffect(() => {
    const getAllowance = async () => {
      if (!coin || !address || !isERC20) return setAllowance(NaN)
      const provider = makeOwnProvider(purchaseCoinOptions[coin].chain)
      const coinContract = createERC20Contract(
        provider,
        purchaseCoinOptions[coin].contractAddress
      )
      
      setAllowance(
        (await coinContract.allowance(address, mghWallet)).toNumber()
      )
    }
    getAllowance()
  }, [coin])

  const approveToken = async () => {
    if (!provider) return
    const ethersWeb3Provider = new ethers.providers.Web3Provider(provider)
    if (!coin || !monthlyChoice) return
    if (isERC20) {
      const coinContract = createERC20Contract(
        ethersWeb3Provider.getSigner(),
        purchaseCoinOptions[coin].contractAddress
      )

      const tx = await coinContract.approve(
        mghWallet,
        ethers.constants.MaxUint256
      )

      await tx.wait()

      setUSDAllowance(Number(tx))
    }
  }

  const transferToken = async () => {
    if (!coin || !provider || !address || !monthlyChoice) return

      const amountToPay =
        monthlyChoice &&
        amount * 10 ** purchaseCoinOptions[coin].decimals

    if (!amountToPay) return
    if (isERC20) {

      if (allowance < amountToPay) return
        
        if (coin == "usdc")
          coinAddress= USDWallet;
        else if ( coin == "usdt")
          coinAddress = USDWallet;
        else if ( coin== "eth")
          coinAddress = ETHWallet
        
      const tx = await contract.purchaseRole(
        [address, 1, 5, option], coinAddress, []
      )

      await tx.wait()
      // ETH & MATIC. THIS CAN BE TRIGGERED ON TESTNETS AS WELL. SO CHECK
      // ON MAINNET CONTRACT.
    } else {

      const tx = await contract.purchaseRole(
        [ address, 1, 5, option ], 0x0000000000000000000000000000000000000000, [], {value: amountToPay}
      )

      await tx.wait()

    }
  }

  const calculateAmoun = async () =>{
    if (isERC20){
      if (coin == "usdc" || coin == "usdt")
        coinAddress= USDWallet;
      else if ( coin== "eth")
        coinAddress = ETHWallet;

      amount = await contract.purchaseRole(
        [address, 1, 5, option], coinAddress, []
      )
    }else
      amount = await contract.callStatic.purchaseRole(
        [address, 1, 5, option], 0x0000000000000000000000000000000000000000 ,[]
      )
    console.log(amount)
    return amount.toFixed(2)
  }

  return (
    <>
      <div className='w-fit m-auto'>

        {/* Show Amount */}
        <h3>Total Amount: {calculateAmoun} {coin?.toUpperCase()}</h3>

        {/* Action Buttons */}
        {(coin == "usdc" || coin == "usdt") && (
          <PurchaseActionButton onClick={approveToken} disabled={false} text='Approve Token' />
        )}

        {!((coin == "usdc" || coin == "usdt") && !(+USDAllowance)) && (
          <><PurchaseActionButton onClick={transferToken} disabled={allowance < amount} text='Buy' />

          <p className='text-red-500 self-center font-medium pt-0.5 h-2'>
            {allowance < amount ? "You don't have enough tokens." : ""}
          </p></>
        )}

        {chainId !== Chains.MATIC_MAINNET.chainId && (
          <PurchaseActionButton
            onClick={() => {
              changeChain(provider, Chains.MATIC_MAINNET.chainId)
            }}
            disabled={false}
            text='Switch to Polygon'
          />
        )}
        {chainId !== Chains.ETHEREUM_MAINNET.chainId && (
          <PurchaseActionButton
            onClick={() => {
              changeChain(provider, Chains.ETHEREUM_MAINNET.chainId)
            }}
            disabled={false}
            text='Switch to Ethereum'
          />
        )}
      </div>
    </>
  )
}

export default PurchaseBuyForm
