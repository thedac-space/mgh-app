import { Tokens } from "../state/types"

const TokenInput = ({ name, logo, direction }: any) => {

    return (
        <>
            <div className="relative flex items-center justify-between w-full p-5 rounded-xl max-w-xl ">

                <div className="flex flex-grow items-center space-x-3">
                    <img src={logo} className="object-scale-down h-16 p-1" />
                    <div className="flex flex-col pt-1">
                        <p className="text-gray-500 font-medium">{direction}</p>
                        <p className={`text-gray-200 font-medium ${name === Tokens.MGH_DATA || name === Tokens.MMGH ? "text-2xl" : "text-3xl"}`}>{name}</p>
                    </div>

                </div>
                <input required id={name} type="numeric" placeholder="0.0" className={`text-right max-w-xs bg-grey-dark shadow-black hover:shadow-colorbottom focus:shadow-colorbottom bg-opacity-70 text-gray-200 font-medium text-2xl p-4 pt-5 focus:outline-none border border-opacity-10 hover:border-opacity-30 focus:border-opacity-60 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />
            </div>

        </>
    )
}


export default TokenInput
