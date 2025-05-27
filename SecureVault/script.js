// Encrypt any file with embedded metadata (filename + mime type)
function encryptFile() {
  const file = document.getElementById('fileInput').files[0];
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  if (!file || !password) {
    status.textContent = "⚠️ Please select a file and enter a password.";
    status.className = "error";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Data = e.target.result;

    // Wrap metadata in a JSON envelope
    const envelope = JSON.stringify({
      filename: file.name,
      mime: file.type || 'application/octet-stream',
      data: base64Data
    });

    // Encrypt the envelope
    const encrypted = CryptoJS.AES.encrypt(envelope, password).toString();

    // Create encrypted blob for download
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = file.name + '.enc';
    a.click();

    status.textContent = "✅ File encrypted and downloaded.";
    status.className = "success";
  };

  reader.readAsDataURL(file); // Read as base64
}

// Decrypt and restore any file using embedded metadata
function decryptFile() {
  const file = document.getElementById('fileInput').files[0];
  const password = document.getElementById('password').value;
  const status = document.getElementById('status');

  if (!file || !password) {
    status.textContent = "⚠️ Please select a file and enter a password.";
    status.className = "error";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const encrypted = e.target.result;
      const decryptedJson = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

      // Parse the decrypted envelope
      const envelope = JSON.parse(decryptedJson);
      const { filename, mime, data } = envelope;

      if (!data || !data.startsWith('data:')) {
        throw new Error("Invalid file structure.");
      }

      // Extract base64 content and convert to binary
      const base64Parts = data.split(',');
      const byteString = atob(base64Parts[1]);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }

      // Recreate original file
      const blob = new Blob([byteArray], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();

      status.textContent = `✅ File "${filename}" decrypted and downloaded.`;
      status.className = "success";
    } catch (err) {
      status.textContent = "❌ Decryption failed: " + err.message;
      status.className = "error";
    }
  };

  reader.readAsText(file); // Read encrypted text
}
