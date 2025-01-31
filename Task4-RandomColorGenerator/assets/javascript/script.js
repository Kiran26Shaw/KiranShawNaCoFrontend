// Function to populate dropdown boxes with values from 0 to 255
function setValues() {
  ["red", "green", "blue", "cyan", "magenta", "yellow"].forEach(id => {
    let dropdown = document.getElementById(id);
    if (dropdown) {
      for (let i = 0; i <= 255; i++) {
        dropdown.add(new Option(i, i));
      }
    }
  });
}

// Function to dynamically change the color of RGB text
function rgb() {
  document.querySelectorAll(".red")?.forEach((element) => (element.style.color = "red"));
  document.querySelectorAll(".green")?.forEach((element) => (element.style.color = "green"));
  document.querySelectorAll(".blue")?.forEach((element) => (element.style.color = "blue"));
}

// JavaScript to handle RGB dropdown changes and display results
document.addEventListener("DOMContentLoaded", () => {
  const redDropdown = document.getElementById("red");
  const greenDropdown = document.getElementById("green");
  const blueDropdown = document.getElementById("blue");

  // Function to display RGB color details
  function displayRGBColor() {
    const r = parseInt(redDropdown.value || "0");
    const g = parseInt(greenDropdown.value || "0");
    const b = parseInt(blueDropdown.value || "0");

    // Calculate float-point values
    const rFloat = (r / 255).toFixed(2);
    const gFloat = (g / 255).toFixed(2);
    const bFloat = (b / 255).toFixed(2);

    // Calculate hexadecimal values
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");
    const hexColor = `#${rHex}${gHex}${bHex}`;

    // Display the values in the table
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = `
      <tr>
        <td>(${rFloat}, ${gFloat}, ${bFloat})</td>
        <td>${hexColor}</td>
        <td style="background-color: ${hexColor};"></td>
      </tr>
    `;
  }

  // Add event listeners to dropdowns
  redDropdown.addEventListener("change", displayRGBColor);
  greenDropdown.addEventListener("change", displayRGBColor);
  blueDropdown.addEventListener("change", displayRGBColor);
});


// Function to dynamically change the color of CMY text
function cmy() {
  document.querySelectorAll(".cyan")?.forEach((element) => (element.style.color = "cyan"));
  document.querySelectorAll(".magenta")?.forEach((element) => (element.style.color = "magenta"));
  document.querySelectorAll(".yellow")?.forEach((element) => (element.style.color = "yellow"));
}

// JavaScript to handle RGB dropdown changes and display results
document.addEventListener("DOMContentLoaded", () => {
  const cyanDropdown = document.getElementById("cyan");
  const magentaDropdown = document.getElementById("magenta");
  const yellowDropdown = document.getElementById("yellow");

  // Function to display RGB color details
  function displayCMYColor() {
    const c = parseInt(cyanDropdown.value || "0");
    const m = parseInt(magentaDropdown.value || "0");
    const y = parseInt(yellowDropdown.value || "0");

    // Convert CMY to RGB
    const red = 255 - c;
    const green = 255 - m;
    const blue = 255 - y;

    // Calculate float-point values
    const cFloat = (red / 255).toFixed(2);
    const mFloat = (blue / 255).toFixed(2);
    const yFloat = (green / 255).toFixed(2);

    // Convert RGB integer values to hexadecimal
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");
    const hexColor2 = `#${redHex}${greenHex}${blueHex}`;

    // Display the values in the table
    const tablebody = document.querySelector("tbody");
    tablebody.innerHTML = `
      <tr>
        <td>(${cFloat}, ${mFloat}, ${yFloat})</td>
        <td>${hexColor2}</td>
        <td style="background-color: ${hexColor2};"></td>
      </tr>
    `;
  }

  // Add event listeners to dropdowns
  cyanDropdown.addEventListener("change", displayCMYColor);
  magentaDropdown.addEventListener("change", displayCMYColor);
  yellowDropdown.addEventListener("change", displayCMYColor);
});

// Ensure script runs only after DOM is fully loaded
window.onload = function() {
  setValues();
  rgb();
  cmy();
};

// Function to generate a random integer between 0 and 255
function getRandomValue() {
  return Math.floor(Math.random() * 256);
}

// Function to generate 10 random colors and display them
function generateRandomColors() {
  const tableContainer = document.getElementById("color-table-container");
  const tableBody = document.getElementById("color-table-body");

  // Show the table container
  tableContainer.style.display = "block";

  // Clear previous results
  tableBody.innerHTML = "";

  for (let i = 0; i < 10; i++) {
      // Generate random CMY values
      let c = getRandomValue();
      let m = getRandomValue();
      let y = getRandomValue();

      // Convert CMY to RGB
      let r = 255 - c;
      let g = 255 - m;
      let b = 255 - y;

      // Convert RGB to float values
      let rFloat = (r / 255).toFixed(2);
      let gFloat = (g / 255).toFixed(2);
      let bFloat = (b / 255).toFixed(2);

      // Convert RGB to Hex
      let rHex = r.toString(16).padStart(2, "0");
      let gHex = g.toString(16).padStart(2, "0");
      let bHex = b.toString(16).padStart(2, "0");
      let hexColor = `#${rHex}${gHex}${bHex}`.toUpperCase();

      // Create table row
      const row = document.createElement("tr");

      // RGB Float Values Column
      const floatCol = document.createElement("td");
      floatCol.textContent = `(${rFloat}, ${gFloat}, ${bFloat})`;
      row.appendChild(floatCol);

      // Hexadecimal Column
      const hexCol = document.createElement("td");
      hexCol.textContent = hexColor;
      row.appendChild(hexCol);

      // Color Display Column
      const colorCol = document.createElement("td");
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");
      colorBox.style.backgroundColor = hexColor;
      colorCol.appendChild(colorBox);
      row.appendChild(colorCol);

      // Append row to table
      tableBody.appendChild(row);
  }
}

// Attach event listener to the button
document.getElementById("generate-btn").addEventListener("click", generateRandomColors);
