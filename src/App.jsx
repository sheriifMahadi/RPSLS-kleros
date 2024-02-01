import './App.css'
import { WagmiConfig } from 'wagmi'
import { wagmiconfig } from './wagmiconfig';
import Header from './components/Header';
import NewGame from './components/NewGame'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
// import React from 'react';
import History from './components/History.tsx';
import ActiveGame from './components/ActiveGame.tsx';

function App() {
  return (
    <WagmiConfig config={wagmiconfig}>
      <AppContextProvider>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route 
            path=''
            element={<NewGame/>}/>
            <Route
            path='/detail/:hash'
            element={<ActiveGame/>}
            />
            <Route 
            path='history'
            element={<History/>}/>
           </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </WagmiConfig>
  )
  
}

export default App
