import { useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";

const CommentaryBox = ()=>{
    return (
        <>

            <div className="flex items-start border-t border-l border-opacity-20 shadow-dark rounded-xl p-5 w-full bg-grey-dark bg-opacity-30 text-left">

                <div className="container">
                        <div className="flex row relative flex flex-wrap items-center mb-3 pl-1 text-left w-full max-w-sm">
                            <p className="font-medium text-gray-300">How happy are you with this valuation?</p>
                        </div>
                        
                        <div className="flex row items-center justify-around gap-8">
                            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                <input required id="commentInput" type="text" placeholder="Tell us what you think" className={`bg-transparent w-full text-white font-medium p-4 focus:outline-none border hover:border-opacity-100 focus:border-opacity-100 transition duration-300 ease-in-out rounded-xl placeholder-white placeholder-opacity-75`} />
                            </div>
                            

                            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div className="flex row items-center gap-5">
                                    {/* <div className="like-button col">
                                        <input type="checkbox" className="checkbox" id="checkbox" />
                                        <label htmlFor="checkbox"> 
                                            <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                                                <g id="Group" fill="none" fillRule="evenodd" transform="translate(467 392)">
                                                    <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" />
                                                    <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />
                                                    <g id="heartgroup7" opacity="0" transform="translate(7 6)">
                                                        <circle id="heart1" fill="#9CD8C3" cx="2" cy="6" r="2" />
                                                        <circle id="heart2" fill="#8CE8C3" cx="5" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup6" opacity="0" transform="translate(0 28)">
                                                        <circle id="heart1" fill="#CC8EF5" cx="2" cy="7" r="2" />
                                                        <circle id="heart2" fill="#91D2FA" cx="3" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup3" opacity="0" transform="translate(52 28)">
                                                        <circle id="heart2" fill="#9CD8C3" cx="2" cy="7" r="2" />
                                                        <circle id="heart1" fill="#8CE8C3" cx="4" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup2" opacity="0" transform="translate(44 6)">
                                                        <circle id="heart2" fill="#CC8EF5" cx="5" cy="6" r="2" />
                                                        <circle id="heart1" fill="#CC8EF5" cx="2" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup5" opacity="0" transform="translate(14 50)">
                                                        <circle id="heart1" fill="#91D2FA" cx="6" cy="5" r="2" />
                                                        <circle id="heart2" fill="#91D2FA" cx="2" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup4" opacity="0" transform="translate(35 50)">
                                                        <circle id="heart1" fill="#F48EA7" cx="6" cy="5" r="2" />
                                                        <circle id="heart2" fill="#F48EA7" cx="2" cy="2" r="2" />
                                                    </g>
                                                    <g id="heartgroup1" opacity="0" transform="translate(24)">
                                                        <circle id="heart1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
                                                        <circle id="heart2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
                                                    </g>
                                                </g>
                                            </svg> 
                                        </label>         
                                    </div> */}
                            
                                    {/* <button className="like-button col">
                                        <i className="fa fa-thumbs-down fa-spin text-2xl"></i>
                                    </button> */} 

                                    <div className="button-container">
  
                                        <div className="glass-btn red-btn">
                                            {/* <img src="https://i.postimg.cc/DwbWDQTx/facebook.png" alt="facebook"/> */}
                                            <img src="https://img.icons8.com/cotton/50/000000/like--v3.png" alt="heart"/>
                                            
                                        </div>

                                        <div className="glass-btn blue-btn">
                                            {/* <img src="https://i.postimg.cc/LstJ4Hhf/youtube.png" alt="youtube"/> */}
                                            {/* <img src="https://img.icons8.com/carbon-copy/100/000000/poor-quality.png" alt="unlike"/> */}
                                            <img src="https://img.icons8.com/nolan/64/thumbs-down.png"/>
                                        </div>
                                        
                                        {/* <div className="glass-btn amber-btn">
                                            <img src="https://i.postimg.cc/tgQ1H1Rp/soundcloud.png" alt="soundcloud"/>
                                        </div> */}

                                    </div> 
                                </div>
                                <div className="row">
                                    <button type="submit" className="w-full items-center justify-around bg-gray-200 hover:bg-white transition ease-in-out duration-500 rounded-xl m-1 ml-2 lg:ml-1 shadow-dark hover:shadow-button ">Send</button>
                                </div>
                            </div>
                           
                            
                            
                        </div>
                        
                </div>
                
                {/* <p className={`text-lg xl:text-xl font-medium text-gray-300`}>
                    We couldn't obtain Volume data for the selected NFT id{nftID ? " "+nftID : ""}. Contact the <a href="https://market.oceanprotocol.com/asset/did:op:8331D69bF312604542D5f5f41D859dA27568B7cd" target="_blank" className="hover:underline text-pink-600">Ocean Marketplace</a> for more information.
                </p> */}
            </div>
           {/*  <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-center row">
                    <div className="d-flex flex-column col-md-8">
                        <div className="d-flex flex-row align-items-center text-left comment-top p-2 bg-white border-bottom px-4">
                            <div className="profile-image"><img className="rounded-circle" src="https://i.imgur.com/t9toMAQ.jpg" width="70"/></div>
                            <div className="d-flex flex-column-reverse flex-grow-0 align-items-center votings ml-1"><i className="fa fa-sort-up fa-2x hit-voting"></i><span>127</span><i className="fa fa-sort-down fa-2x hit-voting"></i></div>
                            <div className="d-flex flex-column ml-3">
                                <div className="d-flex flex-row align-items-center align-content-center post-title"><span className="bdge mr-1">video</span><span className="mr-2 comments">13 comments&nbsp;</span><span className="mr-2 dot"></span><span>6 hours ago</span></div>
                            </div>
                        </div>
                        <div className="coment-bottom bg-white p-2 px-4">
                            <div className="d-flex flex-row add-comment-section mt-4 mb-4"><img className="img-fluid img-responsive rounded-circle mr-2" src="https://i.imgur.com/qdiP4DB.jpg" width="38"/><input type="text" className="form-control mr-3" placeholder="Add comment"/><button className="btn btn-primary" type="button">Comment</button></div>
                            <div className="commented-section mt-2">
                                <div className="d-flex flex-row align-items-center commented-user">
                                    <h5 className="mr-2">Corey oates</h5><span className="dot mb-1"></span><span className="mb-1 ml-2">4 hours ago</span>
                                </div>
                                <div className="comment-text-sm"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span></div>
                                <div className="reply-section">
                                    <div className="d-flex flex-row align-items-center voting-icons"><i className="fa fa-sort-up fa-2x mt-3 hit-voting"></i><i className="fa fa-sort-down fa-2x mb-3 hit-voting"></i><span className="ml-2">10</span><span className="dot ml-2"></span>
                                        <h6 className="ml-2 mt-1">Reply</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="commented-section mt-2">
                                <div className="d-flex flex-row align-items-center commented-user">
                                    <h5 className="mr-2">Samoya Johns</h5><span className="dot mb-1"></span><span className="mb-1 ml-2">5 hours ago</span>
                                </div>
                                <div className="comment-text-sm"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..</span></div>
                                <div className="reply-section">
                                    <div className="d-flex flex-row align-items-center voting-icons"><i className="fa fa-sort-up fa-2x mt-3 hit-voting"></i><i className="fa fa-sort-down fa-2x mb-3 hit-voting"></i><span className="ml-2">15</span><span className="dot ml-2"></span>
                                        <h6 className="ml-2 mt-1">Reply</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="commented-section mt-2">
                                <div className="d-flex flex-row align-items-center commented-user">
                                    <h5 className="mr-2">Makhaya andrew</h5><span className="dot mb-1"></span><span className="mb-1 ml-2">10 hours ago</span>
                                </div>
                                <div className="comment-text-sm"><span>Nunc sed id semper risus in hendrerit gravida rutrum. Non odio euismod lacinia at quis risus sed. Commodo ullamcorper a lacus vestibulum sed arcu non odio euismod. Enim facilisis gravida neque convallis a. In mollis nunc sed id. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Ultrices mi tempus imperdiet nulla malesuada pellentesque.</span></div>
                                <div className="reply-section">
                                    <div className="d-flex flex-row align-items-center voting-icons"><i className="fa fa-sort-up fa-2x mt-3 hit-voting"></i><i className="fa fa-sort-down fa-2x mb-3 hit-voting"></i><span className="ml-2">25</span><span className="dot ml-2"></span>
                                        <h6 className="ml-2 mt-1">Reply</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* <div className="container justify-content-center mt-5 border-left border-right">
                <div className="d-flex justify-content-center pt-3 pb-2"> <input type="text" name="text" placeholder="+ Add a note" className="form-control addtxt"/> </div>
                <div className="d-flex justify-content-center py-2">
                    <div className="second py-2 px-2"> <span className="text1">Type your note, and hit enter to add it</span>
                        <div className="d-flex justify-content-between py-1 pt-2">
                            <div><img src="https://i.imgur.com/AgAC1Is.jpg" width="18"/><span className="text2">Martha</span></div>
                            <div><span className="text3">Upvote?</span><span className="thumbup"><i className="fa fa-thumbs-o-up"></i></span><span className="text4">3</span></div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
    
};



export default CommentaryBox;


/*
    <div className="container justify-content-center mt-5 border-left border-right">
    <div className="d-flex justify-content-center pt-3 pb-2"> <input type="text" name="text" placeholder="+ Add a note" className="form-control addtxt"> </div>
    <div className="d-flex justify-content-center py-2">
        <div className="second py-2 px-2"> <span className="text1">Type your note, and hit enter to add it</span>
            <div className="d-flex justify-content-between py-1 pt-2">
                <div><img src="https://i.imgur.com/AgAC1Is.jpg" width="18"><span className="text2">Martha</span></div>
                <div><span className="text3">Upvote?</span><span className="thumbup"><i className="fa fa-thumbs-o-up"></i></span><span className="text4">3</span></div>
            </div>
        </div>
    </div>
    <div className="d-flex justify-content-center py-2">
        <div className="second py-2 px-2"> <span className="text1">Type your note, and hit enter to add it</span>
            <div className="d-flex justify-content-between py-1 pt-2">
                <div><img src="https://i.imgur.com/tPvlEdq.jpg" width="18"><span className="text2">Curtis</span></div>
                <div><span className="text3">Upvote?</span><span className="thumbup"><i className="fa fa-thumbs-o-up"></i></span><span className="text4">3</span></div>
            </div>
        </div>
    </div>
    <div className="d-flex justify-content-center py-2">
        <div className="second py-2 px-2"> <span className="text1">Type your note, and hit enter to add it</span>
            <div className="d-flex justify-content-between py-1 pt-2">
                <div><img src="https://i.imgur.com/gishFbz.png" width="18" height="18"><span className="text2">Beth</span></div>
                <div><span className="text3 text3o">Upvoted</span><span className="thumbup"><i className="fa fa-thumbs-up thumbupo"></i></span><span className="text4 text4i">1</span></div>
            </div>
        </div>
    </div>
    <div className="d-flex justify-content-center py-2 pb-3">
        <div className="second py-2 px-2"> <span className="text1">Type your note, and hit enter to add it</span>
            <div className="d-flex justify-content-between py-1 pt-2">
                <div><img src="https://i.imgur.com/tPvlEdq.jpg" width="18"><span className="text2">Curtis</span></div>
                <div><span className="text3">Upvote?</span><span className="thumbup"><i className="fa fa-thumbs-o-up"></i></span><span className="text4 text4o">1</span></div>
            </div>
        </div>
    </div>
</div>
*/