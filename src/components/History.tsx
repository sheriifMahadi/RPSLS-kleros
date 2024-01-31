
import React, { FC, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Hash } from 'viem';
import { useContractRead, useContractReads, useWalletClient } from 'wagmi';
import { AppContext } from '../context/AppContext'
import { contracts } from '../contracts'
 
function History(): FC {
    const { data: walletClient } = useWalletClient();
    const { isLoading, data: availableGameSessions } = useContractRead({
      ...contracts.factory,
      functionName: 'getGameSessions',
      account: walletClient?.account,
      watch: true,
    });
    const { data: activeGameSessions, isLoading: isGameStakesLoading } =
    useContractReads({
      contracts: availableGameSessions?.map((gameSession: Hash) => {
        return {
          address: gameSession,
          functionName: 'stake',
          abi: contracts.rpsls.abi,
        };
      }),
      select: (data) => {
        if (!availableGameSessions) return [];

        return data
          .filter((session) => Number(session.result) > 0)
          .map((_, index) => availableGameSessions[index]);
      },
      watch: true,
    });

  const navigate = useNavigate();

  const { setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsLoading?.(isLoading || isGameStakesLoading);
  }, [isLoading, isGameStakesLoading]);
  return (
        <>
        <div className='history-main'>
            <h1>History</h1>
            <span className='back-btn-span'>
                <button className='back-btn'
                onClick={() => navigate('/')}>
                Back
                </button>

            </span>
            <div className="flex-container-history">
            <div className="history-main-inner">
            {activeGameSessions && activeGameSessions?.length >=1 ? (
                activeGameSessions.map((hash: Hash) => (
                    <div key={hash} className='history-hash'>
                        <div className='hash'>
                            {hash}
                            <hr />
                        </div>
                        <span className='history-hash-btn'>
                            <button onClick={() => navigate(`/detail/${hash}`)}>
                                    View
                            </button>
                        </span>
                    </div>

                ))
            )
            :<div>
                    <h1>There are no available games</h1>
            </div>
            }
        </div>
        </div>
        </div>

        </>
  )

}

export default History