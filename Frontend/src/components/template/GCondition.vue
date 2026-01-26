<template v-if="condition.name">
  <h3>
    <el-row :gutter="10" justify="space-between" align="middle">
      {{ condition.name }}
      <el-switch v-model="advanced" inline-prompt active-text="Advanced" inactive-text="Normal" aria-label="Advanced Mode Switch" />
    </el-row>
  </h3>

  <div v-if="condition.name">
    <el-row :gutter="10" style="margin-bottom:10px;">
      <el-col :xs="24" :sm="12">
        <div>&nbsp;</div>
        <el-input v-model="condition.name" aria-label="Condition Name">
          <template #prepend> Name </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="center-horz"> Description </div>
        <el-input type="textarea" v-model="condition.description" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Enter condition description" />
      </el-col>
    </el-row>

    <el-divider> Bonuses </el-divider>
    <el-row :gutter="10" justify="center">
      <el-col :xs="12" :span="5" justify="center"> <span v-if="Object.keys(condition.bonuses).length"> Name </span> </el-col>
      <el-col :xs="12" :span="6"> <span v-if="Object.keys(condition.bonuses).length"> Value </span> </el-col>
      <el-col :xs="12" :span="6"> <span v-if="Object.keys(condition.bonuses).length"> Type </span> </el-col>
      <el-col :xs="12" :span="4"> <span v-if="Object.keys(condition.bonuses).length"> Targets </span> </el-col>
      <el-col :xs="24" :span="3">
        <el-button size="small" type="success" @click="addBonus()" style="margin-bottom:5px;"> Add Bonus </el-button>
      </el-col>
    </el-row>
    <el-row v-for="(bonus, name) in condition.bonuses" :key="name" :gutter="10" align="middle" style="margin-bottom:5px;">
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
            <el-button type="danger" size="small" @click="delete condition.bonuses[name];"> Yes </el-button>
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
            <el-button type="danger" size="small" @click="delete condition.bonuses[name];"> Yes </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>

    <el-divider>Extras</el-divider>
    <el-row :gutter="10" align="middle">
      <el-col :xs="24" :sm="12">
        <el-row v-if="!condition.extras.duration" :gutter="10" justify="center" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8"> </el-col>
          <el-col :xs="12" :sm="12">
            <el-button size="small" type="success" @click="condition.extras.duration = { left: 0, label: '' }"> Add Duration </el-button>
          </el-col>
        </el-row>

        <el-row v-if="condition.extras.duration" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Time Left </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-input-number v-model="condition.extras.duration.left" aria-label="Condition Duration Left" />
          </el-col>
        </el-row>

        <el-row v-if="condition.extras.duration" :gutter="10" style="margin-bottom:5px;">
          <el-col :xs="12" :sm="8">
            <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Duration Label </el-tag>
          </el-col>
          <el-col :xs="12" :sm="12">
            <el-input v-model="condition.extras.duration.label" aria-label="Ablity Uses Label" />
          </el-col>
        </el-row>
      </el-col>

      <el-col :xs="24" :sm="12">
        <el-row :gutter="10" justify="center" style="margin-bottom:5px;">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Notes </el-tag>
          &nbsp; &nbsp; &nbsp;
          <el-button @click="condition.extras.notes.push('');" type="success" >
            <g-icon iconSize="16px" iconColor="#FFF" iconName="createScroll" />
          </el-button>
        </el-row>

        <el-row v-for="(note, index) in condition.extras.notes" :key="index" :gutter="10" style="margin-bottom:5px;">
          <el-col :span="22">
            <el-input type="textarea" v-model="condition.extras.notes[index]" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${condition.name} note #${index}`" />
          </el-col>

          <el-col :span="2">
            <el-popconfirm title="Are you sure to delete this?">
              <template #reference>
                <el-button type="danger" circle size="small">
                  <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="condition.extras.notes.splice(index, 1);"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div v-if="advanced">
      <el-divider>Advanced</el-divider>
      OBJECT CODE:
      <div v-for="(item, name) in condition" :key="name">
        {{ name }} : {{ item }}
      </div>
    </div>

    <el-row :gutter="10" justify="space-around">
      <el-button @click="reset()" type="warning"> Reset </el-button>
      <el-button @click="saveCondition()" type="primary"> Save </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'g-condition',
  emits: ['save-condition'],
  props: { source: { type: Object } },
  data() {
    return {
      condition: {},
      original: {},
      newBonusName: "",
      advanced: this.$store.state.auth.user.roles.includes('admin'),
      selects: {
        "targets": [],
        "bonusTypes": []
      },
    }
  },
  mounted() {
    this.selects.targets = this.rules.targets;
    this.selects.bonusTypes = Object.keys(this.rules.bonuses);
    this.selects.bonusTypes.push( "Untyped" );
    this.condition = this.source;
    this.original = JSON.stringify(this.source);
  },
  updated() {
    if (this.source.name != this.condition.name) {
      this.condition = this.source;
      this.original = JSON.stringify(this.source);
    }
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
  },
  methods: {
    saveCondition() { this.$emit('save-condition'); },
    addBonus() {
      this.condition.bonuses[this.condition.name.concat(" ", Object.keys(this.condition.bonuses).length+1)] = {
        value: 0,
        type: "Untyped",
        targets: []
      };
    },
    reset() {
      this.condition = {};
      let old = JSON.parse(this.original);
      for (let [prop, value] of Object.entries(old)) {
        this.condition[prop] = value;
      }
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>
