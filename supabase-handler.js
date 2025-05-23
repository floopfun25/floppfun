<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Token Oluştur</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
</head>
<body>
  <h1>Token Formu</h1>

  <input type="file" id="imageInput"><br><br>
  <input type="text" placeholder="My Token Name"><br>
  <input type="text" placeholder="$ TICKER"><br>
  <input type="text" placeholder="e.g. 1000000"><br>
  <input type="text" placeholder="e.g. 10"><br>
  <textarea placeholder="Token hikayesi..."></textarea><br>

  <select id="lockDuration">
    <option value="7 days">7 Gün</option>
    <option value="30 days">30 Gün</option>
    <option value="custom">Özel</option>
  </select><br>
  <input type="text" id="customLock" placeholder="Custom gün sayısı"><br>

  <input type="text" id="manualSOL" placeholder="Prebuy SOL (isteğe bağlı)"><br>

  <div id="socialContainer">
    <input name="social-twitter" placeholder="Twitter"><br>
    <input name="social-discord" placeholder="Discord"><br>
    <!-- Diğer sosyal medya alanları eklenebilir -->
  </div>

  <button onclick="submitForm()">Gönder</button>

  <script>
    const supabase = window.supabase.createClient(
      "https://mlczuanztnqcngioayas.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sY3p1YW56dG5xY25naW9heWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzIwOTYsImV4cCI6MjA2MjM0ODA5Nn0.ShPAiWshDqZD0pAP9RMGdpfrpBtoGd58r_agzigReeI"
    );

    async function submitForm() {
      const imageFile = document.getElementById('imageInput').files[0];
      if (!imageFile) return alert("Lütfen bir görsel yükleyin.");

      const tokenName = document.querySelector('input[placeholder="My Token Name"]').value.trim();
      const ticker = document.querySelector('input[placeholder="$ TICKER"]').value.trim();
      const supply = document.querySelector('input[placeholder="e.g. 1000000"]').value.trim();
      const devShare = document.querySelector('input[placeholder="e.g. 10"]').value.trim();
      const lore = document.querySelector('textarea').value.trim();
      const lockType = document.getElementById("lockDuration").value;
      const customDays = document.getElementById("customLock").value;
      const prebuy = document.getElementById("manualSOL").value || "0";

      if (!tokenName || !ticker || !supply || !devShare || !lore) {
        return alert("Tüm zorunlu alanları doldurun.");
      }

      if (lockType === "custom" && !customDays) {
        return alert("Custom lock süresi giriniz.");
      }

      const lockDuration = lockType === "custom" ? `${customDays} days` : lockType;

      const socials = {};
      document.querySelectorAll('#socialContainer input').forEach(input => {
        socials[input.name.replace('social-', '')] = input.value.trim();
      });

      try {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from("chaos-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase
          .storage
          .from("chaos-images")
          .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        const { error: insertError } = await supabase
          .from("create_chaos")
          .insert([
            {
              token_name: tokenName,
              ticker: ticker,
              supply: supply,
              dev_share: devShare,
              kaos_lore: lore,
              lock_duration: lockDuration,
              image_url: imageUrl,
              socials: socials,
              prebuy_sol: prebuy
            }
          ]);

        if (insertError) throw insertError;

        alert("Form başarıyla gönderildi!");
        window.location.href = "index.html";
      } catch (err) {
        console.error("Form gönderim hatası:", err);
        alert("Hata: " + err.message);
      }
    }
  </script>
</body>
</html>
