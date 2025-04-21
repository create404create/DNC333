// Enhanced with loading spinner, input validation, and copy functionality
function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  const resultDiv = document.getElementById("resultContent");
  
  if (!phone) {
    showError("Please enter a phone number");
    return;
  }
  
  if (!/^\d{10}$/.test(phone)) {
    showError("Please enter a valid 10-digit USA number");
    return;
  }

  // Show loading spinner
  resultDiv.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-spin"></i> Checking...</div>';
  
  const apiUrl = `https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error("API Error");
      return res.json();
    })
    .then(data => {
      console.log("API Response:", data);
      
      const resultHTML = `
        <div class="result-item">
          <span class="result-label">Status:</span>
          <span class="result-value ${data.status.toLowerCase()}">${data.status}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Phone:</span>
          <span class="result-value">${formatPhoneNumber(data.phone)}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Blacklist:</span>
          <span class="result-value ${data.listed.toLowerCase()}">${data.listed}</span>
        </div>
        <div class="result-item">
          <span class="result-label">Litigator:</span>
          <span class="result-value">${data.type || 'N/A'}</span>
        </div>
        <div class="result-item">
          <span class="result-label">State:</span>
          <span class="result-value">${data.state || 'N/A'}</span>
        </div>
        <div class="result-item">
          <span class="result-label">DNC National:</span>
          <span class="result-value ${data.ndnc.toLowerCase()}">${data.ndnc}</span>
        </div>
        <div class="result-item">
          <span class="result-label">DNC State:</span>
          <span class="result-value ${data.sdnc.toLowerCase()}">${data.sdnc}</span>
        </div>
      `;
      
      resultDiv.innerHTML = resultHTML;
      document.getElementById("result").style.display = "block";
    })
    .catch(error => {
      console.error("Error:", error);
      showError("Error fetching data. Please try again.");
    });
}

function formatPhoneNumber(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function showError(message) {
  const resultDiv = document.getElementById("resultContent");
  resultDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
  document.getElementById("result").style.display = "block";
}

function copyResults() {
  const resultContent = document.getElementById("resultContent").innerText;
  navigator.clipboard.writeText(resultContent)
    .then(() => {
      const copyBtn = document.getElementById("copyBtn");
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy';
      }, 2000);
    })
    .catch(err => {
      console.error("Copy failed:", err);
    });
}

// Add input formatting
document.getElementById("phoneNumber").addEventListener("input", function(e) {
  this.value = this.value.replace(/\D/g, '');
});
