<template>
  <div>
    <page-title :heading="heading" :subheading="subheading" :icon="icon"></page-title>

    <div class="content">
      <!-- Horizontal Layout -->
      <div class="main-card mb-3 card">
        <div class="card-header">
          <div class="card-header-title font-size-lg text-capitalize fw-normal">
            <i class="header-icon pe-7s-albums icon-gradient bg-happy-fisher"></i>
            Chat
          </div>
        </div>
        <div class="card-body">
          <!-- <p class="text-muted mb-4">Form fields with labels positioned to the left of inputs.</p> -->
          <div>
            <div class="row">
              <div class="col-lg-12">
                <div class="main-card mb-3 card">
                  <div class="chat-boxes" ref="chatContainer">
                    <div
                      v-for="message in chatMessages"
                      :key="message.id"
                      :class="message.sender === 'AI' ? 'chat-box-left' : 'chat-box-right'"
                      class="chat-box"
                    >
                      <div class="chat-box-inner">
                        <div class="chat-box-user">{{ message.sender }}</div>
                        <div class="chat-box-message">{{ message.text }}</div>
                      </div>
                    </div>
                    <div v-if="waitForReply" class="waiting-for-reply">Thinking....</div>

                    <!--
                    <div class="chat-box chat-box-left">

                    </div>
                    <div class="chat-box chat-box-right">
                      <div class="chat-box-inner">
                        <div class="chat-box-user">You</div>
                        <div class="chat-box-message">Hi I, How can I help you</div>
                      </div>
                    </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form @submit.prevent="submitChatMessage">
            <b-row class="mb-3">
              <b-col sm="8">
                <b-form-input
                  class="text-input"
                  id="horizontalTextarea"
                  v-model="chatInput"
                  placeholder=""
                  rows="4"
                ></b-form-input>
              </b-col>
              <b-col sm="4">
                <div class="d-flex flex-wrap">
                  <b-button type="submit" @click="sendMessage" variant="primary" class="me-2 mb-2">
                    <i class="fas fa-paper-plane me-2"></i>
                    Submit
                  </b-button>
                  <b-button type="button" variant="outline-secondary" class="mb-2">
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
import PageTitle from '../../Layout/Components/PageTitle.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'FormLayouts',
  components: {
    PageTitle
  },
  data() {
    return {
      heading: 'Flip Sole - AI Assistant',
      subheading: 'Upload products here for commerce type of data',
      icon: 'pe-7s-graph text-success',

      backendEndpoint: import.meta.env.VITE_BACKEND_URL,
      auth: useAuthStore(),

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
      perPage: 50,
      filter: '',
      sortBy: 'name',
      sortDesc: false,

      // Table fields
      tableFields: [
        { key: 'id', label: 'ID', sortable: true, class: 'text-center' },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'sku', label: 'SKU', sortable: true },
        { key: 'price', label: 'Price', sortable: true },
        { key: 'brand', label: 'Brand', sortable: true }
      ],

      /*
      "sku": "100128",
      "name": "Asics Gel-Kayano",
      "price": 1400,
      "brand": "asics",
      "categories": ["shoe"],
      "description": "Asics Gel-Kayano provides advanced support and shock absorption using Gel technology, ideal for long-distance running. It comes with color emerald and amethyst"

      */

      projectId: '6469186e-d761-4664-a799-d0455074271b',
      userSession: null,
      productFields: [
        {
          name: 'Sledgers Loafer',
          sku: '111111',
          price: '3500',
          brand: 'Sledgers',
          categories: ['shoe'],
          description:
            'Step into effortless sophistication with the Sledgers Loafer Shoes, crafted for men who value both style and comfort. Designed with Sledgers’ signature lightweight technology, these loafers feature premium leather uppers, cushioned insoles, and flexible outsoles that keep you comfortable all day long.'
        }
      ],

      items: [],
      chatInput: '',

      chatMessages: [
        {
          id: 1,
          sender: 'AI',
          text: 'Hi, How can i help you ?'
        }
      ],
      waitForReply: false
    }
  },

  async created() {
    const userSession = await this.auth.getUserSession()

    console.log('userSession: ', userSession)

    this.userSession = userSession

    console.log('backendEndpoint: ', this.backendEndpoint)
    this.fetchProducts()
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
    scrollToBottom() {
      console.log('scrollToBottom')
      const container = document.querySelector('.chat-boxes')
      if (container) {
        container.scrollTop = container.scrollHeight + 200
      }
    },
    getRandomInt(min = 1, max = 1) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    async fetchProducts() {
      try {
        const res = await axios.get(this.backendEndpoint + '/commerce/products/list')

        console.log('products list', res.data.products)

        this.items = res.data.products

        console.log('this.items: ', this.items)
      } catch (e) {
        console.log('error: ', e.message)
      }
    },
    messagePopUp(title, text, icon, timer = 3000) {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showConfirmButton: true,
        timer: timer // closes after 2 seconds
      })
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

    submitChatMessage() {
      console.log('submitChatMessage')
    },

    async sendMessage() {
      console.log('sendMessage')

      try {
        this.waitForReply = true
        const params = { question: this.chatInput }
        console.log('params', params)

        this.chatMessages.push({
          id: this.getRandomInt(),
          sender: 'YOU',
          text: this.chatInput
        })

        setTimeout(() => {
          this.scrollToBottom()
        }, 500)

        const res = await axios.post(this.backendEndpoint + '/commerce/products/vector/query', params)

        const matchedProducts = res.data.matchedProducts
        const answer = res.data.answer

        this.chatMessages.push({
          id: this.getRandomInt(),
          sender: 'AI',
          text: answer
        })

        this.waitForReply = false
        this.chatInput = ''

        console.log('res', res)
      } catch (e) {
        console.log('error: ', e.message)
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

    async addSubmit() {
      console.log('addSubmit')

      try {
        const params = {
          projectId: this.projectId,
          items: this.productFields
        }

        console.log('this.userSession', this.userSession)

        const res = await axios.post(this.backendEndpoint + '/site/commerce/products/vector/upsert', params, {
          headers: {
            Authorization: `Bearer ${this.userSession}`
          }
        })

        console.log('add submit')

        this.fetchProducts()

        this.messagePopUp('Add/Update Product', 'New product added/update successfully.', 'success', 5000)
      } catch (err) {
        console.error('Error adding record:', err)
        this.messagePopUp('Add/Update Product', err.response.data.message, 'error', 5000)
      }
    },

    validateForm() {
      return (
        this.horizontalForm.email &&
        this.horizontalForm.password.length >= 6 &&
        this.horizontalForm.department &&
        this.horizontalForm.experience
      )
    },

    getValidationState(field) {
      return true

      /*if (field === 'name') {
        console.log('name', field)

        this.productFields.forEachChild(product => {
          if (product.name.length <= 0) return false
        })

        return this.productFields.name ? (this.productFields.name.length > 0 ? true : false) : null
      }
      return null*/
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
