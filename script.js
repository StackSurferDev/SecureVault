function encryptFile() {
  const file = document.getElementById('fileInput').files[0];
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  if (!file || !password) {
    status.textContent = "⚠️ Please select a file and enter a password.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const encrypted = CryptoJS.AES.encrypt(content, password).toString();

    const blob = new Blob([encrypted], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name + '.enc';
    a.click();

    status.textContent = "✅ File encrypted and downloaded.";
  };
  reader.readAsText(file);
}

function decryptFile() {
  const file = document.getElementById('fileInput').files[0];
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  if (!file || !password) {
    status.textContent = "⚠️ Please select a file and enter a password.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const encrypted = e.target.result;
      const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

      if (!decrypted) throw new Error("Wrong password or corrupted file.");

      const blob = new Blob([decrypted], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace('.enc', '.decrypted.txt');
      a.click();

      status.textContent = "✅ File decrypted and downloaded.";
    } catch (err) {
      status.textContent = "❌ Decryption failed: " + err.message;
    }
  };
  reader.readAsText(file);
}
