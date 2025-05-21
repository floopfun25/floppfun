// === Supabase bağlantısı ===
const supabase = supabase.createClient(
  'https://mlczuanztnqcngioayas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sY3p1YW56dG5xY25naW9heWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzIwOTYsImV4cCI6MjA2MjM0ODA5Nn0.ShPAiWshDqZD0pAP9RMGdpfrpBtoGd58r_agzigReeI'
);

// === SOL Fiyatını Coingecko'dan Al ===
let solPriceUSD = 150;
async function fetchSOLPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await res.json();
    solPriceUSD = data.solana.usd;
    const priceDisplay = document.getElementById('solPriceVal');
    if (priceDisplay) priceDisplay.innerText = solPriceUSD.toFixed(2);
  } catch (err) {
    console.warn("SOL fiyatı alınamadı:", err);
  }
}

// === Pre-buy Toggle ===
function togglePrebuy() {
  const sw = document.getElementById('prebuySwitch');
  const box = document.getElementById('prebuyOptions');
  const cost = document.getElementById('prebuyCostDisplay');
  const solusd = document.getElementById('solUsdValue');

  sw.classList.toggle('active');
  const show = sw.classList.contains('active');
  box.style.display = show ? 'block' : 'none';
  box.classList.toggle('active', show);
  cost.style.display = show ? 'block' : 'none';
  solusd.style.display = show ? 'block' : 'none';
}

// === Pre-buy Yüzdelik Hesaplama ===
function setPrebuy(button, percent) {
  document.querySelectorAll('.prebuy-buttons button').forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  document.getElementById('manualSOL').value = '';

  const supply = parseFloat(document.querySelector('input[placeholder="e.g. 1000000"]').value) || 0;
  const devShare = parseFloat(document.querySelector('input[placeholder="e.g. 10"]').value) || 0;

  const devTokens = (supply * devShare) / 100;
  const prebuyTokens = (devTokens * percent) / 100;
  const tokensPerSOL = 1000;
  const solAmount = prebuyTokens / tokensPerSOL;

  if (solAmount > 25) {
    alert("Pre-buy limiti 25 SOL'dur.");
    return;
  }

  const usdAmount = (solAmount * solPriceUSD).toFixed(2);
  document.getElementById('cost').innerHTML = `<span class="notranslate">${solAmount.toFixed(2)} SOL</span> $${usdAmount}`;
  document.getElementById('solUsdValue').innerText = `${solAmount.toFixed(2)} SOL ≈ $${usdAmount}`;
  document.getElementById('solUsdValue').style.display = 'block';
  document.getElementById('prebuyCostDisplay').style.display = 'block';
}

// === Görsel Yükleme ===
async function uploadImageToSupabase(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) throw new Error("Görsel yükleme hatası: " + error.message);

  const { publicUrl } = supabase.storage.from('images').getPublicUrl(fileName).data;
  return publicUrl;
}
function attachListeners() {
  const manualInput = document.getElementById("manualSOL");
  if (manualInput) {
    manualInput.addEventListener("input", () => {
      let solAmount = parseFloat(manualInput.value);
      if (isNaN(solAmount)) return;
      if (solAmount > 25) {
        alert("Maksimum pre-buy limiti 25 SOL'dur.");
        manualInput.value = '';
        return;
      }

      document.querySelectorAll('.prebuy-buttons button').forEach(b => b.classList.remove('active'));

      const usdAmount = (solAmount * solPriceUSD).toFixed(2);
      document.getElementById("prebuyCostDisplay").style.display = "block";
      document.getElementById("solUsdValue").style.display = "block";
      document.getElementById("solUsdValue").innerText = `${solAmount} SOL ≈ $${usdAmount}`;
      document.getElementById("cost").innerHTML = `<span class="notranslate">${solAmount} SOL</span> $${usdAmount}`;
    });
  }

  const lockSelect = document.getElementById("lockDuration");
  const customInput = document.getElementById("customLock");
  if (lockSelect && customInput) {
    lockSelect.addEventListener("change", function () {
      customInput.style.display = this.value === "custom" ? "block" : "none";
    });
  }
}

// === Görsel Önizleme ===
const uploadBox = document.getElementById('uploadBox');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('previewImg');
const uploadText = document.getElementById('uploadText');

function handleFile(file) {
  if (file && file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadText.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    alert("File too large or invalid.");
  }
}

if (uploadBox) {
  uploadBox.addEventListener('dragover', e => {
    e.preventDefault();
    uploadBox.style.borderColor = '#0f0';
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '#444';
  });

  uploadBox.addEventListener('drop', e => {
    e.preventDefault();
    uploadBox.style.borderColor = '#444';
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });
}

if (imageInput) {
  imageInput.addEventListener('change', function () {
    handleFile(this.files[0]);
  });
}

// === Sosyal Medya Seçici ===
document.getElementById('socialSelect')?.addEventListener('change', function () {
  const value = this.value;
  if (!value) return;

  const container = document.getElementById('socialContainer');
  if (container.querySelector(`#social-${value}`)) return;

  const row = document.createElement('div');
  row.className = 'social-row';
  row.id = `social-${value}`;
  row.innerHTML = `
    <input type="text" placeholder="${value} link" name="social-${value}" />
    <button onclick="this.parentElement.remove()" style="background:#222;color:#fff;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;">×</button>
  `;
  container.appendChild(row);
  this.value = "";
});

// === Phantom Wallet Bağlantısı ===
async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const resp = await window.solana.connect();
      const btn = document.querySelector('.connect-btn');
      btn.innerText = "Connected: " + resp.publicKey.toString().slice(0, 6) + "...";
      btn.disabled = true;
      btn.style.background = "#0f0";
      btn.style.color = "#000";
    } catch (err) {
      alert("Wallet connection failed");
    }
  } else {
    alert("Phantom wallet not found.");
    window.open("https://phantom.app", "_blank");
  }
}
// === Supabase Ayarları ===
const supabaseUrl = 'https://mlczuanztnqcngioayas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sY3p1YW56dG5xY25naW9heWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzIwOTYsImV4cCI6MjA2MjM0ODA5Nn0.ShPAiWshDqZD0pAP9RMGdpfrpBtoGd58r_agzigReeI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// === Formu Supabase'e gönder ===
async function submitForm() {
  const imageFile = document.getElementById('imageInput').files[0];
  const tokenName = document.querySelector('input[placeholder="My Token Name"]').value.trim();
  const ticker = document.querySelector('input[placeholder="$ TICKER"]').value.trim();
  const supplyVal = document.querySelector('input[placeholder="e.g. 1000000"]').value.trim();
  const devShareVal = document.querySelector('input[placeholder="e.g. 10"]').value.trim();
  const lockVal = document.querySelector('input[placeholder="e.g. 3"]')?.value.trim();
  const lore = document.querySelector('textarea')?.value.trim();
  const lockType = document.getElementById("lockDuration")?.value;
  const customDays = document.getElementById("customLock")?.value.trim();

  if (!imageFile || !tokenName || !ticker || !supplyVal || !devShareVal || !lore) {
    alert("Lütfen tüm zorunlu alanları doldurun.");
    return;
  }

  const supply = parseFloat(supplyVal);
  const devShare = parseFloat(devShareVal);
  const lockPercent = parseFloat(lockVal || "0");

  if (isNaN(supply) || supply <= 0 || isNaN(devShare) || devShare < 0 || devShare > 100 || isNaN(lockPercent) || lockPercent < 0 || lockPercent > 100) {
    alert("Lütfen geçerli sayısal değerler girin.");
    return;
  }

  if (lockType === "custom" && (!customDays || parseInt(customDays) <= 0)) {
    alert("Geçerli bir custom lock süresi girin.");
    return;
  }

  let imageUrl = '';
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { data: imgData, error: imgError } = await supabase.storage
    .from('chaos-images')
    .upload(fileName, imageFile);

  if (imgError) {
    alert("Görsel yüklenemedi.");
    return;
  } else {
    imageUrl = `${supabaseUrl}/storage/v1/object/public/chaos-images/${fileName}`;
  }

  const socials = Array.from(document.querySelectorAll('#socialContainer input')).map(input => ({
    platform: input.name.replace('social-', ''),
    link: input.value.trim()
  }));

  const { error } = await supabase.from('create_chaos').insert([{
    token_name: tokenName,
    ticker: ticker,
    total_supply: supply,
    dev_share: devShare,
    lock_percent: lockPercent,
    lock_duration: lockType === "custom" ? parseInt(customDays) : lockType,
    kaos_lore: lore,
    image_url: imageUrl,
    socials: socials
  }]);

  if (error) {
    alert("Form gönderilemedi.");
    console.error(error);
  } else {
    alert("Form başarıyla gönderildi!");
  }
}
// === Export fonksiyonlar (HTML'de çağrılabilsin) ===
window.submitForm = submitForm;
window.togglePrebuy = togglePrebuy;
window.setPrebuy = setPrebuy;
window.connectWallet = connectWallet;

// === Hataları konsola yaz (opsiyonel güvenlik/log) ===
window.addEventListener("error", function (e) {
  console.warn("Hata yakalandı:", e.message);
});
