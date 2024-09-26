import React, { useState, useEffect } from 'react';

function App() {
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        // Check if Telegram Web App API is available and ready
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready(); // Initialize Telegram WebApp environment
        }
    }, []);

    const connectPhantomWallet = async () => {
        // Check if Phantom Wallet is installed
        if (window.solana && window.solana.isPhantom) {
            try {
                const wallet = await window.solana.connect(); // Request connection to Phantom
                const walletPublicKey = wallet.publicKey.toString(); // Get wallet public key
                setWalletAddress(walletPublicKey); // Set wallet address in the state

                // Send the public key and Telegram chat ID to the backend via ngrok URL
                fetch(
                    'https://add3-103-99-13-154.ngrok-free.app/connect-wallet',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            walletAddress: walletPublicKey,
                            chatId: window.Telegram.WebApp.initDataUnsafe.user
                                .id,
                        }),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => console.log(data.message));
            } catch (err) {
                console.error('Error connecting to Phantom wallet:', err);
            }
        } else {
            alert('Phantom Wallet not found. Please install Phantom Wallet.');
        }
    };

    return (
        <div className='App'>
            <h1>Connect Phantom Wallet in Telegram Mini App</h1>
            {walletAddress ? (
                <p>Connected wallet address: {walletAddress}</p>
            ) : (
                <button onClick={connectPhantomWallet}>
                    Connect Phantom Wallet
                </button>
            )}
        </div>
    );
}

export default App;
