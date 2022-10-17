import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import flowerNFT from "./utils/flowerNFT.json"

// Constants
const TWITTER_HANDLE = '_k1ddx';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const RARIBLE_LINK = 'https://rinkeby.rarible.com/token/';
const TOTAL_MINT_COUNT = 87;

const CONTRACT_ADDRESS = "0x5B54dE188A660DbF5E2BA6935ce1D70669348eA0";

const App = () => {
  
    const [currentAccount, setCurrentAccount] = useState("");
    const [showModal, setShowModal] = useState(false);

    const checkIfWalletIsConnected = async() => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request(
            { method: 'eth_accounts'}
        );

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
            setupEventListener();
        } else {
            console.log("No authorized account found");
        }

        let chainId = await ethereum.request({ method: 'eth_chainId' });
        
        console.log("Connected to chain " + chainId);
        
        // Rinkebey test network chain ID
        const rinkebyChainId = "0x4"; 
        if (chainId !== rinkebyChainId) {
            alert("You are not connected to the Rinkeby Test Network!");    
        } else {
          console.log("You are on the Rinkeby Test Network.")
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

            setupEventListener()   
        } catch (error) {
            console.log(error);
        }
    }

    // Setup our listener.
    const setupEventListener = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, flowerNFT.abi, signer);

                connectedContract.on(
                    "newTokenMinted", (from, tokenId) => {
                        alert("you can see your hana now at: " + RARIBLE_LINK + CONTRACT_ADDRESS + ":" + tokenId);
                        setShowModal(false);
                    }
                );
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
            
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, flowerNFT.abi, signer);
            
                console.log("Going to pop wallet now to pay gas...")

                //user connects to metamask
                let nftTxn = await connectedContract.mintNFT();     
                
                console.log("Mining...please wait.");

                setShowModal(true);
                await nftTxn.wait();
            
            } else {
                console.log("Ethereum object doesn't exist!");
                setShowModal(false)
            }
        } catch (error) {
            console.log(error);
            setShowModal(false);
        }
    }

    const modalMint = () => {
        askContractToMintNft();
        setShowModal(false);
    }

    useEffect(() => {
      checkIfWalletIsConnected();
    }, [])

    return (
        <>
        <div className="App">
            <div className="container">
                
                <div className="header-container">
                    <text className="header gradient-digi">DIGI</text>
                    <text className="header gradient-hana">HANA</text>
                    <p>
                        <text className="sub-text">Each unique. Each beautiful. Discover your</text> <text className="sub-text gradient-hana">flower</text> <text className="sub-text">today.</text>
                    </p>
                    <p className="description">
                        <p>Each of the 87 flowers only bloom at the time of minting. This means that you will not get to see what your hana is going to exactly look like beforehand, just like real flowers.</p>
                        
                        <p>Once the flower blossoms, it is then encoded and baked <em>directly</em> on-chain. For as long as the Ethereum ecosystem continues to exist, your <em className="gradient-hana">hana</em> will continue to blossom next to you.</p>
                    </p>
                    <div>
                        <img src={"https://rarible.mypinata.cloud/ipfs/QmWcv7zaVUaK6HGM16Xx28RWFRGGGKzxr8Wbb3JuFVW1ti"} width={240} height={240}
                        />
                    </div>
                    {currentAccount === "" ? (
                        <button onClick={connectWallet} className="cta-button connect-wallet-button">Connect to Wallet</button>
                        ) : (
                        <button className="cta-button mint-button" onClick={modalMint}>Mint your DigiHana</button>
                        )
                    }
                </div>

                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />      
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built by @${TWITTER_HANDLE}`}</a>
                </div>

            </div>
        </div>
        
        {showModal ? (
            
            <div className="modalfill">
                <p className="loading header gradient-digi">Watering your hana. Hold on...</p>
                <div className="sun">
                    <div className="sunrays"></div>
                    <div className="circle"></div>
                </div>
                <div className="shadow"></div>
                <div className="pot"></div>
                <div className="water-jar"></div>
                <div className="water"></div>
                <div className="flower">
                    <div className="stem"></div>
                    <div className="leaf"></div>
                    <div className="petal petal-1"></div>
                    <div className="petal petal-2"></div>
                    <div className="petal petal-3"></div>
                    <div className="petal petal-4"></div>
                    <div className="petal petal-5"></div>
                    <div className="petal petal-6"></div>
                    <div className="dot"></div>
                </div>
            </div>
        ) : null}
        
    </>
        
    );
};

export default App;
