import React from "react";


function WalletConnectButton({isLoading, onclick}) {
    return (
     <>
      {isLoading? (
                <div>
                    <button className="header-btn">
                        Connecting
                    </button>
                </div>
            ): (
                <div>
                    <button className="connect header-btn" onClick={onclick}>
                        Connect wallet
                    </button>
                </div>
            )
               
            } 
     </>   
    )
}

export default WalletConnectButton;