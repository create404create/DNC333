function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) return alert("Please enter a phone number");

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerHTML = "";

  Promise.all([
    fetch(tcpaApi).then(res => res.json()),
    fetch(personApi).then(res => res.json())
  ])
    .then(([tcpaData, personData]) => {
      const resultBox = document.getElementById("result");
      const resultHTML = `
        <p><strong>Status:</strong> ${tcpaData.status}</p>
        <p><strong>Phone:</strong> ${tcpaData.phone}</p>
        <p><strong>Blacklist:</strong> ${tcpaData.listed}</p>
        <p><strong>Litigator:</strong> ${tcpaData.type}</p>
        <p><strong>State:</strong> ${tcpaData.state}</p>
        <p><strong>DNC National:</strong> ${tcpaData.ndnc}</p>
        <p><strong>DNC State:</strong> ${tcpaData.sdnc}</p>
        <hr>
        <p><strong>Name:</strong> ${personData.name || 'N/A'}</p>
        <p><strong>Age:</strong> ${personData.age || 'N/A'}</p>
        <p><strong>DOB:</strong> ${personData.dob || 'N/A'}</p>
        <p><strong>Address:</strong> ${personData.address || 'N/A'}</p>
      `;
      resultBox.innerHTML = resultHTML;
      document.getElementById("loading").style.display = "none";
      saveToHistory(phone);
    })
    .catch(error => {
      console.error("API Error:", error);
      document.getElementById("loading").style.display = "none";
      document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
    });
}

function copyResult() {
  const text = document.getElementById("result").innerText;
  navigator.clipboard.writeText(text).then(() => alert("Result copied!"));
}

function exportToPDF() {
  const text = document.getElementById("result").innerText;
  const win = window.open();
  win.document.write(`<pre>${text}</pre>`);
  win.print();
  win.close();
}

function shareResult() {
  const text = document.getElementById("result").innerText;
  if (navigator.share) {
    navigator.share({ text });
  } else {
    alert("Sharing not supported on this browser.");
  }
}

function saveToHistory(phone) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.unshift(phone);
  if (history.length > 5) history = history.slice(0, 5);
  localStorage.setItem("searchHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("recentList");
  list.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  history.forEach(phone => {
    const li = document.createElement("li");
    li.textContent = phone;
    li.onclick = () => {
      document.getElementById("phoneNumber").value = phone;
      checkStatus();
    };
    list.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
  document.getElementById("themeSwitch").addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
  });
  document.getElementById("phoneNumber").addEventListener("keyup", (e) => {
    if (e.key === "Enter") checkStatus();
  });
});
