// floppfun/script.js — PART 1/2 (OPTİMİZE EDİLMİŞ)
document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const mint = url.get('mint');
  const symbol = url.get('symbol');
  const image = url.get('image');

  // CONNECT WALLET
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

  // SEARCH TOGGLE
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  searchBtn?.addEventListener("click", () => {
    searchContainer?.classList.toggle("hidden");
    if (!searchContainer?.classList.contains("hidden")) {
      searchInput?.focus();
    }
  });

  // MENU TOGGLE
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("visible");
  });

  // MUTE TOGGLE (safe fallback)
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

  // CHAOS ANIMASYON → FORM GEÇİŞİ
  window.toggleForm = () => {
    const chaos = document.getElementById("chaosAnimation");
    const form = document.getElementById("tokenFormSection");
    chaos?.classList.remove("hidden");
    form?.classList.add("hidden");
    setTimeout(() => {
      chaos?.classList.add("hidden");
      form?.classList.remove("hidden");
      form?.scrollIntoView({ behavior: "smooth" });
    }, 2500);
  };

  // FORM GÖNDERME
  const tokenForm = document.getElementById("tokenForm");
  const formStatus = document.getElementById("formStatus");

  tokenForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    formStatus.innerText = "Creating token...";
    formStatus.style.color = "aqua";

    try {
      const tokenName = document.getElementById("tokenName").value;
      const tokenSymbol = document.getElementById("tokenSymbol").value;
      const tokenSupply = document.getElementById("tokenSupply").value;
      const tokenImage = document.getElementById("tokenImage").value;
      const tokenDescription = document.getElementById("tokenDescription").value;
      const socialLink = document.getElementById("socialLink").value;

      await supabase.from('tokens').insert([
        { name: tokenName, symbol: tokenSymbol, supply: tokenSupply, image: tokenImage, description: tokenDescription, social_link: socialLink }
      ]);

      formStatus.innerText = `Token ${tokenName} created successfully!`;
      formStatus.style.color = "lime";

      window.location.href = `token.html?mint=mockMintAddress&symbol=${tokenSymbol}&image=${encodeURIComponent(tokenImage)}`;
    } catch (err) {
      console.error(err);
      formStatus.innerText = "Token creation failed.";
      formStatus.style.color = "red";
    }
  });

  // PART 2: floop işlemi + paylaşım + floop count geliyor.
});
// floppfun/script.js — PART 2/2 (FLOOP + PAYLAŞIM)

document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search);
  const mint = url.get('mint');
  const symbol = url.get('symbol');

  const floopBtn = document.getElementById("floopBtn");
  const floopResult = document.getElementById("floopResult");
  const floopCountEl = document.getElementById("floopCount");

  async function loadFloopCount() {
    if (!floopCountEl || !mint) return;
    const { data } = await supabase
      .from('floop_counts')
      .select('count')
      .eq('mint', mint)
      .single();

    floopCountEl.innerText = `Flooped: ${data?.count ?? 0}`;
  }

  loadFloopCount();

  floopBtn?.addEventListener("click", async () => {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Please install Phantom Wallet.");
      return;
    }

    try {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      const response = await window.solana.connect();
      const user = response.publicKey;

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: user,
          toPubkey: new solanaWeb3.PublicKey("BiDrwH1vdp8KtKMsmtKV2aSfwzjbrFe8KbxUGg1DKfi"),
          lamports: solanaWeb3.LAMPORTS_PER_SOL * 0.01
        })
      );

      transaction.feePayer = user;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      floopResult.innerText = "Thanks! Token successfully Flooped.";
      floopResult.style.color = "lime";

      const { data } = await supabase
        .from('floop_counts')
        .select('count')
        .eq('mint', mint)
        .single();

      if (data) {
        await supabase.from('floop_counts')
          .update({ count: data.count + 1 })
          .eq('mint', mint);
      } else {
        await supabase.from('floop_counts')
          .insert({ mint: mint, count: 1 });
      }

      loadFloopCount();
    } catch (err) {
      console.error(err);
      floopResult.innerText = "Transaction failed or cancelled.";
      floopResult.style.color = "red";
    }
  });

  // PAYLAŞIM FONKSİYONLARI
  window.shareOnTwitter = () => {
    const pageUrl = window.location.href;
    const text = `Check out my meme token ${symbol || ''} on Solana!`;
    const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(tweet, '_blank');
  };

  window.shareOnTelegram = () => {
    const pageUrl = window.location.href;
    const msg = `Check out my meme token ${symbol || ''} on Solana: ${pageUrl}`;
    const tg = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(msg)}`;
    window.open(tg, '_blank');
  };

  window.copyMint = () => {
    if (!mint) return;
    navigator.clipboard.writeText(mint).then(() => {
      const copyResult = document.getElementById("copyResult");
      if (copyResult) {
        copyResult.innerText = "Mint address copied!";
        setTimeout(() => (copyResult.innerText = ""), 2000);
      }
    });
  };
});
