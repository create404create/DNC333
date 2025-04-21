function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  const tcpaApi = `https://api.uspeoplesearch.net/tcpa/v1?x=${phone}`;
  const personApi = `https://api.uspeoplesearch.net/person/v3?x=${phone}`;

  Promise.all([
    fetch(tcpaApi).then(res => res.json()),
    fetch(personApi).then(res => res.json())
  ]).then(([tcpaData, personData]) => {
    const resultDiv = document.getElementById("result");
    let personInfo = "<p><strong>Person data not found.</strong></p>";

    if (personData.person && personData.person.length > 0) {
      const person = personData.person[0];
      const address = person.addresses && person.addresses.length > 0 ? `${person.addresses[0].home}, ${person.addresses[0].city}, ${person.addresses[0].state} ${person.addresses[0].zip}` : "N/A";

      personInfo = `
        <p><strong>Name:</strong> ${person.name || "N/A"}</p>
        <p><strong>Age:</strong> ${person.age || "N/A"}</p>
        <p><strong>DOB:</strong> ${person.dob || "N/A"}</p>
        <p><strong>Address:</strong> ${address}</p>
      `;
    }

    resultDiv.innerHTML = `
      <p><strong>Status:</strong> ${tcpaData.status}</p>
      <p><strong>Phone:</strong> ${tcpaData.phone}</p>
      <p><strong>Blacklist:</strong> ${tcpaData.listed}</p>
      <p><strong>Litigator:</strong> ${tcpaData.type}</p>
      <p><strong>State:</strong> ${tcpaData.state}</p>
      <p><strong>DNC National:</strong> ${tcpaData.ndnc}</p>
      <p><strong>DNC State:</strong> ${tcpaData.sdnc}</p>
      <hr>
      ${personInfo}
    `;
  }).catch(error => {
    console.error("API Error:", error);
    document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching data</p>";
  });
}

function copyResult() {
  const result = document.getElementById("result").innerText;
  navigator.clipboard.writeText(result)
    .then(() => alert("Result copied to clipboard!"))
    .catch(() => alert("Failed to copy result."));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("phoneNumber").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkStatus();
  }
});
