import React from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import WalletConnectButton from "./WalletConnectButton";

function Header () {
    const { isLoading : isConnectingWallet, connectors, connect } = useConnect();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();

    const handleConnect = () => {
        connect({
            connector: connectors[0]
        })
    }
    return (
    
        <div className="header-main">
            <div className="logo">
            </div>
            {!address ? (
                <WalletConnectButton 
                isLoading={isConnectingWallet}
                onclick={handleConnect}
                />
            ): (
                <div>
                    {/* icon */}
                    <span>
                        {address}
                    </span>
                </div>
            )
               
            }  
        </div>)
}

export default Header