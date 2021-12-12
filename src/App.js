import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/Confess.json'
import TextBox from "./TextBox";

export default function App() {
  const [showBox, setShowBox] = useState(false);
  

  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const [allConfessions, setAllConfessions] = useState([]);
  const contractAddress = "0x9e2Cc2a8aB4c50FEbbE1575bba092ca87717Ce86";
  const contractABI = abi.abi;
  const [message, setMessage] = useState("")

  const getAllConfessions = async () => {
    const { ethereum } = window;
    
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const confessContract = new ethers.Contract(contractAddress, contractABI, signer);
        const confessTxn = await confessContract.confess(message, { gasLimit: 300000 });

        /*
         * Call the getAllConfessions method from Smart Contract
         */
        const confessions = await confessContract.getAllConfessions();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let confessionsCleaned = [];
        confessions.forEach(confession => {
          confessionsCleaned.push({
            address: confession.confessor,
            timestamp: new Date(confession.timestamp * 1000),
            message: confession.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllConfessions(confessionsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let confessContract;

    const onNewConfess = (from, timestamp, message) => {
      console.log('NewConfession', from, timestamp, message);
      setAllConfessions(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      confessContract = new ethers.Contract(contractAddress, contractABI, signer);
      confessContract.on('NewConfession', onNewConfess);
    }

    return () => {
      if (confessContract) {
        confessContract.off('NewConfession', onNewConfess);
      }
    };
  }, []);

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
        <TextBox visibility={showBox} handleSubmit={confess}/>


        <div className="buttons">
          <button className="confessButton" onClick={() => setShowBox(true)}>
          I want to confess!
          </button>
          <button className="confessButton" onClick={connectWallet}>
          Connect Wallet
          </button>
        </div>
        {allConfessions.map((confession, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {confession.address}</div>
              <div>Time: {confession.timestamp.toString()}</div>
              <div>Message: {confession.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
