import './App.css'
import { WagmiConfig } from 'wagmi'
import { wagmiconfig } from './wagmiconfig';
import Header from './components/Header';
import NewGame from './components/NewGame'

function App() {
 
  return (
    <WagmiConfig config={wagmiconfig}>
      <Header/>
      <NewGame/>
    </WagmiConfig>
  )
  
}

export default App
