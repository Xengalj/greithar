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

  <!-- Buttons -->
  <div class="center-horz" style="margin-top: 10px">
    <el-popconfirm title="Add New Property?" @confirm="addProperty" hide-icon>
      <template #reference>
        <el-button size="small" type="primary"> Add Property </el-button>
      </template>
      <template #actions="{ confirm }">
        <el-input v-model="propName" size="small" placeholder="Property Name" style="margin-bottom:5px;" aria-label="New Property Name" />
        <el-button type="success" size="small" @click="confirm" :disabled="propName == ''"> Yes </el-button>
      </template>
    </el-popconfirm>

    <el-popconfirm title="Add damage to item?" @confirm=" item.value.Damage = {'fine':'0','diminuitive':'1','tiny':'1d2','small':'1d3','medium':'1d4','large':'1d6','huge':'1d8','gargantuan':'2d6','colossal':'3d6'} " hide-icon>
      <template #reference>
        <el-button size="small" type="primary"> Add Damage </el-button>
      </template>
      <template #actions="{ confirm }">
        <el-button type="success" size="small" @click="confirm"> Yes </el-button>
      </template>
    </el-popconfirm>

    <el-popconfirm title="Add bonus to item?" @confirm=" if(!item.value.Bonuses){item.value.Bonuses={};} item.value.Bonuses[`${item.label} ${Object.keys(item.value.Bonuses).length}`] = {}; " hide-icon>
      <template #reference>
        <el-button size="small" type="primary"> Add Bonus </el-button>
      </template>
      <template #actions="{ confirm }">
        <el-button type="success" size="small" @click="confirm"> Yes </el-button>
      </template>
    </el-popconfirm>
  </div>

  <!-- Major Item Properties -->
  <el-divider> Properties </el-divider>
  <div v-for="(value, prop) in item.value" :key="prop">
    <div v-if="!['Description', 'Cost', 'Weight', 'Extras', 'Damage', 'Ammount', 'Bonuses'].includes(prop)">
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

  <!-- Item Damage -->
  <div v-if="item.value.Damage" class="center-horz">
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

  <!-- Item Bonuses -->
  <div v-if="item.value.Bonuses">
    <el-divider> Bonuses </el-divider>
    <el-row class="center-horz" :gutter="5">
      <el-col :span="5"> Name </el-col>
      <el-col :span="6"> Type </el-col>
      <el-col :span="6"> Value </el-col>
      <el-col :span="6"> Targets </el-col>
    </el-row>

    <el-row v-for="(bonus, name) in item.value.Bonuses" :key="name" :gutter="10" align="middle" style="margin-bottom:5px;">
      <el-col :span="5" class="center-horz">
        <el-tag type="primary" effect="dark" size="large" style="margin-left:5px;"> {{ name }} </el-tag>
      </el-col>
      <el-col :span="6">
        <el-input v-model="bonus.type" />
      </el-col>
      <el-col :span="6">
        <el-input-number v-model="bonus.value"/>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="bonus.targets"
          value-key="name"
          size="small"
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
          <el-option v-for="target in selects.targets" :key="target.label" :label="target.label" :value="target.value" >
            <div class="flex targets-center">
              <el-tag :color="target.color" style="margin-right: 8px" size="small" />
              <span :style="{ color: target.color }"> {{ target.label }} </span>
            </div>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1" class="center-horz center-vert">
        <el-popconfirm title="Are you sure to delete this?">
          <template #reference>
            <el-button type="danger" circle size="small">
              <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
            </el-button>
          </template>
          <template #actions="">
            <el-button type="danger" size="small" @click="delete item.value.Bonuses[name];"> Yes </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
  </div>

  <!-- Item Extras -->
  <div>
    <el-divider> Extras </el-divider>
    <el-row :gutter="10">

      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="6"> Masterwork </el-col>
          <el-col :span="14">
            <el-checkbox v-model="item.value.Extras['Masterwork']" style="margin:0;" aria-label="Is Item Masterwork?" />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6"> <span style="font-size:13px;"> Enhancement </span> </el-col>
          <el-col :span="14">
            <el-input-number v-model="item.value.Extras['Enhancement']" size="small" aria-label="Is Item Magic?" />
          </el-col>
        </el-row>

        <el-row v-for="(damage, name) in item.value.Extras['extraDamages']" :key="name" :gutter="10"  style="margin-top:5px;">
          <el-col :span="6"> {{ name }} </el-col>
          <el-col :span="7">
            <el-input v-model="item.value.Extras.extraDamages[name].Damage" placeholder="Dmg Die" :aria-label="`${capFirsts(name)} Damage Input`" />
          </el-col>
          <el-col :span="7">
            <el-input v-model="damage.Type" placeholder="Dmg Type" :aria-label="`${capFirsts(name)} Type Input`" />
          </el-col>
          <el-col :span="2">
            <el-button @click="delete item.value.Extras['extraDamages'][name]" circle>
              <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10" justify="center" style="margin-top:5px;">
          <el-popconfirm title="Add Magic Damage?" @confirm="if(!item.value.Extras.extraDamages) {item.value.Extras.extraDamages = {};} item.value.Extras.extraDamages[propName] = {};" hide-icon>
            <template #reference>
              <el-button size="small" type="info"> Add Damage </el-button>
            </template>
            <template #actions="{ confirm }">
              <el-input v-model="propName" size="small" placeholder="Quality Name" style="margin-bottom:5px;" aria-label="Magic Quality Name" />
              <el-button type="success" size="small" @click="confirm" :disabled="propName == ''"> Yes </el-button>
            </template>
          </el-popconfirm>
        </el-row>
      </el-col>

      <el-col :span="12">
        <div class="center-horz"> Notes </div>
        <el-input
          v-for="(note, index) in item.value.Extras.Notes" :key="index"
          v-model="item.value.Extras.Notes[index]"
          :aria-label="`Item Note ${index}`"
          placeholder="New Note"
        >
          <template #append>
            <el-button @click="deleteNote(index)" style="display: flex;">
              <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
            </el-button>
          </template>
        </el-input>
        <div class="center-horz">
          <el-button size="small" type="info" @click="addNote()"> Add Note </el-button>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-row justify="end">
    <el-button size="small" type="warning" @click="reset()"> Reset </el-button>
    <el-button size="small" type="primary" @click="saveItem()"> Save </el-button>
  </el-row>
</template>

<script>
export default {
  name: 'g-item',
  emits: ['save-item'],
  props: { source: { type: Object } },
  data() {
    return {
      advanced: this.$store.state.auth.user.roles.includes('admin'),
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

    addProperty() { this.item.value[this.propName] = ''; this.propName = ''; },
    deleteProperty(property) { delete this.item.value[property]; },
    addNote() { this.item.value.Extras['Notes'].push(''); },
    deleteNote(index) { this.item.value.Extras['Notes'].splice(index, 1); },

    saveItem() { this.$emit('save-item'); },
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
