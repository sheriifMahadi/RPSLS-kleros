import React from "react";
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi';

function SwitchNetwork() {
    const { switchNetwork, chains } = useSwitchNetwork();
    const { chain } = useNetwork();

    return (
    <>
        {chains 
        && switchNetwork 
        && !chains.find((supportedChain:Chain) => 
        supportedChain.id === chain?.id) 
        ?<div className="modal-container">
            <div className="modal">
                <p className="logo">Network not supported</p>
                <button className="header-btn switchNetwork" onClick={() => switchNetwork(chains[0]?.id)}>
                    Switch to {chains[0].name}
                </button>
            </div>
        </div>
        :<></>
        }
    </>
    )
}

export default SwitchNetwork