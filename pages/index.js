import {useState, useEffect} from "react";
import {ethers} from "ethers";
import wishingSystem_abi from "../artifacts/contracts/Assessment.sol/WishingSystem.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [wishingSystem, setWishingSystem] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [error, setError] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const wishingSystemABI = wishingSystem_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getWishingContract();
  };

  const getWishingContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const wishingSystemContract = new ethers.Contract(contractAddress, wishingSystemABI, signer);
    setWishingSystem(wishingSystemContract);
  }

  const getPrimogems = async() => {
    if (wishingSystem) {
      setBalance((await wishingSystem.getPrimogems()).toNumber());
    }
  }

  const purchasePrimogems = async(amount) => {
    if (wishingSystem) {
      try {
        const price = await wishingSystem.getPrimogemPrice(amount);
        let tx = await wishingSystem.purchasePrimogems(amount, {
          value: price,
          gasLimit: 300000
        });
        await tx.wait();
        getPrimogems();
        setError("");
      } catch (err) {
        console.error("Error:", err);
        if (err.reason) {
          if (err.reason.includes("You are not the Traveler")) {
            setError("Please connect with the correct Traveler account");
          } else if (err.reason.includes("Invalid primogem")) {
            setError("Invalid primogem package selected");
          } else if (err.reason.includes("Incorrect ETH")) {
            setError("Incorrect ETH amount sent for primogem purchase");
          } else {
            setError(err.reason);
          }
        } else {
          setError("Failed to purchase primogems. Please check if you have enough ETH and try again.");
        }
      }
    }
  }

  const makeWish = async(amount) => {
    if (wishingSystem) {
      try {
        let tx = await wishingSystem.makeWish(amount);
        await tx.wait();
        getPrimogems();
        setError("");
      } catch (err) {
        console.error("Error:", err);
        if (err.reason) {
          if (err.reason.includes("You are not the Traveler")) {
            setError("Please connect with the correct Traveler account");
          } else if (err.reason.includes("You can only withdraw")) {
            setError("Invalid wish amount selected");
          } else {
            setError(err.reason);
          }
        } else if (err.message && err.message.includes('InsufficientPrimogems')) {
          const numbers = err.message.match(/\d+/g);
          if (numbers && numbers.length >= 2) {
            const currentBalance = numbers[0];
            const requiredAmount = numbers[1];
            setError(`Not enough primogems! You have ${currentBalance} primogems but need ${requiredAmount} primogems to make this wish.`);
          } else {
            setError("Insufficient primogems for this wish.");
          }
        } else {
          setError("Failed to make wish. Please try again.");
        }
      }
    }
  }

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to access the Wishing System.</p>
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect your Traveler Wallet</button>
    }

    if (balance == undefined) {
      getPrimogems();
    }

    return (
      <div className="primogem-section">
        <div className="account-info">
          <p>Traveler Account: {account}</p>
          <p>Primogem Balance: {balance}</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div>
            <h3>Buy Primogems:</h3>
            <div className="button-grid">
              <button onClick={() => purchasePrimogems(60)}>60 Primogems ($0.99)</button>
              <button onClick={() => purchasePrimogems(300)}>300 Primogems ($4.99)</button>
              <button onClick={() => purchasePrimogems(980)}>980 Primogems ($14.99)</button>
              <button onClick={() => purchasePrimogems(1980)}>1980 Primogems ($29.99)</button>
              <button onClick={() => purchasePrimogems(3280)}>3280 Primogems ($49.99)</button>
              <button onClick={() => purchasePrimogems(6480)}>6480 Primogems ($99.99)</button>
            </div>
          </div>
          <div>
            <h3>Make Wishes:</h3>
            <div className="wish-buttons">
              <button onClick={() => makeWish(160)}>1 Wish (160 Primogems)</button>
              <button onClick={() => makeWish(1600)}>10 Wishes (1600 Primogems)</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header className="header">
        <h1>Welcome to the Genshin Impact Wishing System!</h1>
        <p>Purchase Primogems and make your wishes here, Traveler!</p>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: #2c3e50;
          color: #ecf0f1;
          min-height: 100vh;
          padding: 20px;
        }
        .header {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #34495e;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header h1 {
          color: #f1c40f;
          margin-bottom: 10px;
        }
        :global(button) {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        :global(button:hover) {
          background-color: #2980b9;
        }
        :global(.primogem-section) {
          background-color: #34495e;
          padding: 20px;
          border-radius: 10px;
          margin: 10px auto;
          max-width: 800px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        :global(.account-info) {
          background-color: #2980b9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        :global(.error-message) {
          background-color: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border: 2px solid #e74c3c;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        :global(h3) {
          color: #f1c40f;
          margin: 15px 0;
        }
      `}</style>
    </main>
  )
}
