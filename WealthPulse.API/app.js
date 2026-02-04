"use strict";
// API Base URL - Update this with your deployed API URL
const API_BASE_URL = "https://your-api-url.railway.app"; // Change to your actual API URL
// Navigation
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  loadDashboardData();
  // Load hash on page load
  const hash = window.location.hash.substring(1) || "dashboard";
  showPage(hash);
});
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const page = item.getAttribute("data-page");
      showPage(page);
      // Update active state
      navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");
      // Update URL hash
      window.location.hash = page;
    });
  });
}
function showPage(pageName) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));
  const targetPage = document.getElementById(pageName);
  if (targetPage) {
    targetPage.classList.add("active");
    // Load page-specific data
    if (pageName === "assets") {
      loadAssetsTable();
    } else if (pageName === "dashboard") {
      loadDashboardData();
    }
  }
}
// Dashboard Functions
async function loadDashboardData() {
  try {
    updateApiStatus("Connected", "success");
    // Load assets
    const assets = await fetchAssets();
    if (assets && assets.length > 0) {
      updateDashboardStats(assets);
      displayDashboardAssets(assets.slice(0, 4)); // Show only first 4
    } else {
      displayEmptyDashboard();
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    updateApiStatus("Error", "error");
    displayEmptyDashboard();
  }
}
function updateDashboardStats(assets) {
  const totalAssets = assets.length;
  const portfolioValue = assets.reduce((sum, asset) => {
    return sum + asset.quantity * asset.pricePerShare;
  }, 0);
  const totalAssetsEl = document.getElementById("totalAssets");
  const portfolioValueEl = document.getElementById("portfolioValue");
  if (totalAssetsEl) totalAssetsEl.textContent = totalAssets.toString();
  if (portfolioValueEl)
    portfolioValueEl.textContent = formatCurrency(portfolioValue);
}
function displayDashboardAssets(assets) {
  const container = document.getElementById("dashboardAssets");
  if (!container) return;
  if (assets.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No assets found. Add your first asset!</div>';
    return;
  }
  container.innerHTML = assets
    .map(
      (asset) => `
        <div class="asset-card">
            <div class="asset-header">
                <div>
                    <div class="asset-symbol">${escapeHtml(asset.symbol)}</div>
                    <div class="asset-name">${escapeHtml(asset.name)}</div>
                </div>
                <div class="asset-value">
                    ${formatCurrency(asset.quantity * asset.pricePerShare)}
                </div>
            </div>
            <div class="asset-details">
                <div class="asset-detail">
                    <span>Quantity</span>
                    <strong>${asset.quantity}</strong>
                </div>
                <div class="asset-detail">
                    <span>Price/Share</span>
                    <strong>${formatCurrency(asset.pricePerShare)}</strong>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}
function displayEmptyDashboard() {
  const container = document.getElementById("dashboardAssets");
  if (!container) return;
  container.innerHTML = `
        <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M20 7H4M20 7L16 3M20 7L16 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 17H20M4 17L8 13M4 17L8 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>No assets found. Start by adding your first asset!</p>
        </div>
    `;
}
function updateApiStatus(status, type) {
  const statusEl = document.getElementById("apiStatus");
  if (!statusEl) return;
  statusEl.textContent = status;
  statusEl.style.color =
    type === "success" ? "var(--success-color)" : "var(--danger-color)";
}
// Assets Table Functions
async function loadAssetsTable() {
  const tbody = document.getElementById("assetsTableBody");
  if (!tbody) return;
  tbody.innerHTML =
    '<tr><td colspan="6" class="loading-cell">Loading assets...</td></tr>';
  try {
    const assets = await fetchAssets();
    displayAssetsTable(assets);
  } catch (error) {
    console.error("Error loading assets:", error);
    tbody.innerHTML =
      '<tr><td colspan="6" class="loading-cell" style="color: var(--danger-color);">Error loading assets</td></tr>';
  }
}
function displayAssetsTable(assets) {
  const tbody = document.getElementById("assetsTableBody");
  if (!tbody) return;
  if (assets.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="loading-cell">No assets found. Click "Add Asset" to get started!</td></tr>';
    return;
  }
  tbody.innerHTML = assets
    .map(
      (asset) => `
        <tr>
            <td><strong>${escapeHtml(asset.symbol)}</strong></td>
            <td>${escapeHtml(asset.name)}</td>
            <td>${asset.quantity}</td>
            <td>${formatCurrency(asset.pricePerShare)}</td>
            <td><strong>${formatCurrency(asset.quantity * asset.pricePerShare)}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editAsset(${asset.id})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2.00004C11.5084 1.82463 11.7163 1.68605 11.9451 1.5922C12.1739 1.49834 12.4191 1.45087 12.6663 1.45087C12.9136 1.45087 13.1588 1.49834 13.3876 1.5922C13.6164 1.68605 13.8243 1.82463 13.9997 2.00004C14.1751 2.17544 14.3137 2.38334 14.4075 2.61213C14.5014 2.84093 14.5489 3.08617 14.5489 3.33337C14.5489 3.58058 14.5014 3.82582 14.4075 4.05461C14.3137 4.28341 14.1751 4.49131 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteAsset(${asset.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H3.33333H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("");
}
// API Functions
async function fetchAssets() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/assets`);
    if (!response.ok) throw new Error("Failed to fetch assets");
    return await response.json();
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
}
async function testEndpoint(method, endpoint) {
  const responseDiv = document.getElementById("apiResponse");
  const responseContent = document.getElementById("apiResponseContent");
  if (!responseDiv || !responseContent) return;
  responseDiv.style.display = "block";
  responseContent.textContent = "Loading...";
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const contentType = response.headers.get("content-type");
    let data;
    let rawResponse = "";
    // Try to get the raw text first
    rawResponse = await response.text();
    // Try to parse as JSON if content-type is JSON
    if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawResponse);
      } catch (e) {
        data = { error: "Invalid JSON response", rawResponse };
      }
    } else {
      // Not JSON, show raw response
      data = {
        message: "Non-JSON response",
        contentType: contentType || "unknown",
        rawResponse: rawResponse.substring(0, 500), // Limit to first 500 chars
      };
    }
    const formatted = {
      status: response.status,
      statusText: response.statusText,
      data: data,
    };
    responseContent.textContent = JSON.stringify(formatted, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    responseContent.textContent = JSON.stringify(
      {
        error: errorMessage,
      },
      null,
      2,
    );
  }
}
// Helper Functions
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function refreshData() {
  const currentPage = document.querySelector(".page.active");
  if (!currentPage) return;
  const pageId = currentPage.id;
  if (pageId === "dashboard") {
    loadDashboardData();
  } else if (pageId === "assets") {
    loadAssetsTable();
  }
  // Show refresh feedback
  const btn = event?.target?.closest("button");
  if (!btn) return;
  const originalText = btn.innerHTML;
  btn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="animation: spin 1s linear infinite;"><path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.84871 2 11.5151 2.84171 12.6255 4.18359" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 2V4.5H9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Refreshing...';
  setTimeout(() => {
    btn.innerHTML = originalText;
  }, 1000);
}
// Placeholder functions
function openAddAssetModal() {
  alert(
    "Add Asset modal would open here. You can implement a form or redirect to the Swagger UI to add assets via the API.",
  );
}
function editAsset(id) {
  alert(`Edit asset ${id}. Implement edit functionality here.`);
}
function deleteAsset(id) {
  if (confirm("Are you sure you want to delete this asset?")) {
    // Implement delete functionality
    alert(`Asset ${id} would be deleted. Implement API call here.`);
  }
}
// Add CSS animation for spinning
const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
// Make functions available globally
window.refreshData = refreshData;
window.openAddAssetModal = openAddAssetModal;
window.editAsset = editAsset;
window.deleteAsset = deleteAsset;
window.testEndpoint = testEndpoint;
