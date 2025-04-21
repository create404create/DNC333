function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const apiUrl = `${proxy}https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=${phone}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      console.log("Full API Response:", data);

      const result = `
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Blacklist:</strong> ${data.listed}</p>
        <p><strong>Litigator:</strong> ${data.type}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>DNC National:</strong> ${data.ndnc === true ? "Yes" : "No"}</p>
        <p><strong>DNC State:</strong> ${data.sdnc === true ? "Yes" : "No"}</p>
      `;

      document.getElementById("result").innerHTML = result;
    })
    .catch(error => {
      console.error("API Error:", error);
      document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
    });
}

function copyResult() {
  const resultText = document.getElementById("result").innerText;
  if (!resultText) {
    alert("No result to copy.");
    return;
  }

  navigator.clipboard.writeText(resultText)
    .then(() => {
      alert("Result copied to clipboard!");
    })
    .catch(err => {
      console.error("Copy failed:", err);
      alert("Failed to copy result.");
    });
}
