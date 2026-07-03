import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Badge } from '../components/ui/Badge';
import { Search, SlidersHorizontal, UserPlus, Eye } from 'lucide-react';

export const Employees = () => {
  const { employees, setLogoutOpen } = useAppContext();

  // Filters & State
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pageSize = 8;

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    const deps = new Set(employees.map((emp) => emp.department));
    return Array.from(deps).sort();
  }, [employees]);

  // Filter & Sort Logic
  const processedEmployees = useMemo(() => {
    let result = [...employees];

    // Search filter (Fuzzy search on ID, Name, Department, Designation)
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((emp) =>
        [emp.name, emp.department, emp.designation, emp.employeeId].some((val) =>
          val.toLowerCase().includes(lowerSearch)
        )
      );
    }

    // Department filter
    if (department !== 'all') {
      result = result.filter((emp) => emp.department === department);
    }

    // Status filter
    if (status !== 'all') {
      result = result.filter((emp) => emp.status === status);
    }

    // Sorting
    result.sort((first, second) => {
      if (sort === 'joiningDate') {
        return new Date(first.joiningDate) - new Date(second.joiningDate);
      }
      if (sort === 'department') {
        return first.department.localeCompare(second.department);
      }
      return first.name.localeCompare(second.name);
    });

    return result;
  }, [employees, search, department, status, sort]);

  // Paginated chunk
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const items = processedEmployees.slice(start, start + pageSize);
    const pageCount = Math.max(1, Math.ceil(processedEmployees.length / pageSize));
    return { items, pageCount };
  }, [processedEmployees, currentPage]);

  const { items: currentItems, pageCount } = paginatedData;

  const handleOpenDetails = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
    setModalOpen(false);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground font-sans">
      {/* Topbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card shadow-sm shrink-0">
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Directory</p>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Employees</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setLogoutOpen(true)}
            data-testid="logout-btn"
            className="border-border text-foreground hover:bg-muted"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Controls Panel */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative md:col-span-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                  <Search className="h-4 w-4" />
                </span>
                <Input
                  id="employeeSearch"
                  data-testid="employee-search"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 bg-background border-input text-foreground focus-visible:ring-primary"
                />
              </div>

              {/* Department Filter */}
              <div>
                <Select
                  id="departmentFilter"
                  data-testid="department-filter"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-background border-input text-foreground focus-visible:ring-primary"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select
                  id="statusFilter"
                  data-testid="status-filter"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-background border-input text-foreground focus-visible:ring-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </Select>
              </div>

              {/* Sorting */}
              <div>
                <Select
                  id="sortSelect"
                  data-testid="sort-select"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-background border-input text-foreground focus-visible:ring-primary"
                >
                  <option value="name">Sort by Name</option>
                  <option value="department">Sort by Department</option>
                  <option value="joiningDate">Sort by Joining Date</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Directory Table */}
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div id="employeeTable" className="min-w-full">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider">Employee ID</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider">Name</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider">Department</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider">Designation</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {currentItems.length > 0 ? (
                    currentItems.map((emp) => (
                      <tr 
                        key={emp.employeeId} 
                        className="hover:bg-muted/20 transition-colors duration-150"
                      >
                        <td className="p-4 font-medium text-muted-foreground">{emp.employeeId}</td>
                        <td className="p-4 font-bold">{emp.name}</td>
                        <td className="p-4 text-muted-foreground font-medium">{emp.department}</td>
                        <td className="p-4 text-muted-foreground">{emp.designation}</td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              emp.status === 'Active' 
                                ? 'success' 
                                : emp.status === 'On Leave' 
                                  ? 'warning' 
                                  : 'destructive'
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 hover:bg-primary hover:text-primary-foreground font-semibold transition-colors"
                            data-testid={`view-employee-${emp.employeeId}`}
                            onClick={() => handleOpenDetails(emp)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-muted-foreground">
                        No employees match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <div 
            id="pagination" 
            className="flex justify-center items-center gap-1.5 pt-2"
          >
            {Array.from({ length: pageCount }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-all duration-150 ${
                    isActive 
                      ? 'active bg-primary border-primary text-primary-foreground font-bold shadow-sm' 
                      : 'bg-card border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Employee Details Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseDetails} 
        title="Employee Details" 
        id="employeeModal"
      >
        {selectedEmployee && (
          <div className="space-y-4" id="employeeModalContent">
            <div className="border-b border-border pb-3">
              <h3 
                id="employeeModalTitle" 
                className="text-lg font-bold text-foreground"
              >
                {selectedEmployee.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedEmployee.designation}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm employee-detail-list">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Employee ID</span>
                <p className="font-semibold text-foreground">{selectedEmployee.employeeId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Status</span>
                <div>
                  <Badge 
                    variant={
                      selectedEmployee.status === 'Active' 
                        ? 'success' 
                        : selectedEmployee.status === 'On Leave' 
                          ? 'warning' 
                          : 'destructive'
                    }
                  >
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Email Address</span>
                <p className="font-semibold text-foreground break-all">{selectedEmployee.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Phone Number</span>
                <p className="font-semibold text-foreground">{selectedEmployee.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Department</span>
                <p className="font-semibold text-foreground">{selectedEmployee.department}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Joining Date</span>
                <p className="font-semibold text-foreground">
                  {new Date(selectedEmployee.joiningDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
