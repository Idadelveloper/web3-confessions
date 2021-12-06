import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/Confess.json'

export default function App() {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x9e2Cc2a8aB4c50FEbbE1575bba092ca87717Ce86";
  const contractABI = abi.abi;


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

  const confess = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const confessPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await confessPortalContract.getTotalConfessions();
        console.log("Retrieved total confession count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
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
        <div className="buttons">
          <button className="confessButton" onClick={confess}>
          I want to confess!
          </button>
          <button className="confessButton" onClick={connectWallet}>
          Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
