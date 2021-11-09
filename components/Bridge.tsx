import React, { useEffect } from 'react';
import { Widget } from "@maticnetwork/wallet-widget";

const widget = new Widget({
    target: '#btnOpenWidget',
    appName: 'MGH-Bridge',
    autoShowTime: 0,
    position: 'center',
    height: 630,
    width: 540,
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
      <button id="btnOpenWidget" className="mt-3 text-gray-400 font-medium max-w-max text-lg hover:text-blue-400 transition ease-in-out duration-300">Learn more</button>
    </React.Fragment>
  )
}

export default Bridge