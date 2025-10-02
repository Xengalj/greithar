<template>
  <h3> {{ item.label }} </h3>

  <!-- Basic Item Properties -->
  <el-row :gutter="5" justify="center" align="middle">
    <el-col :span="6">
      <el-input v-model="item.label" size="large" placeholder="Item Name" aria-label="Item Name" />
    </el-col>
    <el-col :span="12">
      <el-input v-model="item.value.Description" :rows="2" type="textarea" placeholder="Enter item description" aria-label="Item Description" />
    </el-col>
    <el-col :span="5">
      <el-row>
        <el-input-number v-model="item.value.Cost" :precision="2" placeholder="Cost" aria-label="Item Cost">
          <template #suffix>
            <span> gp </span>
          </template>
        </el-input-number>
      </el-row>
      <el-row>
        <el-input-number v-model="item.value.Weight" :precision="2" placeholder="Weight" aria-label="Item Weight">
          <template #suffix>
            <span> lbs </span>
          </template>
        </el-input-number>
      </el-row>
    </el-col>
  </el-row>

  <!-- Specific Item Properties -->
  <div>
    <el-divider> Specifics </el-divider>
    <div v-for="(value, prop) in item.value" :key="prop">
      <div v-if="!['Description', 'Cost', 'Weight', 'Extras', 'Damage'].includes(prop)">
        <el-row :gutter="5" justify="center">
          <el-col :span="4"> {{ prop }} </el-col>
          <el-col :span="12">
            <el-select v-if="Object.keys(selects).includes(prop)" v-model="item.value[prop]" :aria-label="`Item ${prop}`" multiple>
              <template #tag>
                <el-tag v-for="(element, index) in item.value[prop]" effect="dark" :key="element" closable @close="item.value[prop].splice(index, 1)"> {{ element }} </el-tag>
              </template>
              <el-option v-for="element in selects[prop]" :key="element.label" :label="element.label" :value="element.value" >
                <div class="flex items-center">
                  <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                  <span :style="{ color: element.color }"> {{ element.label }} </span>
                </div>
              </el-option>
            </el-select>
            <el-input v-else-if="!Array.isArray(value)" v-model="item.value[prop]" :aria-label="`Item ${prop}`"/>
          </el-col>
          <el-col :span="2">
            <el-button @click="deleteProperty(prop)" circle>
              <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="center-horz" style="margin-top: 10px">
      <el-popconfirm title="Add New Property?" @confirm="addProperty" hide-icon>
        <template #reference>
          <el-button size="small" type="info"> Add Property </el-button>
        </template>
        <template #actions="{ confirm }">
          <el-input v-model="propName" size="small" placeholder="Property Name" style="margin-bottom:5px;" aria-label="New Property Name" />
          <el-button type="success" size="small" @click="confirm" :disabled="propName == ''"> Yes </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>

  <!-- Item Damage -->
  <div v-if="item.value.Damage">
    <el-divider> Damage </el-divider>
    <el-input
      v-for="(value, prop) in item.value.Damage" :key="prop"
      v-model="item.value.Damage[prop]"
      :aria-label="`${capFirsts(prop)} Damage`"
      style="width: 30%; margin: 0 5px;"
    >
      <template #prepend> {{ prop }} </template>
    </el-input>
  </div>

  <!-- Item Extras -->
  <div>
    <el-divider> Extras </el-divider>
    <el-row v-for="(value, prop) in item.value.Extras" :key="prop" :gutter="5">
      <el-col :span="6"> {{ prop }} </el-col>
      <el-col :span="18">
        <el-checkbox v-if="prop == 'Masterwork'" v-model="item.value.Extras[prop]" style="margin:0;" aria-label="Is Item Masterwork?" />
        <el-input-number v-if="prop == 'Enhancement'" v-model="item.value.Extras[prop]" aria-label="Is Item Magic?" />
        <div v-if="prop == 'Notes'">
          <el-input
            v-for="(note, index) in item.value.Extras[prop]" :key="index"
            v-model="item.value.Extras[prop][index]"
            :aria-label="`Item Note ${index}`"
            placeholder="New Note"
          >
            <template #append>
              <el-button @click="deleteNote(index)" style="display: flex;">
                <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
              </el-button>
            </template>
          </el-input>
          <el-button size="small" type="primary" @click="addNote()"> Add Note </el-button>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-row justify="end">
    <el-button size="small" type="warning" @click="reset()"> Reset </el-button>
    <el-button v-if="newItem" size="small" type="primary" @click="saveItem()"> Save </el-button>
  </el-row>
</template>

<script>
export default {
  name: 'g-item',
  emits: ['save-item'],
  props: {
    source: { type: Object },
    newItem: { type: Boolean }
  },
  data() {
    return {
      original: {},
      selects: {
        "Damage Type": [],
        "Group": [],
        "targets": []
      },
      propName: '',
    }
  },
  mounted() {
    this.selects["Damage Type"] = this.rules["Damage Types"].Weapon;
    this.selects.Group = this.rules["Weapon Groups"];
    this.selects.targets = this.rules.targets;
    this.original = JSON.stringify(this.source);
  },
  updated() {
    this.original = JSON.stringify(this.source);
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    item() { return this.source; }
  },
  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    addNote() { this.item.value.Extras['Notes'].push(''); },
    deleteNote(index) { this.item.value.Extras['Notes'].splice(index, 1); },

    addProperty() { this.item.value[this.propName] = ''; },
    deleteProperty(property) { delete this.item.value[property]; },

    saveItem() { this.$emit('save-item', this.item); },
    reset() {
      let old = JSON.parse(this.original);
      this.item.label = old.label;
      this.item.value = old.value;
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>

<style scoped>
</style>
