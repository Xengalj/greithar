<template lang="html">
  <div class="container" v-if="!loading">

    TOMBSTONE

  </div>
</template>

<script>
import UserService from "@/services/user.service";
// import CharacterService from "@/services/character.service";
import HexGraph from '@/components/template/HexGraph.vue';
import GItem from '@/components/template/GItem.vue';
import GAbility from '@/components/template/GAbility.vue';

export default {
  name: "Create Character",
  components: { HexGraph, GItem, GAbility },
  data() {
    return {
      loading: false,

    };
  },
  computed: {
    rules() { return this.$store.state.data.rules; },
    races() { return this.$store.state.data.races; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },
    conditions() { return this.$store.state.data.conditions; },

    activeConditions() { return this.character.conditions; },
    inventory() { return this.character.inventory; },
    abilities() { return this.character.abilities; },

    // USES: activeConditions, inventory, abilities
    bonuses() {
      let bonuses = {};
      if (this.loading) { return bonuses; }

      // Add feats and other abilities to bonuses
      for (const ability in this.abilities) {
        if (this.abilities[ability].extras.active && this.abilities[ability].bonuses) {
          for (const [name, bonus] of Object.entries(this.abilities[ability].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Add conditions
      for (const condition in this.activeConditions) {
        if (this.activeConditions[condition].bonuses) {
          for (const [name, bonus] of Object.entries(this.activeConditions[condition].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Armor
      let item = this.inventory[1].children[0].children[0];
      if (item) {
        bonuses[item.label] = {};
        bonuses[item.label].type = "Armor";
        bonuses[item.label].targets = item.value.targets;
        bonuses[item.label].value = item.value["AC Bonus"];
      }
      // Shields          For items in equipment . equipped . hands
      for (const item of this.inventory[1].children[1].children[0].children) {
        if (item.value.Proficiency == "Shields") {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = item.value.targets;
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . (slotted) Magic Items
      for (const slot of this.inventory[0].children) {
        for (const item of slot.children) {
          if (item.bonuses) {
            for (const [name, bonus] of Object.entries(item.bonuses)) {
              bonuses[name] = {};
              bonuses[name].type = bonus.type;
              bonuses[name].targets = bonus.targets;
              bonuses[name].value = bonus.value;
            }
          }
        }
      } // end magic items
      // console.log("BONUSES", bonuses);
      return bonuses;
    },

    // USES: bonusLoop(bonuses)
    attributes() {
      let attributes = {
        Str: { total: 10, sources: [], mod: 0 },
        Dex: { total: 10, sources: [], mod: 0 },
        Con: { total: 10, sources: [], mod: 0 },
        Int: { total: 10, sources: [], mod: 0 },
        Wis: { total: 10, sources: [], mod: 0 },
        Cha: { total: 10, sources: [], mod: 0 }
      };
      if (this.loading) { return attributes; }
      for (let [name, attr] of Object.entries(this.character.attributes)) {
        attributes[name].total = attr.base;
        attributes[name].mod = Math.floor( (name == "-" ? 0 : attr.base - 10) / 2 );
        this.bonusLoop(attributes[name], name);
      }
      return attributes;
    },
    // USES: bonusLoop(bonuses)
    cumulativeGaldur() {
      let classes = {};
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        if (!cClass.useGaldur) { continue; }
        classes[cName] = { "total": 0, "sources": [] };
        let val = 0;
        for (let lvl = 0; lvl <= cClass.levels; lvl++) {
          val = this.classes[cName].magic.galdur[lvl];
          this.applyBonus(`Level ${lvl}`, val, classes[cName]);
        }
        this.bonusLoop(classes[cName], `${cName}Galdur`);
      } // end class loop

      return classes;
    },

    newRanks() {
      let ranks = 0;
      for (let skill of Object.values(this.newLevel.skills)) {
        ranks += skill.newRanks;
      }
      return ranks;
    },
    backgroundRanks() {
      let ranks = 0;
      for (let skill of Object.values(this.newLevel.skills)) {
        if (skill.backgroundRanks) { ranks += skill.backgroundRanks }
      }
      return ranks;
    },

  },
  mounted() {
    console.log("races", this.races);
    console.log("classes", this.classes);
    console.log("rules", this.rules);

    UserService.getAllUsers()
    .then(response => {
      this.users = response.data.map((user) => { return {'username': user.username, 'id': user.id} } );
    })
    .catch(err => {
      this.$message({ message: err, type: 'error', });
      console.error(err);
    });



    // CharacterService.getCharacter(this.$route.params.id).then(() => {

      // Wait until we have rules to load stuff
      // while (this.loading) {
        if (!this.rules.size) {
          this.$router.push("/");
      //     // Put [Add Spell] btn in class spells tabs, wait til refs loaded
      //     // setTimeout(() => {
      //     //   const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
      //     //   spellTabs.appendChild(this.$refs.addSpell.$el);
      //     // }, 10);
        }
      // }
          this.loading = false;
    // })
    // .catch(err => { console.error(err); });
  },
  watch: {
    itemFilter(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },
    bonusLoop(object, tString) {
          // console.log(tString, object);
      // object = the bonus object we are adding to: { total: #, sources: [] }
      // tString = the target string we match to add to the bonus object: "atkBonus" || "Str" || "touchAC"
      // Add Active Bonuses
      let typedBonuses = {};
      let prefix = "";

      for (let [name, bonus] of Object.entries(this.bonuses)) {
            // console.log(name, bonus);
        prefix = (bonus.value > 0) ? "+" : "";
        if (Object.keys(this.rules.bonuses).includes(bonus.type)) {
          // If the bonus type doesn't stack
          if (typedBonuses[bonus.type]) {
            // If we have the type of bonus already
            if (typedBonuses[bonus.type].value > bonus.value) {
              // If the current is higher, skip
              continue;
            } else {
              // remove current bonus & value
              bonus.targets.forEach(target => {
                if (target == tString) {
                  object.total -= typedBonuses[bonus.type].value;
                  // loop on sources looking for the one to remove
                  object.sources.forEach((source, i) => {
                    if ( source.includes(typedBonuses[bonus.type].name) ) {
                      object.sources.splice(i, 1);
                    }
                  });
                }
              });
            }
          }
          typedBonuses[bonus.type] = { name: name, value: bonus.value };
        } // End typed bonus prep

        if (!object.sources.includes(`${prefix}${bonus.value} ${name}`)) {
          // if we dont already have that specific bonus applied, add it
          bonus.targets.forEach(target => {
            if (target == tString) {
              // If bonus.targets includes tString, apply it
              object.total += parseInt(bonus.value);
              object.sources.push(`${prefix}${bonus.value} ${name}`);
            }
          });
        }
      } // End Bonuses Loop
    },
    applyBonus(name, value, obj) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },
    saveCharacter() {
      console.log(this.character);




    },

    // Racial Methods
    onRaceChange() {
      let basics = this.character.basics;
      basics.type = this.races[basics.race].type;
      basics.speed.base.total = this.races[basics.race].speed;
      basics.size = this.races[basics.race].size;

      // replace racial traits
      for (const [name, trait] of Object.entries(this.character.abilities)) {
        if (trait.extras.source == "Race") {
          delete this.character.abilities[name];
        }
      }
      for (const [name, trait] of Object.entries(this.races[basics.race].traits)) {
        this.character.abilities[name] = trait;
        this.character.abilities[name].extras = { "active": true, "showMain": false, "source": "Race" };
      }
    },
    genRandomName() {
      let fNames, surnames, rand = 0;

      fNames = this.races[this.character.basics.race][this.character.basics.appearance.gender].names;
      rand = Math.floor(Math.random() * fNames.length);
      this.character.name = fNames[rand] + " ";

      surnames = this.races[this.character.basics.race].surnames;
      rand = Math.floor(Math.random() * Object.keys(surnames).length);
      this.character.name += Object.keys(surnames)[rand];
    },

    // Class Methods
    openLevelDialog() {
      let lvl = {
        "class": this.newLevel.class,
        "level": this.character.classes[this.newLevel.class] ? this.character.classes[this.newLevel.class].levels + 1 : 1,
        "skills": {},
        "abilites": [],
        "newSpells": [],
        "useGaldur": false
      };

      // skills
      for (let [name, skill] of Object.entries(this.rules.skills)) {
        if ( this.classes[lvl.class].skills.includes(name) ) {
          this.character.skills[name].class = true;
        }
        let newSkill = { 'newRanks': 0 };
        if (skill.background) {
          newSkill.backgroundRanks = 0;
        }
        lvl.skills[name] = newSkill;
      }

      // abilities
      this.classes[lvl.class].special[lvl.level].forEach(abil => {
        let newAbil = { 'name': abil, 'description': "" };
        lvl.abilites.push(newAbil);
      });

      // magic
      if (this.classes[lvl.class].magic) {
        if (lvl.level != 1) {
          let newSpellNum = this.classes[lvl.class].magic.spellsKnown.perLevel.match(/\d+/)[0]
          for (let i = 0; i < newSpellNum; i++) {
            lvl.newSpells.push({ "name": '', "level": 0, "class": lvl.class });
          }
        }
      }

      this.newLevel = lvl;
      this.addingLevel = true;
    },
    addLevel() {
      // New Abilites
      this.newLevel.abilites.forEach(newAbil => {
        this.character.abilities[newAbil.name] = {
          "trigger": "Continuous",
          "description": newAbil.description,
          "benefit": {},
          "bonuses": {},
          "extras": { "active": true, "showMain": false, "source": "Class" },
        }
      });

      // Class
      let source = this.classes[this.newLevel.class];
      if ( !this.character.classes[this.newLevel.class] ) {this.character.classes[this.newLevel.class] = {}; }
      let cClass = this.character.classes[this.newLevel.class];
      cClass.levels = this.newLevel.level;

      this.character.health.total += (this.newLevel.level == 1) ? source.hd : source.hd / 2;

      if ( source.magic ) {
        cClass.useGaldur = cClass.useGaldur ? cClass.useGaldur : true;
        cClass.openSpent = cClass.openSpent ? cClass.openSpent : 0;
        cClass.reserveSpent = cClass.reserveSpent ? cClass.reserveSpent : 0;
        cClass.openTotal = Math.floor( source.magic.galdurTotal[this.newLevel.level] / 2 );
        cClass.reserveTotal = Math.ceil( source.magic.galdurTotal[this.newLevel.level] / 2 );
        cClass.preparedSpells = source.magic.spellsPerDay[this.newLevel.level];

        // Even if no spells were added at level up, create teh spot for em
        if ( !this.character.spells[this.newLevel.class] ) { this.character.spells[this.newLevel.class] = []; }
        this.newLevel.newSpells.forEach(spell => {
          if ( !this.character.spells[spell.class][spell.level] ) { this.character.spells[spell.class][spell.level] = {}; }
          this.character.spells[spell.class][spell.level][spell.name] = {
            'SR': false, '​​​​​​castTime': "", '​​​​​​casts': 0, '​​​​​​components': "V,S", '​​​​​​description': "", '​​​​​​duration': "", '​​​​​​range': "", 'save': "", 'target': ""
          }
        });
      }

      // New Skills
      for (let [name, skill] of Object.entries(this.newLevel.skills)) {
        if (skill.newRanks) {
          this.character.skills[name].ranks += skill.newRanks;
        }
        if (skill.backgroundRanks) {
          this.character.skills[name].ranks += skill.backgroundRanks;
        }
      }

      this.character.basics.cr++;
      this.addingLevel = false;
    },

    /***************************\
    *                           *
    *         ABILITIES         *
    *                           *
    \***************************/
    toggleAbility(name, abil) {
      if (this.activeConditions[name]) {
        delete this.activeConditions[name];
        this.actions.special[name].extras.active = false;
      } else {
        this.activeConditions[name] = abil;
        this.actions.special[name].extras.active = true;
      }
    },
    abilShowMain(name, abil) { abil.extras.showMain = abil.extras.showMain ? false : true; },
    addNewAbility() {
      this.addAbil = true;
      this.abil = {
        trigger: "Standard",
        description: "",
        benefit: { target: "Self", text: "" },
        bonuses: {},
        extras: { active: true, source: "Feat", showMain: false }
      };
      this.editingAbil = true;
    },
    saveAbility(abil) {
      let name = Object.keys(abil)[0];
      this.abilities[name] = abil[name];
      this.editingAbil = false;
    },
    editAbility(name, ability) {
      this.addAbil = false;
      this.abilName = name;
      this.abil = {};
      if (!Object.keys(ability).length) {
        ability = {};
        ability[name] = {
          trigger: "Standard",
          description: "",
          benefit: { target: "Self", text: "" },
          bonuses: {},
          Extras: { active: true, source: "Feat" }
        };
      }
      this.abil = ability;
      this.editingAbil = true;
    },
    deleteAbil(name) {
      delete this.abilities[name];
      this.$message({ message: `${name} was removed from abilities`, type: "warning" });
    },

    /***************************\
    *                           *
    *         CONDITIONS        *
    *                           *
    \***************************/
    addNewContion() {
      this.addingCondition = true;
      this.newCondition = {
        name: "",
        description: "",
        bonuses: {}
      };
    },
    addNewConditionBonus() {
      let name = this.newCondition.name;
      if (name) {
        this.newCondition.bonuses[name.concat(" ", Object.keys(this.newCondition.bonuses).length)] = {
          type: "Condition",
          value: 0,
          targets: []
        };
      } else {
        this.$message({ message: "Input Condition Name First", type: "error" });
      }
    },
    addCondition() {
      this.conditions.push(this.newCondition);
      this.addingCondition = false;
    },

    /***************************\
    *                           *
    *         INVENTORY         *
    *                           *
    \***************************/
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    allowDrag(draggingNode) {
      // Do not allow nonDraggable Arr to be moved
      const nonDraggable = [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Magic Items", "Head", "Headband", "Eyes", "Shoulders", "Neck", "Chest", "Body", "Belt", "Wrists", "Ring 1", "Ring 2", "Feet", "Slotless" ];
      return !nonDraggable.includes(draggingNode.data.label);
    },
    allowDrop(draggingNode, dropNode, type) {
      let parentCap = dropNode.parent.data.extras?.capacity ? dropNode.parent.data.extras.capacity : 0;
      let capacity = dropNode.data.extras?.capacity ? dropNode.data.extras.capacity : 0;
      if (type == "inner" && capacity > 0) {
        // only allow dropping into a container based on that containers capacity
        return dropNode.childNodes.length < capacity;
      } else if (type=='next' && parentCap > 0) {
        // allow sorting within a container
        return dropNode.parent.childNodes.length < parentCap;
      } else {
        return false;
      }
    },
    saveItem(item) {
      this.character.inventory[2].children.push(item);
      this.editingItem = false;
    },
    editItem(item) {
      this.addItem = false;
      if (!Object.keys(item).length) {
        item = {
          label: "",
          value: {
            Description: "",
            Cost: 0,
            Weight: 0,
            Extras: {
              Notes: []
            }
          }
        };
      }
      this.item = item;
      this.editingItem = true;
    },
    deleteItem(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.label === data.label);
      children.splice(index, 1);
      this.$message({ message: `${data.label} was removed from inventory`, type: "warning" });
    },

    /***************************\
    *                           *
    *          SPELLS           *
    *                           *
    \***************************/
    addSpell() {
      let cClass = this.character.spells[this.newSpell.class];

      if ( !cClass[this.newSpell.level] ) { cClass[this.newSpell.level] = {}; }
      if (cClass[this.newSpell.level][this.newSpell.name]) {
        this.$message({ message: `You already know a ${this.newSpell.class} spell called ${this.newSpell.name}`, type: "warning" });
        return;
      } else {
        cClass[this.newSpell.level][this.newSpell.name] = {
          'casts': 0,
          'castTime': '1 Standard',
          'components': 'V,S,M/DF',
          'target': 'Self',
          'range': 'Close',
          'duration': 'Instant',
          'save': 'Ref (half)',
          'SR': true,
          'description': ""
        };
        this.newSpell = { name: "", level: 0, class: "" };
      }
    },

  }
}
</script>

<style lang="css" scoped>
h4 { margin: 0; }
.el-row { margin-bottom: 10px; }
.el-row label { margin: 0; }

.stat-controls > :not(:last-child) { margin-bottom: 20px; }

.class-abil {
  width: 48%;
  margin: 2px;
}
.class-abil .el-input-group__prepend { padding: 0 10px !important; }
.el-progress-bar__inner { text-align: center; }
</style>
