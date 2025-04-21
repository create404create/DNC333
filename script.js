const tcpaApi = "https://api.uspeoplesearch.net/tcpa/v1?x=";
const personApi = "https://api.uspeoplesearch.net/person/v3?x=";

function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerHTML = "";

  // Fetch TCPA info
  fetch(tcpaApi + phone)
    .then(res => res.json())
    .then(data => {
      const resultHTML = `
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Blacklist:</strong> ${data.listed}</p>
        <p><strong>Litigator:</strong> ${data.type}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>DNC National:</strong> ${data.ndnc}</p>
        <p><strong>DNC State:</strong> ${data.sdnc}</p>
      `;
      document.getElementById("result").innerHTML = resultHTML;
    })
    .catch(error => {
      console.error("TCPA API Error:", error);
      document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
    });

  // Fetch Person info
  fetch(personApi + phone)
    .then(res => res.json())
    .then(personData => {
      const person = personData.person?.[0];
      const address = person?.addresses?.[0];
      const personInfo = `
        <p><strong>Name:</strong> ${person?.name || 'Not Available'}</p>
        <p><strong>Age:</strong> ${person?.age || 'Not Available'}</p>
        <p><strong>DOB:</strong> ${person?.dob || 'Not Available'}</p>
        <p><strong>Address:</strong> ${address ? `${address.home}, ${address.city}, ${address.state} ${address.zip}` : 'Not Available'}</p>
      `;
      document.getElementById("personInfo").innerHTML = personInfo;
    })
    .catch(error => {
      console.error("Person API Error:", error);
      document.getElementById("personInfo").innerHTML = "<p style='color:red;'>Error fetching person info</p>";
    });

  // Save search to history
  saveToHistory(phone);
}

function copyResult() {
  const resultText = document.getElementById("result").innerText + "\n" + document.getElementById("personInfo").innerText;
  navigator.clipboard.writeText(resultText)
    .then(() => alert("Result copied to clipboard!"))
    .catch(() => alert("Failed to copy result"));
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

function exportToPDF() {
  const text = document.getElementById("result").innerText + "\n" + document.getElementById("personInfo").innerText;
  const win = window.open();
  win.document.write(`<pre>${text}</pre>`);
  win.print();
  win.close();
}

function shareResult() {
  const text = document.getElementById("result").innerText + "\n" + document.getElementById("personInfo").innerText;
  if (navigator.share) {
    navigator.share({ text });
  } else {
    alert("Sharing not supported on this browser.");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("phoneNumber").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkStatus();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
  document.getElementById("themeSwitch").addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
  });
});
