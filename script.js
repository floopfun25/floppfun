document.addEventListener("DOMContentLoaded", () => {
  // Cüzdan bağlantısı
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

  // Token oluşturma formu
  const tokenForm = document.getElementById("tokenForm");
  const formStatus = document.getElementById("formStatus");
  tokenForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.innerText = "Minting your token...";
    formStatus.style.color = "aqua";

    try {
      const tokenName = document.getElementById("tokenName").value;
      const tokenSymbol = document.getElementById("tokenSymbol").value;
      const tokenImage = document.getElementById("tokenImage").value;

      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        alert("Phantom wallet not found.");
        return;
      }

      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"), "confirmed");
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
        splToken.createMintToInstruction(mint, tokenAccount, userPublicKey, 1_000_000_000)
      );

      transaction.feePayer = userPublicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      transaction.partialSign(mintKeypair);

      const signedTx = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(signature, "confirmed");

      const mintAddress = mint.toBase58();
      formStatus.innerText = `Token ${tokenName} minted successfully!`;
      formStatus.style.color = "lime";

      window.location.href = `token.html?mint=${mintAddress}&symbol=${tokenSymbol}&image=${encodeURIComponent(tokenImage)}`;
    } catch (err) {
      console.error(err);
      formStatus.innerText = "Minting failed. Check console.";
      formStatus.style.color = "red";
    }
  });

  // Kaos animasyonu ve formu açan fonksiyon
  window.toggleForm = () => {
    const chaos = document.getElementById("chaosAnimation");
    const form = document.getElementById("tokenFormSection");

    chaos?.classList.remove("hidden");
    chaos.style.display = "flex";
    form?.classList.add("hidden");

    setTimeout(() => {
      chaos.style.display = "none";
      form?.classList.remove("hidden");
      form?.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  // Hamburger menü
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("visible");
  });

  // Müzik (varsa)
  const muteToggle = document.getElementById("muteToggle");
  if (muteToggle) {
    const bgAudio = document.createElement("audio");
    bgAudio.src = "sounds/loop.mp3";
    bgAudio.loop = true;
    bgAudio.volume = 0.4;
    document.body.appendChild(bgAudio);

    let isMuted = false;
    muteToggle.addEventListener("click", () => {
      isMuted = !isMuted;
      muteToggle.innerText = isMuted ? "🔇" : "🔊";
      isMuted ? bgAudio.pause() : bgAudio.play();
    });
  }
});

// Partikül animasyonu + glitch kaldırma aynen kalabilir.
