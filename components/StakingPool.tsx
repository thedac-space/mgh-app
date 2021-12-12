import { useState } from "react"
import { Tokens } from "../lib/enums"
import { getPoolData } from "../lib/utilities"

const StakingPool = ({ id, MGHBalance, totalStaked, stake, unstake, color }: any) => {
    const [stakeInput, setStakeInput] = useState("")
    const [unstakeInput, setUnstakeInput] = useState("")

    const poolData = getPoolData(id)

    return (
        <div className="flex flex-col space-y-5 flex-grow min-w-max max-w-md">

            <div className="relative flex flex-col space-y-5 h-full items-center justify-between border- border- border-opacity-0 shadow-dark rounded-xl bg-grey-dark bg-opacity-30">
                {/* {(!web3Provider || !+allowance || chainId !== Chains.MATIC_MAINNET.chainId) && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 backdrop-blur-sm rounded-xl z-20"></div>} */}
                <div className={`flex flex-col w-full rounded-t-lg p-3 ${color}`}>
                    <h3>{poolData.name}</h3>
                    <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                        <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>APY</p>
                        <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{poolData.APY}%</p>
                    </div>
                    <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                        <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Period</p>
                        <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>{poolData.lockingMonth} Month</p>
                    </div>
                    <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                        <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Locking starts in:</p>
                        <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>176h</p>
                    </div>
                    <div className="self-start flex items-center justify-between space-x-1 sm:space-x-3 w-full">
                        <p className={`text-gray-300 font-medium text-base sm:text-lg pt-1 flex-grow`}>Your Balance</p>
                        <p className={`text-gray-400 font-medium text-base sm:text-lg pt-1 text-right`}>1000 <span className="text-sm sm:text-base font-normal">$MGH</span></p>
                    </div>
                </div>


                <div className="flex flex-col flex-grow w-full items-stretch justify-center space-y-10 sm:space-y-10 max-w-md">
                    <div className="flex flex-col items-center">
                        <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full px-1 mb-1.5">
                            <p className="text-gray-300 font-medium text-xl flex-grow">Stake</p>
                            <p onClick={() => setStakeInput(MGHBalance)} className="text-gray-400 cursor-pointer font-medium hover:text-gray-300 transition ease-in-out duration-300">Max: {(+MGHBalance) ? (+MGHBalance).toFixed(1) : ""}</p>
                        </div>

                        <input onChange={(e) => { setStakeInput(e.target.value) }} value={stakeInput} autoComplete="off" required id={Tokens.MGH} type="number" placeholder="0.0" className={`text-right w-full bg-grey-dark shadow-dark hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-lg sm:text-xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                        <button disabled={stakeInput ? (+stakeInput > +MGHBalance ? true : false) : true} onClick={() => stake(stakeInput)} className={`disabled:opacity-30 disabled:hover:shadow-dark disabled:cursor-default mt-2 sm:mt-4 flex justify-center items-center border border-pink-600 shadow-dark hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4`}>
                            <p className="pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl">Stake $MGH</p>
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="self-start flex items-center space-x-1 sm:space-x-3 w-full px-1 mb-1.5">
                            <p className="text-gray-300 font-medium text-xl flex-grow">Unstake</p>
                            <p onClick={() => (+totalStaked) && setUnstakeInput(totalStaked)} className="text-gray-400 cursor-pointer font-medium pt-1 hover:text-gray-300 transition ease-in-out duration-300">Max: {(+totalStaked) ? (+totalStaked).toFixed(1) : ""}</p>
                        </div>

                        <input onChange={(e) => { setUnstakeInput(e.target.value) }} value={unstakeInput} required id={Tokens.MGH} type="number" autoComplete="off" placeholder="0.0" className={`text-right w-full bg-grey-dark shadow-dark hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-lg sm:text-xl p-3 sm:p-4 pt-4 sm:pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />

                        <button disabled={unstakeInput ? (+unstakeInput > +totalStaked ? true : false) : true} onClick={() => unstake(unstakeInput)} className={`mt-2 sm:mt-4 disabled:opacity-30 disabled:hover:shadow-dark disabled:cursor-default flex justify-center items-center border border-pink-600 shadow-dark hover:shadow-button transition ease-in-out duration-500 rounded-xl w-full py-3 sm:py-4`}>
                            <p className="pt-1 z-10 text-pink-600 font-medium text-lg sm:text-xl">Unstake $MGH</p>
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default StakingPool
