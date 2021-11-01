import Image from "next/image"

import Toolbar from "./Toolbar"


const Intro = ({ scroll }: any) => {

    return (
        <div className="text-center w-full" style={{ height: "3000px" }}>

            <div className={`sticky top-0 h-screen w-full`}>
                <Toolbar dark={true} />

                <div className={`absolute top-0 h-screen w-full z-20 flex justify-center items-center`}>
                    <div className={`${scroll > 10 && "transition-all duration-1000 transform xl:translate-x-64 xl:-translate-y-0 -translate-y-20"} flex flex-col items-center xl:items-start`}>


                    </div>

                </div>


            </div>
        </div>
    )
}

export default Intro