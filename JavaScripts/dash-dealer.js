
'use strict';

const shopRows = [
  {id:'DS001',name:'Shree Ram Dealer',district:'Rajkot',village:'Limboj',allocated:50,received:50,distributed:45,status:'Active'},
  {id:'DS002',name:'Jay Mataji Dealer',district:'Ahmedabad',village:'Sanand',allocated:60,received:60,distributed:60,status:'Active'},
  {id:'DS003',name:'Shiv Shakti Dealer',district:'Surat',village:'Utran',allocated:40,received:40,distributed:32,status:'Active'},
  {id:'DS004',name:'Krishna Dealer',district:'Vadodara',village:'Karjan',allocated:55,received:50,distributed:45,status:'Active'},
  {id:'DS005',name:'Sardar Dealer',district:'Jamnagar',village:'Dhrol',allocated:45,received:45,distributed:45,status:'Active'},
  {id:'DS006',name:'Patel Ration Shop',district:'Bhavnagar',village:'Palitana',allocated:50,received:45,distributed:30,status:'Inactive'},
  {id:'DS007',name:'Maa Annapurna',district:'Porbandar',village:'Kutiyana',allocated:35,received:30,distributed:20,status:'Inactive'},
  {id:'DS008',name:'Vishwakarma Dealer',district:'Amreli',village:'Savarkundla',allocated:40,received:40,distributed:35,status:'Active'},
  {id:'DS009',name:'Gopal Ration Store',district:'Gandhinagar',village:'Kalol',allocated:55,received:55,distributed:52,status:'Active'},
  {id:'DS010',name:'Jai Hind Dealer',district:'Kutch',village:'Bhuj',allocated:70,received:60,distributed:48,status:'Pending Stock'}
];

const state = {
  page: 1,
  pageSize: 10,
  search: '',
  district: 'all',
  status: 'all'
};

const tableBody = document.getElementById('shopsTableBody');
const pagination = document.getElementById('pagination');
const summary = document.getElementById('tableSummary');
const modal = document.getElementById('shopModal');
const toast = document.getElementById('toast');

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function getFilteredRows() {
  const query = state.search.trim().toLowerCase();

  return shopRows.filter(shop => {
    const matchQuery =
      !query ||
      [shop.id, shop.name, shop.district, shop.village]
        .some(value => String(value).toLowerCase().includes(query));

    const matchDistrict =
      state.district === 'all' || shop.district === state.district;

    const matchStatus =
      state.status === 'all' || shop.status === state.status;

    return matchQuery && matchDistrict && matchStatus;
  });
}

function statusClass(status) {
  if (status === 'Active') return 'status-active';
  if (status === 'Inactive') return 'status-inactive';
  return 'status-pending-stock';
}

function formatNumber(value) {
  return Number(value).toLocaleString('en-IN', {
    maximumFractionDigits: 1
  });
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

function renderTable() {
  const rows = getFilteredRows();
  const pageCount = Math.max(1, Math.ceil(rows.length / state.pageSize));

  if (state.page > pageCount) {
    state.page = pageCount;
  }

  const start = (state.page - 1) * state.pageSize;
  const pageRows = rows.slice(start, start + state.pageSize);

  if (!pageRows.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align:center;padding:25px">
          No dealer shops match your search.
        </td>
      </tr>`;
  } else {
    tableBody.innerHTML = pageRows.map((shop, index) => {
      const remaining = Math.max(
        0,
        Number(shop.received) - Number(shop.distributed)
      );

      return `
        <tr>
          <td>${start + index + 1}</td>
          <td>${escapeHTML(shop.id)}</td>
          <td>${escapeHTML(shop.name)}</td>
          <td>${escapeHTML(shop.district)}</td>
          <td>${escapeHTML(shop.village)}</td>
          <td>${formatNumber(shop.allocated)}</td>
          <td>${formatNumber(shop.received)}</td>
          <td>${formatNumber(shop.distributed)}</td>
          <td>${formatNumber(remaining)}</td>
          <td>
            <span class="status-badge ${statusClass(shop.status)}">
              ${escapeHTML(shop.status)}
            </span>
          </td>
          <td>
            <button class="row-action view-shop"
              data-shop-id="${escapeHTML(shop.id)}">
              <i class="fa-regular fa-eye"></i> View
            </button>
            <button class="row-action more-action view-shop"
              data-shop-id="${escapeHTML(shop.id)}"
              aria-label="More details">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </td>
        </tr>`;
    }).join('');
  }

  summary.textContent = rows.length
    ? `Showing ${start + 1}–${Math.min(start + state.pageSize, rows.length)} of ${rows.length} matching sample shops`
    : 'Showing 0 matching shops';

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
    label === '›' ? 'Next page' :
    `Page ${page}`
  );

  button.addEventListener('click', () => {
    state.page = page;
    renderTable();
  });

  return button;
}

function applyFilters(event) {
  if (event) event.preventDefault();

  state.search = document.getElementById('shopSearch').value;
  state.district = document.getElementById('districtFilter').value;
  state.status = document.getElementById('statusFilter').value;
  state.page = 1;

  renderTable();
}

document.getElementById('filterForm').addEventListener(
  'submit',
  applyFilters
);

document.getElementById('shopSearch').addEventListener('input', () => {
  state.search = document.getElementById('shopSearch').value;
  state.page = 1;
  renderTable();
});

document.getElementById('districtFilter').addEventListener(
  'change',
  applyFilters
);

document.getElementById('statusFilter').addEventListener(
  'change',
  applyFilters
);

document.getElementById('clearFiltersButton').addEventListener('click', () => {
  document.getElementById('shopSearch').value = '';
  document.getElementById('districtFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';

  applyFilters();
  showToast('Filters cleared.');
});

document.getElementById('mapDistrict').addEventListener('change', event => {
  const district = event.target.value;

  document.getElementById('districtFilter').value = district;
  applyFilters();

  if (district !== 'all') {
    showToast(`Showing sample records for ${district}.`);
  }
});

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('formError').textContent = '';
  document.getElementById('newShopId').focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('addShopButton').addEventListener('click', openModal);
document.getElementById('tableAddButton').addEventListener('click', openModal);
document.getElementById('closeModalButton').addEventListener('click', closeModal);
document.getElementById('cancelModalButton').addEventListener('click', closeModal);

modal.addEventListener('click', event => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('menuToggle').setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('shopForm').addEventListener('submit', event => {
  event.preventDefault();

  const formError = document.getElementById('formError');

  const shop = {
    id: document.getElementById('newShopId').value.trim(),
    name: document.getElementById('newShopName').value.trim(),
    district: document.getElementById('newShopDistrict').value,
    village: document.getElementById('newShopVillage').value.trim(),
    allocated: Number(document.getElementById('newShopAllocated').value),
    received: Number(document.getElementById('newShopReceived').value),
    distributed: Number(document.getElementById('newShopDistributed').value),
    status: document.getElementById('newShopStatus').value
  };

  if (shopRows.some(row => row.id.toLowerCase() === shop.id.toLowerCase())) {
    formError.textContent = 'That Shop ID already exists in the sample list.';
    return;
  }

  if ([shop.allocated, shop.received, shop.distributed].some(number =>
    number < 0 || !Number.isFinite(number)
  )) {
    formError.textContent = 'Stock values must be zero or greater.';
    return;
  }

  if (
    shop.received > shop.allocated ||
    shop.distributed > shop.received
  ) {
    formError.textContent =
      'Received stock cannot exceed allocated stock, and distributed stock cannot exceed received stock.';
    return;
  }

  shopRows.unshift(shop);

  document.getElementById('shopForm').reset();
  document.getElementById('newShopAllocated').value = '0';
  document.getElementById('newShopReceived').value = '0';
  document.getElementById('newShopDistributed').value = '0';

  document.getElementById('shopSearch').value = '';
  document.getElementById('districtFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  document.getElementById('mapDistrict').value = 'all';

  state.search = '';
  state.district = 'all';
  state.status = 'all';
  state.page = 1;

  renderTable();
  closeModal();
  showToast('Dealer shop added to this page session.');
});

function exportCSV() {
  const rows = getFilteredRows();

  const headers = [
    'Shop ID',
    'Shop Name',
    'District',
    'Village',
    'Allocated (MT)',
    'Received (MT)',
    'Distributed (MT)',
    'Remaining (MT)',
    'Status'
  ];

  const data = rows.map(shop => [
    shop.id,
    shop.name,
    shop.district,
    shop.village,
    shop.allocated,
    shop.received,
    shop.distributed,
    Math.max(0, shop.received - shop.distributed),
    shop.status
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
  link.download = 'dealer-shops-report.csv';

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
  showToast(`CSV report exported (${rows.length} sample records).`);
}

document.getElementById('exportButton').addEventListener('click', exportCSV);

document.getElementById('manageStockButton').addEventListener('click', () => {
  document.getElementById('statusFilter').value = 'Pending Stock';

  state.status = 'Pending Stock';
  state.page = 1;

  renderTable();

  document.getElementById('shopsTableSection').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  showToast('Showing shops marked Pending Stock.');
});

document.getElementById('viewAllButton').addEventListener('click', () => {
  document.getElementById('shopSearch').value = '';
  document.getElementById('districtFilter').value = 'all';
  document.getElementById('statusFilter').value = 'all';
  document.getElementById('mapDistrict').value = 'all';

  applyFilters();

  document.getElementById('shopsTableSection').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

document.getElementById('viewActivityButton').addEventListener('click', () => {
  showToast('Recent activity entries are demonstration records.');
});

document.getElementById('notificationsButton').addEventListener('click', () => {
  document.getElementById('activityList').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  showToast('Review the Recent Activity panel for sample notifications.');
});

document.getElementById('reportMonth').addEventListener('change', event => {
  showToast(`Report period set to ${event.target.value}. Displayed records remain demo data.`);
});

tableBody.addEventListener('click', event => {
  const button = event.target.closest('.view-shop');

  if (!button) return;

  const shop = shopRows.find(row => row.id === button.dataset.shopId);

  if (shop) {
    const remaining = Math.max(0, shop.received - shop.distributed);

    showToast(
      `${shop.id} · ${shop.name} · ${shop.district} · ${shop.status} · ${remaining} MT remaining`
    );
  }
});

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

menuToggle.addEventListener('click', () => {
  const opened = sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});

document.addEventListener('click', event => {
  if (
    window.innerWidth <= 1000 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

renderTable();
