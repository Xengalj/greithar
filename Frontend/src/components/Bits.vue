<template>
  <div class="container">
    <!--
      Splits:
      xs : Phone : 360px
      sm : Tablet : 800px
      md : Laptop : >
    -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="12" :md="6">
      </el-col>
    </el-row>

    <g-icon iconName="d20" iconSize="24px" iconColor="#CCC" />

    <el-tag size="small" effect="dark" type="primary" color="#FFAA00">
      CONTENT
    </el-tag>

    <el-divider style="max-width:50%">
      <h4> <g-icon iconSize="32px" iconName="magicSwirl" /> Classes </h4>
    </el-divider>

    <el-button @click="onClickEvent" size="large" type="primary" circle>
      CONTENT
    </el-button>
    <el-button v-loading="loading">Test 2</el-button>

    <el-input v-model="inputString" @input="onChangeEvent" aria-label="inputName">
      <template #prepend>
        BEFORE BOX
      </template>
      <template #prefix>
        INSIDE START
      </template>
      <template #append>
        INSIDE END
      </template>
      <template #suffix>
        AFETR BOX
      </template>
    </el-input>

    <el-input type="textarea" v-model="inputString" :autosize="{ minRows: 1, maxRows: 4 }" aria-label="textAreaName" />

    <el-input-number v-model="inputNumber" :min="0" :max="10" @change="onChangeEvent" aria-label="inputNumberName" />

    <!-- value-key needed for objects, not arrays -->
    <el-select v-model="selectArray/Object" value-key="objectKey" placeholder="placeholderName" aria-label="selectName" multiple>
      <template #tag>
        <el-tag v-for="(item, index) in selectArray/Object" :key="index" @close="closeEvent" effect="dark" closable>
          {{ selectArray/Object.name }}
        </el-tag>
      </template>
      <el-option v-for="item in optionsObject" :key="item.name" :label="item.name" :value="item" >
        OPTION TAG
      </el-option>
      <template #footer>
        FOOTER CONTENT
        <el-button v-if="!addingCondition" text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
      </template>
    </el-select>

    <el-tooltip placement="top" effect="light">
      HOVER HERE
      <template #content>
        STUFF IN POP-UP
      </template>
    </el-tooltip>

    <el-popconfirm title="MAIN QUESTION / CONTENT" @confirm="onConfirmEvent" hide-icon>
      <template #reference>
        <el-button type="primary" size="small">
          OPEN POP BUTTON
        </el-button>
      </template>
      <template #actions="{ confirm }">
        POP CONTENT
        <el-button @click="confirm" type="primary" size="small" aria-label="buttonName">
          CONFIRM
        </el-button>
      </template>
    </el-popconfirm>

  </div>
</template>
<script>
const icons = require('@/components/template/svgPaths.json');

export default {
  name: "Bits",
  data() {
    return {
      loading: true,

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

    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    // for (let [key, value] of Object.entries(OBJECT)) {}
    // capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    /***************************\
    *                           *
    *        ADMIN CHEAT        *
    *                           *
    \***************************/
    /*
    Items
      extras - Attack / Damage Ability Override       = atk/dmgAbilOverride

    */

    /***************************\
    *                           *
    *           IDEAS           *
    *                           *
    \***************************/
    /*
    - Remove redundant grey abil totals


    */


  },
};
</script>
