<template lang="html">
  <div class="container" v-if="!loading">

    <el-row>
      <el-col :span="16">
        <h3>
          {{ character.name }}
          <el-tag effect="dark" type="info" v-if="advanced" style="margin-right:10px;">
            ID : {{ character.id }}
          </el-tag>
          <span v-if="character.basics.race && ['male','female','agander'].includes(character.basics.appearance.gender)">
            <el-button type="primary" @click="genRandomName()"> Random Name! </el-button>
          </span>
        </h3>
      </el-col>
      <!-- ADVANCED -->
      <el-col :span="8" style="display: flex; justify-content: space-evenly;">
        <el-switch v-model="advanced" inline-prompt active-text=" Advanced " inactive-text=" Normal " aria-label="Advanced Mode Switch" />
      </el-col>
    </el-row>

    <!-- BASICS -->
    <div>
      <el-row>
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

        <!-- Favored Class Bonus & Level -->
        <el-col :span="6">
          <el-row>
            <h4> <g-icon iconName="magicSwirl" /> Favored Class Bonus </h4>
            <el-select v-model="character.basics.favoredClass.name" aria-label="Favored Class Select">
              <el-option v-for="(cClass, cName) in this.classes" :key="cName" :label="cName" :value="cName" />
            </el-select>
            <el-input v-model="character.basics.favoredClass.bonus" aria-label="Favored Class Bonus Input" />
          </el-row>
          <el-row class="center-horz">
            <el-col :span="12">
              <el-input v-model="character.basics.cr" aria-label="Character Level" disabled>
                <template #prepend>Level</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="addLevel()">
                <g-icon iconSize="24px" iconName="sparkle" />
                <span style="padding:5px"> Level Up </span>
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <!-- Backstory, Settings, & Notes -->
      <el-row>
        <h4>Backstory</h4>
        <el-input v-model="character.basics.backstory" type="textarea" autosize aria-label="Backstory Textarea" />
      </el-row>
      <el-row>
        <h4>Notes</h4>
        <el-input v-model="character.notes" type="textarea" autosize aria-label="Notes Textarea" />
      </el-row>
      <h4>Character Settings</h4>
      <el-row>
        <el-col :span="4" class="center-vert"> Hero Points </el-col>
        <el-col :span="20"> <el-input-number v-model="character.userSettings.heroPoints" :min="0" :max="4" aria-label="Hero Points" /> </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center-vert"> Open Tab </el-col>
        <el-col :span="20">
          <el-select v-model="character.userSettings.cardTab" size="small" aria-label="View's Tab Select">
            <el-option label="Main" value="main" />
            <el-option label="Items" value="items" />
            <el-option label="Skills" value="skills" />
            <el-option label="Abilites" value="abilites" />
            <el-option label="Magic" value="magic" />
            <el-option label="Edit" value="edit" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center-vert"> Open Main Sections </el-col>
        <el-col :span="20">
          <el-select v-model="character.userSettings.mainSections" size="small" multiple aria-label="View's main tab open sections">
            <el-option label="Defense" value="defense" />
            <el-option label="Actions" value="actions" />
            <el-option label="Conditions" value="conditions" />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:30px;">
        <el-col :span="4" class="center-vert"> Open Inventory Sections </el-col>
        <el-col :span="20">
          <el-select v-model="character.userSettings.expandInventory" size="small" multiple aria-label="Gender Select">
            <el-option label="Magic Items" value="Magic Items" />
            <el-option label="Equipped" value="Equipped" />
            <el-option label="Armor" value="Armor" />
            <el-option label="Weapons" value="Weapons" />
            <el-option label="Hands" value="Hands" />
            <el-option label="Back" value="Back" />
            <el-option label="Items" value="Items" />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <el-collapse v-model="sectionsCollapse" v-if="!loading">

      <!-- ATTRIBUTES (ABILITIES) -->
      <el-collapse-item name="1">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="Compass" /> Attributes </h4>
          </el-divider>
        </template>

        <el-row>
          <el-col :span="12" class="center-horz">
            <svg width="225" height="200">
              <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
            </svg>
          </el-col>

          <el-col :span="12" class="center-horz center-vert">
            <div class="stat-controls">
              <el-row :gutter="10">
                <!-- Strength -->
                <el-col :span="2" class="center-vert">Str:</el-col>
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
                <el-col :span="2" :offset="1" class="center-vert">Int:</el-col>
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
                <el-col :span="2" class="center-vert">Dex:</el-col>
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
                <el-col :span="2" :offset="1" class="center-vert">Wis:</el-col>
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
                <el-col :span="2" class="center-vert">Con:</el-col>
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
                <el-col :span="2" :offset="1" class="center-vert">Cha:</el-col>
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

              <!-- Health -->
              <el-row :gutter="10">
                <el-col :span="4" class="center-horz">
                  <el-tag size="large" effect="dark" type="danger"> Damage </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.health.damage" :min="0" :max="character.health.total + attributes.Con.total" aria-label="Current Damage" />
                </el-col>
                <el-col :span="4" :offset="1" class="center-horz">
                  <el-tag size="large" effect="dark" type="warning"> Nonleathal </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.health.nonlethal" :min="0" :max="character.health.total+1" aria-label="Current Nonlethal Damage" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-progress
                    :percentage="Math.floor(((character.health.total-character.health.damage)/character.health.total)*100)"
                    :color="healthColors"
                    :text-inside="true"
                    :stroke-width="24"
                  >
                  {{ character.health.total-character.health.damage }} / {{ character.health.total }}
                  </el-progress>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>

      <!-- CLASSES -->
      <el-collapse-item name="2">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="magicSwirl" /> Classes </h4>
          </el-divider>
        </template>

        <div v-for="(cClass, cName) in character.classes" :key="cName">
          <el-divider> <h4> <g-icon iconName="magicSwirl" /> {{ capFirsts(cName) }} </h4> </el-divider>

          <el-row :gutter="10">
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
                  +{{ Math.floor(cClass.levels * this.classes[cName].fort.mult) + this.classes[cName].fort.bonus }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Reflex </template>
                  +{{ Math.floor(cClass.levels * this.classes[cName].ref.mult) + this.classes[cName].ref.bonus }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Will </template>
                  +{{ Math.floor(cClass.levels * this.classes[cName].will.mult) + this.classes[cName].will.bonus }}
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
                      <el-input v-model="character.classes[cName].special[level][index]" class="class-abil" :aria-label="`Class Ability: ${abil}`" disabled>
                        <template #prepend>Level {{ level }} </template>
                      </el-input>
                    </span>
                  </span>
                </span>
              </div>
            </el-col>
          </el-row>

          <!-- Magic -->
          <el-row v-if="this.classes[cName].magic" :gutter="10">
            <el-col :span="8">
              <el-descriptions :column="1" border >
                <el-descriptions-item>
                  <template #label> Caster Level </template>
                  {{ cClass.levels }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Casting Style </template>
                  {{ this.classes[cName].magic.style }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Casting Attribute </template>
                  {{ this.classes[cName].magic.castingAtr }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Spells Per Level </template>
                  {{ this.classes[cName].magic.spellsKnown.perLevel }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Galdur / <br> Spell Slots </template>
                  <el-switch
                    v-model="cClass.useGaldur"
                    inline-prompt active-text=" Galdur "
                    inactive-text=" Spell Slots "
                    aria-label="Casting Type Switch" />

                  <span v-if="cClass.useGaldur" style="margin-left: 20px;">
                    <el-tooltip placement="top" effect="light">
                      <el-tag effect="dark" type="info">
                        {{ cumulativeGaldur[cName].total }} Total Galdur
                      </el-tag>
                      <template #content>
                        <span v-for="bonus in cumulativeGaldur[cName].sources" :key="bonus"> {{ bonus+" " }} </span>
                      </template>
                    </el-tooltip>
                  </span>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="14" :offset="2">
              <div v-if="cClass.useGaldur">
                <el-row :gutter="10">
                  <el-col :span="4">
                    <el-tag effect="dark" type="primary"> Open Pool </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24"
                      :percentage=" Math.floor( ( (cClass.openTotal - cClass.openSpent) / cClass.openTotal ) * 100 ) "
                    >
                      {{ cClass.openTotal - cClass.openSpent }} / {{ cClass.openTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Spent Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.openSpent" :min="0" :max="cClass.openTotal" aria-label="Spent Open Galdur" />
                    </el-tooltip>
                  </el-col>
                    <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Total Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.openTotal" aria-label="Total Open Galdur" />
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row :gutter="10">
                  <el-col :span="4">
                    <el-tag effect="dark" type="warning"> Reserve Pool </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" status="warning"
                      :percentage=" Math.floor( ( (cClass.reserveTotal - cClass.reserveSpent) / cClass.reserveTotal ) * 100 ) "
                    >
                      {{ cClass.reserveTotal - cClass.reserveSpent }} / {{ cClass.reserveTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Spent Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.reserveSpent" :min="0" :max="cClass.reserveTotal" aria-label="Spent Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Total Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.reserveTotal" aria-label="Total Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row :gutter="10" v-if="this.classes[cName].magic.extraGaldur">
                  <el-col :span="4">
                    <el-tag effect="dark" type="info"> {{ this.classes[cName].magic.extraGaldur.poolName }} </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" color="#909399"
                      :percentage=" Math.floor( ( (this.classes[cName].magic.extraGaldur.total[cClass.levels] - cClass.extraSpent) / this.classes[cName].magic.extraGaldur.total[cClass.levels] ) * 100 ) "
                    >
                      {{ this.classes[cName].magic.extraGaldur.total[cClass.levels] - cClass.extraSpent }} / {{ this.classes[cName].magic.extraGaldur.total[cClass.levels] }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Spent Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.extraSpent" :min="0" :max="this.classes[cName].magic.extraGaldur.total[cClass.levels]" :aria-label="`Spent ${this.classes[cName].magic.extraGaldur.poolName} Galdur`" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>


              <div v-else>
                Spell Slots
                Level 1 : [Magic Missile], [xx], [xx]	// [] btn casts spell and disables in list, until rest
                Level 2 : [],[]
              </div>
            </el-col>
          </el-row>
          {{ cClass }} <br> <br>
          {{ this.classes[cName].magic }}

        </div>
      </el-collapse-item>

      <!-- ABILITIES -->
      <el-collapse-item name="3">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="abilityPalm" /> Abilites </h4>
          </el-divider>
        </template>

        <el-row class="center-horz" id="abilities" :gutter="5">
          <el-col :span="5">Name</el-col>
          <el-col :span="14">Description</el-col>
          <el-col :span="5">
            Actions
            <el-popconfirm title="Add New Ability?" icon-color="#626AEF" @confirm="addNewAbility">
              <template #reference>
                <el-button type="primary" size="small">New</el-button>
              </template>
              <template #actions="{ confirm }">
                <el-input v-model="abilName" size="small" placeholder="Ability Name" style="margin-bottom:5px;" />
                <el-button type="primary" size="small" @click="confirm" :disabled="abilName == ''">Yes</el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
        <el-divider style="margin-top: 5px;" />
        <el-collapse v-model="abilityCollapse">
          <el-collapse-item v-for="type in abilityTypes" :key="type" :title="type" :name="type">
            <div v-for="(abil, name) in abilities" :key="name">
              <el-row v-if="abil.extras.source == type" :gutter="5" style="margin-bottom:5px;">
                <el-col :span="5">
                  <el-tag size="small" effect="dark" type="primary"> {{ name }} </el-tag>
                </el-col>
                <el-col :span="14"> {{ abil.description }} </el-col>

                <!-- ABILITY ACTIONS -->
                <el-col :span="3">
                  <el-button size="small" style="width:95%; margin: 0;"
                    :type="abil.extras.active?'primary':'info'"
                    :disabled="abil.trigger=='Continuous'?true:false"
                    @click="toggleAbility(name, abil)"
                  >
                    {{ abil.trigger == "Toggle" ? "Free" : abil.trigger }}
                  </el-button>
                  <el-button size="small" style="width:95%; margin: 0;"
                    :type="abil.extras.showMain?'primary':'info'"
                    @click="abilShowMain(name, abil)"
                  >
                    {{ abil.extras.showMain ? "On Main" : "Just Here" }}
                  </el-button>
                </el-col>
                <el-col :span="2" class="center-horz;">
                  <el-button type="info" size="small" @click="editAbility(name, abil)">
                    <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
                  </el-button>
                  <el-popconfirm title="Are you sure to delete this?">
                    <template #reference>
                      <el-button type="danger" size="small" style="margin:0">
                        <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                      </el-button>
                    </template>
                    <template #actions="">
                      <el-button type="danger" size="small" @click="deleteAbil(name)">Yes</el-button>
                    </template>
                  </el-popconfirm>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-dialog v-model="editingAbil" width="800">
          <g-ability :newAbil="addAbil" :name="abilName" :source="abil" @save-abil="saveAbility"/>
        </el-dialog>

        <el-row id="conditions">
          conditions
          {{ character.conditions }}
          <!--


                    <el-row :gutter="20">
                <el-col :span="3">
                  <g-icon iconSize="32px" iconName="dizzyStar" />
                </el-col>
                <el-col :span="21">
                  <el-row>
                    <el-col :span="8" :offset="16">
                      < ! - - Conditions Dropdown - - >
                      <el-select
                        v-model="activeConditions"
                        value-key="name"
                        multiple
                        placeholder="Common Conditions"
                      >
                        <template #tag>
                          <el-tag v-for="(condition, index) in activeConditions" :key="condition" effect="dark" closable @close="activeConditions.splice(index, 1)"> {{ condition.name }} </el-tag>
                        </template>
                        <el-option v-for="item in conditions" :key="item.name" :label="item.name" :value="item" >
                          <div class="flex items-center">
                            <el-tag type="primary" style="margin-right: 8px" size="small" effect="dark" />
                            <span>{{ item.name }}</span>
                          </div>
                        </el-option>
                        <template #footer>
                          <el-button v-if="!addingCondition" text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
                        </template>
                      </el-select>

                      < ! - - Add New Condition - - >
                      <el-dialog v-model="addingCondition" title="New Condition" width="800">
                        <el-row :gutter="10">
                          <el-col :span="5">
                            <el-input v-model="newCondition.name" size="small" placeholder="Condition Name" />
                          </el-col>
                          <el-col :span="15">
                            <el-input v-model="newCondition.description" :rows="2" type="textarea" placeholder="Enter condition description" />
                          </el-col>
                        </el-row>

                        < ! - - New Condition Bonuses - - >
                        <el-divider> Bonuses </el-divider>
                        <el-row class="center-horz" :gutter="5" style="margin-bottom:5px;">
                          <el-col :span="5"> Name </el-col>
                          <el-col :span="4"> Value </el-col>
                          <el-col :span="5"> Targets </el-col>
                          <el-col :span="5">
                            <el-button size="small" type="primary" @click="addNewConditionBonus" style="margin-left:5px;"> New Bonus </el-button>
                          </el-col>
                        </el-row>
                        <el-row v-for="(bonus, name) in newCondition.bonuses" :key="name" :gutter="5" style="margin-bottom:5px;">
                          <el-col :span="5" class="center-horz">
                            <el-tag type="primary" effect="dark"> {{ name }} </el-tag>
                          </el-col>
                          <el-col :span="5"> <el-input-number v-model="bonus.value" size="small" /> </el-col>
                          <el-col :span="10">
                            <el-select v-model="bonus.targets" value-key="name" multiple placeholder="Modifier Target" >
                              <template #tag>
                                <el-tag v-for="(target, index) in bonus.targets" :key="target" effect="dark" closable @close="bonus.targets.splice(index, 1)"> {{ target }} </el-tag>
                              </template>
                              <el-option v-for="target in this.rules.targets" :key="target.label" :label="target.label" :value="target.value" >
                                <div class="flex items-center">
                                  <el-tag :color="target.color" style="margin-right: 8px" size="small" />
                                  <span :style="{ color: target.color }"> {{ target.label }} </span>
                                </div>
                              </el-option>
                            </el-select>
                          </el-col>
                          <el-col :span="2" class="center-horz">
                            <el-popconfirm title="Are you sure to delete this?">
                              <template #reference>
                                <el-button type="danger" circle size="small">
                                  <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                                </el-button>
                              </template>
                              <template #actions="">
                                <el-button type="danger" size="small" @click="delete this.newCondition.bonuses[name];"> Yes </el-button>
                              </template>
                            </el-popconfirm>
                          </el-col>
                        </el-row>

                        <el-divider />
                        <el-row>
                          <el-col :span="3" class="addCondition">
                            <el-button size="small" type="primary" @click="addCondition()">confirm</el-button>
                            <el-button size="small" @click="newCondition = {}; addingCondition = false;">cancel</el-button>
                          </el-col>
                        </el-row>
                      </el-dialog>
                    </el-col>
                  </el-row>

                  <el-row v-for="condition in activeConditions" :key="condition.name">
                    <el-col :span="6" class="center-vert">
                      {{ condition.name }}
                    </el-col>
                    <el-col :span="18" class="center-vert">
                      {{ condition.description }}
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

          -->
        </el-row>
      </el-collapse-item>

      <!-- SKILLS -->
      <el-collapse-item name="4">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="sparkle" /> Skills </h4>
          </el-divider>
        </template>
        <el-row id="skills" v-if="character.skills.Linguistics && character.skills.Linguistics.extras">
          <el-col :span="2"> Languages: </el-col>
          <el-col :span="21">
            <el-tag size="small" effect="dark" type="primary" v-for="language in character.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5"> <h5> Name (Ability) </h5> </el-col>
          <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="24px" iconName="magicSwirl" />
              <template #content> Class Skill </template>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="24px" iconName="sparkle" />
              <template #content> Ranks </template>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="24px" iconName="armor" />
              <template #content> Armor Penalty </template>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="24px" iconName="openBook" />
              <template #content> Background Skill </template>
            </el-tooltip>
          </el-col>
          <el-col :span="9" class="center-horz"> <h5> Notes </h5> </el-col>
        </el-row>

        <div v-for="(skill, name) in this.rules.skills" :key="name">
          <el-row style="margin-bottom:5px; border-bottom:1px solid grey">
            <el-col :span="5">
              {{ name }}
              <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
              ({{ skill.ability }})
            </el-col>
            <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
              <div style="width:25%">
                <el-checkbox v-model="character.skills[name].class" :aria-label="`${name} class skill`" />
              </div>
              <div style="width:25%">
                <span v-if="character.skills[name].ranks">
                  {{ character.skills[name].ranks }}
                </span>
              </div>
              <div style="width:25%">
                <g-icon v-if="skill.armor_pen" iconSize="15px" iconName="armor" />
              </div>
              <div style="width:25%">
                <g-icon v-if="skill.background" iconSize="15px" iconName="openBook" />
              </div>
            </el-col>
            <el-col :span="14" class="center-horz">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input type="textarea" v-model="character.skills[name].extras.notes" :autosize="{ minRows: 2, maxRows: 4 }" :aria-label="`${name} notes`" />
                </el-col>
                <el-col :span="9">
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
      </el-collapse-item>

      <!-- INVENTORY -->
      <el-collapse-item name="5">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="chest" /> Inventory </h4>
          </el-divider>
        </template>

        <el-row>
          <g-icon iconSize="16px" iconName="treasure" /> COINS
          <el-tag>
            Total (gp) : {{
              (character.coins.pp * 10)
              + (character.coins.gp * 1)
              + (character.coins.sp * 0.1)
              + (character.coins.cp * 0.01)            
            }}
          </el-tag>
          <br>

          <el-input v-model="character.coins.pp" >
            <template #prepend>
              Platinum
            </template>
            <template #append>
              <el-input v-model="character.coins.pp / 50" disabled>
                <template #suffix> lbs. </tempalte>
              </el-input>
            </template>
          </el-input>
          
		
		
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
      </el-collapse-item>

      <!-- SPELLS KNOWN -->
      <el-collapse-item name="6">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="spellBook" /> Spells Known </h4>
          </el-divider>
        </template>

        <el-popconfirm title="Learn New Spell?" hide-icon @confirm="addSpell">
          <template #reference>
            <el-button type="primary" size="large" ref="addSpell">Add Spell</el-button>
          </template>
          <template #actions="{ confirm }">
            Name: <br>
            <el-input v-model="this.newSpell.name" size="small" aria-label="New Spell Name" />
            Level: <br>
            <el-input-number v-model="this.newSpell.level" :min="0" :max="9" size="small" aria-label="New Spell Level" />
            Class: <br>
            <el-select v-model="this.newSpell.class" aria-label="New Spell Class">
              <el-option v-for="(cClass, cName) in this.classes" :key="cName" :label="cName" :value="cName" />
            </el-select>
            <el-button type="primary" size="small" @click="confirm" :disabled="this.newSpell.name == '' || this.newSpell.class == ''">Yes</el-button>
          </template>
        </el-popconfirm>

        <el-tabs v-model="spellsTab" type="card" ref="spellsTab">
          <el-tab-pane v-for="(cClass, cName) in character.spells" :key="cName" :label="capFirsts(cName)" :name="cName" >
            <el-collapse v-model="spellsCollapse">
              <el-collapse-item v-for="(spells, lvl) in cClass" :key="lvl" :name="lvl">

                <template #title>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-tag effect="dark"> Level {{ lvl }} Spells </el-tag>
                    </el-col>
                    <el-col :span="7">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info">
                          Save DC : {{ 10 + lvl + (this.attributes[this.classes[cName].magic.castingAtr].mod) }}
                        </el-tag>
                        <template #content>
                          10
                          + {{ this.attributes[this.classes[cName].magic.castingAtr].mod }} {{ this.classes[cName].magic.castingAtr }}
                          + {{ lvl }} Level Spell
                        </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="10">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info">
                          Defensive Casting DC : {{ 15 + (lvl * 2) }}
                        </el-tag>
                        <template #content>
                          When casting defensively to avoid an Attack of Opportunity <br>
                          15 + {{ lvl * 2 }} (Spell Level x 2)
                        </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </template>

                <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10">
                  <el-col :span="4" class="center-horz">
                    <el-popconfirm
                      hide-icon
                      :title="`Cast for ${spell.casts} Galdur?`"
                      confirm-button-text="Yes"
                      cancel-button-text="No"
                      @confirm="console.log('yep')"
                      @cancel="console.log('nnnope')"
                    >
                      <template #reference>
                        <el-button type="warning" plain> {{ sName }} </el-button>
                      </template>
                    </el-popconfirm>
                  </el-col>

                  <el-col :span="8">
                    <el-input type="textarea" v-model="spell.description" :autosize="{ minRows: 2, maxRows: 4 }" aria-label="Spell Description" />
                  </el-col>

                  <el-col :span="5">
                    <el-input v-model="spell.components" aria-label="Components">
                      <template #prepend>Components</template>
                    </el-input>
                    <el-input v-model="spell.castTime" aria-label="Casting Time">
                      <template #prepend>Casting Time</template>
                    </el-input>
                    <el-input v-model="spell.duration" aria-label="Duration">
                      <template #prepend>Duration</template>
                    </el-input>
                  </el-col>

                  <el-col :span="5">
                    <el-input v-model="spell.target" aria-label="Target">
                      <template #prepend>Target</template>
                    </el-input>
                    <el-input v-model="spell.range" aria-label="Range">
                      <template #prepend>Range</template>
                    </el-input>
                    <el-input v-model="spell.save" aria-label="Save">
                      <template #prepend>Save</template>
                    </el-input>
                  </el-col>

                  <el-col :span="2" class="center-horz">
                    Spell Resistence
                    <el-switch
                    v-model="spell.SR"
                    inline-prompt
                    active-text=" Yes SR "
                    inactive-text=" No SR "
                    aria-label="Spell Resistence Switch" />

                    <el-popconfirm title="Remove spell from spell list?" hide-icon @confirm="delete spells[sName]">
                      <template #reference>
                        <el-button type="danger" size="small">Forget Spell</el-button>
                      </template>
                      <template #actions="{ confirm }">
                        <el-button type="danger" size="small" @click="confirm">Yes</el-button>
                      </template>
                    </el-popconfirm>

                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>


    <!-- FOOTER -->
    <div style="text-align: right">
      <el-button type="primary" @click="saveCharacter()"> Save Changes </el-button>
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
import GAbility from '@/components/template/GAbility.vue';

export default {
  name: "Edit Character",
  components: { HexGraph, GItem, GAbility },
  data() {
    return {
      loading: true,
      advanced: false,
      sectionsCollapse: [ '' ],

      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      abilityCollapse: [],
      abilityTypes: [ "Trait", "Class", "Feat", "Other" ],
      addAbil: false,
      abilName: "",
      editingAbil: false,
      abil: {},

      addItem: false,
      editingItem: false,
      item: {},
      itemFilter: "",

      spellsTab: "",
      newSpell: {
        name: "",
        level: 0,
        class: ""
      },
      spellsCollapse: [],




      character: {},


      tmpSource: {
        id : 0,
        userId : 2,
        name : "Mit'a",
        basics : {
          "cr": 10,
          "size": "medium",
          "race": "Amaru",
          "type": {
            "name": "humanoid",
            "hd": 0,
            "levels": 0,
            "subtypes": [ "Lamia" ]
          },
          "speed": {
            "base": { "total": 30, "sources": [ "Racial Base" ] },
            "swim": { "total": 0, "sources": [] },
            "climb": { "total": 0, "sources": [] },
            "fly": { "total": 0, "sources": [] },
            "burrow": { "total": 0, "sources": []  }
          },
          "alignment": "LG",
          "backstory": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
          "appearance": { "age": 29, "gender": "male", "height": "7'2\"", "weight": "240 lbs." },
          "diety": "Lauriss",
          "environment": "Urban",
          "favoredClass": { "name": "Magus", "bonus": "+1 Galdur per Level" }
        },
        notes : "",
        userSettings : {
          "cardTab": "main",
          "heroPoints": 1,
          "mainSections": [ "defense", "actions", "conditions" ],
          "expandInventory": [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
        },

        attributes : {
          "Str": { "base": 16 },
          "Dex": { "base": 17 },
          "Con": { "base": 12 },
          "Int": { "base": 15 },
          "Wis": { "base": 10 },
          "Cha": { "base": 12 },
        },
        health : {
          "damage": 0,
          "nonlethal": 0,
          "total": 212,
          "sources": [ "+17d12", "+102 Con" ]
        },

        classes : {
          "magus": {
            "levels": 10,
            "useGaldur": true,
            "openSpent": 0,
            "openTotal": 20,
            "reserveSpent": 0,
            "reserveTotal": 20,
            "special": [ [],
              [ "Cantrips", "Arcane Pool (Su)", "Spell Combat (Ex)" ], [ "Spellstrike (Su)" ], [ "Magus Arcana (REPLACE)" ], [ "Spell Recall (Su)" ], [ "Bonus Feat (REPLACE)" ],
              [ "Magus Arcana (REPLACE)" ], [	"Knowledge Pool (Su)", "Medium Armor (Ex)" ], [ "Improved Spell Combat (Ex)" ], [ "Magus Arcana (REPLACE)" ], [ "Fighter Training (Ex)" ],
              [ "Improved Spell Recall (Su)", "Bonus Feat (REPALCE)" ], [ "Magus Arcana (REPLACE)" ], [ "Heavy Armor (Ex)" ], [ "Greater Spell Combat (Ex)" ], [ "Magus Arcana (REPLACE)" ],
              [ "Counterstrike (Ex)" ],  [ "Bonus Feat (REPLACE)" ], [ "Magus Arcana (REPLACE)" ], [ "Greater Spell Access (Su)" ], [ "True Magus (Su)" ]
            ]
          },
          "cleric": {
            "levels": 10,
            "useGaldur": true,
            "openSpent": 0,
            "openTotal": 20,
            "reserveSpent": 0,
            "reserveTotal": 20,
            "extraSpent": 0,
            "special": [ [],
              [ "Cantrips", "Arcane Pool (Su)", "Spell Combat (Ex)" ], [ "Spellstrike (Su)" ], [ "Magus Arcana (REPLACE)" ], [ "Spell Recall (Su)" ], [ "Bonus Feat (REPLACE)" ],
              [ "Magus Arcana (REPLACE)" ], [	"Knowledge Pool (Su)", "Medium Armor (Ex)" ], [ "Improved Spell Combat (Ex)" ], [ "Magus Arcana (REPLACE)" ], [ "Fighter Training (Ex)" ],
              [ "Improved Spell Recall (Su)", "Bonus Feat (REPALCE)" ], [ "Magus Arcana (REPLACE)" ], [ "Heavy Armor (Ex)" ], [ "Greater Spell Combat (Ex)" ], [ "Magus Arcana (REPLACE)" ],
              [ "Counterstrike (Ex)" ],  [ "Bonus Feat (REPLACE)" ], [ "Magus Arcana (REPLACE)" ], [ "Greater Spell Access (Su)" ], [ "True Magus (Su)" ]
            ]
          }
        },

        abilities : {
          "Pyromaniac": {
            "trigger": "Continuous",
            "description": "You are treated as 1 level higher when casting spells and abilities with the fire descriptor or that deal fire damage",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" },
          },
          "Darkvision": {
            "trigger": "Continuous",
            "description": "Amaru can see in the dark up to 60 feet",
            "benefit": { "target": "senses", "text": "Darkvision 60 ft." },
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Stability": {
            "trigger": "Continuous",
            "description": "+4 to CMD when resisting Bull Rush or Trip attempts",
            "benefit": { "target": "CMD", "text": "+4 vs Trp & Bull Rush" },
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Prehensile Tail": {
            "trigger": "Continuous",
            "description": "You can use your tail to pick up and cary small objects",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Hypnotic Gaze": {
            "trigger": "Standard",
            "description": "Can cast Hypnotism once a day for 1 round",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": false, "showMain": true, "source": "Trait" }
          },
          "Reactionary": {
            "trigger": "Continuous",
            "description": "+2 trait bonus on inititive checks",
            "benefit": {},
            "bonuses": {
              "Reactionary (+)": {
                "value": 2,
                "type": "Trait",
                "targets": [ "init" ]
              }
            },
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Drake Anatomist": {
            "trigger": "Continuous",
            "description": "+1 damage against dragons and +2 Knowledge (arcana) to identify them",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Bladed Magic": {
            "trigger": "Continuous",
            "description": "+1 Craft for magic weapons and weapon enhancement from arcane pool lasts for 2 minutes (not 1)",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Trait" }
          },
          "Spell Combat (Ex)": {
            "trigger": "Full-Round",
            "description": "You can make all your attacks at a -2 and also cast a spell with a cast time of 1 Standard Action.",
            "benefit": {},
            "bonuses": {
              "Spell Combat (-)": {
                "value": -2,
                "type": "Feat",
                "targets": [ "rangedAtkBonus", "meleeAtkBonus" ]
              }
            },
            "extras": { "active": true, "showMain": false, "source": "Class" },
          },
          "Weapon Finesse": {
            "trigger": "Continuous",
            "description": "You may use your Dex instead of Str for attacks made with light weapons, elven curve blades, rapiers, whips, or spiked chains.",
            "benefit": {},
            "bonuses": {},
            "extras": { "active": true, "showMain": false, "source": "Feat" },
          },
        },
        conditions : {},

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

        inventory : [ { "label": "Magic Items", "extras": { "icon": "amulet" }, "children": [ { "label": "Head", "extras": { "capacity": 1 }, "children": [] }, { "label": "Headband", "extras": { "capacity": 1 }, "children": [] }, { "label": "Eyes", "extras": { "capacity": 1 }, "children": [] }, { "label": "Shoulders", "extras": { "capacity": 1 }, "children": [] }, { "label": "Neck", "extras": { "capacity": 1 }, "children": [] }, { "label": "Chest", "extras": { "capacity": 1 }, "children": [] }, { "label": "Body", "extras": { "capacity": 1 }, "children": [] }, { "label": "Belt", "extras": { "capacity": 1 }, "children": [] }, { "label": "Wrists", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 1", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 2", "extras": { "capacity": 1 }, "children": [] }, { "label": "Feet", "extras": { "capacity": 1 }, "children": [] }, { "label": "Slotless", "extras": { "capacity": 1 }, "children": [] } ] }, { "label": "Equipped", "extras": { "icon": "equipment" }, "children": [ { "label": "Armor", "extras": { "icon": "armor", "capacity": 1 }, "children": [] }, { "label": "Weapons", "extras": { "icon": "weapons" }, "children": [ { "label": "Hands", "extras": { "icon": "abilityPalm", "capacity": 2 }, "children": [] }, { "label": "Back", "extras": { "icon": "swordShield", "capacity": 2 }, "children": [] } ] } ] }, { "label": "Items", "extras": { "icon": "inventory" }, "children": [ { "label": "Backpack", "extras": { "icon": "backpack", "capacity": 50 }, "children": [] } ] } ],
        coins: { "pp": 0, "gp": 152, "sp": 101, "cp": 21 },

        spells : {
          "magus": [
            {
              'Prestidigitation': {
                'casts': 0,
                'castTime': '1 Standard',
                'components': 'V,S',
                'target': 'Other',
                'range': '10 Ft',
                'duration': '1 Hour',
                'save': 'Other',
                'SR': false,
                'description': "You may perform minor tricks like: lift 1 pound, color, clean, or soil 1 cubic foot of items, chill, warm, or flavor 1 pound of nonliving material. No effects persist except moving, cleaning, and soiling."
              },
              'jolt': { 'description': 'does a zap' },
              'Dancing Lights': { 'description': 'Little Orbs follow you around' }
            },
            {
              'Shield': { 'description': 'Negates Magic Missile & grants a +4 Shield bonus to AC' }
            }
          ],
          "cleric": [
            {},
            {}
          ]
        }
      } // end tmpSource (Mit'a)

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
      // for (let actions of Object.entries(this.character.actions)) {
      //
      //   if (actions[0] == "special" || actions[0] == "basic") {
      //     actions = actions[1];
      //     for (var action in actions) {
      //       if (!Object.keys(abilities).includes(action)) {
      //         abilities[action] = actions[action];
      //       }
      //     }
      //   }
      // }
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

    openGaldur() {
      let open = {};
      open.total = 20;
      return open;
    },
    reserveGaldur() {
      let reserve = {};
      reserve.total = 20;
      return reserve;
    },

    cumulativeGaldur() {
      let classes = {
        "magus": { "total": 0, "sources": [] }, "cleric": { "total": 0, "sources": [] }
      };
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
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
          // Put [Add Spell] btn in class spells tabs, wait til refs loaded
          setTimeout(() => {
            const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
            spellTabs.appendChild(this.$refs.addSpell.$el);
          }, 10);
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
    addLevel() {
      console.log('pop up, get levels, show new, etc');
    },
    // updateAbilities() {
    //   let abilities = this.character.abilities;
    //   let lvl = this.character.basics.cr;
    //
    //   /*
    //   1. loop on classes
    //   2. loop on levels
    //   3. loop on class abilities
    //   4. if special.name is not in ABILITIES => Add it
    //   */
    //   for (const cClass of Object.values(this.character.classes)) {
    //     cClass.special.forEach((abils, level) => {
    //       if (level <= lvl) {
    //         abils.forEach(abil => {
    //           if ( !Object.keys(abilities).includes(abil) ) {
    //             abilities[abil] = {
    //               "trigger": "Continuous",
    //               "description": "PLEASE UPDATE THIS ENTRY",
    //               "benefit": {},
    //               "bonuses": {},
    //               "extras": { "active": false, "showMain": false, "source": "Class" }
    //             };
    //           }
    //         });
    //       }
    //     });
    //   }
    // },



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
  width: 210px;
  margin: 2px;
}
.class-abil .el-input-group__prepend {
	padding: 0 10px !important;
}

.stat-controls .el-progress-bar__inner {
  text-align: center;
}
</style>
