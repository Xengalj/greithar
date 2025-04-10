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
        <div v-if="!['Description', 'Cost', 'Weight', 'Extras'].includes(prop)">
          <el-row :gutter="5">
            <el-col :span="10">{{ prop }}</el-col>
            <el-col :span="10">
              <el-select v-if="Object.keys(selects).includes(prop)" v-model="item.value[prop]" multiple>
                <template #tag>
                  <el-tag v-for="element in item.value[prop]" effect="dark" :key="element"> {{ element }} </el-tag>
                </template>
                <el-option v-for="element in selects[prop]" :key="element.label" :label="element.label" :value="element.value" >
                  <div class="flex items-center">
                    <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                    <span :style="{ color: element.color }">{{ element.label }}</span>
                  </div>
                </el-option>
              </el-select>
              <el-input v-else-if="!Array.isArray(value)" v-model="item.value[prop]" />
            </el-col>
          </el-row>
        </div>
      </div>

      <el-divider>Extras</el-divider>
      <!-- Masterwork, Abilities, (Magic) Enhancement, Notes -->
      <el-row v-for="(value, prop) in item.value.Extras" :key="prop" :gutter="5">
        <el-col :span="6">
          {{ prop }}
        </el-col>
        <el-col :span="18">
          <el-checkbox v-if="prop == 'Masterwork'" v-model="item.value.Extras[prop]" style="margin:0;"/>
          <el-input-number v-if="prop == 'Enhancement'" v-model="item.value.Extras[prop]" />
          <div v-if="prop == 'Notes'">
            <el-input
              v-for="(note, index) in item.value.Extras[prop]" :key="index"
              v-model="item.value.Extras[prop][index]"
              placeholder="New Note"
            >
            <template #append>
              <el-button @click="deleteNote(index)" style="display: flex;">
                <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
              </el-button>
            </template>
            </el-input>

            <el-button size="small" type="primary" @click="addNote()">Add Note</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-button size="small" type="warning" @click="reset()">Reset</el-button>
      <el-button v-if="newItem" size="small" type="primary" @click="saveItem()">Save</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'g-item',
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
    rules() { return this.$store.state.data.rules; },
    equipment() { return this.$store.state.data.equipment; },
    item() { return this.source; }
  },
  methods: {
    addNote() {
      this.item.value.Extras['Notes'].push('');
    },
    deleteNote(index) {
      this.item.value.Extras['Notes'].splice(index, 1);
    },
    saveItem() {
      this.$emit('save-item', this.item);
    },
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
