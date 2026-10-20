
'use strict';

const allocations = [
  {district:'Rajkot',item:'Rice',allocated:1200,distributed:1104},
  {district:'Ahmedabad',item:'Rice',allocated:1150,distributed:1012},
  {district:'Surat',item:'Wheat',allocated:980,distributed:745},
  {district:'Vadodara',item:'Wheat',allocated:860,distributed:594},
  {district:'Jamnagar',item:'Pulses',allocated:750,distributed:465},
  {district:'Bhavnagar',item:'Rice',allocated:680,distributed:524},
  {district:'Porbandar',item:'Edible Oil',allocated:220,distributed:172},
  {district:'Amreli',item:'Sugar',allocated:580,distributed:423},
  {district:'Gandhinagar',item:'Pulses',allocated:540,distributed:498},
  {district:'Kutch',item:'Wheat',allocated:500,distributed:385},
  {district:'Rajkot',item:'Wheat',allocated:900,distributed:810},
  {district:'Ahmedabad',item:'Pulses',allocated:700,distributed:560},
  {district:'Surat',item:'Rice',allocated:850,distributed:720},
  {district:'Vadodara',item:'Edible Oil',allocated:450,distributed:300},
  {district:'Jamnagar',item:'Sugar',allocated:350,distributed:210},
  {district:'Bhavnagar',item:'Wheat',allocated:620,distributed:490},
  {district:'Porbandar',item:'Rice',allocated:320,distributed:256},
  {district:'Amreli',item:'Pulses',allocated:400,distributed:280},
  {district:'Gandhinagar',item:'Rice',allocated:540,distributed:498},
  {district:'Kutch',item:'Edible Oil',allocated:280,distributed:196}
];

const state = {
  page: 1,
  pageSize: 10,
  item: 'all'
};

const tableBody = document.getElementById('allocationTableBody');
const pagination = document.getElementById('pagination');
const summary = document.getElementById('tableSummary');
const modal = document.getElementById('allocationModal');
const toast = document.getElementById('toast');

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function formatNumber(value) {
  return Number(value).toLocaleString('en-IN', {
    maximumFractionDigits: 1
  });
}

function getFilteredAllocations() {
  return allocations.filter(row =>
    state.item === 'all' || row.item === state.item
  );
}

function getCompletion(row) {
  return row.allocated > 0
    ? Math.round(row.distributed / row.allocated * 100)
    : 0;
}

function getStatus(row) {
  const percentage = getCompletion(row);

  if (percentage >= 90) return 'Completed';
  if (percentage >= 60) return 'In Progress';

  return 'Pending';
}

function renderTable() {
  const rows = getFilteredAllocations();
  const pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));

  if (state.page > pageCount) state.page = pageCount;

  const start = (state.page - 1) * state.pageSize;
  const visibleRows = rows.slice(start, start + state.pageSize);

  if (!visibleRows.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:25px">
          No allocation records found.
        </td>
      </tr>`;
  } else {
    tableBody.innerHTML = visibleRows.map((row, index) => {
      const remaining = Math.max(0, row.allocated - row.distributed);
      const completion = getCompletion(row);
      const status = getStatus(row);

      const completionClass = completion >= 80
        ? ''
        : completion >= 60 ? 'medium' : 'low';

      const statusClass = status === 'Completed'
        ? 'status-completed'
        : status === 'In Progress' ? 'status-progress' : 'status-pending';

      return `
        <tr>
          <td>${start + index + 1}</td>
          <td>${escapeHTML(row.district)}</td>
          <td>${escapeHTML(row.item)}</td>
          <td>${formatNumber(row.allocated)}</td>
          <td>${formatNumber(row.distributed)}</td>
          <td>${formatNumber(remaining)}</td>
          <td>
            <span class="completion-pill ${completionClass}">
              ${completion}%
            </span>
          </td>
          <td>
            <span class="status-badge ${statusClass}">
              ${status}
            </span>
          </td>
        </tr>`;
    }).join('');
  }

  summary.textContent = rows.length
    ? `Showing ${start + 1}–${Math.min(start + state.pageSize, rows.length)} of ${rows.length} sample records`
    : 'Showing 0 records';

  pagination.innerHTML = '';

  pagination.appendChild(
    createPageButton('‹', state.page - 1, state.page === 1, false)
  );

  for (let page = 1; page <= pageCount; page++) {
    pagination.appendChild(
      createPageButton(
        String(page),
        page,
        false,
        page === state.page
      )
    );
  }

  pagination.appendChild(
    createPageButton('›', state.page + 1, state.page === pageCount, false)
  );
}

function createPageButton(label, page, disabled, active) {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = `page-button${active ? ' active' : ''}`;
  button.textContent = label;
  button.disabled = disabled;

  button.setAttribute(
    'aria-label',
    label === '‹' ? 'Previous page' :
    label === '›' ? 'Next page' : `Page ${page}`
  );

  button.addEventListener('click', () => {
    state.page = page;
    renderTable();
  });

  return button;
}

document.getElementById('itemFilter').addEventListener('change', event => {
  state.item = event.target.value;
  state.page = 1;
  renderTable();

  showToast(
    state.item === 'all'
      ? 'Showing all food items.'
      : `Showing ${state.item} allocation records.`
  );
});

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('formError').textContent = '';
  document.getElementById('newDistrict').focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('allocateButton').addEventListener('click', openModal);

document.getElementById('closeModalButton').addEventListener(
  'click',
  closeModal
);

document.getElementById('cancelModalButton').addEventListener(
  'click',
  closeModal
);

modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('allocationForm').addEventListener('submit', event => {
  event.preventDefault();

  const formError = document.getElementById('formError');

  const district = document.getElementById('newDistrict').value;
  const item = document.getElementById('newFoodItem').value;
  const allocated = Number(document.getElementById('newAllocated').value);
  const distributed = Number(document.getElementById('newDistributed').value);

  if (!district || !item) {
    formError.textContent = 'Please select a district and food item.';
    return;
  }

  if (
    !Number.isFinite(allocated) ||
    !Number.isFinite(distributed) ||
    allocated <= 0 ||
    distributed < 0
  ) {
    formError.textContent = 'Enter valid stock amounts.';
    return;
  }

  if (distributed > allocated) {
    formError.textContent =
      'Distributed stock cannot exceed allocated stock.';
    return;
  }

  allocations.unshift({
    district,
    item,
    allocated,
    distributed
  });

  document.getElementById('allocationForm').reset();

  document.getElementById('newDistributed').value = '0';
  document.getElementById('itemFilter').value = 'all';

  state.item = 'all';
  state.page = 1;

  renderTable();
  closeModal();

  showToast('Allocation added to the current page session.');
});

function exportCSV() {
  const rows = getFilteredAllocations();

  const headers = [
    'District',
    'Food Item',
    'Allocated (MT)',
    'Distributed (MT)',
    'Remaining (MT)',
    'Completion (%)',
    'Status'
  ];

  const data = rows.map(row => [
    row.district,
    row.item,
    row.allocated,
    row.distributed,
    Math.max(0, row.allocated - row.distributed),
    getCompletion(row),
    getStatus(row)
  ]);

  const csv = [headers, ...data]
    .map(row => row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(','))
    .join('\r\n');

  const blob = new Blob(['\ufeff', csv], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'food-allocation-report.csv';

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);

  showToast(`CSV report exported: ${rows.length} sample records.`);
}

document.getElementById('exportButton').addEventListener('click', exportCSV);

document.getElementById('reportButton').addEventListener('click', () => {
  document.getElementById('districtAllocation').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  showToast('Allocation report displayed below.');
});

document.getElementById('stockButton').addEventListener('click', () => {
  showToast('Stock management requires a connected inventory system.');
});

document.getElementById('viewMapButton').addEventListener('click', () => {
  document.querySelector('.map-panel').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});

document.getElementById('viewActivityButton').addEventListener('click', () => {
  showToast('Recent activity shown here contains demonstration records.');
});

document.getElementById('notificationsButton').addEventListener('click', () => {
  document.getElementById('recentActivity').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  showToast('Review the Recent Activity panel.');
});

document.getElementById('reportMonth').addEventListener('change', event => {
  showToast(
    `Reporting period set to ${event.target.value}. Records are still sample data.`
  );
});

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

menuToggle.addEventListener('click', () => {
  const opened = sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});

document.addEventListener('click', event => {
  if (
    window.innerWidth <= 1100 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

renderTable();
