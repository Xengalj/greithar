<template>
  <div class="crd">
    <el-row :gutter="5">
      <el-col :span="5">
        <el-input v-model="item.label" size="small" placeholder="Item Name" />
      </el-col>
      <el-col :span="10">
        <el-input v-model="item.value.Description" :rows="2" type="textarea" placeholder="Enter item description" />
      </el-col>

      <el-col :span="9">
        <el-row>
          <el-input-number v-model="item.value.Cost" :precision="2" placeholder="Cost">
            <template #suffix>
              <span>gp</span>
            </template>
          </el-input-number>
        </el-row>
        <el-row>
          <el-input-number v-model="item.value.Weight" :precision="2" placeholder="Weight">
            <template #suffix>
              <span>lbs</span>
            </template>
          </el-input-number>
        </el-row>
      </el-col>
    </el-row>
    <div class="">
      <div v-for="(value, prop) in item.value" :key="prop">
        <div v-if="!['Description', 'Cost', 'Weight'].includes(prop)">
          {{ prop }} : {{ value }}
        </div>

        <!--
        prop name   input[value]

        if damage -> use size

        if value == array -> use select?
       -->
      </div>
    </div>

    <el-row>
      <el-col :span="3" class="addCondition">
        <el-button size="small" type="warning" @click="reset()">Reset</el-button>
      </el-col>
    </el-row>
    {{ item }}
  </div>
</template>

<script>
export default {
  name: 'g-item',
  props: { source: { type: Object } },
  data() {
    return {
      armorStats: [ "AC Bonus", "Max Dex", "Penalty", "Spell Failure", "Cost", "Weight", "Proficiency", "Description", "Special", "Extras", "targets" ],
      weaponStats: [ "Damage", "Critical", "Range", "Damage Type", "Proficiency", "Category", "Group", "Cost", "Weight", "Description", "Special", "Extras" ],
      /*
      bonusTargets = this.rules
      damageTypes = this.rules
      groups = this.general
      */
    }
  },
  mounted() {},
  computed: {
    rules() { return this.$store.state.data.rules; },
    equipment() { return this.$store.state.data.equipment; },
    item() {
      console.log(this.source);
      let item = Object.keys(this.source).length ? this.source : {
        label: "",
        value: {
          Description: "",
          Cost: 0,
          Weight: 0
        }
      };

      return item;
    }
  },
  methods: {
    reset() {
      this.$message({ message: "NOT YET IMPLEMENTED", type: "warning" });
      // this.item = this.equipment[item]

    }
  }
}
</script>

<style scoped>
</style>
