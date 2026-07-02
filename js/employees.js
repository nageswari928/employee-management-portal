import {
  ensureAuthenticated,
  renderSidebar,
  initLogoutButton,
  loadJson,
  sortEmployees,
  filterEmployees,
  paginateEmployees,
  renderPagination,
  createElement,
  getEmployeeDepartmentOptions,
  applyStoredTheme,
  getProfile,
  getSettings,
} from './common.js';

class EmployeesController {
  constructor() {
    this.employees = [];
    this.pageSize = 8;
    this.currentPage = 1;
    this.filters = { department: 'all', status: 'all', search: '', sort: 'name' };
    this.employeeTable =
        page.getByTestId("employee-table");
    this.init();
  }

  async init() {
    if (!ensureAuthenticated()) {
      return;
    }
    applyStoredTheme();
    renderSidebar('employees.html');
    initLogoutButton();
    this.bindEvents();
    this.employees = await loadJson('./data/employees.json');
    this.employees.forEach((employee, index) => {
      employee.id = employee.employeeId || `EMP${String(index + 1).padStart(3, '0')}`;
    });
    this.renderDepartmentFilters();
    this.renderTable();
  }

  bindEvents() {
    const searchInput = document.getElementById('employeeSearch');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortSelect = document.getElementById('sortSelect');
    const closeButton = document.getElementById('closeEmployeeModal');

    searchInput.addEventListener('input', (event) => {
      this.filters.search = event.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    departmentFilter.addEventListener('change', (event) => {
      this.filters.department = event.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    statusFilter.addEventListener('change', (event) => {
      this.filters.status = event.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    sortSelect.addEventListener('change', (event) => {
      this.filters.sort = event.target.value;
      this.currentPage = 1;
      this.renderTable();
    });

    closeButton.addEventListener('click', () => this.closeModal());
  }

  renderDepartmentFilters() {
    const departmentFilter = document.getElementById('departmentFilter');
    if (!departmentFilter) {
      return;
    }
    const departments = getEmployeeDepartmentOptions(this.employees);
    departments.forEach((department) => {
      const option = createElement('option');
      option.value = department;
      option.textContent = department;
      departmentFilter.append(option);
    });
  }

  renderTable() {
    const tableContainer = document.getElementById('employeeTable');
    const paginationContainer = document.getElementById('pagination');
    if (!tableContainer || !paginationContainer) {
      return;
    }
    const filtered = filterEmployees(this.employees, this.filters.department, this.filters.status, this.filters.search);
    const sorted = sortEmployees(filtered, this.filters.sort);
    const { items, pageCount, page } = paginateEmployees(sorted, this.currentPage, this.pageSize);

    const table = createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Employee ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Status</th><th>Action</th>
        </tr>
      </thead>
      <tbody></tbody>`;
    const tableBody = table.querySelector('tbody');
    items.forEach((employee) => {
      const row = createElement('tr');
      row.innerHTML = `
        <td>${employee.employeeId}</td>
        <td>${employee.name}</td>
        <td>${employee.department}</td>
        <td>${employee.designation}</td>
        <td><span class="badge">${employee.status}</span></td>
        <td><button class="table-row-btn" type="button" data-testid="view-employee-${employee.employeeId}">View</button></td>`;
      row.querySelector('button').addEventListener('click', () => this.openModal(employee));
      tableBody.append(row);
    });

    tableContainer.innerHTML = '';
    tableContainer.append(table);
    renderPagination(paginationContainer, pageCount, page, (pageNumber) => {
      this.currentPage = pageNumber;
      this.renderTable();
    });
  }

  openModal(employee) {
    const modal = document.getElementById('employeeModal');
    const content = document.getElementById('employeeModalContent');
    if (!modal || !content) {
      return;
    }
    content.innerHTML = `
      <h3 id="employeeModalTitle">${employee.name}</h3>
      <div class="employee-detail-list">
        <div><strong>Employee ID</strong>: ${employee.employeeId}</div>
        <div><strong>Email</strong>: ${employee.email}</div>
        <div><strong>Phone</strong>: ${employee.phone}</div>
        <div><strong>Department</strong>: ${employee.department}</div>
        <div><strong>Designation</strong>: ${employee.designation}</div>
        <div><strong>Status</strong>: ${employee.status}</div>
        <div><strong>Joining Date</strong>: ${employee.joiningDate}</div>
      </div>`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    const modal = document.getElementById('employeeModal');
    if (!modal) {
      return;
    }
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

new EmployeesController();
