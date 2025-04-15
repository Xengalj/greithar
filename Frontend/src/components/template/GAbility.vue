<template>
  <h3> {{ name }} </h3>
  <div v-if="name">
    <el-row :gutter="5" style="margin-bottom:10px;">
      <el-col :span="5" class="center-horz">
        <div> Name </div>
        <el-tag type="primary" effect="dark" size="large"> {{ name }} </el-tag>
      </el-col>
      <el-col :span="14">
        <div class="center-horz"> Description </div>
        <el-input v-model="ability.description" :rows="2" type="textarea" placeholder="Enter item description" />
      </el-col>
      <el-col :span="5">
        <div class="center-horz"> Trigger </div>
        <el-select v-model="ability.trigger" lbael="Trigger">
          <el-option v-for="trigger in selects.trigger" :key="trigger.label" :label="trigger.label" :value="trigger.value" >
            <div class="flex items-center">
              <el-tag :color="trigger.color" style="margin-right: 8px" size="small" />
              <span :style="{ color: trigger.color }"> {{ trigger.label }} </span>
            </div>
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="5" style="margin-bottom:10px;">
      <el-col :span="10">
        <div class="center-horz"> Prerequisites </div>
        <el-input v-model="ability.prerequisites" :rows="2" type="textarea" :disabled="!advanced" />
      </el-col>

      <el-col :span="14">
        <div class="center-horz"> Benefit </div>
        <el-input v-model="ability.benefit.text" placeholder="Text on Main Tab">
          <template #prepend> Text </template>
        </el-input>
        <el-input v-model="ability.benefit.target" placeholder="Where text goes" :disabled="!advanced">
          <template #prepend> Target </template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider> Bonuses </el-divider>
    <el-row class="center-horz" :gutter="5">
      <el-col :span="5"> <span v-if="Object.keys(ability.bonuses).length"> Name </span> </el-col>
      <el-col :span="3"> <span v-if="Object.keys(ability.bonuses).length"> Type </span> </el-col>
      <el-col :span="4"> <span v-if="Object.keys(ability.bonuses).length"> Value </span> </el-col>
      <el-col :span="9"> <span v-if="Object.keys(ability.bonuses).length"> Targets </span> </el-col>
      <el-col :span="3">
        <el-button size="small" type="primary" @click="addBonus()" style="margin-bottom:5px;"> Add Bonus </el-button>
      </el-col>
    </el-row>
    <el-row v-for="(bonus, name) in ability.bonuses" :key="name" :gutter="5" style="margin-bottom:5px;">
      <el-col :span="5" class="center-horz">
        <el-tag type="primary" effect="dark" size="large" style="margin-left:5px;"> {{ name }} </el-tag>
      </el-col>
      <el-col :span="3">
        <el-input v-model="bonus.type" />
      </el-col>
      <el-col :span="4">
        <el-input-number v-model="bonus.value" style="width:120px;"/>
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="bonus.targets"
          value-key="name"
          size="small"
          multiple
          placeholder="Modifier Target"
        >
          <template #tag>
            <el-tag v-for="(target, index) in bonus.targets" :key="target" effect="dark" closable @close="bonus.targets.splice(index, 1)"> {{ target }} </el-tag>
          </template>
          <el-option v-for="item in selects.targets" :key="item.label" :label="item.label" :value="item.value" >
            <div class="flex items-center">
              <el-tag :color="item.color" style="margin-right: 8px" size="small" />
              <span :style="{ color: item.color }"> {{ item.label }} </span>
            </div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input v-if="advanced" v-model="customTarget" placeholder="Enter custom target string">
          <template #append>
            <el-button @click="bonus.targets.push(customTarget); customTarget='';"> Add </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="2" class="center-horz center-vert">
        <el-popconfirm title="Are you sure to delete this?">
          <template #reference>
            <el-button type="danger" circle size="small">
              <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
            </el-button>
          </template>
          <template #actions="">
            <el-button type="danger" size="small" @click="delete ability.bonuses[name];"> Yes </el-button>
          </template>
        </el-popconfirm>
      </el-col>

    </el-row>

    <el-divider>Extras</el-divider>
    <div style="margin-bottom:25px;">
      <el-row v-for="(value, prop) in ability.extras" :key="prop" :gutter="5">
        <el-col :span="6" style="text-align:right"> {{ prop }} </el-col>
        <el-col :span="18">
          <el-checkbox v-if="prop == 'active'" v-model="ability.extras[prop]" style="margin:0;"/>
          <el-input v-else-if="prop == 'source'" v-model="ability.extras[prop]" placeholder="What kind of ability is this" />
          <div v-else> {{ value }} </div>
        </el-col>
      </el-row>
    </div>

{{ ability }}

    <div>
      <el-button type="info" @click="advanced = advanced ? false : true;"> Toggle Advanced Mode </el-button>
      <el-button type="warning" @click="reset()"> Reset </el-button>
      <el-button v-if="newAbil" type="primary" @click="saveAbil()"> Save </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'g-ability',
  emits: ['saveAbil'],
  props: {
    newAbil: { type: Boolean },
    name: { type: String },
    source: { type: Object }
  },
  data() {
    return {
      original: { name: "", text: "" },
      newBonusName: "",
      advanced: false,
      customTarget: "",
      selects: {
        "trigger": [
          { "color": "#E63415", "label": "Continuous",  "value": "Continuous" },
          { "color": "#FF6600", "label": "Standard",    "value": "Standard" },
          { "color": "#FFDE0A", "label": "Move",        "value": "Move" },
          { "color": "#3cb44b", "label": "Full-Round",  "value": "Full-Round" },
          { "color": "#1EC79D", "label": "Swift",       "value": "Swift" },
          { "color": "#4167F0", "label": "Immediate",   "value": "Immediate" },
          { "color": "#911eb4", "label": "Free",        "value": "Free" }
        ],
        "targets": []
      },
    }
  },
  mounted() {
    this.selects.targets = this.rules.targets;
    this.original.name = this.name;
    this.original.text = JSON.stringify(this.source);
  },
  updated() {
    if (this.name != this.original.name) {
      this.original.name = JSON.stringify(this.name);
      this.original.text = JSON.stringify(this.source);
    }
  },
  computed: {
    rules() { return this.$store.state.data.rules; },
    equipment() { return this.$store.state.data.equipment; },
    ability() { return this.source; }
  },
  methods: {
    saveAbil() {
      let newAbil = {};
      newAbil[this.name] = this.ability;
      this.$emit('save-abil', newAbil);
    },
    addBonus() {
      let name = this.name;
      this.ability.bonuses[name.concat(" ", Object.keys(this.ability.bonuses).length)] = {
        type: "Feat",
        value: 0,
        targets: []
      };
    },
    reset() {
      let old = JSON.parse(this.original.text);
      for (let [prop, value] of Object.entries(old)) {
        this.ability[prop] = value;
      }
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>

<style scoped>
</style>
