document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWallet");
  connectBtn?.addEventListener("click", async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        connectBtn.innerText = `Connected: ${resp.publicKey.toString().slice(0, 4)}...`;
        connectBtn.disabled = true;
      } catch {
        alert("Connection failed.");
      }
    } else {
      alert("Phantom wallet not found.");
    }
  });

  const tokenForm = document.getElementById("tokenForm");
  const formStatus = document.getElementById("formStatus");

  tokenForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.innerText = "Minting your token...";
    formStatus.style.color = "aqua";

    try {
      const tokenName = document.getElementById("tokenName").value;
      const tokenSymbol = document.getElementById("tokenSymbol").value;
      const tokenSupply = parseInt(document.getElementById("tokenSupply").value);
      const tokenImage = document.getElementById("tokenImage").value;

      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        alert("Phantom wallet not found.");
        return;
      }

      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("devnet"), "confirmed");
      const resp = await provider.connect();
      const userPublicKey = resp.publicKey;

      const mintKeypair = solanaWeb3.Keypair.generate();
      const mint = mintKeypair.publicKey;
      const lamports = await connection.getMinimumBalanceForRentExemption(splToken.MINT_SIZE);
      const tokenAccount = await splToken.getAssociatedTokenAddress(mint, userPublicKey);

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.createAccount({
          fromPubkey: userPublicKey,
          newAccountPubkey: mint,
          space: splToken.MINT_SIZE,
          lamports,
          programId: splToken.TOKEN_PROGRAM_ID
        }),
        splToken.createInitializeMintInstruction(mint, 9, userPublicKey, null),
        splToken.createAssociatedTokenAccountInstruction(userPublicKey, tokenAccount, userPublicKey, mint),
        splToken.createMintToInstruction(mint, tokenAccount, userPublicKey, tokenSupply * Math.pow(10, 9))
      );
