
document.addEventListener("DOMContentLoaded", () => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  // Toast notifications
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // District-wise performance chart
  const districts = [
    "Rajkot", "Gandhinagar", "Valsad", "Navsari",
    "Ahmedabad", "Surat", "Vadodara", "Jamnagar"
  ];

  const performance = [92, 88, 83, 78, 72, 86, 81, 75];

  const districtChart = new Chart($("#districtChart"), {
    type: "line",
    data: {
      labels: districts.slice(0, 5),
      datasets: [{
        label: "Distribution Performance",
        data: performance.slice(0, 5),
        borderColor: "#0d9874",
        backgroundColor: "rgba(13, 152, 116, 0.08)",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#0d9874",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => ` Performance: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            color: "#85a0b2",
            font: { size: 10 },
            callback: value => value + "%"
          },
          grid: { color: "#e5eff4" },
          border: { display: false }
        },
        x: {
          ticks: {
            color: "#6f91a7",
            maxRotation: 0,
            minRotation: 0,
            font: { size: 9 }
          },
          grid: { display: false },
          border: { display: false }
        }
      }
    }
  });

  // District filter
  $("#districtFilter").addEventListener("change", event => {
    const count = event.target.value === "all" ? districts.length : 5;

    districtChart.data.labels = districts.slice(0, count);
    districtChart.data.datasets[0].data = performance.slice(0, count);
    districtChart.update();
  });

  // Food distribution doughnut chart
  new Chart($("#foodChart"), {
    type: "doughnut",
    data: {
      labels: ["Rice", "Wheat", "Pulses", "Edible Oil", "Sugar"],
      datasets: [{
        data: [3994, 3494, 2246, 1498, 1248],
        backgroundColor: [
          "#0d9069",
          "#ffbd30",
          "#ffad39",
          "#8aa7fa",
          "#9657ca"
        ],
        borderWidth: 0,
        hoverOffset: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "67%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context =>
              ` ${context.label}: ${context.raw.toLocaleString("en-IN")} MT`
          }
        }
      }
    }
  });

  // View all reports
  let showingAll = false;

  $("#viewAllBtn").addEventListener("click", () => {
    showingAll = !showingAll;

    $$(".extra-report").forEach(row => {
      row.hidden = !showingAll;
    });

    $("#viewAllBtn").innerHTML = showingAll
      ? 'Show Recent Reports <i class="fa-solid fa-arrow-up"></i>'
      : 'View All Reports <i class="fa-solid fa-arrow-right"></i>';

    $("#tableNote").textContent = showingAll
      ? "Showing all 7 available sample reports"
      : "Showing 5 recent reports";
  });

  // Download individual report as CSV
  function downloadReport(row) {
    const headers = [
      "Report Number",
      "Report Name",
      "Type",
      "Generated On",
      "Status"
    ];

    const cells = [...row.querySelectorAll("td")].slice(0, 5);

    const escapeCSV = value =>
      '"' + String(value).replace(/"/g, '""') + '"';

    const csv = [
      headers.map(escapeCSV).join(","),
      cells.map(cell => escapeCSV(cell.innerText.trim())).join(",")
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const reportName = cells[1].innerText
      .trim()
      .replace(/[^a-z0-9]+/gi, "_");

    link.href = url;
    link.download = reportName + ".csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast("Report downloaded successfully.");
  }

  $$(".download-btn").forEach(button => {
    button.addEventListener("click", () => {
      downloadReport(button.closest("tr"));
    });
  });

  // Month selection
  $("#monthSelect").addEventListener("change", event => {
    showToast(
      `Selected ${event.target.value}. Connect your database to load its reports.`
    );
  });

  // Notification button
  $("#notificationBtn").addEventListener("click", () => {
    showToast("You have 3 notifications in this demonstration.");
  });

  // Administrator profile
  $("#profileBtn").addEventListener("click", () => {
    showToast("Administrator profile selected.");
  });

  // Sidebar navigation demonstration
//   $$(".navigation a").forEach(link => {
//     link.addEventListener("click", event => {
//       event.preventDefault();

//       $$(".navigation a").forEach(item => {
//         item.classList.remove("active");
//       });

//       link.classList.add("active");

//       const pageName = link.textContent.trim();

//       if (pageName !== "Reports & Analytics") {
//         showToast(`${pageName} page navigation is not connected yet.`);
//       }
//     });
//   });
// });
