import { useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";

interface CommentaryBoxProps {
    showCard: boolean;
}


const CommentaryBox = ({ showCard }: CommentaryBoxProps)=>{
    return (
        <>
            <div className={`${showCard ? "animate__fadeIn" : "hidden"} mt-5`}>
                <div className="container">
                        <div className="flex row relative flex flex-wrap items-center mb-3 pl-1 text-left w-full max-w-sm">
                            <p className="font-medium text-gray-300">How happy are you with this valuation?</p>
                        </div>

                        <div className="flex row items-center justify-around gap-8">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12  w-90">
                                <input required id="commentInput" type="text" placeholder="Tell us what you think" className={`bg-transparent w-full text-white font-medium p-4 focus:outline-none border hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />
                            </div>
                        </div>
                        
                        <div className="flex row items-center justify-around gap-8 mt-10">
                            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div className="flex row items-center gap-5">

                                    <div className="button-container">
                                        <div className="glass-btn red-btn">
                                            <img src="https://img.icons8.com/cotton/50/000000/like--v3.png" alt="heart"/>
                                        </div>

                                        <div className="glass-btn blue-btn">
                                            <img src="https://img.icons8.com/nolan/64/thumbs-down.png"/>
                                        </div>

                                    </div> 
                                </div>
                                <div className="row">
                                    <button type="submit" className="w-full items-center justify-around bg-gray-200 hover:bg-white transition ease-in-out duration-500 rounded-xl m-1 ml-2 lg:ml-1 shadow-dark hover:shadow-button ">Send</button>
                                </div>
                            </div>
                        </div>  
                </div>
            </div>
        </>
    );
    
};


export default CommentaryBox;