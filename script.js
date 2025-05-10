// CÜZDAN BAĞLAMA (PHANTOM)
async function connectWallet() {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      try {
        const response = await provider.connect();
        const btn = document.getElementById("connectWallet");
        btn.innerText = "Connected";
        btn.disabled = true;
      } catch {
        alert("Connection cancelled.");
      }
    } else {
      alert("Phantom Wallet not found.");
    }
  } else {
    alert("Solana not supported in this browser.");
  }
}

// SES AÇ/KAPA
function toggleMute() {
  const muteToggle = document.getElementById("muteToggle");
  if (!muteToggle) return;
  window.isMuted = !window.isMuted;
  muteToggle.innerText = window.isMuted ? "🔇" : "🔊";
}

// ARAMA ALANINI GÖSTER/GİZLE
function toggleSearch() {
  const searchContainer = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  if (!searchContainer || !searchInput) return;

  const visible = searchContainer.style.display === "block";
  searchContainer.style.display = visible ? "none" : "block";
  if (!visible) searchInput.focus();
}

// ENTER TUŞUYLA DEMO ARAMA
function handleSearchEnter(e) {
  if (e.key === "Enter") {
    const query = e.target.value.trim();
    if (query) {
      alert(`Searching for "${query}"... (demo)`);
    }
  }
}

// MOBİL MENÜ TOGGLE
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu) return;
  const isVisible = mobileMenu.style.display === "block";
  mobileMenu.style.display = isVisible ? "none" : "block";
}

// TÜM EVENTLERİ BAĞLA
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connectWallet")?.addEventListener("click", connectWallet);
  document.getElementById("muteToggle")?.addEventListener("click", toggleMute);
  document.getElementById("searchBtn")?.addEventListener("click", toggleSearch);
  document.getElementById("searchInput")?.addEventListener("keypress", handleSearchEnter);
  document.getElementById("menuBtn")?.addEventListener("click", toggleMobileMenu);
});
