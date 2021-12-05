import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const confess = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <h1>😈 Confess!!!</h1>
        </div>

        <div className="bio">
        I'm Ida and I want to know something about you that nobody knows. Kinda a secret. Good or Evil. It could be something you've done or something you plan on doing or something you think about someone. A secret you'll take to your grave 😉
        </div>

        <button className="confessButton" onClick={confess}>
        I want to confess!
        </button>
      </div>
    </div>
  );
}
