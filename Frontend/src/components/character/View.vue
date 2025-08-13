<template>
  <div v-if="!loading" class="container">
    <!--
    upload a file (profile)
    https://serversideup.net/uploading-files-vuejs-axios/
    -->


    <!-- Basics -->
    <el-row :gutter="20" style="margin-bottom: 15px;">
      <!-- ATTRIBUTES -->
      <el-col :span="12" class="center-horz">
        <svg width="225" height="200">
          <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
        </svg>
        <el-row>
          <el-col :offset="6" :span="2"> Str: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Str.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Str.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Str.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Str.total-10)/2) }}</el-tag>
          </el-col>
          <el-col :offset="1" :span="2"> Int: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Int.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Int.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Int.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Int.total-10)/2) }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="6" :span="2"> Dex: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Dex.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Dex.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Dex.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Str.total-10)/2) }}</el-tag>
          </el-col>
          <el-col :offset="1" :span="2"> Wis: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Wis.sources[0]" placement="top" effect="light">
              <el-tag size="large" effect="dark" type="primary">{{attributes.Wis.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Wis.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Wis.total-10)/2) }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="6" :span="2"> Con: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Con.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Con.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Con.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Str.total-10)/2) }}</el-tag>
          </el-col>
          <el-col :offset="1" :span="2"> Cha: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Cha.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Cha.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Str.total-10)/2) }}</el-tag>
          </el-col>
        </el-row>
      </el-col>

      <!-- Icon & Lore -->
      <el-col :span="12">
        <div class="center-horz">
          <g-icon iconSize="128px" :icon-name="character.basics.type.name" :key="character.basics.type.name"/>
          <br>
          {{ character.basics }}
        </div>
        <el-row>
          <el-col :span="4" class="center-vert center-horz">
            <g-icon iconSize="24px" icon-name="compass"/>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="12">
                {{ character.basics.alignment }} {{ capFirsts(character.basics.size) }} ({{ sizeStats.space }})
              </el-col>
              <el-col :span="12">
                <el-tooltip v-if="character.basics.type.levels" placement="top" effect="light">
                  <el-tag size="small" effect="dark" type="primary">{{ capFirsts(character.basics.type.name) }}</el-tag>
                  <template #content>
                    {{ character.basics.type.levels }} HD (1d{{ character.basics.type.hd }})
                  </template>
                </el-tooltip>
                <el-tag v-else size="small" effect="dark" type="primary">{{ capFirsts(character.basics.type.name) }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-tooltip placement="top" effect="light" v-for="(cClass, name) in character.classes" :key="name">
                <el-tag size="small" effect="dark" type="primary" style="margin: 0 1px 0 0;">{{ capFirsts(name) }} {{ cClass.levels }}</el-tag>
                <template #content>
                  {{ cClass.levels }} HD ({{ cClass.levels }}d{{ classes[name].hd }})
                </template>
              </el-tooltip>
              <el-tag size="small" effect="dark" type="info" v-for="subtype in character.basics.type.subtypes" :key="subtype" style="margin: 0 1px 0 2px;">
                {{ capFirsts(subtype) }}
              </el-tag>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="forest"/> </el-col>
          <el-col :span="20" class="center-vert"> {{ character.basics.environment }} </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="sparkle"/> </el-col>
          <el-col :span="20" class="center-vert"> XP : {{ this.rules.experience[character.basics.cr] }} </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- Content Tabs -->
    <el-button @click="rest()" ref="restBtn" size="large">
      <el-tooltip placement="top" effect="light">
        <g-icon iconSize="24px" iconName="campfire" />
        <template #content>Rest for 8 Hours</template>
      </el-tooltip>
    </el-button>
    <el-tabs v-model="character.userSettings.cardTab" ref="tabs" type="card">

      <!-- Main -->
      <el-tab-pane name="Main">
        <template #label> <g-icon iconSize="24px" iconName="compass" /> Main </template>

        <el-collapse v-model="character.userSettings.mainSections">
          <!-- Defense -->
          <el-collapse-item name="defense">
            <template #title> <g-icon iconName="armor" /> Defense </template>

            <el-row :gutter="20">
              <el-col :span="3"> <g-icon iconSize="32px" iconName="Armor" /> </el-col>
            </el-row>

          </el-collapse-item>

          <!-- Actions -->
          <el-collapse-item name="actions">
            <template #title> <g-icon iconName="swordShield" /> Actions </template>

          </el-collapse-item>

          <!-- Conditions -->
          <el-collapse-item name="conditions">
            <template #title> <g-icon iconName="dizzyStar" /> Conditions </template>

          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>





      <!-- Items -->
      <el-tab-pane name="Items">
        <template #label> <g-icon iconSize="24px" iconName="inventory" /> Items </template>
        <!-- Coins -->
        <el-row :gutter="10">
          <el-col :span="8" class="center-vert center-horz">
            <el-tag size="large" effect="dark" type="primary" >
              <g-icon iconSize="24px" iconName="treasure" />
              Total (gp) : {{
                (character.coins.pp * 10)
                + (character.coins.gp * 1)
                + (character.coins.sp * 0.1)
                + (character.coins.cp * 0.01)
              }}
            </el-tag>
          </el-col>
          <el-col :span="8">
            <el-input v-model="character.coins.pp" aria-label="Platinum Pieces Input" >
              <template #prepend> Platinum </template>
              <template #suffix> Coins </template>
              <template #append> {{ (character.coins.pp / 50) }} lbs. </template>
            </el-input>
            <el-input v-model="character.coins.gp" aria-label="Gold Pieces Input" >
              <template #prepend> Gold </template>
              <template #suffix> Coins </template>
              <template #append> {{ (character.coins.gp / 50) }} lbs. </template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="character.coins.sp" aria-label="Silver Pieces Input" >
              <template #prepend> Silver </template>
              <template #suffix> Coins </template>
              <template #append> {{ (character.coins.sp / 50) }} lbs. </template>
            </el-input>
            <el-input v-model="character.coins.cp" aria-label="Copper Pieces Input" >
              <template #prepend> Copper </template>
              <template #suffix> Coins </template>
              <template #append> {{ (character.coins.cp / 50) }} lbs. </template>
            </el-input>
          </el-col>
        </el-row>
        <el-divider />

        <el-row :gutter="10">
          <el-col :span="20">
            <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search" />
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="editItem({}); addItem=true;">Add Item</el-button>
          </el-col>
        </el-row>
        <el-tree
          :data="character.inventory"
          ref="tree"
          draggable
          render-after-expand
          node-key="label"
          :default-expanded-keys="character.userSettings.expandInventory"
          :filter-node-method="filterNode"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
        >
          <template #default="{ node, data }">
            <el-col :span="1" style="text-align: center; margin-right:2px;">
              <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
              <span v-else> • </span>
            </el-col>
            <el-col :span="7"> {{ node.label }} </el-col>
            <el-col :span="3">
              <span v-if="data.value"> {{ data.value.Cost }} gp </span>
            </el-col>
            <el-col :span="3">
              <span v-if="data.value"> {{ data.value.Weight }} lbs. </span>
            </el-col>
            <div class="custom-tree-node" v-if="data.value">
              <!-- Edit Item (in modal component) -->
              <el-button type="info" circle size="small" @click="editItem(data)">
                <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
              </el-button>

              <!-- Delete Item -->
              <el-popconfirm title="Are you sure to delete this?">
                <template #reference>
                  <el-button type="danger" circle size="small">
                    <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                  </el-button>
                </template>
                <template #actions="">
                  <el-button type="danger" size="small" @click="deleteItem(node, data)">Yes</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-tree>
        <el-dialog v-model="editingItem" width="800">
          <g-item :source="item" :newItem="addItem" @save-item="saveItem"/>
        </el-dialog>
      </el-tab-pane>

      <!-- Skills -->
      <el-tab-pane name="Skills">
        <template #label> <g-icon iconSize="24px" iconName="sparkle" /> Skills </template>

        <el-row v-if="character.skills.Linguistics && character.skills.Linguistics.extras">
          <el-col :span="2"> Languages: </el-col>
          <el-col :span="21">
            <el-tag size="small" effect="dark" type="primary" v-for="language in character.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
          </el-col>
        </el-row>


        <el-divider />

        <!-- <el-row>
          <el-col :span="5"> Name </el-col>
          <el-col :span="4" class="center-horz"> Bonus </el-col>
          <el-col :span="3" class="center-horz"> Ranks </el-col>
          <el-col :span="4"> </el-col>
          <el-col :span="8" class="center-horz"> Ability, Armor Penalty, Class Skill </el-col>
        </el-row>
        <!- - <el-divider /> - ->
        <div v-for="(skill, name) in skills" :key="name">
          <el-row v-if="skill.untrained || skill.ranks" style="margin-bottom:5px; border-bottom:1px solid grey">
            <el-col :span="5">
              {{ name }}
              <span v-if="['Craft', 'Perform', 'Profession'].includes(name)"> (unspecified) </span>
            </el-col>
            <!- - Bonus - ->
            <el-col :span="4" class="center-horz">
              <el-tooltip placement="top" effect="light">
                {{ skill.bonus.total }}
                <template #content>
                  <span v-for="bonus in skill.bonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>
            </el-col>
            <el-col :span="3" class="center-horz"> {{ skill.ranks }} <span v-if="skill.ranks"> Ranks </span> </el-col>
            <el-col :span="4"> </el-col>
            <el-col :span="3" class="center-horz"> {{ skill.ability }} </el-col>
            <el-col :span="1" class="center-horz">
               <g-icon v-if="skill.armor_pen" iconSize="15px" iconName="armor" />
             </el-col>
            <el-col :span="1" class="center-horz">
              <g-icon v-if="skill.class" iconSize="15px" iconName="abilityPalm" />
             </el-col>
          </el-row>
        </div> -->




        <el-row :gutter="10" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="5" class="center-vert"> <h5> Name (Ability) </h5> </el-col>
          <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">

            <div style="width:25%">
              <el-tooltip placement="top" effect="light">
                <g-icon iconSize="28px" iconName="sparkle" />
                <template #content> Bonus </template>
              </el-tooltip>
            </div>
            <div style="width:25%">
              <el-tooltip placement="top" effect="light">
                <g-icon iconSize="28px" iconName="magicSwirl" />
                <template #content> Class Skill </template>
              </el-tooltip>
            </div>
            <div style="width:25%">
              <el-tooltip placement="top" effect="light">
                <g-icon iconSize="28px" iconName="armor" />
                <template #content> Armor Penalty </template>
              </el-tooltip>
            </div>
            <div style="width:25%">
              <el-tooltip placement="top" effect="light">
                <g-icon iconSize="28px" iconName="openBook" />
                <template #content> Background Skill </template>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="9" class="center-horz center-vert"> <h5> Notes </h5> </el-col>
        </el-row>

        <div v-for="(skill, name) in rules.skills" :key="name">
          <el-row style="margin-bottom:5px; border-bottom:1px solid grey">
            <el-col :span="5" class="center-vert">
              {{ name }}
              <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
              ({{ skill.ability }})
            </el-col>
            <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
              <div style="width:25%" class="center-vert">
                <span v-if="character.skills[name].ranks">
                  <el-tag :effect="character.skills[name].ranks ? 'dark' : 'plain'">
                    {{ character.skills[name].ranks }}
                  </el-tag>
                </span>
              </div>
              <div style="width:25%" class="center-vert">
                <span v-if="advanced">
                  <el-checkbox v-model="character.skills[name].class" size="large" aria-label="Class Skill Checkbox" />
                </span>
                <span v-else>
                  <g-icon v-if="character.skills[name].class" iconSize="20px" iconName="magicSwirl" />
                </span>
              </div>
              <div style="width:25%" class="center-vert">
                <g-icon v-if="skill.armor_pen" iconSize="20px" iconName="armor" />
              </div>
              <div style="width:25%" class="center-vert">
                <g-icon v-if="skill.background" iconSize="20px" iconName="openBook" />
              </div>
            </el-col>
            <el-col :offset="1" :span="14" class="center-horz">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input type="textarea" v-model="character.skills[name].extras.notes" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${name} notes`" />
                </el-col>
                <el-col :span="9" class="center-vert">
                  <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)">
                    <el-input v-model="character.skills[name].extras.specialty" :aria-label="`${name} Specialty`">
                      <template #prepend>Specialty</template>
                    </el-input>
                  </span>
                  <span v-if="name == 'Linguistics'">
                    <el-select v-model="character.skills.Linguistics.extras.languages" multiple filterable allow-create default-first-option :reserve-keyword="false" aria-label="Languages Select">
                      <el-option v-for="name in races[character.basics.race].languages" :key="name" :label="name" :value="name" >
                        {{ name }}
                      </el-option>
                    </el-select>
                  </span>
                </el-col>
              </el-row>
             </el-col>
          </el-row>
        </div>


      </el-tab-pane>

      <!-- Abilities -->
      <el-tab-pane name="Abilities">
        <template #label> <g-icon iconSize="24px" iconName="abilityPalm" /> Abilities </template>

        Abilities
      </el-tab-pane>

      <!-- Magic -->
      <el-tab-pane name="Magic">
        <template #label> <g-icon iconSize="24px" iconName="spellBook" /> Magic </template>

        Magic
      </el-tab-pane>

      <!-- Edit -->
      <el-tab-pane name="Edit">
        <template #label> <g-icon iconSize="24px" iconName="quill" /> Edit </template>

        <g-icon iconName="openBook" />
        Notes

        <g-icon iconName="openScroll" />
        Player Lore

      </el-tab-pane>
    </el-tabs>


    <el-divider />
    <div v-for="(item, name) in this.character" :key="name">
      {{ name }} : {{ item }}
      <br><br>
    </div>

  </div>
</template>

<script>
// import UserService from "@/services/user.service";
import CharacterService from "@/services/character.service";
import HexGraph from '@/components/template/HexGraph.vue';
import GItem from '@/components/template/GItem.vue';
// import GAbility from '@/components/template/GAbility.vue';

export default {
  name: "View Character",
  components: { HexGraph,
     GItem,
     //  GAbility
   },
  data() {
    return {
      loading: true,

      sectionsCollapse: [ '' ],
      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      abilityCollapse: [],
      abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],
      addAbil: false,
      abilName: "",
      editingAbil: false,
      abil: {},

      newCondition: {},
      addingCondition: false,

      addItem: false,
      editingItem: false,
      item: {},
      itemFilter: "",

      spellsTab: "",
      newSpell: { name: "", level: 0, class: "" },
      spellsCollapse: [],

      character: {},


    };
  },
  computed:{
    rules() { return this.$store.state.data.rules; },
    races() { return this.$store.state.data.races; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },

    sizeStats() { return this.rules.size ? this.rules.size[this.character.basics.size] : { "space": "5 ft." }; },
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
    }

  },
  mounted() {
    if (!this.rules) { this.$router.push("/"); }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
console.log('response', response);
      this.character = response.character[0];
      // this.character.user = {};
      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    // .finally(() => {
    //   // Put [Add Spell] btn in class spells tabs, wait til refs loaded
    //   const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
    //   spellTabs.appendChild(this.$refs.addSpell.$el);
    // });


  },
  watch: {
    itemFilter(val) { this.$refs.tree.filter(val); }
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
            Extras: { Notes: [] }
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





  }
};
</script>

<style media="screen">
  .center {
    text-align: center;
  }
</style>
