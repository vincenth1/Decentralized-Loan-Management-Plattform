import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import contractJson from "./LiquidityPool.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x1C79DC596476420717a64421288a01996427D479";

// Replace with your actual ABI from artifacts
const ABI = contractJson.abi;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await prov.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setProvider(prov);
      setSigner(signer);
      setAccount(address);
      setContract(contract);
    } else {
      alert("Please install MetaMask");
    }
  };

  // Fetch balance
  const fetchBalance = async () => {
    if (contract) {
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
    }
  };

  // Add funds
  const handleAddFunds = async () => {
    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther("0.1"),
      });
      await tx.wait();
      fetchBalance();
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  // Extract funds
  const handleExtract = async () => {
    const tx = await contract.extract(ethers.parseEther("0.05"));
    await tx.wait();
    fetchBalance();
  };

  // Auto fetch when contract changes
  useEffect(() => {
    if (contract) fetchBalance();
  }, [contract]);

  return (
    <div className="App">
      <h1>Liquidity Pool</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <p>Pool Balance: {balance} FTM</p>

      <button onClick={handleAddFunds}>Add 0.1 FTM</button>
      <button onClick={handleExtract}>Extract 0.05 FTM</button>
    </div>
  );
}

export default App;
