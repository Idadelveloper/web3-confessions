import React, {useEffect} from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <h1>😈 Confess!!!</h1>
        </div>

        <div className="bio">
        I'm Ida and I want to know something about you that nobody knows. Kinda a secret. Good or Evil. It could be something you've done or something you plan on doing or something you think about someone. A secret you'll take to your grave 😉
        </div>

        <button className="confessButton" onClick={null}>
        I want to confess!
        </button>
        <button className="confessButton" onClick={connectWallet}>
        Connect Wallet
        </button>
      </div>
    </div>
  );
}
