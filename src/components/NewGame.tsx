import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useContractWrite, useAccount, useSignMessage } from 'wagmi'
import { Address, Hash, encodePacked, keccak256, parseEther, isAddress } from 'viem';
import { contracts } from '../contracts'
import imgPaths from '../assets/images/paths'
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppContext } from '../context/AppContext';
import { validateAddress } from '../validators/Validators';
import { Weapons, weapons } from '../models/weaponsModel';
import GameDetail from './GameDetail.tsx';
import React from 'react';

function NewGame() {
    
    const [clicked, setClicked] = useState(false)
    const { address } = useAccount();
    const [player2, setPlayer2] = useState<Address | undefined>();
    const [bid, setBid] = useState<string>('0');
    const [, setSalt] = useLocalStorage('salt');
    const [, setMove1] = useLocalStorage('move');
    const [selectedWeapon, setSelectedWeapon] = useState<Weapons>(Weapons.Null);
    const [isMoveCommitted, setIsMoveCommitted] = useState<boolean>();
    
    const handleStartGame = (e) => {
        const salt = crypto.randomUUID();

          _move1Hash.current = keccak256(
            encodePacked(['uint8', 'string'], [selectedWeapon, salt]),
          );

          _salt.current = salt;

          signMessage({
            message: `Your game move is: ${selectedWeapon}. Your game salt is: ${_salt.current}. Keep it private! It'll automatically be stored in your local storage.`,
          });
        }
    
    const {
        error,
        isLoading: isNewGameSessionLoading,
        write: createNewGameSession,
        data: createNewGameSessionData,
      } = useContractWrite({
        ...contracts.factory,
        functionName: "createGameSession",
        value: parseEther(bid),
      });
    
    const _salt = useRef<string | undefined>();
    const _move1Hash = useRef<Hash | undefined>();
    const { signMessage, data: signData } = useSignMessage();
    useEffect(() => {
        if (createNewGameSessionData?.hash && !error) {
          setIsMoveCommitted(true);
        }
    }, [createNewGameSessionData?.hash]);
    
      const [gameSessionHash, setGameSessionHash] = useState<Hash>();


    useEffect(() => {
        if (!createNewGameSessionData && signData && _move1Hash.current && player2)
            createNewGameSession({
            args: [_move1Hash.current, player2],
            });
    }, [signData]);

    useEffect(() => {
        if (gameSessionHash && _salt.current) {
          setSalt(_salt.current, `salt-${gameSessionHash}`);
          setMove1(String(selectedWeapon), `move-${gameSessionHash}`);
        }
    }, [gameSessionHash]);

    const { setErrorMessage, setIsLoading } = useContext(AppContext);
    useEffect(() => {
        if (error?.message) setErrorMessage?.(error.message);
      }, [error?.message]);

    useEffect(() => {
        setIsLoading?.(isNewGameSessionLoading);
    }, [isNewGameSessionLoading]);

    return (
        <>
            <div className="weapon-images-wrapper">
                {!isMoveCommitted ? <p>New Game</p>: <p></p>}
                {!isMoveCommitted 
                 ?<div className="flex-container">
                 <div className="weapon-images">
                    {!isMoveCommitted 
                    ? <>{weapons.map((weapon:Weapons) => (
                         <img key={weapon-1} src={imgPaths[weapon - 1]} alt="" 
                         className={selectedWeapon === weapon ? 'clicked': ''} 
                         onClick={() => setSelectedWeapon(weapon)}/>
                    ))}</>
                    :<></>}
                    
                 </div>
                 <div>
                     <div className="inputs">
                         <div className="text-input-wrapper address">
                         <p>Wallet Address</p>
                         <input className='' 
                         type="text" 
                         value={player2}
                         placeholder='0x123A5357Ff689d2e54fe47e3568D057e35dDc8E5'
                         onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
                         isAddress(value) && setPlayer2(value)}
                         />
                         </div>
 
                         <div className="text-input-wrapper bid">
                         <p>Eth Bid</p>
                         <input className='' 
                         type="number" 
                         placeholder='1'
                         value={bid}
                         onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
                         setBid(value)}
                         />
                         </div>
                         
                     </div>
                     <div className="button-div">
                     {!(
                     address &&
                     selectedWeapon !== Weapons.Null &&
                     Number(bid) > 0 &&
                     validateAddress(player2)
                 ) ? <button disabled
                         className='start-game-btn'>
                         Play
                     </button>
                     :<button 
                         className='start-game-btn'
                         onClick={handleStartGame}
                         >
                          Play
                     </button>
                     } 
                     </div>
                 </div>
                 </div>
                 : createNewGameSessionData?.hash ? (
                  <GameDetail
                  setGameSessionHash={setGameSessionHash}
                  transactionHash={createNewGameSessionData?.hash}
                  bid={bid}
                  player2={player2}
                  />
                 ): <></>
                }
            </div>
           
        </>
    )
}

export default NewGame

