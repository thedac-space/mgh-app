import { useState } from "react";

interface ScoreBoxProps {
    showCard: boolean;
}


const ScoreBox = ({ showCard }: ScoreBoxProps)=>{
    return (
        <>
            <div className={`mt-5`}>
                <div className="container">
                        <div className="flex row relative flex flex-wrap items-center mb-3 pl-1 text-left w-full max-w-sm">
                            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <p className=" text-lg xl:text-xl font-medium text-gray-300">Valuation Score: </p>
                            </div>
                            
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ml-5">
                                <div className="flex row items-center gap-5 w-100 mt-2">

                                    <div className="button-container w-50">
                                        <div className="glass-btn red-btn wide-btn tall-btn span-hover">
                                            <img className="regular-icon" src="https://img.icons8.com/cotton/50/000000/like--v3.png" alt="heart"/>
                                            <span className="font-medium ml-5">
                                                50
                                            </span>
                                        </div>

                                        <div className="glass-btn blue-btn wide-btn tall-btn span-hover">
                                            <img className="regular-icon" src="https://img.icons8.com/nolan/64/thumbs-down.png"/>
                                            <span className="font-medium ml-5">
                                                26
                                            </span>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        
                        {/* <div className="flex row items-center justify-around gap-8 mt-10">
                            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div className="flex row items-center gap-5">

                                    <div className="button-container">
                                        <div className="glass-btn red-btn">
                                            <img src="https://img.icons8.com/cotton/50/000000/like--v3.png" alt="heart"/>
                                            50
                                        </div>

                                        <div className="glass-btn blue-btn">
                                            <img src="https://img.icons8.com/nolan/64/thumbs-down.png"/>
                                            26
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>   */}
                </div>
            </div>
        </>
    );
    
};


export default ScoreBox;