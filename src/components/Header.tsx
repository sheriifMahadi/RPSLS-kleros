import React from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import WalletConnectButton from "./WalletConnectButton";
import SwitchNetwork from "./SwitchNetwork";
import { useNavigate } from 'react-router-dom';

function Header () {
    const { isLoading : isConnectingWallet, connectors, connect } = useConnect();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

    const handleConnect = () => {
        connect({
            connector: connectors[0]
        })
    }
    const navigate = useNavigate();

    return (
        <>
            <div className="header-main">
                <div className="logo">
                    RPSLS --
                </div>
                <div className="">
                    {!address ? (
                        <WalletConnectButton 
                        isLoading={isConnectingWallet}
                        onclick={handleConnect}
                        />
                    ): (
                        <div>
                              <span className="active header-btn">
                                <button onClick={() => navigate('/history')}>
                                    <span>
                                    History

                                    </span>
                                </button>
                            </span>
                            <span>
                                <button 
                                onClick={() => disconnect()} className={address ? "disconnect header-btn header-address" : "header-btn"}>
                                    <span className="header-address">{address}</span>
                                </button>
                            </span>
                          
                        </div>
                    )
                    
                    }
                </div>
            </div>
        <hr />
        <SwitchNetwork/>

        </>
)
}

export default Header