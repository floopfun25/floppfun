  // floppfun/script.js — PART 1/2

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

  // Arama kutusu toggle
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  searchBtn?.addEventListener("click", () => {
    searchContainer?.classList.toggle("hidden");
    if (!searchContainer?.classList.contains("hidden")) {
      searchInput?.focus();
    }
  });

  // Menü toggle
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("visible");
  });

  // Ses toggle
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

  // Chaos animasyonu → form aç
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
// floppfun/script.js — PART 2/2

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

      const supabaseUrl = 'https://ugzbsmmaxxklojwlijrt.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR...'; // gizli key kırpıldı
      const supabase = supabase.createClient(supabaseUrl, supabaseKey);

      await supabase.from('tokens').insert([
        {
          name: tokenName,
          symbol: tokenSymbol,
          supply: tokenSupply,
          image: tokenImage,
          description: tokenDescription,
          social_link: socialLink
        }
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
});
