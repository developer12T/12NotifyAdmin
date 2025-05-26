<template>
    <div class="p-4 sm:ml-24">
      <div class="p-4 mt-10">
        <!-- Header -->
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <i class="fas fa-users text-2xl text-blue-600 dark:text-blue-400"></i>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">รายการพนักงาน</h1>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            ทั้งหมด {{ employees.length }} คน
          </div>
        </div>

        <div class="md:flex gap-2">
          <!-- Department List Sidebar -->
          <div class="w-full md:w-80 mb-4 md:mb-0">
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="ค้นหาแผนก..." 
                    class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                  <Icon class="absolute left-3 top-3 text-gray-400" icon="cuida:search-outline" width="18" height="18" />
                </div>
              </div>
              <div class="max-h-[calc(100vh-250px)] overflow-y-auto">
                <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                  <li v-for="dept in filteredDepartments" :key="dept.name">
                    <a href="#" 
                       @click.prevent="selectDepartment(dept.name === 'ทั้งหมด' ? null : dept)"
                       :class="[
                         'flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                         (dept.name === 'ทั้งหมด' && !selectedDepartment) || (selectedDepartment?.name === dept.name)
                           ? 'bg-blue-50 dark:bg-blue-900/20' 
                           : ''
                       ]">
                      <div class="flex items-center">
                        <i :class="[
                          'mr-3',
                          dept.name === 'ทั้งหมด' ? 'fas fa-users' : 'fas fa-building',
                          'text-gray-400'
                        ]"></i>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ dept.name }}
                        </span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {{ dept.count }} คน
                      </span>
            </a>
        </li>
    </ul>
              </div>
    </div>
</div>

          <!-- Employee List -->
          <div class="flex-1">
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-users text-xl text-blue-600 dark:text-blue-400"></i>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                      {{ selectedDepartment ? selectedDepartment.name : 'พนักงานทั้งหมด' }}
                      <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                        ({{ filteredDepartmentEmployees.length }} คน)
                      </span>
                    </h2>
                  </div>
                  <div class="relative">
                    <input 
                      type="text" 
                      v-model="employeeSearchQuery"
                      placeholder="ค้นหาพนักงาน..." 
                      class="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                    <Icon class="absolute left-3 top-3 text-gray-400" icon="cuida:search-outline" width="18" height="18" />
                  
                  </div>
                </div>
              </div>
              <div v-if="filteredDepartmentEmployees.length > 0" class="overflow-x-auto max-h-[calc(100vh-250px)] overflow-y-auto">
                <table class="w-full text-sm text-left">
                  <thead class="text-xs sticky top-0 z-10 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">พนักงาน</th>
                      <th scope="col" class="px-6 py-3">รหัสพนักงาน</th>
                      <th scope="col" class="px-6 py-3">ตำแหน่ง</th>
                      <th scope="col" class="px-6 py-3">อีเมล</th>
                      <th scope="col" class="px-6 py-3">สถานะ</th>
                      <!-- <th scope="col" class="px-6 py-3">บทบาท</th> -->
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="employee in filteredDepartmentEmployees" 
                        :key="employee.employeeID"
                        class="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        @click="showEmployeeDetails(employee)">
                      <td class="px-6 py-4">
                        <div class="flex items-center space-x-3">
                          <img :src="employee.imgUrl" 
                               :alt="employee.fullName"
                               class="w-8 h-8 rounded-full object-cover">
                          <div class="font-medium text-gray-900 dark:text-white">
                            {{ employee.fullName }}
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 text-gray-900 dark:text-white">
                        {{ employee.employeeID }}
                      </td>
                      <td class="px-6 py-4 text-gray-900 dark:text-white">
                        {{ employee.positon || 'ไม่ระบุตำแหน่ง' }}
                      </td>
                      <td class="px-6 py-4 text-gray-900 dark:text-white">
                        {{ employee.mail }}
                      </td>
                      <td class="px-6 py-4">
                        <span :class="[
                          'px-2 py-1 text-xs rounded-full',
                          employee.status === 1 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        ]">
                          {{ employee.status === 1 ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <!-- <td class="px-6 py-4">
                        <span :class="[
                          'px-2 py-1 text-xs rounded-full',
                          employee.role === 'admin'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        ]">
                          {{ employee.role === 'admin' ? 'Admin' : 'User' }}
                        </span>
                      </td> -->
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="p-12 text-center">
                <p class="text-gray-500 dark:text-gray-400">
                  {{ employeeSearchQuery ? 'ไม่พบพนักงานที่ค้นหา' : 'ไม่พบพนักงานในแผนกนี้' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Details Modal -->
    <div v-if="selectedEmployee" 
         class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
         @click="closeEmployeeDetails">
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
               @click.stop>
            <!-- Modal Header -->
            <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4 sm:p-8">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-8">
                  <div class="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img :src="selectedEmployee.imgUrl" 
                         :alt="selectedEmployee.fullName"
                         class="w-full h-full object-cover">
                  </div>
                  <div>
                    <h3 class="text-2xl font-medium leading-6 text-gray-900 dark:text-white mb-2">
                      {{ selectedEmployee.fullName }}
                    </h3>
                    <p class="text-xl text-gray-500 dark:text-gray-400 mb-4">
                      {{ selectedEmployee.fullNameThai }}
                    </p>
                    <div class="mt-3 flex items-center space-x-3">
                      <span :class="[
                        'px-3 py-1 text-sm rounded-full',
                        selectedEmployee.status === 1 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      ]">
                        {{ selectedEmployee.status === 1 ? 'Active' : 'Inactive' }}
                      </span>
                      <span :class="[
                        'px-3 py-1 text-sm rounded-full',
                        selectedEmployee.role === 'admin'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      ]">
                        {{ selectedEmployee.role === 'admin' ? 'Admin' : 'User' }}
                      </span>
                    </div>
                  </div>
                </div>
                <button type="button" 
                        class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                        @click="closeEmployeeDetails">
                  <span class="sr-only">Close</span>
                  <i class="fas fa-times text-2xl"></i>
                </button>
          </div>
        </div>
      
            <!-- Modal Body -->
            <div class="bg-white dark:bg-gray-800 px-6 pt-2 pb-6 sm:p-8">
              <div class="grid grid-cols-2 gap-8">
                <div class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">รหัสพนักงาน</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.employeeID }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ชื่อผู้ใช้</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.userName }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ตำแหน่ง</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.positon || 'ไม่ระบุตำแหน่ง' }}</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">แผนก</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.department || 'ไม่ระบุแผนก' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">บริษัท</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.company || 'ไม่ระบุบริษัท' }}</p>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">อีเมล</p>
                    <p class="text-lg text-gray-900 dark:text-white">{{ selectedEmployee.mail }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { Icon } from '@iconify/vue';
  import { useEmployeeStore } from '@/stores/modules/employee.js';
  import { storeToRefs } from 'pinia';

  export default {
    name: 'EmployeeView',
    components: {
      Icon
    },
    setup() {
      const employeeStore = useEmployeeStore();
      const { employees, loading, error } = storeToRefs(employeeStore);

      return {
        employeeStore,
        employees,
        loading,
        error
      };
    },
    data() {
      return {
        searchQuery: '',
        employeeSearchQuery: '',
        selectedDepartment: null,
        selectedEmployee: null
      };
    },
    computed: {
      departments() {
        const deptMap = new Map();
        deptMap.set('all', {
          name: 'ทั้งหมด',
          count: this.employees.length,
          employees: [...this.employees]
        });

        this.employees.forEach(emp => {
          const deptName = emp.department || 'User Resign';
          if (!deptMap.has(deptName)) {
            deptMap.set(deptName, {
              name: deptName,
              count: 0,
              employees: []
            });
          }
          const dept = deptMap.get(deptName);
          dept.count++;
          dept.employees.push(emp);
        });
        const deptArray = Array.from(deptMap.values());
        return deptArray.sort((a, b) => {
          if (a.name === 'ทั้งหมด') return -1;
          if (b.name === 'ทั้งหมด') return 1;
          return a.name.localeCompare(b.name);
        });
      },
      filteredDepartments() {
        if (!this.searchQuery) return this.departments;
        
        const query = this.searchQuery.toLowerCase();
        return this.departments.filter(dept => 
          dept.name.toLowerCase().includes(query)
        );
      },
      filteredDepartmentEmployees() {
        if (!this.selectedDepartment) {
          return this.filterEmployees(this.employees);
        }
        
        return this.filterEmployees(this.selectedDepartment.employees);
      }
    },
    created() {
      this.fetchEmployees();
    },
    methods: {
      async fetchEmployees() {
        try {
          await this.employeeStore.getEmployeeList();
          this.selectedDepartment = null;
          console.log('Total employees:', this.employees.length);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      },
      filterEmployees(employees) {
        if (!this.employeeSearchQuery) {
          console.log('Showing all employees:', employees.length);
          return employees;
        }
        
        const query = this.employeeSearchQuery.toLowerCase();
        const filtered = employees.filter(emp => 
          emp.fullName.toLowerCase().includes(query) ||
          emp.employeeID.toLowerCase().includes(query) ||
          (emp.positon && emp.positon.toLowerCase().includes(query))
        );
        console.log('Filtered employees:', filtered.length);
        return filtered;
      },
      selectDepartment(department) {
        console.log('Selecting department:', department?.name || 'ทั้งหมด');
        this.selectedDepartment = department;
        this.employeeSearchQuery = '';
        
        const employeesToShow = this.filteredDepartmentEmployees;
        console.log('Employees to show:', employeesToShow.length);
      },
      showEmployeeDetails(employee) {
        this.selectedEmployee = employee;
      },
      closeEmployeeDetails() {
        this.selectedEmployee = null;
      }
    }
  };
  </script>

  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>
