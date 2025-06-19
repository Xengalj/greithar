<template>
  <div class="container" v-if="!loading">

    <el-row>
      <el-col :span="8">
        <h3>
          {{ character.name }}
          <el-tag effect="dark" type="info" v-if="advanced">
            ID : {{ character.id }}
          </el-tag>
          <span v-if="character.basics.race && ['male','female','agander'].includes(character.basics.appearance.gender)">
            <el-button type="primary" @click="genRandomName()"> Random Name! </el-button>
          </span>
        </h3>
      </el-col>

      <el-col :span="8" style="display: flex; justify-content: space-evenly;">
      </el-col>



      <el-col :span="8" style="display: flex; justify-content: space-evenly;">
        <!-- ADVANCED -->
        <el-switch v-model="advanced" inline-prompt active-text=" Advanced " inactive-text=" Normal " aria-label="Advanced Mode Switch" />
      </el-col>
    </el-row>


    <!-- BASICS -->
    <el-row id="basics">
      <el-col :span="18">
        <el-row :gutter="10">

          <!-- Name -->
          <el-col :span="8">
            <el-input v-model="character.name" aria-label="Character Name">
              <template #prepend>Name</template>
            </el-input>
          </el-col>

          <!-- Race / Type (subtype) -->
          <el-col :span="8">
            <el-select v-model="character.basics.race" size="small" placeholder="Choose Race" @change="onRaceChange()" aria-label="Race Select">
              <template #label="{ label }">
                <span style="float: left">{{ label }}</span>
                <span style="float: right">
                  <el-tag size="small" effect="dark" type="primary">{{ capFirsts(character.basics.type.name) }}</el-tag>
                  <el-tag size="small" effect="dark" type="info" style="margin-left:5px;" v-for="subtype in character.basics.type.subtypes" :key="subtype"> {{ subtype }} </el-tag>
                </span>
              </template>
              <el-option v-for="(race, name) in this.races" :key="name" :label="name" :value="name">
                <span style="float: left">{{ name }}</span>
                <span style="float: right">
                  <el-tag size="small" effect="dark" type="primary">{{ capFirsts(race.type.name) }}</el-tag>
                </span>
              </el-option>
            </el-select>
          </el-col>

          <!-- Gender -->
          <el-col :span="6">
            <div v-if="advanced">
              <el-input v-model="character.basics.appearance.gender" aria-label="Custom Gender Input" />
            </div>
            <div v-else>
              <el-select v-model="character.basics.appearance.gender" size="small" aria-label="Gender Select">
                <el-option v-if="this.races[character.basics.race].male" label="Male" value="male" />
                <el-option v-if="this.races[character.basics.race].female" label="Female" value="female" />
                <el-option v-if="this.races[character.basics.race].agender" label="Agender" value="agender" />
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">

          <!-- Alignment -->
          <el-col :span="8">
            <el-input v-model="character.basics.alignment" aria-label="Alignment Input">
              <template #prepend>Alignment</template>
            </el-input>
          </el-col>

          <!-- Size -->
          <el-col :span="8">
            <el-input v-model="character.basics.size" disabled aria-label="Size Display">
              <template #suffix>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                  Space: {{ this.rules.size[character.basics.size].space }}
                </span>
              </template>
            </el-input>
          </el-col>

          <!-- Speeds -->
          <el-col :span="8">
            <span v-for="(mode, name) in character.basics.speed" :key="name">
              <span v-if="mode.total">
                <el-badge :value="mode.sources.length" :max="5">
                  <el-tooltip placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info" style="margin-left:5px;"> {{ capFirsts(name) }}: {{ mode.total }} ft. </el-tag>
                    <template #content>
                      <span v-for="bonus in mode.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                </el-badge>
              </span>
            </span>
          </el-col>
        </el-row>
        <el-row :gutter="10">

          <!-- Age -->
          <el-col :span="8">
            <el-tooltip placement="top" effect="light">
              <el-input v-model="character.basics.appearance.age" :min="1" aria-label="Age Input">
                <template #prepend>Age</template>
              </el-input>
              <template #content>
                <span v-for="(range, name) in this.races[character.basics.race].age" :key="name">
                  {{ name }} : {{ range }} <br>
                </span>
              </template>
            </el-tooltip>
          </el-col>

          <!-- Height -->
          <el-col :span="8">
            <el-tooltip placement="right" effect="light">
              <el-input v-model="character.basics.appearance.height" aria-label="Height Input">
                <template #prepend>Height</template>
              </el-input>
              <template #content>
                <span v-if="['male','female','agander'].includes(character.basics.appearance.gender)">
                  {{ this.races[character.basics.race][character.basics.appearance.gender].height }}
                </span>
                <span v-else>Choose within reason</span>
              </template>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row :gutter="10">

          <!-- Diety -->
          <el-col :span="8">
            <el-input v-model="character.basics.diety" aria-label="Worship Input">
              <template #prepend>Beliefs</template>
            </el-input>
          </el-col>
          <el-col :span="8">

            <!-- Weight -->
            <el-tooltip placement="right" effect="light">
              <el-input v-model="character.basics.appearance.weight" aria-label="Weight Input">
                <template #prepend>Weight</template>
              </el-input>
              <template #content>
                <span v-if="['male','female','agander'].includes(character.basics.appearance.gender)">
                  {{ this.races[character.basics.race][character.basics.appearance.gender].weight }}
                </span>
                <span v-else>Choose within reason</span>
              </template>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-col>

      <!-- Favored Class Bonus & Level Up -->
      <el-col :span="6">
        <el-row>
          <h4> <g-icon iconName="magicSwirl" /> Favored Class Bonus </h4>
          <el-select v-model="character.basics.favoredClass.name" aria-label="Favored Class Select">
            <el-option v-for="(cClass, cName) in this.classes" :key="cName" :label="cName" :value="cName" />
          </el-select>
          <el-input v-model="character.basics.favoredClass.bonus" aria-label="Favored Class Bonus Input" />
        </el-row>
        <el-row class="center-horz">
          <el-col>
            <el-button type="primary" @click="addLevel()">
              <g-icon iconSize="24px" iconName="sparkle" />
              <span style="padding:5px"> Level Up </span>
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- Backstory -->
    <el-row style="margin-bottom:30px;">
      <h4>Backstory</h4>
      <el-input v-model="character.basics.backstory" type="textarea" autosize aria-label="Backstory Textarea" />
    </el-row>

    user settings : {{ character.userSettings }} <br>
    notes : {{ character.notes }} <br>

    <el-divider id="attributes"> <h4> <g-icon iconSize="32px" iconName="Compass" /> Attributes </h4> </el-divider>
    <!-- ATTRIBUTES (ABILITIES) -->
    <el-row v-if="!loading">
      <el-col :span="12" class="center-horz">
        <svg width="225" height="200">
          <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
        </svg>
      </el-col>

      <el-col :span="12" class="center-horz center-vert">
        <div class="stat-controls">

          <el-row :gutter="10">
            <!-- Strength -->
            <el-col :span="2">Str:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Str.sources.length" v-if="attributes.Str.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Str.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Str.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Str.base" :min="1" aria-label="Base Strength Input" />
            </el-col>

            <!-- Intelligence -->
            <el-col :span="2" :offset="1">Int:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Int.sources.length" v-if="attributes.Int.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Int.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Int.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Int.base" :min="1" aria-label="Base Intelligence Input" />
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <!-- Dexterity -->
            <el-col :span="2">Dex:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Dex.sources.length" v-if="attributes.Dex.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Dex.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Dex.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Dex.base" :min="1" aria-label="Base Dexterity Input" />
            </el-col>

            <!-- Wisdom -->
            <el-col :span="2" :offset="1">Wis:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Wis.sources.length" v-if="attributes.Wis.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Wis.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Wis.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Wis.base" :min="1" aria-label="Base Wisdom Input" />
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <!-- Constitution -->
            <el-col :span="2">Con:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Con.sources.length" v-if="attributes.Con.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Con.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Con.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Con.base" :min="1" aria-label="Base Constitution Input" />
            </el-col>

            <!-- Charisma -->
            <el-col :span="2" :offset="1">Cha:</el-col>
            <el-col :span="2">
              <el-badge :max="5" :value="attributes.Cha.sources.length" v-if="attributes.Cha.sources[0]">
                <el-tooltip placement="top" effect="light">
                  <el-tag size="large" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
                  <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                </el-tooltip>
              </el-badge>
              <el-tag size="large" effect="dark" type="primary" v-else>{{attributes.Cha.total}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-input-number v-model="character.attributes.Cha.base" :min="1" aria-label="Base Charisma Input" />
            </el-col>
          </el-row>

        </div>
      </el-col>
    </el-row>
    health : {{ character.health }}

    <!-- CLASSES -->
    <div id="classes"></div>
    <el-row v-for="(cClass, cName) in character.classes" :key="cName" :gutter="10">
      <el-divider> <h4> <g-icon iconName="magicSwirl" /> {{ capFirsts(cName) }} </h4> </el-divider>

      <el-col :span="4">
        <el-descriptions :column="1" border >
          <el-descriptions-item>
            <template #label> Levels </template>
            {{ cClass.levels }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label> HD </template>
            {{ cClass.levels }}d{{ this.classes[cName].hd }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label> Fort </template>
            +{{ Math.floor(cClass.levels * this.classes[cName].fort.mult) + this.classes[cName].fort.bonus }} <br>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label> Reflex </template>
            +{{ Math.floor(cClass.levels * this.classes[cName].ref.mult) + this.classes[cName].ref.bonus }} <br>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label> Will </template>
            +{{ Math.floor(cClass.levels * this.classes[cName].will.mult) + this.classes[cName].will.bonus }} <br>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label> Ranks </template>
            {{ cClass.levels * this.classes[cName].ranks }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

      <el-col :span="6">
        <div v-if="this.classes[cName].alignment.length < 9">
          Allowed Alignments <br>
          <el-tag size="small" effect="dark" type="primary" v-for="name in this.classes[cName].alignment" :key="name" style="margin-left:10px;">
            {{ name }}
          </el-tag>
        </div>
        <div>
          Class Skills <br>
          <el-tag size="small" effect="dark" type="primary" v-for="name in this.classes[cName].skills" :key="name" style="margin-left:10px;">
            {{ name }}
          </el-tag>
        </div>
        <div>
          Proficiencies <br>
          <el-tag size="small" effect="dark" type="primary" v-for="item in this.classes[cName].proficiency" :key="item" style="margin-left:10px;">
            {{ item }}
          </el-tag>
        </div>
      </el-col>

      <el-col :span="14">
        Special Abilities <br>
        <div class="class-abils">
          <span v-for="(abilities, level) in cClass.special" :key="level">
            <span v-for="(abil, index) in abilities" :key="index">
              <span v-if="level < cClass.levels">
                <el-input v-model="character.classes[cName].special[level][index]" style="width: 210px; margin: 2px;" :aria-label="`Class Ability: ${abil}`" />
              </span>
            </span>
          </span>
        </div>
      </el-col>
    </el-row>

    <el-divider> <h4> <g-icon iconSize="32px" iconName="Compass" /> Abilities </h4> </el-divider>

    <el-row id="abilities">
      ABILITIES
      {{ character.abilities }}
    </el-row>

    <el-row id="conditions">
      conditions
      {{ character.conditions }}
    </el-row>




    <!-- SKILLS -->
    <el-divider> <h4> <g-icon iconSize="32px" iconName="Compass" /> Skills </h4> </el-divider>
    <el-row id="skills" v-if="character.skills.Linguistics && character.skills.Linguistics.extras">
      <el-col :span="2"> Languages: </el-col>
      <el-col :span="21">
        <el-tag size="small" effect="dark" type="primary" v-for="language in character.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="5"> <h5> Name (Ability) </h5> </el-col>
      <el-col :span="1" class="center-horz"> <h5> Ranks </h5> </el-col>
      <el-col :span="1" class="center-horz">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="24px" iconName="armor" />
          <template #content> Armor Penalty </template>
        </el-tooltip>
      </el-col>
      <el-col :span="1" class="center-horz">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="24px" iconName="openBook" />
          <template #content> Background Skill </template>
        </el-tooltip>
      </el-col>
      <el-col :span="2" class="center-horz"> <h5> Class Skill </h5> </el-col>
      <el-col :span="11" class="center-horz"> <h5> Extras </h5> </el-col>
    </el-row>

    <div v-for="(skill, name) in this.rules.skills" :key="name">
      <el-row style="margin-bottom:5px; border-bottom:1px solid grey">
        <el-col :span="5">
          {{ name }}
          <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
          ({{ skill.ability }})
        </el-col>
        <el-col :span="1" class="center-horz">
          <span v-if="character.skills[name].ranks">
            {{ character.skills[name].ranks }}
          </span>
        </el-col>
        <el-col :span="1" class="center-horz">
          <g-icon v-if="skill.armor_pen" iconSize="15px" iconName="armor" />
        </el-col>
        <el-col :span="1" class="center-horz">
          <g-icon v-if="skill.background" iconSize="15px" iconName="openBook" />
        </el-col>
        <el-col :span="2" class="center-horz">
          <el-checkbox v-model="character.skills[name].class" :aria-label="`${name} class skill`" />
        </el-col>
        <el-col :span="14" class="center-horz">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input v-model="character.skills[name].extras.notes" :aria-label="`${name} notes`">
                <template #prepend>Notes</template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)">
                <el-input v-model="character.skills[name].extras.specialty" :aria-label="`${name} Specialty`">
                  <template #prepend>Specialty</template>
                </el-input>
              </span>
              <span v-if="name == 'Linguistics'">
                languages select
              </span>
            </el-col>
          </el-row>
         </el-col>
      </el-row>
    </div>



    <el-row id="actions">
      ACTIONS
      {{ character.actions }}
    </el-row>

    <el-row id="inventory">
      INVENTORY
      {{ character.inventory }}
    </el-row>

    <el-row>
      <g-icon iconSize="16px" iconName="treasure" /> COINS
    </el-row>
    <el-divider />

    <el-row :gutter="10">
      <el-col :span="20">
        <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" />
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


    <el-row id="magic">
      MAGIC
      {{ character.magic }}
    </el-row>


    <!-- FOOTER -->
    <div style="text-align: right">
      <el-button type="primary" @click="saveMonster()"> Save Changes </el-button>
    </div>

    <div v-for="(item, name) in this.tmpSource" :key="name">
      {{ name }} : {{ item }}
      <br><br>
    </div>

  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import HexGraph from '@/components/template/HexGraph.vue';
import GItem from '@/components/template/GItem.vue';

export default {
  name: "Edit Character",
  components: { HexGraph, GItem },
  data() {
    return {
      loading: true,
      advanced: false,


      addItem: false,
      editingItem: false,
      item: {},
      itemFilter: "",

      character: {},


      tmpSource: {
        id : 0,
        name : "Smelborp",
        basics : {
          "cr": 0,
          "size": "medium",
          "race": "Zikaru",
          "type": {
            "name": "humanoid",
            "hd": 0,
            "levels": 0,
            "subtypes": [ "Human" ]
          },
          "speed": {
            "base": { "total": 30, "sources": [ "Racial Base" ] },
            "swim": { "total": 0, "sources": [] },
            "climb": { "total": 0, "sources": [] },
            "fly": { "total": 0, "sources": [] },
            "burrow": { "total": 0, "sources": []  }
          },
          "alignment": "N",
          "backstory": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
          "appearance": { "age": 21, "gender": "male", "height": "", "weight": "" },
          "diety": "",
          "environment": "Urban",
          "favoredClass": { "name": "", "bonus": "+1 HP, Skill, or Galdur per Level" }
        },
        classes : {
          "warrior": { "levels": 1 },
          "barbarian": {
            "levels": 12,
            "special" : [ [], [ "Fast Movement (Ex)", "Rage (Ex)" ], [ "Rage Power (Ex) (REPLACE)", "Uncanny Dodge (Ex)" ], [ "Trap Sense (Ex)" ], [ "Rage Power (Ex) (REPLACE)" ], [ "Improved Uncanny Dodge (Ex)" ], [ "Rage Power (Ex) (REPLACE)" ], [ "Damage Reduction (Ex)" ], [ "Rage Power (Ex) (REPLACE)" ], [], [ "Rage Power (Ex) (REPLACE)" ], [ "Greater Rage (Ex)" ], [ "Rage Power (Ex) (REPLACE)" ], [], [ "Indomitable Will (Ex)", "Rage Power (Ex) (REPLACE)" ], [], [ "Rage Power (Ex) (REPLACE)" ], [ "Tireless Rage (Ex)" ], [ "Rage Power (Ex) (REPLACE)" ], [], [ "Mighty Rage (Ex)", "Rage Power (Ex) (REPLACE)" ] ] }
        },
        abilities : {
          "Racial Score Modifier": {
            "trigger": "Continuous",
            "description": "Humans get a +2 racial bonus to any one ability.",
            "benefit": "",
            "bonuses": {
              "Racial Ability (+)": { "value": 2, "targets": [ "Con" ], "type": "Racial" }
            },
            "extras": { "active": true, "showMain": false, "source": "Race" }
          }
        },
        attributes : {
          "Str": { "base": 15 },
          "Dex": { "base": 13 },
          "Con": { "base": 14 },
          "Int": { "base": 10 },
          "Wis": { "base": 12 },
          "Cha": { "base": 8 },
        },
        health : {},
        actions : {
          "melee": {},
          "ranged": {},
          "special": {}
        },
        skills : {
          "Acrobatics":                   { "ranks": 0, "class": true, "extras": { "notes": "" } },
          "Bluff":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Climb":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Diplomacy":                    { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Disable Device":               { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Disguise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Escape Artist":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Fly":                          { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Heal":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Intimidate":                   { "ranks": 4, "class": true, "extras": { "notes": "Std to demoralize" } },
          "Knowledge (arcana)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (dungeoneering)":    { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (local)":            { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (nature)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (planes)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (religion)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Perception":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Ride":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Sense Motive":                 { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Spellcraft":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Stealth":                      { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Survival":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Swim":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Use Magic Device":             { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Appraise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Artistry":                     { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
          "Craft":                        { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
          "Handle Animal":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (engineering)":      { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (geography)":        { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (history)":          { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Knowledge (nobility)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
          "Linguistics":                  { "ranks": 0, "class": false, "extras": { "notes": "", "languages": [ "Common", "Risko" ] } },
          "Lore":                         { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
          "Perform":                      { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
          "Profession":                   { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
          "Sleight of Hand":              { "ranks": 0, "class": false, "extras": { "notes": "" }  }
        },

        magic : {},
        inventory : [ { "label": "Magic Items", "extras": { "icon": "amulet" }, "children": [ { "label": "Head", "extras": { "capacity": 1 }, "children": [] }, { "label": "Headband", "extras": { "capacity": 1 }, "children": [] }, { "label": "Eyes", "extras": { "capacity": 1 }, "children": [] }, { "label": "Shoulders", "extras": { "capacity": 1 }, "children": [] }, { "label": "Neck", "extras": { "capacity": 1 }, "children": [] }, { "label": "Chest", "extras": { "capacity": 1 }, "children": [] }, { "label": "Body", "extras": { "capacity": 1 }, "children": [] }, { "label": "Belt", "extras": { "capacity": 1 }, "children": [] }, { "label": "Wrists", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 1", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 2", "extras": { "capacity": 1 }, "children": [] }, { "label": "Feet", "extras": { "capacity": 1 }, "children": [] }, { "label": "Slotless", "extras": { "capacity": 1 }, "children": [] } ] }, { "label": "Equipped", "extras": { "icon": "equipment" }, "children": [ { "label": "Armor", "extras": { "icon": "armor", "capacity": 1 }, "children": [] }, { "label": "Weapons", "extras": { "icon": "weapons" }, "children": [ { "label": "Hands", "extras": { "icon": "abilityPalm", "capacity": 2 }, "children": [] }, { "label": "Back", "extras": { "icon": "swordShield", "capacity": 2 }, "children": [] } ] } ] }, { "label": "Items", "extras": { "icon": "inventory" }, "children": [ { "label": "Backpack", "extras": { "icon": "backpack", "capacity": 50 }, "children": [] } ] } ],

        userSettings : { "cardTab": "main", "heroPoints": 1, "mainSections": [ "defense", "actions", "conditions" ], "expandInventory": [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ] },
        conditions : {},
        notes : {},
        userId : 2
      }

      ,
    };
  },
  computed: {
    rules() { return this.$store.state.data.rules; },
    races() { return this.$store.state.data.races; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },
    conditions() { return this.$store.state.data.conditions; },

    inventory() { return this.character.inventory; },
    abilities() {
      if (this.loading) { return {}; }
      let abilities = this.character.abilities;
      for (let actions of Object.entries(this.character.actions)) {
        if (actions[0] == "special" || actions[0] == "basic") {
          actions = actions[1];
          for (var action in actions) {
            if (!Object.keys(abilities).includes(action)) {
              abilities[action] = actions[action];
            }
          }
        }
      }
      return abilities;
    },


    // USES: <data>activeConditions, inventory, abilities
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
      // for (const condition in this.activeConditions) {
      //   if (this.activeConditions[condition].bonuses) {
      //     for (const [name, bonus] of Object.entries(this.activeConditions[condition].bonuses)) {
      //       bonuses[name] = bonus;
      //     }
      //   }
      // }
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

  },
  mounted() {
    console.log("rules", this.rules);
    console.log("races", this.races);
    console.log("classes", this.classes);



    CharacterService.getCharacter(this.$route.params.id).then(() => {
      // console.log('response:', response);
      // this.character = response.character[0];
      this.character = this.tmpSource;

      // Wait until we have rules to load stuff
      while (this.loading) {
        if (this.rules.size) {
          // this.init();
          this.loading = false;
        }
      }
    })
    .catch(err => { console.error(err); });
  },
  watch: {
    itemFilter(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    init() {
      console.log('init');
    },

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


    // Racial Methods
    onRaceChange() {
      let basics = this.character.basics;
      basics.type = this.races[basics.race].type;
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

    /***************************\
    *                           *
    *           Class           *
    *                           *
    \***************************/
    // onClassChange(value, direction) {
    //   if (direction == "right") {
    //     console.log(value);
    //     console.log(this.character.classes);
    //   }
    //
    // },
    addLevel() {
      console.log('pop up, get levels, show new, etc');
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




  }
}
</script>

<style lang="css" scoped>
h4 { margin: 0; }
.el-row { margin-bottom: 10px; }
.el-row label { margin: 0; }

.stat-controls > :not(:last-child) { margin-bottom: 20px; }
</style>
