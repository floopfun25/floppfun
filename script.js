// floppfun/script.js — PART 1/4

document.addEventListener("DOMContentLoaded", () => {
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
  const searchBox = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  searchBtn?.addEventListener("click", () => {
    if (searchBox.style.display === "none" || !searchBox.style.display) {
      searchBox.style.display = "block";
      searchInput?.focus();
    } else {
      searchBox.style.display = "none";
    }
  });

  // MUTE TOGGLE
  const muteBtn = document.getElementById("muteToggle");
  const bgAudio = document.createElement("audio");
  bgAudio.src = "sounds/loop.mp3"; // varsa müziğin yolu burası
  bgAudio.loop = true;
  bgAudio.volume = 0.4;
  document.body.appendChild(bgAudio);
  muteBtn?.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play();
      muteBtn.innerText = "🔊";
    } else {
      bgAudio.pause();
      muteBtn.innerText = "🔇";
    }
  });

  // MENU TOGGLE
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn?.addEventListener("click", () => {
    mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
  });

  // CHAOS → FORM GEÇİŞİ
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

  // FILTER BUTTONS
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      alert("Filter: " + btn.innerText);
    });
  });
});
// floppfun/script.js — PART 2/4

const tokenForm = document.getElementById("tokenForm");
const formStatus = document.getElementById("formStatus");

tokenForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formStatus.innerText = "Creating token...";
  formStatus.style.color = "blue";

  try {
    // Simülasyon (gerçek token yaratma işlemi Solana üzerinde yapılacak)
    const tokenName = document.getElementById("tokenName").value;
    const tokenSymbol = document.getElementById("tokenSymbol").value;
    const tokenSupply = document.getElementById("tokenSupply").value;
    const tokenImage = document.getElementById("tokenImage").value;
    const tokenDescription = document.getElementById("tokenDescription").value;
    const socialLink = document.getElementById("socialLink").value;

    // Başarı durumu
    formStatus.innerText = `Token ${tokenName} created successfully!`;
    formStatus.style.color = "lime";

    // Token bilgilerini Supabase'e kaydediyoruz
    await supabase
      .from('tokens')
      .insert([
        { name: tokenName, symbol: tokenSymbol, supply: tokenSupply, image: tokenImage, description: tokenDescription, social_link: socialLink }
      ]);

    // Başarı mesajı
    window.location.href = `token.html?mint=mockMintAddress&symbol=${tokenSymbol}&image=${encodeURIComponent(tokenImage)}`;
  } catch (err) {
    console.error(err);
    formStatus.innerText = "Token creation failed.";
    formStatus.style.color = "red";
  }
});
// floppfun/script.js — PART 3/4

const floopBtn = document.getElementById("floopBtn");
const floopResult = document.getElementById("floopResult");
const floopCountEl = document.getElementById("floopCount");

async function loadFloopCount() {
  const { data } = await supabase
    .from('floop_counts')
    .select('count')
    .eq('mint', mint)
    .single();

  floopCountEl.innerText = `Flooped: ${data?.count ?? 0}`;
}

loadFloopCount();

floopBtn.addEventListener("click", async () => {
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

    // Transfer işlemi: 0.01 SOL gönderimi
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: user,
        toPubkey: new solanaWeb3.PublicKey("BiDrwH1vdp8KtKMsmtKV2aSfwzjbrFe8KbxUGg1DKfi"),
        lamports: solanaWeb3.LAMPORTS_PER_SOL * 0.01
      })
    );

    transaction.feePayer = user;
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    // İşlemi imzala ve gönder
    const signed = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    // Başarılı işlem sonucu
    floopResult.innerText = "Thanks! Token successfully Flooped.";
    floopResult.style.color = "lime";

    // Supabase'e floop sayısını güncelle
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
// floppfun/script.js — PART 4/4

// Twitter paylaşım butonu
function shareOnTwitter() {
  const pageUrl = window.location.href;
  const text = `Check out my meme token ${symbol} on Solana!`;
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
  window.open(tweet, '_blank');
}

// Telegram paylaşım butonu
function shareOnTelegram() {
  const pageUrl = window.location.href;
  const msg = `Check out my meme token ${symbol} on Solana: ${pageUrl}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(msg)}`;
  window.open(tg, '_blank');
}

// Mint adresini kopyalama
function copyMint() {
  navigator.clipboard.writeText(mint).then(() => {
    document.getElementById("copyResult").innerText = "Mint address copied!";
    setTimeout(() => {
      document.getElementById("copyResult").innerText = "";
    }, 2000);
  });
}

// Arama alanı toggle
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");

searchBtn?.addEventListener("click", () => {
  if (searchContainer.style.display === "none") {
    searchContainer.style.display = "block";
    searchInput.focus();
  } else {
    searchContainer.style.display = "none";
  }
});

// Ses kontrol butonu
const muteToggle = document.getElementById("muteToggle");
let isMuted = false;

muteToggle?.addEventListener("click", () => {
  isMuted = !isMuted;
  muteToggle.innerText = isMuted ? "🔇" : "🔊";
  // Müziğe bağlayacak fonksiyon varsa buraya yazılır
});
