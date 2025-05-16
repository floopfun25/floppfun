document.addEventListener("DOMContentLoaded", () => {
  // === CÜZDAN BAĞLANTI ===
  const connectBtn = document.getElementById("connectWallet");
  connectBtn?.addEventListener("click", () => {
    const modal = document.getElementById("walletModal");
    modal?.classList.remove("hidden");
  });

  window.connectWallet = (walletName) => {
    alert(`Connecting to ${walletName}...`);
    document.getElementById("walletModal")?.classList.add("hidden");
  };

  // === KAOS BUTONU → MASKOT GÖSTERİMİ ===
  window.toggleForm = () => {
    const chaos = document.getElementById("chaosMascot");
    const form = document.getElementById("tokenFormSection");

    chaos?.classList.remove("hidden");
    chaos.style.display = "flex";
    form?.classList.add("hidden");

    setTimeout(() => {
      chaos.classList.add("hidden");
      chaos.style.display = "none";
      form?.classList.remove("hidden");
      form?.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  };

  // === HAMBURGER MENÜ ===
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  menuBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("visible");
  });

  // === ARAMA BUTONU ===
  const searchBtn = document.getElementById("searchBtn");
  const searchContainer = document.getElementById("searchContainer");
  const searchInput = document.getElementById("searchInput");
  searchBtn?.addEventListener("click", () => {
    searchContainer?.classList.toggle("hidden");
    if (!searchContainer?.classList.contains("hidden")) {
      searchInput?.focus();
    }
  });

  // === SES KONTROL ===
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
  // === CANVAS PARTİKÜL YAĞMURU ===
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function createParticles(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedY: Math.random() * 0.5 + 0.2,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 238, ${p.alpha})`;
        ctx.fill();
        p.y += p.speedY;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animateParticles);
    }

    createParticles(100);
    animateParticles();
  }

  // === GİRİŞTE GLITCH EFEKTİNİ TEMİZLE ===
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.remove("intro-glitch");
    }, 700);
  });
});
