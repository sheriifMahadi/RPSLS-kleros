import React from "react";


function WalletConnectButton({isLoading, onclick}) {
    return (
     <>
      {isLoading? (
                <div>
                    <button>
                        Connecting
                    </button>
                </div>
            ): (
                <div>
                    <button onClick={onclick}>
                        Connect wallet
                        
                    </button>
                </div>
            )
               
            } 
     </>   
    )
}

export default WalletConnectButton;