<template>
  <div>
    <b-row class="mb-3">
      <label for="horizontalEmail" class="col-sm-3 col-form-label">Name</label>
      <b-col sm="9">
        <b-form-input
          id="name"
          v-model="productFields.name"
          type="text"
          placeholder=""
          :state="getValidationState('name')"
          required
        ></b-form-input>
        <b-form-invalid-feedback> Please enter product name. </b-form-invalid-feedback>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'TextField',

  data() {
    return {
      name: 'Name'
    }
  }
}
</script>
