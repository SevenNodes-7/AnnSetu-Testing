
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const monthFilter = document.getElementById("monthFilter");
const toast = document.getElementById("toast");

let toastTimeout;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Mobile sidebar
menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close sidebar" : "Open sidebar"
    );
});

document.addEventListener("click", event => {
    if (
        window.innerWidth <= 1000 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

// Reporting month selector
monthFilter.addEventListener("change", () => {
    const selectedMonth = monthFilter.value;

    document.getElementById("reportMonth").textContent =
        `${selectedMonth} — district summary.`;

    showToast(
        `Selected ${selectedMonth}. Connect your database to load its actual records.`
    );
});

// Notifications
document.getElementById("notificationBtn").addEventListener("click", () => {
    const alerts = document.querySelector(".alerts-panel");

    alerts.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    showToast("Review the Alerts & Notifications section below.");
});

// View all recent activities
document.getElementById("viewActivityBtn").addEventListener("click", () => {
    const activityList = document.getElementById("activityList");

    activityList.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showToast("Showing all recent activities available in this demo.");
});

// View all alerts
document.getElementById("viewAlertsBtn").addEventListener("click", () => {
    document.getElementById("alertsList").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    showToast("Review the alerts listed on this dashboard.");
});

// Update the reporting period shown in the demo
document.getElementById("monthFilter").dispatchEvent(
    new Event("change")
);
