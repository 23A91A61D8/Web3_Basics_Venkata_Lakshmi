// ✅ Replace this with your deployed contract address
const contractAddress = "0x9D5A1e7884c0BfC9301c4c03d08A7cC20F147d23";

// ✅ Replace with your contract ABI from Remix
const contractABI = [
  {
    "inputs": [],
    "name": "message",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string","name":"newMessage","type":"string"}],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById("walletAddress").innerText = "Connected: " + address;
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("✅ MetaMask connected:", address);
    } catch (error) {
      console.error("Connection failed:", error);
    }
  } else {
    alert("🦊 Please install MetaMask!");
  }
}

async function readMessage() {
  if (!contract) {
    alert("Please connect MetaMask first!");
    return;
  }
  try {
    const message = await contract.message();
    document.getElementById("messageDisplay").innerText = "Message: " + message;
  } catch (error) {
    console.error("Error reading message:", error);
  }
}

async function writeMessage() {
  if (!contract) {
    alert("Please connect MetaMask first!");
    return;
  }
  const newMsg = document.getElementById("newMessage").value;
  if (newMsg.trim() === "") {
    alert("Please enter a message!");
    return;
  }
  try {
    const tx = await contract.setMessage(newMsg);
    await tx.wait();
    alert("✅ Message updated on blockchain!");
    readMessage();
  } catch (error) {
    console.error("Error writing message:", error);
  }
}
