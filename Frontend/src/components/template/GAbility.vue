<template v-if="ability.name">
  <h3>
    <el-row :gutter="10" justify="space-between" align="middle">
      {{ ability.name }}
      <el-switch v-model="advanced" inline-prompt active-text="Advanced" inactive-text="Normal" aria-label="Advanced Mode Switch" />
    </el-row>
  </h3>

  <div v-if="ability.name">
    <el-row :gutter="10" style="margin-bottom:10px;">
      <el-col :xs="24" :sm="12">
        <div>&nbsp;</div>
        <el-input v-model="ability.name" aria-label="Ability Name">
          <template #prepend> Name </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="center-horz"> Description </div>
        <el-input type="textarea" v-model="ability.description" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Enter item description" />
      </el-col>
    </el-row>

    <el-row :gutter="10" align="middle">
      <el-col :xs="24" :sm="12">
        <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Trigger </el-tag>
        <el-select v-model="ability.trigger" style="width:75%">
          <el-option v-for="trigger in selects.trigger" :key="trigger.label" :label="trigger.label" :value="trigger.value" >
            <div class="flex items-center">
              <el-tag :color="trigger.color" style="margin-right: 8px" size="small" />
              <span :style="{ color: trigger.color }"> {{ trigger.label }} </span>
            </div>
          </el-option>
        </el-select>
        <div class="center-horz">
          <el-switch v-model="ability.extras.showMain" active-text="Show on Main Tab" inactive-text="Only Abilitys Tab" inline-prompt />
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" v-if="ability.extras.showMain">
        <el-input v-model="ability.shortText" placeholder="Text on Main Tab">
          <template #prepend> Short Text </template>
        </el-input>
        <el-input v-model="ability.location" placeholder="Where text goes" :disabled="!advanced">
          <template #prepend> Location </template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider> Bonuses </el-divider>
    <el-row :gutter="10" justify="center">
      <el-col :xs="12" :span="5" justify="center"> <span v-if="Object.keys(ability.bonuses).length"> Name </span> </el-col>
      <el-col :xs="12" :span="6"> <span v-if="Object.keys(ability.bonuses).length"> Value </span> </el-col>
      <el-col :xs="12" :span="6"> <span v-if="Object.keys(ability.bonuses).length"> Type </span> </el-col>
      <el-col :xs="12" :span="4"> <span v-if="Object.keys(ability.bonuses).length"> Targets </span> </el-col>
      <el-col :xs="24" :span="3">
        <el-button size="small" type="success" @click="addBonus()" style="margin-bottom:5px;"> Add Bonus </el-button>
      </el-col>
    </el-row>
    <el-row v-for="(bonus, name) in ability.bonuses" :key="name" :gutter="10" align="middle" style="margin-bottom:5px;">
      <el-col :xs="10" :span="5">
        <el-tag type="primary" effect="dark" size="large" style="margin-left:5px;"> {{ name }} </el-tag>
      </el-col>

      <el-col :xs="2" :span="0">
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
      <el-col :xs="10" :span="6"> <el-input-number v-model="bonus.value" /> </el-col>

      <el-col :xs="12" :span="6">
        <el-select v-model="bonus.type" filterable allow-create default-first-option :reserve-keyword="false" placeholder="Modifier Target" >
          <el-option v-for="type in selects.bonusTypes" :key="type" :label="type" :value="type" />
        </el-select>
      </el-col>
      <el-col :xs="12" :span="6">
        <el-select
          v-model="bonus.targets"
          value-key="name"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
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

      <el-col :xs="0" :span="1" class="center-horz center-vert">
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
    <el-row :gutter="10" align="middle">
      <el-col :xs="24" :sm="12">
        <el-row v-if="ability.extras" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8"> </el-col>
          <el-col :xs="12" :sm="12">
            <el-switch v-model="ability.extras.active" active-text="Ability is Active" inactive-text="Inactive" inline-prompt />
          </el-col>
        </el-row>

        <el-row v-if="ability.extras.category" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8"> Category </el-col>
          <el-col :xs="12" :sm="12">
            <el-select v-model="ability.extras.category">
              <el-option v-for="trigger in selects.abilityTypes" :key="trigger" :label="trigger" :value="trigger" >
                {{ trigger }}
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row v-if="!ability.extras.uses" :gutter="10" justify="center" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8"> </el-col>
          <el-col :xs="12" :sm="12">
            <el-button size="small" type="success" @click="ability.extras.uses = { left: 0, total: 0, label: '', color: '' }"> Add Uses </el-button>
          </el-col>
        </el-row>

        <el-row v-if="ability.extras.uses" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Uses Left </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-input-number v-model="ability.extras.uses.left" aria-label="Ablity Uses Left" />
          </el-col>
        </el-row>

        <el-row v-if="ability.extras.uses" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Uses Total </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-input-number v-model="ability.extras.uses.total" aria-label="Ablity Total Uses"/>
          </el-col>
        </el-row>

        <el-row v-if="ability.extras.uses" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Uses Label </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-input v-model="ability.extras.uses.label" aria-label="Ablity Uses Label" />
          </el-col>
        </el-row>

        <el-row v-if="ability.extras.uses" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Uses Color </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-color-picker v-model="ability.extras.uses.color" :predefine="[ '#4167F0', '#FFDE0A', '#E63415', '#bfef45', '#ADD8E6', '#42d4f4', '#E63415', '#911eb4', '#f032e6', '#71797E' ]"  aria-label="Ablity Uses Color" />
          </el-col>
        </el-row>
      </el-col>

      <el-col :xs="24" :sm="12">
        <el-row :gutter="10" justify="center" style="margin-bottom:5px;">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Notes </el-tag>
          &nbsp; &nbsp; &nbsp;
          <el-button @click="ability.extras.notes.push('');" type="success" >
            <g-icon iconSize="16px" iconColor="#FFF" iconName="createScroll" />
          </el-button>
        </el-row>

        <el-row v-for="(note, index) in ability.extras.notes" :key="index" :gutter="10" style="margin-bottom:5px;">
          <el-col :span="22">
            <el-input type="textarea" v-model="ability.extras.notes[index]" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${ability.name} note #${index}`" />
          </el-col>

          <el-col :span="2">
            <el-popconfirm title="Are you sure to delete this?">
              <template #reference>
                <el-button type="danger" circle size="small">
                  <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="ability.extras.notes.splice(index, 1);"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div v-if="advanced">
      <el-divider>Advanced</el-divider>
      <el-row v-if="ability.extras.source" :gutter="10" style="margin-bottom:5px;">
        <el-col :xs="12" :sm="8">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Source Class </el-tag>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-input v-model="ability.extras.source.class" aria-label="Ablity Source Class" />
        </el-col>
      </el-row>
      <el-row v-if="ability.extras.source" :gutter="10" style="margin-bottom:5px;">
        <el-col :xs="12" :sm="8">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Source Level </el-tag>
        </el-col>
        <el-col :xs="12" :sm="12">
          <el-input-number v-model="ability.extras.source.level" aria-label="Ability Source Level"/>
        </el-col>
      </el-row>

      OBJECT CODE:
      <div v-for="(item, name) in ability" :key="name">
        {{ name }} : {{ item }}
      </div>
    </div>

    <el-row :gutter="10" justify="space-around">
      <el-button @click="reset()" type="warning"> Reset </el-button>
      <el-button @click="saveAbil()" type="primary"> Save </el-button>
    </el-row>
  </div>

</template>

<script>
export default {
  name: 'g-ability',
  emits: ['save-abil'],
  props: { source: { type: Object } },
  data() {
    return {
      ability: {},
      original: {},
      newBonusName: "",
      advanced: this.$store.state.auth.user.roles.includes('admin'),
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
        "abilityTypes": [ "Race", "Trait", "Class", "Feat", "Other" ],
        "targets": [],
        "bonusTypes": []
      },
    }
  },
  mounted() {
    this.selects.targets = this.rules.targets;
    this.selects.bonusTypes = Object.keys(this.rules.bonuses);
    this.ability = this.source;
    this.original = JSON.stringify(this.source);
  },
  updated() {
    if (this.source.name != this.ability.name) {
      this.ability = this.source;
      this.original = JSON.stringify(this.source);
    }
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
  },
  methods: {
    saveAbil() { this.$emit('save-abil'); },
    addBonus() {
      this.ability.bonuses[this.ability.name.concat(" ", Object.keys(this.ability.bonuses).length+1)] = {
        value: 0,
        type: "Morale",
        targets: []
      };
    },
    reset() {
      this.ability = {};
      let old = JSON.parse(this.original);
      for (let [prop, value] of Object.entries(old)) {
        this.ability[prop] = value;
      }
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>
