// === DOM YÜKLENDİĞİNDE ===
document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWallet");
  const walletModal = document.getElementById("walletModal");

  connectBtn?.addEventListener("click", () => {
    walletModal?.classList.remove("hidden");
  });

  setTimeout(() => {
    document.body.classList.remove("intro-glitch");
  }, 700);
});

// === CÜZDAN BAĞLANTISI ===
function connectWallet(walletType) {
  const connectBtn = document.getElementById("connectWallet");
  const phantomLink = document.getElementById("phantomLink");
  const walletModal = document.getElementById("walletModal");

  if (walletType === "phantom") {
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect()
        .then((resp) => {
          const pubKey = resp.publicKey.toString();
          connectBtn.innerText = `Connected: ${pubKey.slice(0, 4)}...`;
          connectBtn.disabled = true;
        })
        .catch(() => alert("Phantom connection failed."));
    } else {
      phantomLink?.click();
    }
  } else {
    alert(`${walletType} integration coming soon.`);
  }

  walletModal?.classList.add("hidden");
}

// === KAOS BAŞLAT ===
function toggleForm() {
  const mascot = document.getElementById("mascotChaos");
  const form = document.getElementById("tokenFormSection");

  mascot?.classList.remove("hidden");
  mascot?.classList.add("show", "spin");

  setTimeout(() => {
    mascot?.classList.remove("show", "spin");
    mascot?.classList.add("hidden");
    form?.classList.remove("hidden");
  }, 2000);
}

// === GÖRSEL ÖNİZLEME ===
const imageBox = document.getElementById("imageUploadBox");
const imageInput = document.getElementById("tokenImage");

imageBox?.addEventListener("click", () => imageInput?.click());
imageInput?.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    imageBox.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Preview" class="preview-img" />`;
  }
});

// === ARAMA ===
const searchBtn = document.getElementById("searchBtn");
const searchContainer = document.getElementById("searchContainer");
searchBtn?.addEventListener("click", () => {
  searchContainer.classList.toggle("hidden");
});

// === MOBİL MENÜ ===
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// === FORM TOKEN LAUNCH ===
const launchBtn = document.getElementById("mintTokenBtn");
const tokenName = document.getElementById("tokenName");
const tokenSymbol = document.getElementById("tokenSymbol");
const formStatus = document.getElementById("formStatus");

launchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  formStatus.innerText = "";

  const name = tokenName.value.trim();
  const symbol = tokenSymbol.value.trim();

  if (!name || !symbol) {
    formStatus.innerText = "Token name and symbol are required!";
    return;
  }

  alert(`Token launched: ${name} (${symbol})`);
  formStatus.innerText = "Token successfully launched!";
});

// === SES BUTONU ===
const muteBtn = document.getElementById("muteToggle");
let isMuted = false;
muteBtn?.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.innerText = isMuted ? "🔇" : "🔊";
  document.querySelectorAll("audio").forEach(audio => {
    audio.muted = isMuted;
  });
});
