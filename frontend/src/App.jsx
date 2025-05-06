import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import contractJson from "./LiquidityPool.json";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x5B7c5344F3232926d7F3f28615d782926Ae5C147";

// Replace with your actual ABI from artifacts
const ABI = contractJson.abi;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [debt, setDebt] = useState("0");
  const [amount, setAmount] = useState("0");
  const [contractOwner, setContractOwner] = useState(null);
  const [borrowTime, setBorrowTime] = useState(null);
  const [userToScore, setUserToScore] = useState("");
  const [scoreToAssign, setScoreToAssign] = useState("");
  const [creditScore, setCreditScore] = useState(null);

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

      const ownerAddress = await contract.owner();
      setContractOwner(ownerAddress);
      await fetchBorrowTime();

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

  // Fetch debt
  const fetchDebt = async () => {
    if (contract) {
      const userDebt = await contract.getMyDebt();
      setDebt(ethers.formatEther(userDebt));
    }
  };

  // Fetch credit score
  const fetchCreditScore = async () => {
    if (contract && account) {
      try {
        const score = await contract.creditScore(account);
        setCreditScore(Number(score));
      } catch (err) {
        console.error("Error fetching credit score:", err);
      }
    }
  };

  // Fetch contract owner
  const fetchContractOwner = async () => {
    if (contract) {
      const owner = await contract.owner();
      setContractOwner(owner);
    }
  };

  // Fetch borrow time
  const fetchBorrowTime = async () => {
    if (contract) {
      const timestamp = await contract.borrowTimestamp(account);
      setBorrowTime(new Date(Number(timestamp) * 1000).toLocaleString());
    }
  };

  // Add funds

  const handleAddFunds = async (amount) => {
    try {
      const tx = await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethers.parseEther(amount),
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

  const handleBorrow = async () => {
    try {
      const tx = await contract.borrow(ethers.parseEther("0.05"));
      await tx.wait();
      fetchBalance();
      fetchDebt();
    } catch (error) {
      console.error("Error borrowing funds:", error);
    }
    await fetchBorrowTime();
    await fetchCreditScore();


  };

  const handleRepay = async () => {
    try {
      const tx = await contract.repay({ value: ethers.parseEther("0.05") });
      await tx.wait();
      fetchBalance();
      fetchDebt();
    } catch (error) {
      console.error("Error repaying funds:", error);
    }
    await fetchBorrowTime();

  };

  const handleAssignScore = async () => {
    try {
      const tx = await contract.setCreditScore(userToScore, parseInt(scoreToAssign));
      await tx.wait();
      alert(`Credit score of ${scoreToAssign} assigned to ${userToScore}`);
      setUserToScore("");
      setScoreToAssign("");
    } catch (error) {
      console.error("Error assigning credit score:", error);
      alert("Failed to assign score. Are you the owner?");
    }
    await fetchCreditScore();

  };

  // Auto fetch when contract changes
  useEffect(() => {
    if (contract) {
      fetchBalance();
      fetchDebt();
      fetchCreditScore();
      fetchContractOwner(); //for safeguarding, refetch owner in case of reload
      fetchBorrowTime(); // refetch borrow time
    }
  }, [contract]);

  return (
    <div className="App">
      <h1>Liquidity Pool</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <p>Pool Balance: {balance} Sonic</p>
      <p>Your Debt: {debt} Sonic</p>
      <p>Your Credit Score: {creditScore !== null ?  creditScore : null }</p>
      {contractOwner && <p>Contract Owner: {contractOwner}</p>}
      {borrowTime && <p>Last Borrowed At: {borrowTime}</p>}

      <button onClick={() => handleAddFunds("0.1")}>Add 0.1 Sonic</button>

      <input
        type="number"
        placeholder="Enter Sonic amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="0"
        step="0.01"
      />
      <button onClick={() => handleAddFunds(amount)}>Add Custom Amount</button>

      {account &&
        contractOwner &&
        account.toLowerCase() === contractOwner.toLowerCase() && (
          <button onClick={handleExtract}>Extract 0.05 Sonic</button>
        )}

      <button onClick={handleBorrow}>Borrow 0.05 Sonic</button>
      <button onClick={handleRepay}>Repay 0.05 Sonic</button>

      {account &&
        contractOwner &&
        account.toLowerCase() === contractOwner.toLowerCase() && (
          <div style={{ marginTop: "2em" }}>
            <h3>Assign Credit Score (Owner Only)</h3>
            <input
              type="text"
              placeholder="User wallet address"
              value={userToScore}
              onChange={(e) => setUserToScore(e.target.value)}
              style={{ width: "300px" }}
            />
            <br />
            <input
              type="number"
              placeholder="Score (0-100)"
              min="0"
              max="100"
              value={scoreToAssign}
              onChange={(e) => setScoreToAssign(e.target.value)}
              style={{ width: "100px", marginTop: "5px" }}
            />
            <br />
            <button onClick={handleAssignScore} style={{ marginTop: "10px" }}>
              Assign Score
            </button>
          </div>
        )}
    </div>
  );
}

export default App;
