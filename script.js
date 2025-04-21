const tcpaApi = "https://api.uspeoplesearch.net/tcpa/v1?x=";
const personApi = "https://api.uspeoplesearch.net/person/v3?x=";

function handleEnter(event) {
  if (event.key === "Enter") {
    checkStatus();
  }
}

function checkStatus() {
  const phone = document.getElementById("phoneNumber").value.trim();
  if (!phone) {
    alert("Please enter a phone number");
    return;
  }

  // Fetch DNC and status info
  fetch(tcpaApi + phone)
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerHTML = `
        <p><strong>Status:</strong> ${data.status || 'N/A'}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <p><strong>Blacklist:</strong> ${data.listed || 'N/A'}</p>
        <p><strong>Litigator:</strong> ${data.type || 'N/A'}</p>
        <p><strong>State:</strong> ${data.state || 'N/A'}</p>
        <p><strong>DNC National:</strong> ${data.ndnc === true ? 'Yes' : 'No'}</p>
        <p><strong>DNC State:</strong> ${data.sdnc === true ? 'Yes' : 'No'}</p>
      `;
    })
    .catch(err => {
      console.error("DNC API Error:", err);
      document.getElementById("result").innerHTML = "<p style='color:red;'>Error fetching DNC data</p>";
    });

  // Fetch Person Info
  fetch(personApi + phone)
    .then(res => res.json())
    .then(personData => {
      const person = personData.person?.[0];
      const address = person?.addresses?.[0];

      document.getElementById("personInfo").innerHTML = `
        <p><strong>Name:</strong> ${person?.name || 'Not Found'}</p>
        <p><strong>Age:</strong> ${person?.age || 'Not Found'}</p>
        <p><strong>DOB:</strong> ${person?.dob || 'Not Found'}</p>
        <p><strong>Address:</strong> ${address ? `${address.home}, ${address.city}, ${address.state}, ${address.zip}` : 'Not Found'}</p>
      `;
    })
    .catch(err => {
      console.error("Person API Error:", err);
      document.getElementById("personInfo").innerHTML = "<p style='color:red;'>Error fetching person info</p>";
    });
}

function copyResults() {
  const resultText = document.getElementById("result").innerText + "\n" + document.getElementById("personInfo").innerText;
  navigator.clipboard.writeText(resultText)
    .then(() => alert("Results copied to clipboard!"))
    .catch(err => alert("Failed to copy results"));
}
