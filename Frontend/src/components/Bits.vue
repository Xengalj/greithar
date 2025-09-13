<template>
  <div class="container">

    <!--
      Splits:
      XS : Phone : 360px
      sm : Tablet : 800px
      LG : Laptop : >
    -->

    <el-row :gutter="10" justify="center" align="middle">
      <div v-for="(icon, name, index) in icons" :key="index" class="center-horz" style="margin: 5px;">
        <el-button size="large" type="primary" circle>
          <g-icon iconSize="24px" :iconName="name" />
        </el-button>
        <br>
        {{ name }}
      </div>
    </el-row>
    <el-divider />

    <el-row>
      <el-col :xs="22" :sm="12" :md="6">
        <el-input v-model="nameSearch" @input="searchByName" aria-label="Item Name">
          <template #prepend>
            <g-icon iconSize="20px" iconName="search" />
            Search
          </template>
        </el-input>
      </el-col>
    </el-row>


    <el-tag :color="item.color" type="info" size="small" effect="dark" />


    <el-tooltip placement="top" effect="light">
      HOVER HERE
      <template #content>
        STUFF IN POP-UP
      </template>
    </el-tooltip>




  </div>
</template>

<script>
const icons = require('@/components/template/svgPaths.json');

export default {
  name: "Bits",
  data() {
    return {
      colors: [
        { value: '#E63415', label: 'Red' },
        { value: '#FF6600', label: 'Orange' },
        { value: '#FFDE0A', label: 'Yellow' },

        { value: '#3cb44b', label: 'Green' },
        { value: '#4167F0', label: 'Blue' },
        { value: '#911eb4', label: 'Purple' },

        { value: '#800000', label: 'Maroon' },
        { value: '#bfef45', label: 'Lime' },
        { value: '#1EC79D', label: 'Teal' },

        { value: '#42d4f4', label: 'Cyan' },
        { value: '#000075', label: 'Navy' },
        { value: '#f032e6', label: 'Magenta' },

        { value: '#ffd8b1', label: 'Apricot' },
        { value: '#aaffc3', label: 'Mint' },
        { value: '#dcbeff', label: 'Lavender' }
      ],
    };
  },
  mounted() {
    this.$message({ message: "Resting for 8 hours", type: "success" });
  },
};
</script>
