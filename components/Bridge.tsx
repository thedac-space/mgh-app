import React, { useEffect } from 'react';
import { Widget } from "@maticnetwork/wallet-widget";

const widget = new Widget({
  target: '#btnOpenWidget',
  appName: 'MGH-Bridge',
  // autoShowTime: 0,
  position: 'center',
  // height: 630,
  // width: 540,
  network: 'mainnet',
});


const Bridge = () => {

  // subscribe to event onLoad
  const load = () => {
    console.log('widget is loaded');
  };

  const close = () => {
    console.log('widget is closed');
  };

  useEffect(() => {
    widget.on('load', load);
    widget.on('close', close);
    widget.create();
  }, [])

  return (
    <React.Fragment>
      <button id="btnOpenWidget" className="relative flex justify-center items-center border border-opacity-0 hover:border-opacity-20 hover:shadow-button transition ease-in-out duration-500 shadow-black rounded-xl w-full py-4 text-gray-200 font-medium text-lg overflow-hidden">
        <div className="h-full w-full absolute bg-gradient-to-br transition-all ease-in-out duration-300 from-pink-600 to-blue-500 rounded-xl blur-2xl group-hover:blur-xl" />
        <span className="pt-1 z-10">Bridge</span>
      </button>
    </React.Fragment>
  )
}

export default Bridge