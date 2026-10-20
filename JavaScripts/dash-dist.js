
const districts = [
    { name: "Rajkot", shops: 620, beneficiaries: 542000, allocated: 1200, distributed: 1104 },
    { name: "Ahmedabad", shops: 580, beneficiaries: 487300, allocated: 1150, distributed: 1012 },
    { name: "Surat", shops: 540, beneficiaries: 412600, allocated: 980, distributed: 745 },
    { name: "Vadodara", shops: 480, beneficiaries: 398200, allocated: 860, distributed: 594 },
    { name: "Jamnagar", shops: 410, beneficiaries: 325700, allocated: 750, distributed: 465 },
    { name: "Bhavnagar", shops: 390, beneficiaries: 298400, allocated: 680, distributed: 524 },
    { name: "Porbandar", shops: 120, beneficiaries: 85400, allocated: 220, distributed: 172 },
    { name: "Amreli", shops: 310, beneficiaries: 231200, allocated: 580, distributed: 423 },
    { name: "Gandhinagar", shops: 290, beneficiaries: 212400, allocated: 540, distributed: 498 },
    { name: "Kutch", shops: 270, beneficiaries: 198700, allocated: 500, distributed: 385 },
    { name: "Anand", shops: 260, beneficiaries: 187000, allocated: 470, distributed: 400 },
    { name: "Bharuch", shops: 250, beneficiaries: 176000, allocated: 450, distributed: 350 },
    { name: "Junagadh", shops: 240, beneficiaries: 169000, allocated: 430, distributed: 365 },
    { name: "Kheda", shops: 230, beneficiaries: 160000, allocated: 420, distributed: 340 },
    { name: "Mehsana", shops: 225, beneficiaries: 155000, allocated: 410, distributed: 360 },
    { name: "Banaskantha", shops: 220, beneficiaries: 152000, allocated: 400, distributed: 280 },
    { name: "Patan", shops: 210, beneficiaries: 143000, allocated: 390, distributed: 300 },
    { name: "Surendranagar", shops: 205, beneficiaries: 139000, allocated: 380, distributed: 270 },
    { name: "Dahod", shops: 200, beneficiaries: 135000, allocated: 370, distributed: 240 },
    { name: "Panchmahal", shops: 195, beneficiaries: 130000, allocated: 360, distributed: 275 },
    { name: "Valsad", shops: 190, beneficiaries: 126000, allocated: 350, distributed: 320 },
    { name: "Navsari", shops: 185, beneficiaries: 121000, allocated: 340, distributed: 305 },
    { name: "Sabarkantha", shops: 180, beneficiaries: 118000, allocated: 330, distributed: 260 },
    { name: "Tapi", shops: 175, beneficiaries: 110000, allocated: 320, distributed: 250 },
    { name: "Narmada", shops: 170, beneficiaries: 105000, allocated: 310, distributed: 220 },
    { name: "Botad", shops: 165, beneficiaries: 100000, allocated: 300, distributed: 240 },
    { name: "Morbi", shops: 160, beneficiaries: 98000, allocated: 290, distributed: 225 },
    { name: "Aravalli", shops: 155, beneficiaries: 94000, allocated: 280, distributed: 230 },
    { name: "Mahisagar", shops: 150, beneficiaries: 90000, allocated: 270, distributed: 200 },
    { name: "Chhota Udepur", shops: 145, beneficiaries: 85000, allocated: 260, distributed: 190 },
    { name: "Devbhoomi Dwarka", shops: 140, beneficiaries: 80000, allocated: 250, distributed: 195 },
    { name: "Gir Somnath", shops: 135, beneficiaries: 76000, allocated: 240, distributed: 200 },
    { name: "Dang", shops: 80, beneficiaries: 45000, allocated: 180, distributed: 135 }
];

let currentPage = 1;
const rowsPerPage = 10;

const tableBody = document.getElementById("districtTableBody");
const searchInput = document.getElementById("searchDistrict");
const statusFilter = document.getElementById("statusFilter");
const pagination = document.getElementById("pagination");
const tableInfo = document.getElementById("tableInfo");
const modal = document.getElementById("districtModal");
const modalBody = document.getElementById("modalBody");

function getCompletion(district) {
    if (district.allocated <= 0) return 0;

    return Math.round(
        (district.distributed / district.allocated) * 100
    );
}

function getStatus(district) {
    const completion = getCompletion(district);

    if (completion >= 90) return "Completed";
    if (completion >= 50) return "In Progress";

    return "Pending";
}

function formatNumber(number) {
    return number.toLocaleString("en-IN");
}

function getFilteredDistricts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    return districts.filter(district => {
        const matchesName = district.name.toLowerCase().includes(searchText);
        const matchesStatus =
            selectedStatus === "All" ||
            getStatus(district) === selectedStatus;

        return matchesName && matchesStatus;
    });
}

function renderTable() {
    const filteredDistricts = getFilteredDistricts();
    const totalPages = Math.ceil(filteredDistricts.length / rowsPerPage);

    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }

    if (totalPages === 0) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleDistricts = filteredDistricts.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    tableBody.innerHTML = "";

    if (visibleDistricts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center;padding:25px;">
                    No matching districts found.
                </td>
            </tr>
        `;
    } else {
        visibleDistricts.forEach((district, index) => {
            const completion = getCompletion(district);
            const status = getStatus(district);

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${startIndex + index + 1}</td>
                <td><strong>${district.name}</strong></td>
                <td>${formatNumber(district.shops)}</td>
                <td>${formatNumber(district.beneficiaries)}</td>
                <td>${formatNumber(district.allocated)}</td>
                <td>${formatNumber(district.distributed)}</td>
                <td>${formatNumber(district.allocated - district.distributed)}</td>
                <td>${completion}%</td>
                <td>
                    <span class="status-badge ${statusClass(status)}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="view-btn" data-district="${index}">
                        <i class="fa-regular fa-eye"></i> View
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    const firstRecord = filteredDistricts.length ? startIndex + 1 : 0;
    const lastRecord = Math.min(
        startIndex + rowsPerPage,
        filteredDistricts.length
    );

    tableInfo.textContent =
        `Showing ${firstRecord}–${lastRecord} of ${filteredDistricts.length} districts`;

    renderPagination(totalPages);
}

function statusClass(status) {
    if (status === "Completed") return "completed";
    if (status === "In Progress") return "in-progress";

    return "pending";
}

function renderPagination(totalPages) {
    pagination.innerHTML = "";

    const previousButton = document.createElement("button");
    previousButton.textContent = "‹";
    previousButton.setAttribute("aria-label", "Previous page");
    previousButton.disabled = currentPage <= 1;

    previousButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement("button");
        button.textContent = page;

        if (page === currentPage) {
            button.classList.add("active");
            button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
            currentPage = page;
            renderTable();
        });

        pagination.appendChild(button);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "›";
    nextButton.setAttribute("aria-label", "Next page");
    nextButton.disabled = currentPage >= totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    pagination.appendChild(nextButton);
}

function showDistrictDetails(district) {
    const completion = getCompletion(district);
    const status = getStatus(district);

    document.getElementById("modalTitle").textContent =
        district.name + " District Details";

    modalBody.innerHTML = `
        <p><strong>District:</strong> ${district.name}</p>
        <p><strong>Dealer shops:</strong> ${formatNumber(district.shops)}</p>
        <p><strong>Beneficiaries:</strong> ${formatNumber(district.beneficiaries)}</p>
        <p><strong>Food allocated:</strong> ${formatNumber(district.allocated)} MT</p>
        <p><strong>Food distributed:</strong> ${formatNumber(district.distributed)} MT</p>
        <p><strong>Remaining:</strong> ${formatNumber(district.allocated - district.distributed)} MT</p>
        <p><strong>Completion:</strong> ${completion}%</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Reporting month:</strong> ${document.getElementById("monthFilter").value}</p>
        <p><em>Figures shown are illustrative sample data.</em></p>
    `;

    modal.hidden = false;
    document.getElementById("closeModal").focus();
}

tableBody.addEventListener("click", event => {
    const button = event.target.closest("[data-district]");

    if (!button) return;

    const index = Number(button.dataset.district);
    const district = getFilteredDistricts()[
        (currentPage - 1) * rowsPerPage +
        Array.from(tableBody.querySelectorAll("tr")).indexOf(button.closest("tr"))
    ];

    if (district && Number.isInteger(index)) {
        showDistrictDetails(district);
    }
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.hidden = true;
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.hidden = true;
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        modal.hidden = true;
    }
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
});

statusFilter.addEventListener("change", () => {
    currentPage = 1;
    renderTable();
});

document.getElementById("monthFilter").addEventListener("change", event => {
    updateChart();
    renderTable();
    console.info("Selected reporting month:", event.target.value);
});

document.getElementById("menuToggle").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
});

document.addEventListener("click", event => {
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.getElementById("menuToggle");

    if (
        window.innerWidth <= 1000 &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
    }
});

document.getElementById("addDistrictBtn").addEventListener("click", () => {
    const name = prompt("Enter the new district name:");

    if (!name || !name.trim()) return;

    const cleanName = name.trim();

    if (districts.some(d => d.name.toLowerCase() === cleanName.toLowerCase())) {
        alert("This district already exists.");
        return;
    }

    districts.push({
        name: cleanName,
        shops: 0,
        beneficiaries: 0,
        allocated: 0,
        distributed: 0
    });

    currentPage = Math.ceil(districts.length / rowsPerPage);
    renderTable();
    updateChart();

    alert(
        "District added to the temporary demo list. " +
        "It will not be saved permanently without a backend."
    );
});

document.getElementById("reportBtn").addEventListener("click", () => {
    exportCSV("district-report.csv");
});

document.getElementById("allocationBtn").addEventListener("click", () => {
    alert("Connect this button to your Food Allocation page.");
});

document.getElementById("exportBtn").addEventListener("click", () => {
    exportCSV("district-data.csv");
});

function exportCSV(filename) {
    const headers = [
        "District",
        "Dealer Shops",
        "Beneficiaries",
        "Allocated MT",
        "Distributed MT",
        "Pending MT",
        "Completion %",
        "Status"
    ];

    const rows = getFilteredDistricts().map(district => [
        district.name,
        district.shops,
        district.beneficiaries,
        district.allocated,
        district.distributed,
        district.allocated - district.distributed,
        getCompletion(district),
        getStatus(district)
    ]);

    const csv = [headers, ...rows]
        .map(row =>
            row.map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(",")
        )
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

let districtChart;

function updateChart() {
    const chartCanvas = document.getElementById("districtChart");

    if (districtChart) {
        districtChart.destroy();
    }

    const chartDistricts = [...districts]
        .sort((a, b) => getCompletion(b) - getCompletion(a))
        .slice(0, 5);

    districtChart = new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: chartDistricts.map(d => d.name),
            datasets: [{
                label: "Distribution Completion (%)",
                data: chartDistricts.map(getCompletion),
                backgroundColor: [
                    "#16845b",
                    "#258b63",
                    "#80bd4e",
                    "#ffbf31",
                    "#f59a30"
                ],
                borderRadius: 5,
                borderSkipped: false,
                maxBarThickness: 42
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: context => `${context.raw}% completed`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: value => value + "%"
                    },
                    grid: {
                        color: "#e9f0f2"
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 35,
                        minRotation: 0,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

renderTable();
updateChart();
