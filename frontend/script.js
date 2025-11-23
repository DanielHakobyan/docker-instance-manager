const API_URL = "http://localhost:8000";

// Elements
const tableBody = document.querySelector("#containerTable tbody");
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const createBtn = document.getElementById("createBtn");

openModalBtn.onclick = () => (modal.style.display = "block");
closeModalBtn.onclick = () => (modal.style.display = "none");
// Open / Close create modal
openModalBtn.onclick = () => (modal.style.display = "block");
closeModalBtn.onclick = () => (modal.style.display = "none");
const closeModalX = document.getElementById("closeModalX");
closeModalX.onclick = () => (modal.style.display = "none");

// About Modal
const aboutModal = document.getElementById("aboutModal");
const openAboutBtn = document.getElementById("openAboutBtn");
const closeAboutBtn = document.getElementById("closeAboutBtn");
const closeAboutX = document.getElementById("closeAboutX");

openAboutBtn.onclick = () => (aboutModal.style.display = "block");
closeAboutBtn.onclick = () => (aboutModal.style.display = "none");
closeAboutX.onclick = () => (aboutModal.style.display = "none");

// Helper to create usage bar HTML
function createUsageBar(value, type) {
  return `
    <div class="usage-bar">
      <span class="usage-label">${type}</span>
      <div class="progress-wrapper">
        <div class="progress-fill ${type.toLowerCase()}" style="width: ${value}%;"></div>
      </div>
      <span class="usage-percent">${value}%</span>
    </div>
  `;
}

function loadContainers() {
  fetch(`${API_URL}/containers`)
    .then((res) => res.json())
    .then((data) => {
      tableBody.innerHTML = ""; // Clear table

      // === Update summary cards ===
      const total = data.length;
      const running = data.filter((c) => c.status === "running").length;
      const stopped = total - running;

      document.getElementById("totalContainers").textContent = total;
      document.getElementById("runningContainers").textContent = running;
      document.getElementById("stoppedContainers").textContent = stopped;

      // === Fill table ===
      data.forEach((c) => {
        const row = document.createElement("tr");

        const toggleButton =
          c.status === "running"
            ? `<button class="action-btn stop" onclick="stopContainer('${c.id}')">
                 <i class="fa-solid fa-stop"></i> Stop
               </button>`
            : `<button class="action-btn start" onclick="startContainer('${c.id}')">
                 <i class="fa-solid fa-play"></i> Start
               </button>`;

        row.innerHTML = `
            <td>${c.name}</td>
            <td><span class="status-badge ${
              c.status === "running" ? "running" : "stopped"
            }">${c.status}</span></td>
            <td>${c.cpu_limit}</td>
            <td>${c.ram_limit}</td>
            <td>${createUsageBar(c.cpu_usage, "CPU")}</td>
            <td>${createUsageBar(c.ram_usage, "RAM")}</td>
            <td class="action-buttons">
              ${toggleButton}
              <button class="action-btn delete" onclick="deleteContainer('${
                c.id
              }')">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </td>
          `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => console.error("Error loading containers:", err));
}

function createContainer() {
  const name = document.getElementById("nameInput").value;
  const cpu = parseFloat(document.getElementById("cpuInput").value);
  const ram = document.getElementById("ramInput").value;

  fetch(`${API_URL}/containers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, cpu, ram }),
  }).then(() => {
    modal.style.display = "none";
    loadContainers();
  });
}

createBtn.onclick = createContainer;

function startContainer(id) {
  fetch(`${API_URL}/containers/${id}/start`, { method: "POST" }).then(
    loadContainers
  );
}

function stopContainer(id) {
  fetch(`${API_URL}/containers/${id}/stop`, { method: "POST" }).then(
    loadContainers
  );
}

function deleteContainer(id) {
  fetch(`${API_URL}/containers/${id}`, { method: "DELETE" }).then(
    loadContainers
  );
}

// Auto-refresh every 2 seconds
setInterval(loadContainers, 2000);

// Initial load
loadContainers();
