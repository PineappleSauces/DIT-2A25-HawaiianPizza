const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const sessionId = localStorage.getItem("compareSessionId");

  if (!sessionId) {
    alert("No comparison session found.");
    window.location.href = "cars.html";
    return;
  }

  // 1️⃣ Fetch currently selected cars from backend
  const currentRes = await fetch(`${API_BASE_URL}/api/compare/current`, {
    headers: {
      "X-Session-Id": sessionId
    }
  });

  if (!currentRes.ok) {
    alert("Failed to load comparison session.");
    window.location.href = "cars.html";
    return;
  }

  const currentData = await currentRes.json();

  if (
    !currentData.selectedCars ||
    currentData.selectedCars.length !== 2
  ) {
    alert("You must select exactly 2 cars to compare.");
    window.location.href = "cars.html";
    return;
  }

  // ✅ FIX: selectedCars are already car objects
  const cars = currentData.selectedCars;
  const carIds = cars.map(car => car.id);

  // 2️⃣ Fetch aggregated comparison summary
  const summaryRes = await fetch(`${API_BASE_URL}/api/compare/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: carIds })
  });

  if (!summaryRes.ok) {
    alert("Failed to load comparison data.");
    return;
  }

  const summary = await summaryRes.json();

  renderCars(summary.cars);
  renderStats(summary.stats);

  // Reset button logic
  const resetBtn = document.getElementById("resetCompareBtn");
  if (resetBtn) {
    resetBtn.onclick = async () => {
      await fetch(`${API_BASE_URL}/api/compare/reset`, {
        method: "DELETE",
        headers: {
          "X-Session-Id": sessionId
        }
      });

      localStorage.removeItem("compareSessionId");
      window.location.href = "cars.html";
    };
  }
});

// ---------------- RENDER CAR CARDS ----------------
function renderCars(cars) {
  const grid = document.getElementById("compareGrid");
  if (!grid) return;

  grid.innerHTML = "";

  cars.forEach(car => {
    const html = `
      <article class="product-card">
        <div class="product-tag">${car.type}</div>
        <div class="product-name">${car.name}</div>
        <div class="product-meta">${car.description || ""}</div>
        <div class="product-price-row">
          <span class="product-price">${car.price_display}</span>
          <span class="text-muted">${car.power}</span>
        </div>
      </article>
    `;
    grid.insertAdjacentHTML("beforeend", html);
  });
}

// ---------------- RENDER AGGREGATED STATS ----------------
function renderStats(stats) {
  const container = document.getElementById("compareStats");
  if (!container) return;

  const maxNames = stats.maxHpCars.map(c => c.name).join(", ");
  const minNames = stats.minHpCars.map(c => c.name).join(", ");

  const ranking = stats.sortedByHpDesc
    .map(c => `${c.name} (${c.hpValue} HP)`)
    .join("<br>");

  container.innerHTML = `
    <h2>Comparison Summary</h2>
    <p><strong>Highest Horsepower:</strong> ${stats.maxHpValue} HP — ${maxNames}</p>
    <p><strong>Lowest Horsepower:</strong> ${stats.minHpValue} HP — ${minNames}</p>
    <p><strong>Horsepower Difference:</strong> ${stats.hpDifference} HP</p>

    <h3>Ranking</h3>
    <p>${ranking}</p>
  `;
}
