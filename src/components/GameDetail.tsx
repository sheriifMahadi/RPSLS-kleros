
import { Dispatch, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Hash, decodeAbiParameters } from 'viem';
import { Address, useWaitForTransaction } from 'wagmi';
import React from 'react';

interface GameDetailProps {
    transactionHash: Hash;
    setGameSessionHash: Dispatch<Hash>;
    bid: string;
    player2: `0x${string}`;
  }

function GameDetail ({setGameSessionHash: _setGameSessionHash,
                        transactionHash: _transactionHash,
                    bid: bid,
                player2: player2}: GameDetailProps){
    const [transactionHash, setTransactionHash] =
    useState<Hash>(_transactionHash);
    const { setIsLoading, setErrorMessage } = useContext(AppContext);

    const handleShare = (e) => {
    navigator.clipboard.writeText(
        `${window.location.hostname}/detail/${gameSessionHash}`,
    )
    }
    
    const {
        error,
        data: transactionData,
        isLoading: isTransactionDataLoading,
        } = useWaitForTransaction({
        hash: transactionHash,
        enabled: !!transactionHash,
        onReplaced: (replacement) => {
            if (replacement.reason === 'cancelled') {
            setErrorMessage?.(`Transaction ${transactionHash} was cancelled`);
            return;
            } else {
            setTransactionHash(replacement.transactionReceipt.transactionHash);
            }
        },
        onError: (err) => setErrorMessage?.(err.message),
        confirmations: 1,
        });

    const [gameSessionHash, setGameSessionHash] = useState<Hash>();

    useEffect(() => {
        if (!transactionData?.logs[0]?.data) return;
        const _gameSessionHash = String(
            decodeAbiParameters(
                [
                  {  type: 'address',
                    name: 'gameSession'
                    },
                ],
                transactionData.logs[0].topics[1] as Address
            ),
        ) as Hash;
            
        setGameSessionHash(_gameSessionHash);

        _setGameSessionHash(_gameSessionHash);
    }, [transactionData])
    const navigate = useNavigate();

    useEffect(() => {
      setIsLoading?.(isTransactionDataLoading);
    }, [isTransactionDataLoading]);

    return (
        <>
            <div className='game-detail-wrapper'>
                <p className='game-detail-heading'>Game Detail</p>
                {isTransactionDataLoading
                ?   <div className='pending'>
                    <span>Please Wait</span>
                    </div>

            : transactionData?.status === 'success' && !error
            ?   <div className='success'>
                    <p>Status: <span>Success</span></p>
                    <p>Game session Hash: 
                        <span>
                            {gameSessionHash}    
                        </span> 
                    </p>
                    <p>Player 2 address: <span>{player2}</span> </p>
                    <p>Bid: <span>{bid} eth</span></p>
                </div>
                : <></>}
                {gameSessionHash
                ? <div className='button-div share-btn start-game-btn'>
                    <button onClick={handleShare}>
                        Share
                    </button> 
                </div>

                : <></>}
            </div>
            <hr />
        </>
    )
}

export default GameDetail