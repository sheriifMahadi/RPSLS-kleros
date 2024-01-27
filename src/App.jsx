import './App.css'
import { WagmiConfig } from 'wagmi'
import { wagmiconfig } from './wagmiconfig';
import Header from './components/Header';
function App() {
 
  return (
    <WagmiConfig config={wagmiconfig}>
      <Header/>
    </WagmiConfig>
  )
  
}

export default App
