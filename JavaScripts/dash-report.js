
const $ = selector => document.querySelector(selector);

// Exact report details shown in the reference image.
const reports = [
  {
    name: "District-wise Food Allocation Report",
    type: "Allocation",
    date: "20 Oct 2026, 10:24 AM",
    status: "Completed"
  },
  {
    name: "Beneficiary Coverage Report",
    type: "Beneficiaries",
    date: "18 Oct 2026, 04:15 PM",
    status: "Completed"
  },
  {
    name: "Dealer Shops Summary",
    type: "Shops",
    date: "16 Oct 2026, 11:03 AM",
    status: "Completed"
  },
  {
    name: "Stock Position Report",
    type: "Stock",
    date: "13 Oct 2026, 09:42 AM",
    status: "Completed"
  },
  {
    name: "Pending Distribution Report",
    type: "Distribution",
    date: "10 Oct 2026, 03:20 PM",
    status: "Completed"
  }
];

// District-wise performance chart.
const districtLabels = [
  "Rajkot",
  "Gandhinagar",
  "Valsad",
  "Navsari",
  "Ahmedabad"
];

const districtValues = [92, 92, 78, 83, 88];

const districtCanvas = $("#districtChart");

const districtChart = new Chart(districtCanvas, {
  type: "bar",

  data: {
    labels: districtLabels,

    datasets: [{
      data: districtValues,
      backgroundColor: [
        "#168b69",
        "#43ad70",
        "#ffbd32",
        "#4199e4",
        "#2eaf91"
      ],
      borderRadius: 7,
      borderSkipped: false,
      maxBarThickness: 65,
      categoryPercentage: 0.75,
      barPercentage: 0.8
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        top: 15,
        right: 3
      }
    },

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: context => ` Completion: ${context.raw}%`
        }
      }
    },

    scales: {
      y: {
        min: 0,
        max: 100,

        ticks: {
          stepSize: 20,
          color: "#6289a6",
          font: {
            family: "Inter",
            size: 10
          },
          callback: value => value + "%"
        },

        grid: {
          color: "#e4eef3",
          drawTicks: false
        },

        border: {
          display: false
        }
      },

      x: {
        ticks: {
          color: "#527c98",
          font: {
            family: "Inter",
            size: 10
          },
          maxRotation: 0,
          minRotation: 0
        },

        grid: {
          display: false
        },

        border: {
          color: "#dceaf0"
        }
      }
    }
  },

  plugins: [{
    id: "barValueLabels",

    afterDatasetsDraw(chart) {
      const { ctx } = chart;

      ctx.save();
      ctx.fillStyle = "#087e70";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        ctx.fillText(
          districtValues[index] + "%",
          bar.x,
          bar.y - 7
        );
      });

      ctx.restore();
    }
  }]
});

// Top 5 / Top 3 district filter.
$("#districtLimit").addEventListener("change", event => {
  const limit = Number(event.target.value);

  districtChart.data.labels = districtLabels.slice(0, limit);
  districtChart.data.datasets[0].data = districtValues.slice(0, limit);
  districtChart.update();
});

// Food category distribution donut chart.
// Percentages intentionally follow the reference image.
const foodCanvas = $("#foodChart");

new Chart(foodCanvas, {
  type: "doughnut",

  data: {
    labels: [
      "Rice",
      "Wheat",
      "Pulses",
      "Edible Oil",
      "Sugar"
    ],

    datasets: [{
      data: [32, 28, 16, 12, 10],

      backgroundColor: [
        "#128765",
        "#ffbd32",
        "#ffb23d",
        "#8aa8fa",
        "#8756c5"
      ],

      borderWidth: 0,
      hoverOffset: 5,
      spacing: 1
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "67%",

    plugins: {
      legend: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: context =>
            ` ${context.label}: ${context.raw}%`
        }
      }
    }
  }
});

// CSV file download.
function downloadCSV(filename, rows) {
  const escapeCell = value => {
    let text = String(value ?? "");

    // Reduce spreadsheet formula injection risk.
    if (/^[\s]*[=+\-@]/.test(text)) {
      text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
  };

  const csv = rows
    .map(row => row.map(escapeCell).join(","))
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Download the selected report.
$("#reportTable").addEventListener("click", event => {
  const button = event.target.closest("[data-report]");

  if (!button) return;

  const report = reports[Number(button.dataset.report)];

  if (!report) return;

  const rows = [
    ["Report Name", "Type", "Generated On", "Status"],
    [report.name, report.type, report.date, report.status]
  ];

  downloadCSV(
    report.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".csv",
    rows
  );
});

// View all reports dialog.
const messageDialog = $("#messageDialog");
const messageTitle = $("#messageTitle");
const messageBody = $("#messageBody");

function showMessage(title, content) {
  messageTitle.textContent = title;
  messageBody.innerHTML = content;
  messageDialog.showModal();
}

$("#viewAllReports").addEventListener("click", () => {
  const list = reports.map((report, index) => `
    <p>
      <strong>${index + 1}. ${report.name}</strong><br>
      Type: ${report.type}<br>
      Generated: ${report.date}<br>
      Status: ${report.status}
    </p>
  `).join("<hr style='border:0;border-top:1px solid #e2edf1;margin:12px 0'>");

  showMessage("All Reports", list);
});

$("#closeMessage").addEventListener("click", () => {
  messageDialog.close();
});

messageDialog.addEventListener("click", event => {
  if (event.target === messageDialog) {
    messageDialog.close();
  }
});

// Notification button.
$("#notificationBtn").addEventListener("click", () => {
  showMessage(
    "Notifications",
    "<p>You have 3 notifications.</p>" +
    "<p>1. Reports updated for October 2026.</p>" +
    "<p>2. District performance data is available.</p>" +
    "<p>3. Food distribution summary is available.</p>"
  );
});

// Mobile sidebar.
const sidebar = $("#sidebar");
const sidebarOverlay = $("#sidebarOverlay");

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("visible");
}

$("#menuToggle").addEventListener("click", () => {
  sidebar.classList.toggle("open");

  sidebarOverlay.classList.toggle(
    "visible",
    sidebar.classList.contains("open")
  );
});

sidebarOverlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeSidebar();
  }
});

// Sidebar selection.
// This page only implements Reports & Analytics;
// other links are navigation placeholders.
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const page = link.dataset.page;

    if (page !== "Reports & Analytics") {
      showMessage(
        page,
        `<p>The ${page} page is not included in this HTML file.</p>`
      );
      closeSidebar();
      return;
    }

    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.remove("active");
    });

    link.classList.add("active");
    closeSidebar();
  });
});
