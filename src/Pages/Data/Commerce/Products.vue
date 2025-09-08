<template>
  <div>
    <page-title :heading="heading" :subheading="subheading" :icon="icon"></page-title>

    <div class="content">
      <!-- Horizontal Layout -->
      <div class="main-card mb-3 card">
        <div class="card-header">
          <div class="card-header-title font-size-lg text-capitalize fw-normal">
            <i class="header-icon pe-7s-albums icon-gradient bg-happy-fisher"></i>
            Add Product
          </div>
        </div>
        <div class="card-body">
          <!-- <p class="text-muted mb-4">Form fields with labels positioned to the left of inputs.</p> -->

          <form @submit.prevent="submitHorizontalForm">
            <!--<b-row v-for="addProductFields in field" :key="field.key" class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">Name</label>
              <b-col sm="9">
                <b-form-input
                  :id="--------------------"
                  v-model="name"
                  type="text"
                  placeholder=""
                  :state="getValidationState('name')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter product name. </b-form-invalid-feedback>
              </b-col>
            </b-row>-->

            <b-row class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">Name</label>
              <b-col sm="9">
                <b-form-input
                  id="name"
                  v-model="name"
                  type="text"
                  placeholder=""
                  :state="getValidationState('name')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter product name. </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">SKU</label>
              <b-col sm="9">
                <b-form-input
                  id="horizontalEmail"
                  v-model="horizontalForm.email"
                  type="email"
                  placeholder=""
                  :state="getHorizontalValidationState('email')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter a valid email address. </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">Price</label>
              <b-col sm="9">
                <b-form-input
                  id="horizontalEmail"
                  v-model="horizontalForm.email"
                  type="email"
                  placeholder=""
                  :state="getHorizontalValidationState('email')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter a valid email address. </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">Brand</label>
              <b-col sm="9">
                <b-form-input
                  id="horizontalEmail"
                  v-model="horizontalForm.email"
                  type="email"
                  placeholder=""
                  :state="getHorizontalValidationState('email')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter a valid email address. </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <label for="horizontalEmail" class="col-sm-3 col-form-label">Categories</label>
              <b-col sm="9">
                <b-form-input
                  id="horizontalEmail"
                  v-model="horizontalForm.email"
                  type="email"
                  placeholder=""
                  :state="getHorizontalValidationState('email')"
                  required
                ></b-form-input>
                <b-form-invalid-feedback> Please enter a valid email address. </b-form-invalid-feedback>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <label for="horizontalTextarea" class="col-sm-3 col-form-label">Description</label>
              <b-col sm="9">
                <b-form-textarea
                  id="horizontalTextarea"
                  v-model="horizontalForm.bio"
                  placeholder=""
                  rows="4"
                ></b-form-textarea>
              </b-col>
            </b-row>

            <b-row>
              <b-col sm="9" offset-sm="3">
                <div class="d-flex flex-wrap">
                  <b-button type="submit" @click="AddSubmit()" variant="primary" class="me-2 mb-2">
                    <i class="fas fa-paper-plane me-2"></i>
                    Submit
                  </b-button>
                  <b-button type="button" variant="outline-secondary" @click="resetHorizontalForm" class="mb-2">
                    <i class="fas fa-undo me-2"></i>
                    Reset
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </form>
        </div>
      </div>

      <b-card title="Products" class="main-card mb-4">
        <div class="table-controls mb-3">
          <b-row class="align-items-center">
            <b-col md="6">
              <div class="d-flex align-items-center">
                <label class="form-label me-2 mb-0">Show:</label>
                <b-form-select
                  v-model="perPage"
                  :options="[
                    { value: 5, text: '5' },
                    { value: 10, text: '10' },
                    { value: 25, text: '25' },
                    { value: 50, text: '50' }
                  ]"
                  size="sm"
                  style="width: auto"
                ></b-form-select>
                <span class="ms-2 text-muted">entries</span>
              </div>
            </b-col>
            <b-col md="6">
              <div class="d-flex justify-content-end">
                <b-form-input
                  v-model="filter"
                  type="text"
                  size="sm"
                  placeholder="Search..."
                  style="width: 200px"
                ></b-form-input>
              </div>
            </b-col>
          </b-row>
        </div>

        <b-table
          :items="paginatedItems"
          :fields="tableFields"
          :striped="striped"
          :bordered="bordered"
          :hover="hover"
          :small="small"
          :dark="dark"
          :responsive="responsive"
          :show-empty="showEmpty"
          empty-text="No data available"
          class="mb-0"
        >
          <!-- Custom slot for status column -->
          <template #cell(status)="data">
            <span :class="getStatusClass(data.value)" class="badge">
              {{ data.value }}
            </span>
          </template>

          <!-- Custom slot for actions column -->
          <template #cell(actions)="data">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary btn-sm" @click="editItem(data.item)">
                <font-awesome-icon icon="edit" />
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="deleteItem(data.item)">
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </template>
        </b-table>

        <!-- Pagination -->
        <div v-if="totalRows > perPage" class="d-flex justify-content-between align-items-center mt-3">
          <div class="text-muted">
            Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, totalRows) }} of
            {{ totalRows }} entries
          </div>
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            size="sm"
            class="mb-0"
            aria-label="Table pagination"
          ></b-pagination>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from '../../../Layout/Components/PageTitle.vue'
//import axios from 'axios'

export default {
  name: 'FormLayouts',
  components: {
    PageTitle
  },
  data() {
    return {
      heading: 'Manage Products',
      subheading: 'Upload products here for commerce type of data',
      icon: 'pe-7s-graph text-success',

      // Grid Form Data
      gridForm: {
        email: '',
        password: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        acceptTerms: false
      },

      // Inline Form Data
      inlineForm: {
        email: '',
        password: '',
        newsletter: false,
        notifications: true,
        marketing: false
      },

      // Quick Form Data
      quickForm: {
        email: '',
        password: ''
      },

      /*addProductFields: [
        {
          id: 'name',
          mode: 'name',
          type: 'text',
          placeholder: 'Type product name here',
          stateValidation: 'name',
          class: 'product-name',
          label: 'Name',
          is_required: true,
          invalid_feedback: 'Please enter product name.',
          field_type: 'input'
        }
      ],*/

      // Horizontal Form Data
      horizontalForm: {
        email: '',
        password: '',
        department: '',
        skills: [],
        bio: '',
        file: null,
        experience: '',
        available: false
      },

      // Advanced Form Data
      advancedForm: {
        website: '',
        price: '',
        search: '',
        range: 50,
        color: '#007bff',
        date: ''
      },

      // Form Options
      stateOptions: [
        { value: '', text: 'Choose state...' },
        { value: 'ca', text: 'California' },
        { value: 'ny', text: 'New York' },
        { value: 'tx', text: 'Texas' },
        { value: 'fl', text: 'Florida' },
        { value: 'wa', text: 'Washington' }
      ],

      departmentOptions: [
        { value: '', text: 'Select department...' },
        { value: 'engineering', text: 'Engineering' },
        { value: 'design', text: 'Design' },
        { value: 'marketing', text: 'Marketing' },
        { value: 'sales', text: 'Sales' },
        { value: 'support', text: 'Support' }
      ],

      skillOptions: [
        { value: 'vue', text: 'Vue.js' },
        { value: 'react', text: 'React' },
        { value: 'angular', text: 'Angular' },
        { value: 'node', text: 'Node.js' },
        { value: 'python', text: 'Python' },
        { value: 'java', text: 'Java' },
        { value: 'php', text: 'PHP' },
        { value: 'design', text: 'UI/UX Design' }
      ],

      experienceOptions: [
        { text: 'Entry Level (0-2 years)', value: 'entry' },
        { text: 'Mid Level (3-5 years)', value: 'mid' },
        { text: 'Senior Level (6+ years)', value: 'senior' },
        { text: 'Lead/Manager (8+ years)', value: 'lead' }
      ],

      // Table styling options
      striped: true,
      bordered: false,
      hover: true,
      small: false,
      dark: false,
      responsive: true,
      showEmpty: true,
      sortable: true,

      // Pagination and filteringn
      currentPage: 1,
      perPage: 10,
      filter: '',
      sortBy: 'name',
      sortDesc: false,

      // Table fields
      tableFields: [
        { key: 'id', label: 'ID', sortable: true, class: 'text-center' },
        { key: 'name', label: 'Full Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'department', label: 'Department', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status', sortable: true, class: 'text-center' },
        { key: 'joinDate', label: 'Join Date', sortable: true, class: 'text-center' },
        { key: 'actions', label: 'Actions', class: 'text-center' }
      ],

      // Enhanced sample data
      items: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@company.com',
          department: 'Engineering',
          role: 'Senior Developer',
          status: 'Active',
          joinDate: '2022-01-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          department: 'Design',
          role: 'UI/UX Designer',
          status: 'Active',
          joinDate: '2022-03-20'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@company.com',
          department: 'Marketing',
          role: 'Marketing Manager',
          status: 'Inactive',
          joinDate: '2021-11-10'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@company.com',
          department: 'Engineering',
          role: 'DevOps Engineer',
          status: 'Active',
          joinDate: '2023-02-01'
        },
        {
          id: 5,
          name: 'David Brown',
          email: 'david.brown@company.com',
          department: 'Sales',
          role: 'Sales Representative',
          status: 'Pending',
          joinDate: '2023-05-15'
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily.davis@company.com',
          department: 'HR',
          role: 'HR Specialist',
          status: 'Active',
          joinDate: '2022-08-12'
        },
        {
          id: 7,
          name: 'Tom Anderson',
          email: 'tom.anderson@company.com',
          department: 'Engineering',
          role: 'Frontend Developer',
          status: 'Active',
          joinDate: '2023-01-20'
        },
        {
          id: 8,
          name: 'Lisa Miller',
          email: 'lisa.miller@company.com',
          department: 'Design',
          role: 'Product Designer',
          status: 'Inactive',
          joinDate: '2021-09-05'
        }
      ]
    }
  },

  computed: {
    filteredItems() {
      if (!this.filter || !Array.isArray(this.items)) {
        return this.items || []
      }
      const filterLower = this.filter.toLowerCase()
      return this.items.filter(item => {
        if (!item || typeof item !== 'object') return false
        return Object.values(item).some(value => {
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(filterLower)
        })
      })
    },
    paginatedItems() {
      const filtered = this.filteredItems
      if (!Array.isArray(filtered)) return []

      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return filtered.slice(start, end)
    },
    totalRows() {
      return Array.isArray(this.filteredItems) ? this.filteredItems.length : 0
    }
  },

  methods: {
    addSubmit() {
      console.log('addSubmit')
    },
    getStatusClass(status) {
      const statusClasses = {
        Active: 'bg-success',
        Inactive: 'bg-danger',
        Pending: 'bg-warning text-dark'
      }
      return statusClasses[status] || 'bg-secondary'
    },
    editItem(item) {
      // Handle edit action
      alert(`Edit item: ${item.name}`)
    },
    deleteItem(item) {
      // Handle delete action
      if (confirm(`Are you sure you want to delete ${item.name}?`)) {
        const index = this.items.findIndex(i => i.id === item.id)
        if (index > -1) {
          this.items.splice(index, 1)
          // Reset to first page if current page is now empty
          if (this.paginatedItems.length === 0 && this.currentPage > 1) {
            this.currentPage = 1
          }
        }
      }
    },

    // Grid Form Methods
    submitGridForm() {
      if (this.validateGridForm()) {
        alert('Grid form submitted successfully!')
        // Handle form submission
        // Form data available in this.gridForm
      }
    },

    validateGridForm() {
      return (
        this.gridForm.email &&
        this.gridForm.password.length >= 6 &&
        this.gridForm.address &&
        this.gridForm.city &&
        this.gridForm.state &&
        this.gridForm.zip &&
        this.gridForm.acceptTerms
      )
    },

    resetGridForm() {
      this.gridForm = {
        email: '',
        password: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        acceptTerms: false
      }
    },

    // Inline Form Methods
    submitInlineForm() {
      if (this.inlineForm.email && this.inlineForm.password) {
        alert('Inline form submitted successfully!')
        // Form data available in this.inlineForm
      }
    },

    submitQuickForm() {
      if (this.quickForm.email && this.quickForm.password) {
        alert('Quick form submitted successfully!')
        // Form data available in this.quickForm
      }
    },

    // Horizontal Form Methods
    submitHorizontalForm() {
      if (this.validateHorizontalForm()) {
        alert('Horizontal form submitted successfully!')
        // Form data available in this.horizontalForm
      }
    },

    validateHorizontalForm() {
      return (
        this.horizontalForm.email &&
        this.horizontalForm.password.length >= 6 &&
        this.horizontalForm.department &&
        this.horizontalForm.experience
      )
    },

    getValidationState(field) {
      if (field === 'email') {
        return this.horizontalForm.email ? (this.isValidEmail(this.horizontalForm.email) ? true : false) : null
      }
      if (field === 'password') {
        return this.horizontalForm.password ? (this.horizontalForm.password.length >= 6 ? true : false) : null
      }
      return null
    },

    resetHorizontalForm() {
      this.horizontalForm = {
        email: '',
        password: '',
        department: '',
        skills: [],
        bio: '',
        file: null,
        experience: '',
        available: false
      }
    },

    // Utility Methods
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }
  }
}
</script>

<style>
/* Global CSS to fix BootstrapVueNext BFormFile component styling - Bootstrap 5 compliant */

/* Target all file input pseudo-elements with comprehensive browser support */
input[type='file']::file-selector-button,
input[type='file']::-webkit-file-upload-button,
input[type='file']::-moz-file-upload-button {
  padding: 0.375rem 0.75rem !important;
  margin: -0.375rem -0.75rem !important;
  margin-inline-end: 0.75rem !important;
  color: #212529 !important;
  background-color: #e9ecef !important;
  border: 1px solid #ced4da !important;
  border-right: 1px solid #ced4da !important;
  border-radius: 0.375rem 0 0 0.375rem !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  font-size: 1rem !important;
  font-family: inherit !important;
  cursor: pointer !important;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out !important;
}

/* Hover effects for file input buttons */
input[type='file']:hover::file-selector-button,
input[type='file']:hover::-webkit-file-upload-button {
  background-color: #ddd6fe !important;
}

/* Ensure the file input itself has proper Bootstrap 5 styling */
input[type='file'] {
  border: 1px solid #ced4da !important;
  border-radius: 0.375rem !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  color: #212529 !important;
  background-color: #fff !important;
}

/* Specific targeting for the horizontal file input */
#horizontalFile {
  border: 1px solid #ced4da !important;
  border-radius: 0.375rem !important;
  padding: 0.375rem 0.75rem !important;
}
</style>

<style scoped>
/* Custom form styling */
.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  min-height: 2.25rem;
}

.divider {
  height: 1px;
  background-color: #e9ecef;
  margin: 1rem 0;
}

/* Input group styling */
.input-group-text {
  background-color: #f8f9fa;
  border-color: #ced4da;
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 2.25rem;
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
}

/* Form validation styling */
.is-invalid {
  border-color: #dc3545;
}

.is-valid {
  border-color: #28a745;
}

/* Button spacing */
.btn + .btn {
  margin-left: 0.5rem;
}

/* Enhanced form layout styling */
.row {
  margin-bottom: 1rem;
}

.row:last-child {
  margin-bottom: 0;
}

/* Advanced Layout Examples specific styling */
.main-card .card-body h6 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1rem;
}

/* Ensure form controls in Advanced Layout have consistent height */
.form-control,
.form-select,
.input-group .form-control {
  min-height: 2.25rem;
  font-size: 1rem;
}

/* Bootstrap 5 Input Group Fixes - consistent with Controls.vue */
.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

/* Fix double borders by using negative margins (Bootstrap 5 approach) */
.input-group > .form-control,
.input-group > .form-select,
.input-group > .form-floating {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}

/* Use negative margins to overlap borders and eliminate double borders */
.input-group > .form-control + .form-control,
.input-group > .form-control + .form-select,
.input-group > .form-control + .input-group-text,
.input-group > .form-control + .btn,
.input-group > .form-select + .form-control,
.input-group > .form-select + .form-select,
.input-group > .form-select + .input-group-text,
.input-group > .form-select + .btn,
.input-group > .input-group-text + .form-control,
.input-group > .input-group-text + .form-select,
.input-group > .input-group-text + .input-group-text,
.input-group > .input-group-text + .btn,
.input-group > .btn + .form-control,
.input-group > .btn + .form-select,
.input-group > .btn + .input-group-text,
.input-group > .btn + .btn {
  margin-left: -1px;
}

/* Remove border radius from middle elements */
.input-group > .form-control:not(:first-child):not(:last-child),
.input-group > .form-select:not(:first-child):not(:last-child),
.input-group > .input-group-text:not(:first-child):not(:last-child),
.input-group > .btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}

/* Remove right border radius from first element when not last */
.input-group > .form-control:not(:last-child),
.input-group > .form-select:not(:last-child),
.input-group > .input-group-text:not(:last-child),
.input-group > .btn:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Remove left border radius from last element when not first */
.input-group > .form-control:not(:first-child),
.input-group > .form-select:not(:first-child),
.input-group > .input-group-text:not(:first-child),
.input-group > .btn:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Input group text styling with Bootstrap 5 defaults */
.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

/* Button styling in input groups */
.input-group > .btn {
  position: relative;
  z-index: 2;
  min-height: 2.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
}

/* Focus states - bring focused element to top */
.input-group > .form-control:focus,
.input-group > .form-select:focus {
  z-index: 5;
}

.input-group .btn:focus {
  z-index: 5;
}

/* Search button specific styling */
.search-button {
  min-width: 2.25rem;
  min-height: 2.25rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0.375rem 0.75rem !important;
}

.search-button svg,
.search-button i {
  font-size: 0.875rem;
  width: 0.875rem;
  height: 0.875rem;
  color: #6c757d;
}

.search-button:hover svg,
.search-button:hover i {
  color: #495057;
}

/* Bootstrap 5 File Input Styling - BootstrapVueNext compatible */
.form-control[type='file']:not(:disabled):not([readonly]) {
  cursor: pointer;
}

.form-control[type='file'] {
  overflow: hidden;
}

/* Modern browsers (Chrome 89+, Firefox 82+) - NEW STANDARD - High Specificity */
.form-control[type='file']::file-selector-button,
input.form-control[type='file']::file-selector-button {
  padding: 0.375rem 0.75rem !important;
  margin: -0.375rem -0.75rem !important;
  margin-inline-end: 0.75rem !important;
  color: #212529 !important;
  background-color: #e9ecef !important;
  cursor: pointer !important;
  border: 0 !important;
  border-inline-end: 1px solid #ced4da !important;
  border-radius: 0 !important;
  transition: background-color 0.15s ease-in-out !important;
  font-size: 1rem !important;
  font-family: inherit !important;
}

.form-control[type='file']:hover::file-selector-button,
input.form-control[type='file']:hover::file-selector-button {
  background-color: #ddd6fe !important;
}

.form-control[type='file']:not(:disabled):not([readonly])::-webkit-file-upload-button,
input.form-control[type='file']:not(:disabled):not([readonly])::-webkit-file-upload-button {
  padding: 0.375rem 0.75rem !important;
  margin: -0.375rem -0.75rem !important;
  margin-inline-end: 0.75rem !important;
  color: #212529 !important;
  background-color: #e9ecef !important;
  cursor: pointer !important;
  border: 0 !important;
  border-inline-end: 1px solid #ced4da !important;
  border-radius: 0 !important;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out !important;
  font-size: 1rem !important;
  font-family: inherit !important;
}

.form-control[type='file']:hover:not(:disabled):not([readonly])::-webkit-file-upload-button,
input.form-control[type='file']:hover:not(:disabled):not([readonly])::-webkit-file-upload-button {
  background-color: #ddd6fe !important;
}

.form-control[type='file']::-webkit-file-upload-button,
input.form-control[type='file']::-webkit-file-upload-button {
  padding: 0.375rem 0.75rem !important;
  margin: -0.375rem -0.75rem !important;
  margin-inline-end: 0.75rem !important;
  color: #212529 !important;
  background-color: #e9ecef !important;
  cursor: pointer !important;
  border: 0 !important;
  border-inline-end: 1px solid #ced4da !important;
  border-radius: 0 !important;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out !important;
  font-size: 1rem !important;
  font-family: inherit !important;
}

.form-control-sm[type='file']::-webkit-file-upload-button {
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
  margin-inline-end: 0.5rem;
}

.form-control-lg[type='file']::-webkit-file-upload-button {
  padding: 0.5rem 1rem;
  margin: -0.5rem -1rem;
  margin-inline-end: 1rem;
}

/* Modern browser size variants for file selector button */
.form-control-sm[type='file']::file-selector-button {
  padding: 0.25rem 0.5rem;
  margin: -0.25rem -0.5rem;
  margin-inline-end: 0.5rem;
}

.form-control-lg[type='file']::file-selector-button {
  padding: 0.5rem 1rem;
  margin: -0.5rem -1rem;
  margin-inline-end: 1rem;
}

/* Firefox file upload button styling - High Specificity */
.form-control[type='file']::-moz-file-upload-button,
input.form-control[type='file']::-moz-file-upload-button {
  padding: 0.375rem 0.75rem !important;
  margin: -0.375rem -0.75rem !important;
  margin-inline-end: 0.75rem !important;
  color: #212529 !important;
  background-color: #e9ecef !important;
  cursor: pointer !important;
  border: 0 !important;
  border-inline-end: 1px solid #ced4da !important;
  border-radius: 0 !important;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out !important;
  font-size: 1rem !important;
  font-family: inherit !important;
}

/* BootstrapVueNext specific file input fixes */
.form-file .form-file-button {
  padding: 0.375rem 0.75rem;
  margin-left: -1px;
  color: #212529;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.375rem 0 0 0.375rem;
}

.form-file .form-control {
  border-radius: 0 0.375rem 0.375rem 0;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .col-md-5,
  .col-md-4,
  .col-md-2 {
    margin-bottom: 1rem;
  }

  .offset-sm-3 {
    margin-left: 0;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
  }

  .d-flex.justify-content-between .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

/* Alert styling */
.alert ul {
  padding-left: 1.25rem;
  margin-bottom: 0;
}

.alert li {
  margin-bottom: 0.25rem;
}

/* Range input styling */
input[type='range'] {
  width: 100%;
}

/* Color input styling */
input[type='color'] {
  width: 100%;
  height: 38px;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

/* File input styling */
.form-file-input {
  cursor: pointer;
}

/* Multi-select styling */
select[multiple] {
  height: auto;
}

/* Form check spacing */
.form-check {
  margin-bottom: 0.5rem;
}

/* Legend styling */
legend {
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
}

/* Inline checkbox improvements */
.form-check-inline {
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

/* Input group styling */
.input-group {
  margin-bottom: 1rem;
}

.input-group:last-child {
  margin-bottom: 0;
}

/* Horizontal form improvements */
.col-form-label {
  padding-top: calc(0.375rem + 1px);
  padding-bottom: calc(0.375rem + 1px);
  margin-bottom: 0;
  font-weight: 500;
}

/* Button group alignment */
.d-flex.flex-wrap .btn {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.d-flex.flex-wrap .btn:last-child {
  margin-right: 0;
}
</style>
