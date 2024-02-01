
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTimer } from 'react-timer-hook';

import { formatEther } from 'viem';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { AppContext } from '../context/AppContext'
import { contracts } from '../contracts'

import { useLocalStorage } from '../hooks/useLocalStorage'
import imgPaths from '../assets/images/paths'
import { Weapons, weapons } from '../models/weaponsModel';
import { convert } from '../utils/timeconvert'
import React from 'react';

function ActiveGame() {
    const { hash } = useParams<{ hash: Address }>();
    
 
    const rpslsGameContract = useMemo(
        () => ({
          abi: contracts.rpsls.abi,
          address: hash,
        }),
        [hash],
      );

    const { data: move2 } = useContractRead({
        ...rpslsGameContract,
        functionName: 'move2',
        watch: true,
    });

    const { data: stake } = useContractRead({
        ...rpslsGameContract,
        functionName: 'stake',
        watch: true,
      });

      
    const { data: player1 } = useContractRead({
        ...rpslsGameContract,
        functionName: 'player1',
        watch: true,
    });
    const { data: lastTimePlayed } = useContractRead({
        ...rpslsGameContract,
        functionName: 'lastTimePlayed',
        watch: true,
      });
    const { data: TIMEOUT_IN_MS } = useContractRead({
        ...rpslsGameContract,
        functionName: 'TIMEOUT_IN_MS',
    });
    const { data: player2 } = useContractRead({
        ...rpslsGameContract,
        functionName: 'player2',
        watch: true,
      });

    const { setIsLoading } = useContext(AppContext);
    const [isEligibleForTimeout, setIsEligibleForTimeout] = useState<boolean>(false);

    const {
        isLoading: claimTimeoutLoading,
        write: claimTimeout,
        data: claimTimeoutTransactionData,
      } = useContractWrite({
        ...rpslsGameContract,
        functionName: 'claimTimeout',
      });
    const { address } = useAccount();

    const [successMessage, setSuccessMessage] = useState<string | undefined>();

    const { isLoading: claimTimeoutTransactionLoading } = useWaitForTransaction({
        hash: claimTimeoutTransactionData?.hash,
        onSuccess: () => setSuccessMessage('Timeout claimed successfully'),
      });
    

    useEffect(() => {
        setIsLoading?.(claimTimeoutLoading || claimTimeoutTransactionLoading);
    }, [claimTimeoutLoading, claimTimeoutTransactionLoading]);

    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: new Date(
          (Number(lastTimePlayed || 0) + Number(TIMEOUT_IN_MS || 0)) * 1000, // Convert Epoch timestamp to ms (https://dev.to/iamephraim/how-to-convert-epoch-timestamp-to-date-using-javascript-352f)
        ),
        autoStart: true,
        onExpire: () => setIsEligibleForTimeout(true),
      });
    
      const [selectedWeapon, setSelectedWeapon] = useState<Weapons>(Weapons.Null);
    
    const {
        write: submitMove,
        isLoading: isSubmitMoveLoading,
        data: submitMoveData,
        } = useContractWrite({
        ...rpslsGameContract,
        functionName: 'play',
        args: [selectedWeapon],
        value: stake || BigInt(0),
    });

    const { isLoading: isSubmitMoveTransactionLoading } = useWaitForTransaction({
        hash: submitMoveData?.hash,
        onSuccess: () => setSuccessMessage('Move submitted successfully!'),
      });
    
      const [salt] = useLocalStorage(`salt-${hash}`);
      const [move1] = useLocalStorage(`move-${hash}`);

    const {
        write: solveGame,
        isLoading: isSolveGameLoading,
        data: solveGameData,
    } = useContractWrite({
        ...rpslsGameContract,
        functionName: 'solve',
        args: [Number(move1), String(salt)],
    });

    const { isLoading: isSolveGameTransactionLoading } = useWaitForTransaction({
        hash: solveGameData?.hash,
        onSuccess: () =>
          setSuccessMessage('Game solved successfully. See the winner! 🎊🎉'),
      });
    
      const { data: isPlayer1Winner } = useContractRead({
        ...rpslsGameContract,
        functionName: 'win',
        args: [Number(move1), Number(move2)],
        enabled: Number(move1) !== Weapons.Null && Number(move2) !== Weapons.Null,
      });

      const { data: isPlayer2Winner } = useContractRead({
        ...rpslsGameContract,
        functionName: 'win',
        args: [Number(move2), Number(move1)],
        enabled: Number(move1) !== Weapons.Null && Number(move2) !== Weapons.Null,
      });

      useEffect(() => {
        if (!TIMEOUT_IN_MS || !lastTimePlayed) return;
    
        restart(
          new Date(
            (Number(lastTimePlayed || 0) + Number(TIMEOUT_IN_MS || 0)) * 1000,
          ),
        );
      }, [TIMEOUT_IN_MS, lastTimePlayed]);



      return (<>
        <div className="weapon-images-wrapper">
            {
                player1 && (stake || !move2)
                ?<div className="flex-container">

                    <div className='weapon-images'>
                        <>
                        { player2 === address
                            ? weapons.map((weapon:Weapons) => (
                            <img key={weapon-1} src={imgPaths[weapon - 1]} alt="" 
                            className={selectedWeapon === weapon ? 'clicked': ''} 
                            onClick={() => setSelectedWeapon(weapon)}/>
                            ))
                            :<></>}
                        </>
                    </div>
                    <div className="details">
                        <h1>Players</h1>
                        <p>{player1}</p>
                        <p>{player2}</p>

                        <h1>Stake</h1>
                        <p>{stake? formatEther(stake): 0}</p>
                        <h1>Count down</h1>
                        {convert(minutes)}:{convert(seconds)}
                        <div className="flex-container-show-player-moves">
                            <div className="blured">

                            </div>
                            <div className="player2-move">
                                {player2 === address && !move2 
                                ?   <>
                                <div className="button-div">
                                    <button 
                                    disabled={selectedWeapon === Weapons.Null}
                                    onClick={() => stake && submitMove?.()}
                                    className='start-game-btn'>
                                        Play
                                    </button>
                                </div>
                                </>
                                : <>
                                    {move2 
                                    ? <img key={imgPaths[move2 - 1]} src={imgPaths[move2 - 1]} alt="" 
                                    className={selectedWeapon === "" ? 'clicked': ''}
                                    />                                    
                                    : <>
                                        Please select a move
                                    </> 
                                }
                                </>}
                                {(player2 === address && move2 && isEligibleForTimeout) ||
                                (isEligibleForTimeout && player1 === address && !move2)
                                ?   <>
                                        <button
                                        onClick={() => claimTimeout?.()}
                                        >
                                            Claim timeout
                                        </button>
                                    </>
                                :   <>
                                        <></>
                                    </>}
                                {player1 === address && move2 
                                ?   <>
                                    <button onClick={() => solveGame?.()}
                                    >
                                    View Result    
                                    </button>
                                    </>
                                : 
                                    <>
                                    </>}

                                {
                                    successMessage ? {successMessage} : <></>
                                }
                            </div>
                        </div>
                    </div>

                </div>                   
                
                : player1 && move2 
                ?   <>
                        Game has been solved
                        <p>The winner is </p>
                        {isPlayer1Winner === false 
                        ?   <>
                                Player2: {player2}
                            </> 
                        : isPlayer2Winner === false 
                        ?   <>
                                Player1: {player1}
                            </>
                        :   <>
                            The game is tied. Stakes refunded
                            </>
                            }
                    </>
                : <></>
            }
        </div>

      </>
      )
}


export default ActiveGame

 