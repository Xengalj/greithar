<template lang="html">
  <div v-if="!loading" class="container">

    <!-- NAME & ADVANCED -->
    <el-row :gutter="10" align="middle">
      <el-col :xs="24" :span="12">
        <h3>
          {{ character.name }}
          <el-tag v-if="advanced" type="info" plain> ID : {{ character.id }} </el-tag>
        </h3>
      </el-col>
      <el-col :xs="0" :sm="9" :md="10"></el-col>
      <el-col :xs="24" :sm="3" :md="2" style="display: flex; justify-content: space-evenly;">
        <el-switch v-model="advanced" inline-prompt active-text=" Advanced " inactive-text=" Normal " aria-label="Advanced Mode Switch" />
      </el-col>
    </el-row>

    <!-- Level Up -->
    <el-row :gutter="10" justify="center">
      <el-col :xs="12" :sm="6" :md="6">
        <el-input v-model="character.classes.total.levels" aria-label="Character Level" disabled>
          <template #prepend>Level</template>
        </el-input>
      </el-col>
      <el-col :xs="12" :sm="5" :md="3">
        <el-popconfirm title="Choose a class" @confirm="openLevelDialog" hide-icon :hide-after="2000">
          <template #reference>
            <el-button type="primary">
              <g-icon iconSize="24px" iconName="sparkle" />
              <span style="padding:5px"> Level Up </span>
            </el-button>
          </template>
          <template #actions="{ confirm }">
            <el-select v-model="newLevelClass.name" @change="onClassSelect" aria-label="New Level Class" style="margin-bottom:5px">
              <el-option-group v-for="group in classSelect" :key="group.label" :label="group.label">
                <el-option v-for="name in group.options" :key="name" :label="capFirsts(name)" :value="name" />
              </el-option-group>
            </el-select>
            <el-button type="primary" size="small" @click="confirm" :disabled="newLevelClass.name == ''"> Go! </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>

    <!-- Save, View, Back btns -->
    <el-row :gutter="10" justify="center">
      <el-col :xs="6" :sm="3" :md="2" class="center-horz" style="margin-bottom:10px;">
        <el-button @click="this.$router.push({ name: 'character-view', params: { id: character.id } })" type="info"> View </el-button>
      </el-col>
      <el-col :xs="10" :sm="5" :md="3" class="center-horz">
        <el-button @click="saveCharacter()" type="primary"> Save Changes </el-button>
      </el-col>
      <el-col :xs="14" :sm="6" :md="4" class="center-horz">
        <el-button @click="$router.push({ name: 'character-list' })" type="warning" plain> Back to All Characters </el-button>
      </el-col>
    </el-row>


    <el-collapse v-model="sectionsCollapse" v-if="!loading">
      <!-- BASICS -->
      <el-collapse-item name="0">
        <template #title>
          <el-divider style="max-width:75%">
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" :iconName="character.basics.type.name" style="margin:0" /> Basics
            </el-col>
            <el-col :xs="0" :sm="24">
              <h4> <g-icon iconSize="32px" :iconName="character.basics.type.name" /> Basics </h4>
            </el-col>
          </el-divider>
        </template>

        <el-row :gutter="10" align="middle" class="basics">
          <!-- Name -->
          <el-col :xs="24" :sm="10" :md="6">
            <el-input v-model="character.name" aria-label="Character Name">
              <template #prepend>Name</template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="4" :md="3" v-if="character.basics.race && ['male','female','agender'].includes(character.settings.appearance.gender)" class="center-horz">
            <el-button @click="genRandomName()" type="primary" size="small" aria-label="Create Random Name"> Random Name! </el-button>
          </el-col>
          <el-col :xs="24" :sm="0" :md="9"></el-col>
          <!-- User -->
          <el-col :xs="24" :sm="10" :md="6">
            <el-select v-if="advanced && $store.state.auth.user.roles.includes('admin')" v-model="character.user.id" placeholder="Choose User" aria-label="User Select">
              <template #label="{ label }">
                <span>{{ label }}</span>
              </template>
              <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id">
                <span>{{ user.username }}</span>
              </el-option>
            </el-select>
          </el-col>

          <!-- Gender -->
          <el-col :xs="24" :sm="12" :md="6">
            <div v-if="advanced">
              <el-input v-model="character.settings.appearance.gender" aria-label="Custom Gender Input">
                <template #prepend>Gender</template>
              </el-input>
            </div>
            <div v-else>
              <el-select v-model="character.settings.appearance.gender" aria-label="Gender Select">
                <el-option v-if="races.races[character.basics.race].male" label="Male" value="male" />
                <el-option v-if="races.races[character.basics.race].female" label="Female" value="female" />
                <el-option v-if="races.races[character.basics.race].agender" label="Agender" value="agender" />
              </el-select>
            </div>
          </el-col>
          <!-- Race -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-select v-model="character.basics.race" @change="onRaceChange()" placeholder="Choose Race" aria-label="Race Select">
              <el-option v-for="(race, name) in races.races" :key="name" :label="name" :value="name" />
            </el-select>
          </el-col>
          <!-- Creature Type -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-input v-model="character.basics.type" disabled aria-label="Creature Type">
              <template #prepend> Type </template>
            </el-input>
          </el-col>
          <!-- Subtype(s) -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-select v-model="character.basics.subtypes" multiple filterable allow-create aria-label="Subtypes Select">
              <el-option label="Lamia" value="Lamia" />
              <el-option label="Harpy" value="Harpy" />
              <el-option label="Catfolk" value="Catfolk" />
              <el-option label="Satyr" value="Satyr" />
              <el-option label="Reptilian" value="Reptialian" />
              <el-option label="Human" value="Human" />
            </el-select>
          </el-col>

          <!-- Age -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-tooltip placement="top" effect="light">
              <el-input v-model="character.settings.appearance.age" :min="1" aria-label="Age Input">
                <template #prepend>Age</template>
              </el-input>
              <template #content v-if="character.basics.race">
                <span v-for="(range, name) in races.races[character.basics.race].age" :key="name">
                  {{ name }} : {{ range }} <br>
                </span>
              </template>
            </el-tooltip>
          </el-col>
          <!-- Height -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-tooltip placement="right" effect="light">
              <el-input v-model="character.settings.appearance.height" aria-label="Height Input">
                <template #prepend>Height</template>
              </el-input>
              <template #content>
                <span v-if="['male','female','agander'].includes(character.settings.appearance.gender)">
                  {{ races.races[character.basics.race][character.settings.appearance.gender].height }}
                </span>
                <span v-else>Choose within reason</span>
              </template>
            </el-tooltip>
          </el-col>
          <!-- Weight -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-tooltip placement="right" effect="light">
              <el-input v-model="character.settings.appearance.weight" aria-label="Weight Input">
                <template #prepend>Weight</template>
                <template #suffix>lbs.</template>
              </el-input>
              <template #content>
                <span v-if="['male','female','agander'].includes(character.settings.appearance.gender)">
                  {{ races.races[character.basics.race][character.settings.appearance.gender].weight }}
                </span>
                <span v-else>Choose within reason</span>
              </template>
            </el-tooltip>
          </el-col>
          <!-- Size -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-input v-model="character.basics.size" disabled aria-label="Size Display">
              <template #suffix>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                  Space: {{ rules.size[character.basics.size].space }}
                </span>
              </template>
            </el-input>
          </el-col>

          <!-- Alignment -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-input v-model="character.basics.alignment" aria-label="Alignment Input">
              <template #prepend>Alignment</template>
            </el-input>
          </el-col>
          <!-- Diety -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-input v-model="character.settings.deity" aria-label="Worship Input">
              <template #prepend>Diety</template>
            </el-input>
          </el-col>
          <!-- Speed -->
          <el-col :xs="24" :sm="12" :md="6">
            <el-input v-model="character.basics.speed.base.total" disabled aria-label="Base Speed">
              <template #prepend>Speed</template>
              <template #suffix>ft.</template>
            </el-input>
          </el-col>
        </el-row>
      </el-collapse-item>

      <!-- ATTRIBUTES (ABILITIES) -->
      <el-collapse-item name="1">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="Compass" style="margin:0" /> Attributes
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="Compass" /> Attributes
            </el-col>
          </h4> </el-divider>
        </template>

        <el-row style="padding-top:10px;">
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
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Str.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Str.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Str.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Str.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Str.base" :min="1" aria-label="Base Strength Input" />
                </el-col>
                <!-- Intelligence -->
                <el-col :span="2" :offset="1" class="center-vert">Int:</el-col>
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Int.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Int.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Int.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Int.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Int.base" :min="1" aria-label="Base Intelligence Input" />
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- Dexterity -->
                <el-col :span="2" class="center-vert">Dex:</el-col>
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Dex.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Dex.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Dex.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Dex.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Dex.base" :min="1" aria-label="Base Dexterity Input" />
                </el-col>
                <!-- Wisdom -->
                <el-col :span="2" :offset="1" class="center-vert">Wis:</el-col>
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Wis.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Wis.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Wis.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Wis.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Wis.base" :min="1" aria-label="Base Wisdom Input" />
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- Constitution -->
                <el-col :span="2" class="center-vert">Con:</el-col>
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Con.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Con.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Con.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Con.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Con.base" :min="1" aria-label="Base Constitution Input" />
                </el-col>
                <!-- Charisma -->
                <el-col :span="2" :offset="1" class="center-vert">Cha:</el-col>
                <el-col :span="3">
                  <el-tooltip v-if="attributes.Cha.sources[0]" placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info"> {{ attributes.Cha.total }} </el-tag>
                    <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                  </el-tooltip>
                  <el-tag v-else size="large" effect="dark" type="info"> {{ attributes.Cha.total }} </el-tag>
                  <el-tag size="small" effect="dark" type="primary"> {{ attributes.Cha.mod }} </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Cha.base" :min="1" aria-label="Base Charisma Input" />
                </el-col>
              </el-row>

              <!-- Health -->
              <el-row :gutter="10">
                <el-col :span="5" class="center-horz">
                  <el-tag size="large" effect="dark" type="danger"> Damage </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.health.damage" :min="0" :max="character.health.total + attributes.Con.total" aria-label="Current Damage" />
                </el-col>
                <el-col :offset="1" :span="5" class="center-horz">
                  <el-tag size="large" effect="dark" type="warning"> Nonleathal </el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.health.nonlethal" :min="0" :max="character.health.total+1" aria-label="Current Nonlethal Damage" />
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-progress
                    v-if="character.health.total > 0"
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
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="magicSwirl" style="margin:0" /> Classes
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="magicSwirl" /> Classes
            </el-col>
          </h4> </el-divider>
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
                <el-descriptions-item v-if="cClass.hd">
                  <template #label> HD </template>
                  {{ cClass.levels }}d{{ cClass.hd }}
                </el-descriptions-item>
                <el-descriptions-item v-if="cClass.hd">
                  <template #label> Fort </template>
                  +{{ Math.floor(cClass.levels * cClass.saves.fort.mult) + cClass.saves.fort.bonus }}
                </el-descriptions-item>
                <el-descriptions-item v-if="cClass.hd">
                  <template #label> Reflex </template>
                  +{{ Math.floor(cClass.levels * cClass.saves.ref.mult) + cClass.saves.ref.bonus }}
                </el-descriptions-item>
                <el-descriptions-item v-if="cClass.hd">
                  <template #label> Will </template>
                  +{{ Math.floor(cClass.levels * cClass.saves.will.mult) + cClass.saves.will.bonus }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="6">
              <span v-if="cClass.hd">
                <div v-if="classes[cName] && classes[cName].alignment.length < 9">
                  Allowed Alignments <br>
                  <el-tag size="small" effect="dark" type="primary" v-for="name in classes[cName].alignment" :key="name" style="margin-left:10px;">
                    {{ name }}
                  </el-tag>
                </div>
                <div v-if="classes[cName]">
                  Class Skills <br>
                  <el-tag size="small" effect="dark" type="primary" v-for="name in classes[cName].skills" :key="name" style="margin-left:10px;">
                    {{ name }}
                  </el-tag>
                </div>
                <div v-if="classes[cName]">
                  Proficiencies <br>
                  <el-tag size="small" effect="dark" type="primary" v-for="item in classes[cName].proficiency" :key="item" style="margin-left:10px;">
                    {{ item }}
                  </el-tag>
                </div>
              </span>
            </el-col>

            <el-col :span="14">
              <h5 class="center-horz"> Special Abilities </h5>
              <div class="class-abils">
                <span v-for="(abilities, level) in cClass.abilities" :key="level">
                  <span v-for="id in abilities" :key="id">
                    <span v-for="(abil, index) in character.abilities" :key="index">
                      <el-input v-if="abil.extras.id == id" v-model="abil.name" class="class-abil" :aria-label="`Class Ability: ${abil}`" disabled>
                        <template #prepend>Level {{ level }} </template>
                      </el-input>
                    </span>
                  </span>
                </span>
              </div>
            </el-col>
          </el-row>

          <!-- Magic -->
          <el-row v-if="cClass.magic" :gutter="10">
            <el-col :span="8">
              <el-descriptions :column="1" border >
                <el-descriptions-item>
                  <template #label> Caster Level </template>
                  {{ cClass.magic.casterLevel }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Casting Style </template>
                  {{ cClass.magic.style }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Casting Attribute </template>
                  {{ cClass.magic.castingAtr }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Spells Per Level </template>
                  <span v-if="classes[cName]">
                    <span v-if="classes[cName].magic.spellsKnown.total">
                      {{ classes[cName].magic.spellsKnown.total }}
                    </span>
                    <span v-if="classes[cName].magic.spellsKnown.perLevel">
                      {{ classes[cName].magic.spellsKnown.perLevel }}
                    </span>
                    <span v-if="classes[cName].magic.spellsKnown.byLevel">
                      {{ classes[cName].magic.spellsKnown.byLevel[cClass.levels] }}
                    </span>
                  </span>
                  <span v-else>
                    <el-tag effect="plain" type="warning"> You must use the wiki </el-tag>
                  </span>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Galdur / <br> Spell Slots </template>
                  <el-switch v-model="cClass.magic.useGaldur" inline-prompt active-text=" Galdur " inactive-text=" Spell Slots " :disabled="!cClass.magic.galdur" aria-label="Casting Style Switch" />
                  <span v-if="cClass.magic.useGaldur" style="margin-left: 20px;">
                    <el-tooltip placement="top" effect="light">
                      <el-tag effect="dark" type="info"> {{ cumulativeGaldur[cName].total }} Total Galdur </el-tag>
                      <template #content>
                        <span v-for="bonus in cumulativeGaldur[cName].sources" :key="bonus"> {{ bonus+" " }} </span>
                      </template>
                    </el-tooltip>
                  </span>
                </el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="14" :offset="2">
              <!-- GALDUR -->
              <div v-if="cClass.magic.useGaldur">
                <el-row :gutter="10" align="middle">
                  <el-col :span="4">
                    <el-tag effect="dark" type="primary"> Open Pool </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" :percentage=" Math.floor( ( cClass.magic.galdur.openRemaining / cClass.magic.galdur.openTotal ) * 100 ) ">
                      {{ cClass.magic.galdur.openRemaining }} / {{ cClass.magic.galdur.openTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.magic.galdur.openRemaining" :min="0" :max="cClass.magic.galdur.openTotal" aria-label="Remaining Open Galdur" />
                    </el-tooltip>
                  </el-col>
                    <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Total Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.magic.galdur.openTotal" aria-label="Total Open Galdur" />
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row :gutter="10" align="middle">
                  <el-col :span="4">
                    <el-tag effect="dark" type="warning"> Reserve Pool </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" status="warning" :percentage=" Math.floor( ( cClass.magic.galdur.reserveRemaining / cClass.magic.galdur.reserveTotal ) * 100 ) ">
                      {{ cClass.magic.galdur.reserveRemaining }} / {{ cClass.magic.galdur.reserveTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.magic.galdur.reserveRemaining" :min="0" :max="cClass.magic.galdur.reserveTotal" aria-label="Remaining Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Total Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.magic.galdur.reserveTotal" aria-label="Total Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-if="classes[cName].magic.extraGaldur">
                  <el-col :span="4">
                    <el-tag effect="dark" type="info"> {{ classes[cName].magic.extraGaldur.poolName }} </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" color="#909399" :percentage=" Math.floor( ( cClass.magic.galdur.extraRemaining / cClass.magic.extraTotal ) * 100 ) ">
                      {{ cClass.magic.galdur.extraRemaining }} / {{ cClass.magic.galdur.extraTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.magic.galdur.extraRemaining" :min="0" :max="cClass.magic.galdur.extraTotal" :aria-label="`Remaining ${classes[cName].magic.extraGaldur.poolName} Galdur`" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>

              <!-- PREPARED -->
              <div v-else-if="cClass.magic.style.includes('Prepared')">
                <el-row :gutter="10" v-for="(numOfSpells, level) in cClass.magic.spellsPerDay" :key="level">
                  <el-col :span="2">
                    Level {{ level }}
                  </el-col>
                  <el-col :span="22">
                    <span v-for="num in numOfSpells" :key="num">
                      <el-select v-model="cClass.magic.preparedSpells[level][num-1]" :aria-label="`Prepared Spell Select for Level ${level} Number ${num}`" filterable allow-create style="max-width:33%">
                        <el-option v-for="(spell, name) in character.spells[cName][level]" :key="name" :label="name" :value="name" >
                          {{ name }}
                        </el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
              </div>

              <!-- SPONTANEOUS -->
              <!--
              <div v-else>
                <el-row :gutter="10" v-for="(numOfSpells, level) in classes[cName].magic.spellsPerDay[cClass.levels]" :key="level">
                  <el-col :span="4">
                    <el-tag effect="dark" type="primary">
                      Level {{ level }}
                     </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :percentage=" Math.floor( ( cClass.remainingCasts[level] / (numOfSpells == '∞' ? 1 : numOfSpells) ) * 100 ) " :text-inside="true" :stroke-width="24">
                      {{ cClass.remainingCasts[level] }} / {{ numOfSpells }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" v-if="advanced && level > 0" class="center-horz">
                    <el-tooltip content="Remaining Spells Today" placement="top" effect="light">
                      <el-input-number v-model="cClass.remainingCasts[level]" :min="0" :max="numOfSpells" aria-label="Remaining Spells Today" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
            -->
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>

      <!-- ABILITIES -->
      <el-collapse-item name="3">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="abilityPalm" style="margin:0" /> Abilities
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="abilityPalm" /> Abilities
            </el-col>
          </h4> </el-divider>
        </template>
        <el-row :gutter="5" justify="space-between">
          <el-col :xs="4" :sm="2" :span="5">Name</el-col>
          <el-col :xs="0" :sm="14" :span="14" class="center-horz">Description</el-col>
          <el-col :xs="8" :sm="4" :span="5">
            Actions
            <el-button type="success" size="small" @click="addNewAbility()"> New </el-button>
          </el-col>
        </el-row>
        <el-divider style="margin-top: 5px;" />
        <el-collapse v-model="abilityCollapse">
          <el-collapse-item v-for="type in abilityTypes" :key="type" :title="type" :name="type">
            <div v-for="(abil, index) in abilities" :key="index">
              <el-row v-if="abil.extras.category == type" :gutter="5" style="margin-bottom:5px;" justify="space-between">
                <el-col :xs="10" :sm="5"> <el-tag size="small" effect="dark" type="primary"> {{ abil.name }} </el-tag> </el-col>
                <el-col :xs="0" :sm="12" :span="14"> {{ abil.description }} </el-col>
                <el-col :xs="10" :sm="6">
                  <el-row>
                    <el-col :xs="14" :span="16" class="center-horz">
                      <el-button size="small" style="width:95%; margin: 0;"
                        :type="abil.extras.active?'primary':'info'"
                        :disabled="abil.trigger=='Continuous'?true:false"
                        @click="toggleAbility(abil)" >
                        {{ abil.trigger == "Toggle" ? "Free" : abil.trigger }}
                      </el-button>
                      <el-switch v-model="abil.extras.showMain" active-text="On Main" inactive-text="Just Here" inline-prompt />
                    </el-col>
                    <el-col :xs="0" :span="8" class="center-horz;">
                      <el-button type="info" size="small" @click="editAbility(abil)">
                        <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
                      </el-button>
                      <el-popconfirm title="Are you sure to delete this?">
                        <template #reference>
                          <el-button type="danger" size="small" style="margin:0">
                            <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                          </el-button>
                        </template>
                        <template #actions="">
                          <el-button type="danger" size="small" @click="deleteAbil(index)">Yes</el-button>
                        </template>
                      </el-popconfirm>
                    </el-col>
                    <el-col :xs="10" :span="0" class="center-horz;">
                      <el-button type="info" size="small" @click="dialogWidth = 355; editAbility(abil)">
                        <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
                      </el-button>
                      <el-popconfirm :title="`Are you sure to delete ${abil.name}?`">
                        <template #reference>
                          <el-button type="danger" size="small" style="margin:0">
                            <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                          </el-button>
                        </template>
                        <template #actions="">
                          <el-button type="danger" size="small" @click="deleteAbil(index)">Yes</el-button>
                        </template>
                      </el-popconfirm>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>

          <!-- Attacks -->
          <el-collapse-item name="atacks">
            <template #title>
              <g-icon iconSize="32px" iconName="swordShield" /> Special Actions
            </template>
            <el-row :gutter="10" justify="space-between">
              <el-col :span="16">
                This section is for any extra attacks you may have like natural bite attacks or other unique damage dealling abilities
              </el-col>
              <el-col :span="3">
                <el-popconfirm title="Add New Attack?" @confirm="addNewAttack" hide-icon>
                  <template #reference>
                    <el-button type="success" size="small">New</el-button>
                  </template>
                  <template #actions="{ confirm }">
                    <el-tooltip content="Number of Attacks" effect="light" placement="top">
                      <el-input-number v-model="atkNum" :min="1" size="small" style="margin-bottom:5px" aria-label="Number of Attacks" />
                    </el-tooltip>
                    <el-input v-model="atkName" size="small" style="margin-bottom:5px;" placeholder="Attack Name" aria-label="New Attack Name" />
                    <el-button @click="confirm" :disabled="atkName == ''" type="primary" size="small" aria-label="Create New Attack">Yes</el-button>
                  </template>
                </el-popconfirm>
              </el-col>
            </el-row>
            <el-divider />
            <el-row v-for="(atk, name) in character.actions" :key="name" :gutter="10">
              <el-col :span="2" class="center-horz">
                <el-tag size="large" effect="dark" type="primary">
                  {{ atk.atkNum > 1 ? atkNum : '' }}  {{ name }}
                </el-tag> <br><br><br>
                <el-popconfirm title="Are you sure to delete this?">
                  <template #reference>
                    <el-button type="danger" size="small" style="margin:0">
                      <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button type="danger" size="small" @click="delete character.actions[name]; this.$message({ message: `${name} was removed from attacks`, type: 'warning' });">Yes</el-button>
                  </template>
                </el-popconfirm>
              </el-col>
              <el-col :span="7">
                <span v-for="(dmg, size) in atk.Damage" :key="size">
                  <el-input v-model="atk.Damage[size]" size="small" :aria-label="`Attack Damage Size ${size}`" style="max-width: 45%; margin: 5px;">
                    <template #prepend> {{ size }} </template>
                  </el-input>
                </span>
              </el-col>
              <el-col :span="4">
                <el-select v-model="atk['Damage Type']" size="small" multiple aria-label="Damage Types Select">
                  <el-option v-for="type in this.rules['Damage Types'].Weapon" :key="type.label" :label="type.label" :value="type.label">
                    <el-tag color="#E63415" style="margin-right: 8px" size="small" />
                    <span style="color:#E63415"> {{ type.label }} </span>
                  </el-option>
                  <el-option v-for="type in this.rules['Damage Types'].Energy" :key="type.label" :label="type.label" :value="type.label">
                    <el-tag color="#42d4f4" style="margin-right: 8px" size="small" />
                    <span style="color:#42d4f4"> {{ type.label }} </span>
                  </el-option>
                  <el-option v-for="type in this.rules['Damage Types'].Aligned" :key="type.label" :label="type.label" :value="type.label">
                    <el-tag color="#FFDE0A" style="margin-right: 8px" size="small" />
                    <span style="color:#FFDE0A"> {{ type.label }} </span>
                  </el-option>
                  <el-option v-for="type in this.rules['Damage Types'].Misc" :key="type.label" :label="type.label" :value="type.label">
                    <el-tag color="#3cb44b" style="margin-right: 8px" size="small" />
                    <span style="color:#3cb44b"> {{ type.label }} </span>
                  </el-option>
                  <el-option v-for="type in this.rules['Damage Types'].Substance" :key="type.label" :label="type.label" :value="type.label">
                    <el-tag color="#FF6600" style="margin-right: 8px" size="small" />
                    <span style="color:#FF6600"> {{ type.label }} </span>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input v-model="atk.Critical" size="small" aria-label="Attack Critical">
                  <template #prepend> Crit </template>
                </el-input>
                <el-input v-model="atk.Range" size="small" aria-label="Additional Attack Reach" style="margin-top:10px">
                  <template #prepend> Reach </template>
                </el-input>
                <el-input v-model="atk.Proficiency" size="small" aria-label="Attack Proficiency" style="margin-top:10px">
                  <template #prepend> Proficiency </template>
                </el-input>
                <el-input v-model="atk.Category" size="small" aria-label="Attack Group" style="margin-top:10px">
                  <template #prepend> Group </template>
                </el-input>
              </el-col>
              <el-col :span="7">
                Extras {{ atk.Extras }}
                <el-row v-for="(extra, index) in atk.Extras" :key="index" :gutter="5">
                  <el-col :span="24">
                    <el-input v-model="atk.Extras[index]" :aria-label="`Extra ${index+1} Input`">
                      <template #append>
                        <el-button @click="deleteAtkExtra(name, index)" style="display: flex;">
                          <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
                        </el-button>
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
                <el-button size="small" type="primary" @click="addAtkExtra(name)"> Add Note </el-button>
              </el-col>
            </el-row>
          </el-collapse-item>

          <!-- Conditions -->
          <el-collapse-item name="conditions">
            <template #title>
              <g-icon iconSize="32px" iconName="dizzyStar" /> Conditions
            </template>
            <el-row :gutter="10" justify="end">
              <el-col :span="8">
                <el-select v-model="character.conditions" value-key="name" multiple placeholder="Common Conditions" aria-label="Conditions Select">
                  <template #tag>
                    <el-tag v-for="(condition, index) in character.conditions" :key="condition" effect="dark" closable @close="character.conditions.splice(index, 1)"> {{ condition.name }} </el-tag>
                  </template>
                  <el-option v-for="item in conditions" :key="item.name" :label="item.name" :value="item" >
                    <el-tag type="primary" style="margin-right: 8px" size="small" effect="dark"> {{ item.name }} </el-tag>
                  </el-option>
                  <template #footer>
                    <el-button text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
                  </template>
                </el-select>
              </el-col>
            </el-row>
            <el-divider> Active </el-divider>
            <el-row v-for="condition in character.conditions" :key="condition.name" justify="space-between" align="middle">
              <el-col :xs="12" :sm="6">
                <el-tag type="info" size="large" effect="dark"> {{ condition.name }} </el-tag>
              </el-col>
              <el-col :xs="0" :sm="12"> {{ condition.description }} </el-col>
              <el-col :xs="3" :sm="6">
                <el-tag v-if="condition.extras && condition.extras.duration" size="small" effect="dark" type="warning" style="color:black">
                  {{ condition.extras.duration.left }} {{ condition.extras.duration.label }}
                </el-tag>
                &nbsp;
                <el-button type="info" size="small" circle @click="editCondition(condition)">
                  <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
                </el-button>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>

      <!-- SKILLS -->
      <el-collapse-item name="4">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="sparkle" style="margin:0" /> Skills
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="sparkle" /> Skills
            </el-col>
          </h4> </el-divider>
        </template>
        <el-row id="skills" v-if="character.skills.Linguistics && character.skills.Linguistics.extras">
          <el-col :span="2"> Languages: </el-col>
          <el-col :span="21">
            <el-tag size="small" effect="dark" type="primary" v-for="language in character.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
          </el-col>
        </el-row>

        <el-row :gutter="10" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="5" class="center-vert"> <h5> Name (Ability) </h5> </el-col>
          <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
            <div style="width:25%">
              <el-tooltip placement="top" effect="light">
                <g-icon iconSize="28px" iconName="sparkle" />
                <template #content> Ranks </template>
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
                      <el-option v-for="name in races.races[character.basics.race].languages" :key="name" :label="name" :value="name" >
                        {{ name }}
                      </el-option>
                    </el-select>
                  </span>
                  <span v-if="name == 'Fly'">
                    <el-select v-model="character.skills.Fly.extras.maneuverability" default-first-option :reserve-keyword="false" aria-label="Flight Maneuverability Select">
                      <el-option label="Flightless" value="Flightless"> Flightless </el-option>
                      <el-option label="Clumsy" value="Clumsy"> Clumsy </el-option>
                      <el-option label="Poor" value="Poor"> Poor </el-option>
                      <el-option label="Average" value="Average"> Average </el-option>
                      <el-option label="Good" value="Good"> Good </el-option>
                      <el-option label="Perfect" value="Perfect"> Perfect </el-option>
                    </el-select>
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
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="chest" style="margin:0" /> Inventory
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="chest" /> Inventory
            </el-col>
          </h4> </el-divider>
        </template>
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
            <el-button type="primary" @click="editItem({})">Add Item</el-button>
          </el-col>
        </el-row>
        <el-tree
          :data="character.inventory"
          ref="tree"
          draggable
          render-after-expand
          node-key="label"
          :default-expanded-keys="character.settings.expandInventory"
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
            <el-col :span="3">
              <el-input-number v-if="data.value" v-model="data.value.Amount" :min="0" size="small" aria-label="Number of Items" />
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
      </el-collapse-item>

      <!-- SPELLS KNOWN -->
      <el-collapse-item name="6">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="spellBook" style="margin:0" /> Spells Known
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="spellBook" /> Spells Known
            </el-col>
          </h4> </el-divider>
        </template>

        <el-popconfirm title="Learn New Spell?" @confirm="addSpell" hide-icon :hide-after="1000">
          <template #reference>
            <el-button type="primary" size="large" ref="addSpell">Add Spell</el-button>
          </template>
          <template #actions="{ confirm }">
            Name: <br>
            <el-input v-model="newSpell.name" size="small" aria-label="New Spell Name" />
            Level: <br>
            <el-input-number v-model="newSpell.level" :min="0" :max="9" size="small" aria-label="New Spell Level" />
            Class: <br>
            <el-select v-model="newSpell.class" aria-label="New Spell Class">
              <el-option v-for="(cClass, cName) in character.classes" :key="cName" :label="capFirsts(cName)" :value="cName" />
            </el-select>
            <el-button type="primary" size="small" @click="confirm" :disabled="newSpell.name == '' || newSpell.class == ''">Yes</el-button>
          </template>
        </el-popconfirm>

        <el-tabs v-model="spellsTab" type="card" ref="spellsTab" style="padding-top:10px;">
          <el-tab-pane v-for="(cClass, cName) in character.spells" :key="cName" :label="capFirsts(cName)" :name="cName" >
            {{cName}}
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
                          Save DC : {{ 10 + lvl + (attributes[character.classes[cName].magic.castingAtr].mod) }}
                        </el-tag>
                        <template #content>
                          10
                          + {{ attributes[character.classes[cName].magic.castingAtr].mod }} {{ character.classes[cName].magic.castingAtr }}
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
                    <el-button type="warning" plain> {{ sName }} </el-button>
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

                    <el-popconfirm title="Remove spell from spell list?" @confirm="delete spells[sName]" hide-icon>
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

      <!-- CHARACTER EXTRAS -->
      <el-collapse-item name="7">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="openScroll" style="margin:0" /> Extras
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="openScroll" /> Extras
            </el-col>
          </h4> </el-divider>
        </template>

        <el-row :gutter="10" justify="center">
          <el-col :span="12">

            <el-collapse v-model="settingsCollapse">
              <el-collapse-item title="Settings" name="settings">
                <el-descriptions :column="1" border >
                  <el-descriptions-item v-if="advanced" >
                    <template #label> Player / NPC </template>
                    <el-switch v-model="character.settings.isNPC" inline-prompt active-text=" NPC " inactive-text=" PLAYER " aria-label="Player / NPC Switch" />
                  </el-descriptions-item>
                  <el-descriptions-item >
                    <template #label> Campaigns </template>
                    <el-row :gutter="10" justify="space-between" align="middle">
                      <el-col :xs="24" :sm="12" :md="20">
                        <el-tag v-for="campaign in character.campaigns" :key="campaign.id" size="small" effect="dark" type="primary">
                          {{ campaign.name }}
                        </el-tag>
                      </el-col>
                      <el-col :xs="24" :sm="12" :md="3">
                        <el-popover :hide-after="2000" :width="300" trigger="click" style="width: 240px">
                          <template #reference>
                            <el-button type="success" circle> <g-icon iconName="createScroll" iconSize="24px" iconColor="#000" /> </el-button>
                          </template>
                          <template #default>
                            <el-input v-model="campaignName" placeholder="Enter Campaign Name" aria-label="Canmpaign Name">
                              <template #append>
                                <el-button @click="findCampaign"> Search </el-button>
                              </template>
                            </el-input>
                            <div v-if="campaigns.length">
                              <el-select v-model="campaign" @change="loadEncounters" aria-label="Confirm Campaign">
                                <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign" >
                                  {{ campaign.user.username }}'s {{ campaign.name }} ({{ campaign.id }})
                                </el-option>
                              </el-select>
                              <span v-if="campaign.id">
                                <span> Join {{ campaign.name }}? </span>
                                <el-button @click="joinCampaign" type="success" size="small" aria-label="Join Campaign"> Yes </el-button>
                              </span>
                            </div>
                          </template>
                        </el-popover>
                      </el-col>
                    </el-row>
                  </el-descriptions-item>
                  <el-descriptions-item v-if="character.settings.isNPC" >
                    <template #label> Encounter </template>
                    <el-row justify="space-between" align="middle">
                      <el-col :span="12">
                        <el-select v-model="encounter" size="small" filterable>
                          <el-option v-for="encounter in encounters" :key="encounter.id" :label="encounter.name" :value="encounter" />
                        </el-select>
                      </el-col>
                      <el-col :span="3">
                        <el-button v-if="encounter.id" @click="joinEncounter" type="success" size="small" aria-label="Join Encounter"> Join </el-button>
                      </el-col>
                    </el-row>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label> Hero Points </template>
                    <el-input-number v-model="character.settings.heroPoints" :min="0" :max="4" size="small" aria-label="Hero Points" />
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label> Open Tab </template>
                    <el-select v-model="character.settings.cardTab" size="small" aria-label="View's Tab Select">
                      <el-option label="Main" value="Main" />
                      <el-option label="Items" value="Items" />
                      <el-option label="Skills" value="Skills" />
                      <el-option label="abilities" value="abilities" />
                      <el-option label="Spells" value="Spells" />
                      <el-option label="Edit" value="Edit" />
                    </el-select>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label> Open Main Secions </template>
                    <el-select v-model="character.settings.mainSections" multiple size="small" aria-label="View's main tab open sections">
                      <el-option label="Defense" value="defense" />
                      <el-option label="Actions" value="actions" />
                      <el-option label="Resources" value="resources" />
                    </el-select>
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template #label> Open Inventory Sections </template>
                    <el-select v-model="character.settings.expandInventory" multiple size="small" aria-label="Gender Select">
                      <el-option label="Magic Items" value="Magic Items" />
                      <el-option label="Equipped" value="Equipped" />
                      <el-option label="Armor" value="Armor" />
                      <el-option label="Weapons" value="Weapons" />
                      <el-option label="Hands" value="Hands" />
                      <el-option label="Back" value="Back" />
                      <el-option label="Items" value="Items" />
                    </el-select>
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>

              <el-collapse-item title="Backstory" name="backstory">
                <el-row>
                  <el-col :span="4" class="center-vert"> Backstory </el-col>
                  <el-col :span="20">
                    <el-input v-model="character.basics.backstory" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" aria-label="Backstory Textarea" />
                  </el-col>
                </el-row>
              </el-collapse-item>

              <el-collapse-item title="Notes" name="Notes">
                <el-row>
                  <el-col :span="4" class="center-vert"> Notes </el-col>
                  <el-col :span="20">
                    <el-input v-model="character.notes" type="textarea" :autosize="{ minRows: 2, maxRows: 20 }" aria-label="Notes Textarea" />
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>

          <el-col :span="12">
            <el-divider style="margin: 24px 0 10px 0"> Bonuses </el-divider>
            <div class="center-horz">
              <el-row :gutter="5">
                <el-col :span="6"> <el-tag effect="dark" type="primary"> Name </el-tag> </el-col>
                <el-col :span="2" class="center-horz"> <el-tag effect="dark" type="primary"> Value </el-tag> </el-col>
                <el-col :span="4" class="center-horz"> <el-tag effect="dark" type="primary"> Type </el-tag> </el-col>
                <el-col :span="12"> <el-tag effect="dark" type="primary"> Targets </el-tag> </el-col>
                <el-divider style="margin: 5px 0 10px 0" />
              </el-row>
              <el-row v-for="(bonus, name) in bonuses" :key="name" :gutter="5">
                <el-col :span="6"> {{ name }} </el-col>
                <el-col :span="2" class="center-horz"> {{ bonus.value }} </el-col>
                <el-col :span="4" class="center-horz"> {{ bonus.type }} </el-col>
                <el-col :span="12"> {{ bonus.targets }} </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>

      <!-- ADMIN EDIT -->
      <el-collapse-item name="8" v-if="advanced">
        <template #title>
          <el-divider style="max-width:75%"> <h4>
            <el-col :xs="24" :span="0">
              <g-icon iconSize="26px" iconName="lockedBook" style="margin:0" /> Admin Edit
            </el-col>
            <el-col :xs="0" :sm="24">
              <g-icon iconSize="32px" iconName="lockedBook" /> Admin Edit
            </el-col>
          </h4> </el-divider>
        </template>

        <el-row :gutter="10" align="middle">
          <el-col :xs="24" :sm="6" :md="4">
            <el-row :gutter="10">
              <el-col :xs="12" class="center-horz">
                <el-button @click="copySection('character', character)" type="info"> Copy Character </el-button>
              </el-col>
              <el-col :xs="12" class="center-horz">
                <el-button @click="loadJSON('character', characterJSON)" type="warning"> Update Character </el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="18" :md="20">
            <el-input type="textarea" v-model="characterJSON" :autosize="{ minRows: 5, maxRows: 20 }" aria-label="Admin Character JSON Input" />
          </el-col>
        </el-row>

        <div v-for="(section, name) in character" :key="name">
          <el-row v-if="['inventory', 'basics', 'notes', 'classes', 'abilities', 'actions', 'skills', 'spells' ].includes(name)" :gutter="10" justify="center" align="middle">
            <el-col :xs="24" :sm="6" :md="4">
              <el-row :gutter="10">
                <el-col :xs="12" class="center-horz">
                  <el-button @click="copySection(name, character[name])" type="info"> Copy {{ capFirsts(name) }} </el-button>
                </el-col>
                <el-col :xs="12" class="center-horz">
                  <el-button @click="loadJSON(name, sectionsJSON[name])" type="warning"> Update {{ capFirsts(name) }} </el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="18" :md="20">
              <el-input type="textarea" v-model="sectionsJSON[name]" :autosize="{ minRows: 5, maxRows: 20 }" :aria-label="`Admin ${name} JSON Input`" />
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- Dialog -->
    <el-auto-resizer style="height: 10px">
      <template #default="{ width }">
        <el-dialog v-model="dialog" :width="width" @close="showAbil=false; showItem=false; showCondition=false; showCustomClass=false; addingLevel=false;">
          <g-item v-if="showItem" :source="item" @save-item="saveItem"/>
          <g-ability v-if="showAbil" :source="abil" @save-abil="saveAbility"/>
          <g-condition v-if="showCondition" :source="condition" @save-condition="saveCondition"/>

          <!-- CUSTOM LEVEL -->
          <div v-if="showCustomClass">
            <h2> <g-icon iconName="magicSwirl" /> Create Custom Class </h2>
            <el-row justify="center">
              <el-descriptions :column="1" border >
                <el-descriptions-item>
                  <template #label> Class Name </template>
                  <el-input v-model="customClass.name" placeholder="Enter Name" aria-label="Custom Class Name" />
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Hit Die </template>
                  <el-input-number v-model="customClass.hd" :min="0" :max="12" aria-label="Custom Class Hit Die">
                    <template #prefix>
                      <span>d</span>
                    </template>
                  </el-input-number>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> BAB Progression </template>
                  <el-select v-model="customClass.bab" aria-label="Custom Class BAB Progression">
                    <el-option label="Slow (Level x 0.5)" :value="0.5" > Slow </el-option>
                    <el-option label="Medium (Level x 0.75)" :value="0.75" > Medium </el-option>
                    <el-option label="Fast (Level x 1)" :value="1" > Fast </el-option>
                  </el-select>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Saves </template>
                  <el-row :gutter="10">
                    <el-col :xs="24" :sm="8" :md="8">
                      <el-tag effect="dark" type="primary"> Fortitude </el-tag>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <el-select v-model="customClass.saves.fort" value-key="id" aria-label="Custom Class Fort Save">
                        <el-option v-for="item in saves" :key="item.id" :label="item.id" :value="item" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :xs="24" :sm="8" :md="8">
                      <el-tag effect="dark" type="primary"> Reflex </el-tag>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <el-select v-model="customClass.saves.ref" value-key="id" aria-label="Custom Class Ref Save">
                        <el-option v-for="item in saves" :key="item.id" :label="item.id" :value="item" />
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :xs="24" :sm="8" :md="8">
                      <el-tag effect="dark" type="primary"> Will </el-tag>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <el-select v-model="customClass.saves.will" value-key="id" aria-label="Custom Class Will Save">
                        <el-option v-for="item in saves" :key="item.id" :label="item.id" :value="item" />
                      </el-select>
                    </el-col>
                  </el-row>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Skill Ranks </template>
                  <el-input-number v-model="customClass.ranks" :min="0" :max="10" aria-label="Custom Class Ranks" />
                  (+ Int Mod)
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Class Skills </template>
                  <el-select v-model="customClass.skills" value-key="skill" aria-label="Custom Class Fort Save" multiple>
                    <el-option v-for="(data, skill) in rules.skills" :key="skill" :label="skill" :value="skill" />
                  </el-select>
                </el-descriptions-item>
              </el-descriptions>
            </el-row>

            <el-row v-if="!customClass.magic" justify="center">
              <el-button @click="customClass.magic = {}" size="large" type="success"> Add Magic </el-button>
            </el-row>

            <el-row v-if="customClass.magic" justify="center">
              <el-descriptions :column="1" border >
                <el-descriptions-item>
                  <template #label> Casting Style </template>
                  <el-input v-model="customClass.magic.style" aria-label="New Class Magic Style" />
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Casting Attribute </template>
                  <el-select v-model="customClass.magic.castingAtr" value-key="key" aria-label="Custom Class Magic Attribute">
                    <el-option v-for="(item, key) in attributes" :key="key" :label="key" :value="key" > {{ key }} </el-option>
                  </el-select>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label> Spells per Day </template>
                  <el-input type="textarea" v-model="customClass.magic.spellsPerDayTable" :autosize="{ minRows: 1, maxRows: 4 }" aria-label="Custom Class Spells Per Day" />
                </el-descriptions-item>
              </el-descriptions>
            </el-row>

            <el-row justify="center">
              <el-tag size="large" effect="plain" type="warning">
                Special Abilities must be manually added upon levelup
              </el-tag>
            </el-row>

            <el-row justify="center">
              <el-button type="primary" size="large" @click="this.showCustomClass = false; openLevelDialog()" :disabled="!customClass.name && customClass.name == 'custom'"> Go! </el-button>
            </el-row>
          </div>

          <!-- LEVEL UP -->
          <div v-if="addingLevel">
            <h2> <g-icon iconName="magicSwirl" /> Level {{ newLevel.level }} {{ capFirsts(newLevelClass.name) }} </h2>

            <!-- New Abilities -->
            <div>
              <el-row :gutter="10" align="middle">
                <el-divider> <h3> Abilities </h3> </el-divider>
              </el-row>
              <el-row :gutter="10" v-for="ability in newLevel.abilities" :key="ability" align="middle">
                <el-col :xs="24" :sm="12" :md="12">
                  <el-input v-model="ability.name" :aria-label="`Class Ability: ${ability}`">
                    <template #prepend> Name </template>
                  </el-input>
                  <el-input v-if="advanced" v-model="ability.extras.id" size="small" disabled>
                    <template #prepend> ID </template>
                  </el-input>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12">
                  <el-input v-model="ability.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="Enter ability description" aria-label="Ability Description"/>
                </el-col>
              </el-row>
              <el-row :gutter="10" justify="center" align="middle">
                <el-button @click="addClassAbility" type="success"> New </el-button>
              </el-row>
            </div>

            <!-- New Magic -->
            <div v-if="newLevelClass.magic">
              <el-row :gutter="10" align="middle">
                <el-divider> <h3> Magic </h3> </el-divider>
              </el-row>
              <el-row :gutter="10">
                <el-col :xs="24" :sm="12" :md="8" style="margin-bottom:10px">
                  <el-descriptions :column="1" border >
                    <el-descriptions-item>
                      <template #label> Casting Style </template>
                      {{ newLevelClass.magic.style }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label> Casting Attribute </template>
                      {{ newLevelClass.magic.castingAtr }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label> Galdur / <br> Spell Slots </template>
                      <el-switch
                      v-model="newLevelClass.useGaldur"
                      inline-prompt active-text=" Galdur "
                      inactive-text=" Spell Slots "
                      :disabled="!newLevelClass.magic.galdur"
                      aria-label="Casting Type Switch" />
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template #label>
                        {{ newLevelClass.useGaldur ? "Additional Galdur" : "Total Spell Slots" }}
                      </template>
                      {{
                        newLevelClass.useGaldur ?
                        newLevelClass.magic.galdur[newLevel.level] :
                        newLevelClass.magic.spellsPerDayTable[newLevel.level]
                      }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <div v-if="newLevelClass.magic.spellsKnown" class="center-horz" style="margin-top:10px">
                    <!-- Cleric Total -->
                    <span v-if="newLevelClass.magic.spellsKnown.total">
                      {{ newLevelClass.magic.spellsKnown.total }}
                    </span>
                    <!-- Wizard Initial -->
                    <span v-else-if="newLevel.level == 1 && newLevelClass.magic.spellsKnown.starting">
                      Add {{ newLevelClass.magic.spellsKnown.starting }}
                    </span>
                    <!-- Wizard By Level -->
                    <span v-else-if="newLevelClass.magic.spellsKnown.perLevel">
                      Add {{ newLevelClass.magic.spellsKnown.perLevel }}
                    </span>
                    <!-- Bard By Level -->
                    <span v-else-if="newLevelClass.magic.spellsKnown.byLevel[newLevel.level]">
                      Add
                      <span v-for="(num, index) in newLevelClass.magic.spellsKnown.byLevel[newLevel.level]" :key="index">
                        {{ num }} level {{ index }}s{{ newLevelClass.magic.spellsKnown.byLevel[newLevel.level].length-1 > index ? ', and ' : '' }}
                      </span>
                    </span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="16">
                  <el-row v-for="(spell, index) in newLevel.newSpells" :key="index" :gutter="10" justify="center">
                    <el-col :xs="3" :sm="2" :md="1">
                      <el-popconfirm title="Remove spell from spell list?" @confirm="newLevel.newSpells.splice(index, 1)" hide-icon>
                        <template #reference>
                          <el-button type="danger" size="small" circle>
                            <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                          </el-button>
                        </template>
                        <template #actions="{ confirm }">
                          <el-button type="danger" size="small" @click="confirm">Yes</el-button>
                        </template>
                      </el-popconfirm>
                    </el-col>
                    <el-col  :xs="12" :sm="9" :md="5">
                      <el-tooltip placement="top" content="Spell Level">
                        <el-input-number v-model="spell.level" :min="0" :max="9" size="small" aria-label="New Spell Level" />
                      </el-tooltip>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="18">
                      <el-input v-model="spell.name" size="small" aria-label="New Spell Name">
                        <template #prepend> Name </template>
                      </el-input>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" justify="center" align="middle">
                    <el-button @click="newLevel.newSpells.push({ 'name': '', 'level': 0, 'class': newLevelClass.name })" type="success"  ref="addSpell">
                      Add Spell
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
            </div>

            <!-- New Skills -->
            <div>
              <el-row :gutter="10" align="middle">
                <el-divider> <h3> Skills </h3> </el-divider>
              </el-row>
              <el-row :gutter="10" align="middle" style="margin-bottom:5px; border-bottom:1px solid grey">
                <el-col :xs="18" :sm="8" :md="6"> <h5> Name (Ability) </h5> </el-col>
                <el-col :xs="0" :sm="4" :md="4">
                  <el-row justify="space-evenly" style="margin:0">
                    <el-col :span="2">
                      <el-tooltip placement="top" effect="light">
                        <g-icon iconSize="24px" iconName="magicSwirl" />
                        <template #content> Class Skill </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="2">
                      <el-tooltip placement="top" effect="light">
                        <g-icon iconSize="24px" iconName="armor" />
                        <template #content> Armor Penalty </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="2">
                      <el-tooltip placement="top" effect="light">
                        <g-icon iconSize="24px" iconName="openBook" />
                        <template #content> Background Skill </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="3" :sm="2" :md="4">
                  <el-tooltip placement="top" effect="light">
                    <g-icon iconSize="24px" iconName="sparkle" />
                    <template #content> Current Ranks </template>
                  </el-tooltip>
                </el-col>
                <el-col :xs="12" :sm="5" :md="5" :style=" (newRanks > Math.max(1, newLevelClass.ranks + attributes.Int.mod)) || (backgroundRanks > 2) ? 'color:red' : ''">
                  {{ newRanks }} / {{ Math.max(1, newLevelClass.ranks + attributes.Int.mod) }} New Ranks
                </el-col>
                <el-col :xs="12" :sm="5" :md="5" :style=" (newRanks > Math.max(1, newLevelClass.ranks + attributes.Int.mod)) || (backgroundRanks > 2) ? 'color:red' : ''">
                  {{ backgroundRanks }} / 2 New Background Ranks
                </el-col>
              </el-row>

              <el-row v-for="(skill, name) in rules.skills" :key="name" :gutter="10" style="margin-bottom:5px; border-bottom:1px solid grey">
                <el-col :xs="18" :sm="8" :md="6">
                  {{ name }}
                  <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
                  ({{ skill.ability }})
                </el-col>
                <el-col :xs="0" :sm="4" :md="4">
                  <el-row justify="space-evenly" style="margin:0">
                    <el-col :span="2">
                      <g-icon v-if="character.skills[name].class" iconSize="20px" iconName="magicSwirl" />
                    </el-col>
                    <el-col :span="2">
                      <g-icon v-if="skill.armor_pen" iconSize="20px" iconName="armor" />
                    </el-col>
                    <el-col :span="2">
                      <g-icon v-if="skill.background" iconSize="20px" iconName="openBook" />
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="3" :sm="2" :md="4">
                  <el-tag :effect="character.skills[name].ranks ? 'dark' : 'plain'">
                    {{ character.skills[name].ranks }}
                  </el-tag>
                </el-col>
                <el-col :xs="12" :sm="5" :md="5">
                  <el-input-number v-model="newLevel.skills[name].newRanks" :min="0"
                  :max="(character.classes.total.levels+1) - (character.skills[name].ranks + newLevel.skills[name].backgroundRanks?newLevel.skills[name].backgroundRanks:0)"
                  size="small" aria-label="New Ranks">
                  <template #suffix>
                    <g-icon v-if="newLevel.skills[name].newRanks>0" iconSize="20px" iconName="sparkle" iconColor="var(--el-color-warning)" />
                    </template>
                  </el-input-number>
                </el-col>
                <el-col :xs="12" :sm="5" :md="5">
                  <el-input-number v-if="skill.background" v-model="newLevel.skills[name].backgroundRanks" :min="0"
                  :max="Math.min(2, character.classes.total.levels+1-character.skills[name].ranks-newLevel.skills[name].newRanks)"
                  size="small" aria-label="New Background Ranks">
                  <template #suffix>
                    <g-icon v-if="newLevel.skills[name].backgroundRanks>0" iconSize="20px" iconName="sparkle" iconColor="var(--el-color-warning)" />
                    </template>
                  </el-input-number>
                </el-col>
              </el-row>
            </div>

            <el-row justify="center">
              <el-button
                type="primary"
                @click="addLevel()"
                :disabled="
                (newRanks == 0) ||
                (newRanks > Math.max(1, newLevelClass.ranks + attributes.Int.mod)) ||
                (backgroundRanks > 2) ||
                (backgroundRanks == 0)"
              >
                Confirm Level Up
              </el-button>
            </el-row>
          </div> <!-- end level up -->
        </el-dialog>
      </template>
    </el-auto-resizer>


  </div>
</template>

<script>
import UserService from "@/services/user.service";
import CharacterService from "@/services/character.service";
import CampaignService from "@/services/campaign.service";
import EncounterService from "@/services/encounter.service";

import HexGraph from '@/components/template/HexGraph.vue';
import GItem from '@/components/template/GItem.vue';
import GAbility from '@/components/template/GAbility.vue';
import GCondition from '@/components/template/GCondition.vue';

export default {
  name: "Edit Character",
  components: { HexGraph, GItem, GAbility, GCondition },
  data() {
    return {
      loading: true,
      character: {},
      users: {},
      advanced: this.$store.state.auth.user.roles.includes('admin'),

      sectionsCollapse: [ '0' ],
      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      abilityCollapse: [],
      abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],
      abilID: 0,
      abilNames: [],
      atkNum: 0,
      atkName: "",

      itemFilter: "",

      spellsTab: "",
      newSpell: { name: "", level: 0, class: "" },
      spellsCollapse: [],

      // Extras Section
      settingsCollapse: [],

      campaignName: "",
      campaigns: [],
      campaign: {},

      encounterName: "",
      encounters: [],
      encounter: {},
      encountersLoading: false,

      // Dialogs
      dialog: false,
      dialogWidth: 750,
      abil: {},
      showAbil: false,
      item: {},
      showItem: false,
      condition: {},
      showCondition: false,


      // Level Up
      classSelect: [
        { label: 'Current Classes', options: [] },
        { label: 'New Classes', options: [] }
      ],
      showCustomClass: false,
      customClass: {}, // data for new class
      // saves select in custom class
      saves: [
        { id: "Good", data: { mult: 0.5, bonus: 2 } },
        { id: "Bad", data: { mult: 0.33, bonus: 0 } }
      ],

      addingLevel: false,
      newLevel: { class: '' },
      newLevelClass: {},

      // Drawer
      characterJSON: "",
      sectionsJSON: {},

      temp: '',

    };
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    feats() { return JSON.parse(localStorage.getItem('feats')); },
    actions() { return JSON.parse(localStorage.getItem('actions')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },
    currentUser() { return this.$store.state.auth.user; },

    activeConditions() { return this.character.conditions; },
    // inventory() { return this.character.inventory; },
    abilities() { return this.character.abilities; },

    // USES: activeConditions, inventory, abilities
    bonuses() {
      let bonuses = {};
      if (this.loading) { return bonuses; }

      for (let [name, val] of Object.entries(this.races.races[this.character.basics.race].abilityMods)) {
        bonuses[`Racial ${name} Bonus`] = {};
        bonuses[`Racial ${name} Bonus`].type = "Racial";
        bonuses[`Racial ${name} Bonus`].targets = [ name ];
        bonuses[`Racial ${name} Bonus`].value = val;
      }

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
      let item = this.character.inventory[1].children[0].children[0];
      if (item) {
        bonuses[item.label] = {};
        bonuses[item.label].type = "Armor";
        bonuses[item.label].targets = item.value.targets;
        bonuses[item.label].value = item.value["AC Bonus"];
      }
      // Shields          For items in equipment . equipped . hands
      for (const item of this.character.inventory[1].children[1].children[0].children) {
        if (item.value.Proficiency == "Shields") {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = item.value.targets;
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . (slotted) Magic Items
      for (const slot of this.character.inventory[0].children) {
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
        this.bonusLoop(attributes[name], name);
        attributes[name].mod = Math.floor( (name == "-" ? 0 : attributes[name].total - 10) / 2 );
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
    if (!this.rules.size) { this.$router.push("/"); }

    if ( this.currentUser.roles.includes("admin") ) {
      UserService.getAllUsers()
      .then(response => { this.users = response.data.rows.map((user) => { return {'username': user.username, 'id': user.id} } ); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
      console.log("Character", response);
      this.character = response.character;
      if (!this.character.user) { this.character.user = {} }

      // TODO: if toon has resources instead of allies
      if (this.character.resources) { this.updateStructure(); }

      // TODO: Feats and Default Actions stuff

      // Set up the Class Select for levelup
      for (let cName of Object.keys(this.character.classes)) {
        if (cName != "total") {
          this.classSelect[0].options.push(cName);
        }
      }
      for (let cName of Object.keys(this.classes)) {
        if ( !this.classSelect[0].options.includes(cName) && !["galdur", "total"].includes(cName) ) {
          this.classSelect[1].options.push(cName);
        }
      }

      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    .finally(() => {
      // Put [Add Spell] btn in class spells tabs, wait til refs loaded
      const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
      spellTabs.appendChild(this.$refs.addSpell.$el);
    });
  },
  watch: {
    itemFilter(val) { this.$refs.tree.filter(val); }
  },
  methods: {
    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    capFirsts(string) {
      if (Number.isInteger(string)) { string = string.toString(); }
      return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : "";
    },
    applyBonus( name, value, obj ) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },
    /*
     * Loop on all the bonuses, and apply them to the given object if needed
     * * object = the bonus object we are adding to: { total: #, sources: [] }
     * * tString = the target string we match to add to the bonus object: "atkBonus", "totalAC", "init"
    */
    bonusLoop(object, tString) {
      let debug = "totalAC";
      if (tString.includes(debug)) { console.log(tString, object); }

      let prefix, typedBonuses = {};
      for (let [name, bonus] of Object.entries(this.bonuses)) {
        prefix = "";
        if (tString.includes(debug)) { console.log(name, bonus); }

        if (bonus.targets && bonus.targets.includes(tString)) {
          if (bonus.value > 0) {
            prefix = "+";

            // if this is a non stacking bonus
            if (this.rules.bonuses[bonus.type] && !this.rules.bonuses[bonus.type].stacks) {

              // if we already have a bonus of this type
              if ( typedBonuses[bonus.type] ) {

                // if the existing bonus is smaller and should be replaced
                if (typedBonuses[bonus.type].value < bonus.value) {
                  if (tString.includes(debug)) { console.log(`replace ${typedBonuses[bonus.type].value} ${typedBonuses[bonus.type].name}`); }
                  object.total -= typedBonuses[bonus.type].val;
                  object.sources.forEach((source, i) => {
                    if (source.includes(typedBonuses[bonus.type].name)) {
                      object.sources.splice(i, 1);
                    }
                  });

                  // update existing typed, non-stacking bonus
                  typedBonuses[bonus.type] = { name: name, value: bonus.value };

                // current bonus is higher
                } else {
                  if (tString.includes(debug)) { console.log(`current bonus is higher/doesn't exist`); }
                  continue;
                }

              // Add new bonus
              } else {
                typedBonuses[bonus.type] = { name: name, value: bonus.value };
              }
            } // end isStacking
          } // end prefix = "+"

          if (!object.sources.includes(`${prefix}${bonus.value} ${name}`)) {
            if (tString.includes(debug)) { console.log(`add ${prefix}${bonus.value} ${name}`); }
            object.total += parseInt(bonus.value);
            object.sources.push(`${prefix}${bonus.value} ${name}`);
          }
        }
      } // End Bonuses Loop
    },
    saveCharacter() {
      CharacterService.updateCharacter(this.character)
      .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    // Racial Methods
    onRaceChange() {
      let basics = this.character.basics;
      basics.type = this.races.races[basics.race].type;
      basics.subtypes = this.races.races[basics.race].subtypes;
      basics.speed.base.total = this.races.races[basics.race].speed;
      basics.size = this.races.races[basics.race].size;

      // replace racial traits
      for( let i = this.character.abilities.length-1; i>=0; i--) {
        if (this.character.abilities[i].extras.category == "Race") {
          this.character.abilities.splice(i, 1);
        }
      }

      for (const [name, trait] of Object.entries(this.races.races[basics.race].traits)) {
        this.abilID++;
        trait.name = name;
        trait.extras = {
          id: this.abilID,
          active: true,
          category: "Race",
          showMain: false,
          notes: []
        }
        this.character.abilities.push(trait);
      }
    },
    genRandomName() {
      let fNames, surnames, rand = 0;

      fNames = this.races.races[this.character.basics.race][this.character.settings.appearance.gender].names;
      rand = Math.floor(Math.random() * fNames.length);
      this.character.name = fNames[rand];

      if (this.races.races[this.character.basics.race].surnames) {
        surnames = this.races.races[this.character.basics.race].surnames;
        rand = Math.floor(Math.random() * Object.keys(surnames).length);
        this.character.name += " " + Object.keys(surnames)[rand];
      }
    },

    updateStructure() {
      console.info('Restructuring Old Character', this.character);
      /***************************\
      *                           *
      *          CLASSES          *
      *                           *
      \***************************/
      let totalLvl = 0;
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        if ( cName == 'total' || Object.keys(this.rules.creature_types).includes(cName) ) { continue; }
        totalLvl += cClass.levels;

        let classStructure = {
          "levels": cClass.levels,
          "hd": cClass.hd ? cClass.hd : this.classes[cName].hd,
          "bab": cClass.bab ? cClass.bab : this.classes[cName].bab,
          "ranks": cClass.ranks ? cClass.ranks : this.classes[cName].ranks,
          "saves": cClass.saves ? cClass.saves : this.classes[cName].saves,
          "abilities": cClass.abilities ? cClass.abilities : []
        };

        if (cClass.magic) {
          classStructure.magic = {
            "style": cClass.magic.style ? cClass.magic.style : this.classes[cName].magic.style,
            "castingAtr": cClass.magic.castingAtr ? cClass.magic.castingAtr : this.classes[cName].magic.castingAtr,
            "casterLevel": cClass.magic.casterLevel ? cClass.magic.casterLevel : cClass.levels,
            "spellsPerDay": cClass.magic.spellsPerDay ? cClass.magic.spellsPerDay : this.classes[cName].magic.spellsPerDay[cClass.levels],
            "useGaldur": cClass.magic.useGaldur ? cClass.magic.useGaldur : false,
            "galdur": cClass.magic.galdur ? cClass.magic.galdur : { "openTotal": 0, "openRemaining": 0, "reserveTotal": 0, "reserveRemaining": 0 }
          };

          if (classStructure.magic.style.includes("Prepared")) {
            if (cClass.magic.preparedSpells) {
              classStructure.magic.preparedSpells = cClass.magic.preparedSpells;
            } else {
              classStructure.magic.preparedSpells = [];
              this.classes[cName].magic.spellsPerDay[cClass.levels].forEach((spellSlots, lvl) => {
                for (let i = 0; i < spellSlots; i++) {
                  classStructure.magic.preparedSpells[lvl] = "";
                }
              });
            }

          } else if (classStructure.magic.style.includes("Spontaneous")) {
            classStructure.magic.remainingCasts = cClass.magic.remainingCasts ? cClass.magic.remainingCasts : [];

          } else {
            let er = 'Casting Style is not Prepared or Spontaneous!';
            this.$message({ message: er, type: 'error', });
            console.error(er);
          }
        } // end class magic

        this.character.classes[cName.toLowerCase()] = classStructure;
      }

      // add classes.total
      if (!this.character.classes.total) { this.character.classes.total = { levels: 0, abilities: [] }; }
      this.character.classes.total.levels = totalLvl;
      for (let lvl = 0; lvl < totalLvl+1; lvl++) {
        this.character.classes.total.abilities.push(
          this.classes.total.special[lvl]
        );
      }

      /***************************\
      *                           *
      *         ABILITIES         *
      *                           *
      \***************************/
      if (!Array.isArray(this.character.abilities)) {
        let abils = [];
        for (let [name, abil] of Object.entries(this.character.abilities)) {
          this.abilID++;
          if (!abil.location) {
            let newAbil = {
              name: name,
              description: abil.description ? abil.description : "",
              shortText: abil.benefit ? abil.benefit.text : "",
              location: abil.benefit ? abil.benefit.target : "",
              trigger: abil.trigger ? abil.trigger : "",
              bonuses: abil.bonuses ? abil.bonuses : {},
              extras: {
                id: this.abilID,
                active: abil.extras.active ? abil.extras.active : false,
                showMain: abil.extras.showMain ? abil.extras.showMain : false,
                category: abil.extras.category ? abil.extras.category : "Other",
                notes: []
              }
            };
            abils.push(newAbil);
          }
        }
        this.character.abilities = abils;
      }

      // setup abil ID
      let newAbilsArr = [];
      this.character.abilities.forEach(abil => {
        this.abilID++;
        let newStructure = {
          name: abil.name,
          description: abil.description ? abil.description : "",
          shortText: abil.shortText ? abil.shortText : "",
          location: abil.location ? abil.location : "",
          trigger: abil.trigger ? abil.trigger : "",
          bonuses: abil.bonuses ? abil.bonuses : {},
          extras: {
            id: abil.extras.id ? abil.extras.id : this.abilID,
            active: abil.extras.active ? abil.extras.active : false,
            showMain: abil.extras.showMain ? abil.extras.showMain : false,
            category: abil.extras.category ? abil.extras.category : "Other",
            notes: []
          }
        };
        newAbilsArr.push(newStructure);
        if (this.abilID < abil.extras.id) { this.abilID = abil.extras.id; }
      });
      this.character.abilities = newAbilsArr;

      /***************************\
      *                           *
      *         SETTINGS          *
      *                           *
      \***************************/
      let settings = this.character.settings;
      if (!settings.customClasses) { settings.customClasses = {}; }

      if (!settings.appearance) { settings.appearance = {}; }
      if (this.character.basics.appearance) {
        let appearance = new Object(this.character.basics.appearance);
        delete this.character.basics.appearance;
        this.character.settings.appearance = appearance;
      }

      if (this.character.basics.favoredClass) {
        let fav = this.character.basics.favoredClass;
        this.character.abilities.push({
          "name": "Favored Class Bonus",
          "description": `You get a small bonus for each level in ${fav.name} (${ fav.bonus ? fav.bonus : 'usually +1 hp, ranks, or galdur'})`,
          "shortText": "SHORT_BLURB",
          "location": "self",
          "trigger": "Continuous",
          "bonuses": { "Favored Class": { "type": "Untyped", "value": 0, "targets": [ "HP" ] } },
          "extras": {
            "id": 1,
            "active": true,
            "showMain": false,
            "category": "Other",
            "notes": []
          }
        });
        delete this.character.basics.favoredClass;
      }
      if (this.character.settings.favoredClass) {
        let fav = this.character.settings.favoredClass;
        this.character.abilities.push({
          "name": "Favored Class Bonus",
          "description": `You get a small bonus for each level in ${fav.name} (${ fav.bonus ? fav.bonus : 'usually +1 hp, ranks, or galdur'})`,
          "shortText": "SHORT_BLURB",
          "location": "self",
          "trigger": "Continuous",
          "bonuses": { "Favored Class": { "type": "Untyped", "value": 0, "targets": [ "HP" ] } },
          "extras": {
            "id": 1,
            "active": true,
            "showMain": false,
            "category": "Other",
            "notes": []
          }
        });
        delete this.character.settings.favoredClass;
      }

      if (this.character.basics.diety) {
        let deity = this.character.basics.deity;
        delete this.character.basics.deity;
        this.character.settings.deity = deity;
      }

      // Restructure types
      if (!this.character.basics.subtypes) {
        this.character.basics.subtypes = this.character.basics.type.subtypes ? this.character.basics.type.subtypes : [];
        this.character.basics.type = this.character.basics.type.name;
      }
    },

    /***************************\
    *                           *
    *          LEVEL UP         *
    *                           *
    \***************************/
    onClassSelect() {
      if (this.newLevelClass.name == "custom") {
        this.customClass = this.classes.custom;

        // TODO: Remove
        this.customClass = {
          "name": "Cultist",
          "hd": 8, "ranks": 4, "bab": 0.75,
          "saves": { "fort": { "id": "Bad", "data": { "mult": 0.33, "bonus": 0 } }, "ref": { "id": "Bad", "data": { "mult": 0.33, "bonus": 0 } }, "will": { "id": "Good", "data": { "mult": 0.5, "bonus": 2 } } },
          "skills": [ "Appraise", "Bluff", "Craft", "Disguise", "Intimidate", "Knowledge (arcana)", "Knowledge (religion)", "Knowledge (planes)", "Linguistics", "Profession", "Sleight of Hand", "Spellcraft", "Stealth", "Use Magic Device" ],
          // "proficiency": [],
          // "alignment": [],
          "magic": {
            "style": "Prepared Arcane",
            "castingAtr": "Cha",
            "spellsPerDayTable": "3 \t1 \t– \t– \t– \t– \t–\n4 \t2 \t– \t– \t– \t– \t–\n4 \t3 \t– \t– \t– \t– \t–\n4 \t3 \t1 \t– \t– \t– \t–\n4 \t4 \t2 \t– \t– \t– \t–\n5 \t4 \t3 \t– \t– \t– \t–\n5 \t4 \t3 \t1 \t– \t– \t–\n5 \t4 \t4 \t2 \t– \t– \t–\n5 \t5 \t4 \t3 \t– \t– \t–\n5 \t5 \t4 \t3 \t1 \t– \t–\n5 \t5 \t4 \t4 \t2 \t– \t–\n5 \t5 \t5 \t4 \t3 \t– \t–\n5 \t5 \t5 \t4 \t3 \t1 \t–\n5 \t5 \t5 \t4 \t4 \t2 \t–\n5 \t5 \t5 \t5 \t4 \t3 \t–\n5 \t5 \t5 \t5 \t4 \t3 \t1\n5 \t5 \t5 \t5 \t4 \t4 \t2\n5 \t5 \t5 \t5 \t5 \t4 \t3\n5 \t5 \t5 \t5 \t5 \t5 \t4\n5 \t5 \t5 \t5 \t5 \t5 \t5"
          }
        };

        this.showCustomClass = true;
        this.dialog = true;
      }
    },
    openLevelDialog() {
      let cClass = {
        name: this.newLevelClass.name.toLowerCase(),
        levels: 0,
        hd: 0,
        bab: 0,
        ranks: 0,
        saves: {
          "ref": { "mult": 0, "bonus": 0 },
          "fort": { "mult": 0, "bonus": 0 },
          "will": { "mult": 0, "bonus": 0 }
        },
        abilities: []
      };

      if (this.customClass.name) {
        // if we are making a new custom class
        for (let [key, value] of Object.entries(this.customClass)) {
          cClass[key] = value;
        }
        cClass.name = cClass.name.toLowerCase();

        if (this.customClass.magic) {
          let spellsPerDayTable = [[]];
          let tmpSPD = this.customClass.magic.spellsPerDayTable;
          tmpSPD.split('\n').forEach((item, lvl) => {
            spellsPerDayTable[lvl+1] = [];
            item.split('\t').forEach((num, spLvl) => {
              if (Number.isInteger(parseInt(num))) {
                spellsPerDayTable[lvl+1][spLvl] = parseInt(num);
              }
            });
          });
          this.character.settings.customClasses[this.customClass.name] = {
            "spellsPerDayTable": spellsPerDayTable,
            "galdur": [],
            "galdurTotal": []
          };
          this.customClass.magic.spellsPerDayTable = spellsPerDayTable;
        }

      } else {
        for (let [key, value] of Object.entries(this.character.classes[cClass.name])) {
          cClass[key] = value;
        }
        if (cClass.magic) {
          let custom = this.character.settings.customClasses[cClass.name];
          if (custom) {
            cClass.magic.spellsPerDayTable = custom.spellsPerDayTable;
          } else {
            cClass.magic.spellsPerDayTable = this.classes[cClass.name].magic.spellsPerDayTable;
          }
        }
      }



      this.newLevel = {
        "level": this.character.classes[cClass.name] ? this.character.classes[cClass.name].levels + 1 : 1,
        "skills": [],     // new skill ranks
        "abilities": [],  // new level / class abilities
        "newSpells": [],
      };

console.log(this.newLevel);
console.log(cClass);

      // skills
      for (let [name, skill] of Object.entries(this.rules.skills)) {
        if ( this.newLevel.level == 1 && cClass.skills.includes(name) ) {
          this.character.skills[name].class = true;
        }
        let newSkill = { 'newRanks': 0 };
        if (skill.background) { newSkill.backgroundRanks = 0; }
        this.newLevel.skills[name] = newSkill;
      }

      // abilities
      if (this.classes.total.special[this.character.classes.total.levels+1].length>0) {
        // if the character gets a new feat or attribute advancement this level:
        this.abilID++;
        let newAbil = {};
        this.classes.total.special[this.character.classes.total.levels+1].forEach(abil => {
          newAbil = { 'name': abil, 'description': "",
            'extras': {
              id: this.abilID,
              active: true,
              showMain: false,
              category: "Feat",
              notes: []
            }
          };
          this.newLevel.abilities.push(newAbil);
        });
      }
      if (cClass.special) {
        cClass.special[this.newLevel.level].forEach(abil => {
          this.abilID++;
          let newAbil = { 'name': abil, 'description': "",
            'extras': {
              id: this.abilID,
              active: true,
              showMain: false,
              category: "Class",
              notes: []
            }
          };
          this.newLevel.abilities.push(newAbil);
        });
      }

      // Automatically prep new spells to be added
      if ( cClass.magic ) {
        if ( cClass.magic.spellsKnown && cClass.magic.spellsKnown.byLevel ) {
          let newSpellArr = cClass.magic.spellsKnown.byLevel[this.newLevel.level];
          for (let level = 0; level < newSpellArr.length; level++) {
            let lvlNum = newSpellArr[level]; // new spells of level 'level'
            // if we already have spells of 'level'
            if (this.character.spells[cClass.name] && this.character.spells[cClass.name][level]) {
              // reduce the number of added spells by the ammount we already have
              lvlNum -= Object.keys(this.character.spells[cClass.name][level]).length;
            }
            for (let j = 0; j < lvlNum; j++) {
              this.newLevel.newSpells.push({ "name": '', "level": level, "class": cClass.name });
            }
          }
        }
      }

      this.newLevelClass = cClass;
      this.addingLevel = true;
      this.dialog = true;
      console.log('new level class', this.newLevelClass);
      console.log('new level', this.newLevel);
    },
    addClassAbility() {
      this.abilID++;
      this.newLevel.abilities.push({
        name: "",
        description: "",
        shortText: "",
        location: "Self",
        trigger: "Standard",
        bonuses: {},
        extras: {
          id: this.abilID,
          active: true,
          category: "Class",
          showMain: false,
          notes: []
        }
      });
    },
    addLevel() {
      let source = this.newLevelClass;
console.log('source', source);
      // if toon doesn't have a level in the given class yet, make a new obj for it
      if ( !this.character.classes[source.name] ) {
        this.character.classes[source.name] = {
          levels: 0,
          hd: source.hd,
          bab: source.bab,
          ranks: source.ranks,
          saves: source.saves,
          abilities: [ [] ],
        };
      }
      this.character.health.total += (this.newLevel.level == 1) ? source.hd : source.hd / 2;
      let cClass = this.character.classes[source.name];
      cClass.levels = this.newLevel.level;
      cClass.abilities[this.newLevel.level] = [];

      // New abilities
      this.newLevel.abilities.forEach(newAbil => {
        this.character.abilities.push( newAbil );
        if (newAbil.extras.category == "Feat") {
          this.character.classes.total.abilities[this.newLevel.level] = [];
          this.character.classes.total.abilities[this.newLevel.level].push( newAbil.extras.id );
        }
        if (newAbil.extras.category == "Class") {
          cClass.abilities[this.newLevel.level].push( newAbil.extras.id );
        }
      });

      if ( source.magic ) {
        console.log('class has magic');
        cClass.magic = cClass.magic ? cClass.magic :
        {
          style: source.magic.style,
          castingAtr: source.magic.castingAtr,
          casterLevel: this.newLevel.level,
          useGaldur: source.magic.useGaldur ? source.magic.useGaldur : false,
          galdur: source.magic.galdur ? source.magic.galdur : { "openTotal": 0, "reserveTotal": 0, "openRemaining": 0, "reserveRemaining": 0 },
        };

        if (source.magic.spellsPerDayTable) {
          cClass.magic.spellsPerDay = source.magic.spellsPerDayTable[this.newLevel.level];
        } else if (this.character.settings.customClasses[source.name]) {
          cClass.magic.spellsPerDay = this.character.settings.customClasses[source.name].spellsPerDayTable[this.newLevel.level];
        } else {
          cClass.magic.spellsPerDay = this.classes[source.name].magic.spellsPerDayTable
        }

        if (source.magic.style.includes("Prepared")) {
          let prepped = [];
          if (!cClass.magic.preparedSpells) { cClass.magic.preparedSpells = []; }
          console.log(cClass);
          cClass.magic.spellsPerDay.forEach((spells, level) => {
            if (!cClass.magic.preparedSpells[level]) { cClass.magic.preparedSpells[level] = []; }
            prepped[level] = [];
            for (let i = 0; i < spells; i++) {
              prepped[level][i] = cClass.magic.preparedSpells[level][i] ? cClass.magic.preparedSpells[level][i] : "";
            }
          });
          cClass.magic.preparedSpells = prepped;

        } else if (source.magic.style.includes('Spontaneous')) {
          cClass.magic.remainingCasts = Array.from(cClass.magic.spellsPerDay);
          cClass.magic.remainingCasts[0] = 1;
        }

        console.log(source);
        if ( source.magic.galdurTotal ) {
          cClass.magic.galdur.openTotal = Math.floor( source.magic.galdurTotal[this.newLevel.level] / 2 );
          cClass.magic.galdur.openRemaining = cClass.magic.openRemaining ? cClass.magic.openRemaining : cClass.magic.openTotal;
          cClass.magic.galdur.reserveTotal = Math.ceil( source.magic.galdurTotal[this.newLevel.level] / 2 );
          cClass.magic.galdur.reserveRemaining = cClass.magic.reserveRemaining ? cClass.magic.reserveRemaining : cClass.magic.reserveTotal;
          if (source.magic.extraGaldur) {
            cClass.magic.galdur.extraTotal = source.magic.extraGaldur.total[cClass.levels];
            cClass.magic.galdur.extraRemaining = cClass.magic.extraRemaining ? cClass.magic.extraRemaining : source.magic.extraGaldur.total;
          }
        }

        // Even if no spells were added at level up, create the spot for em
        if ( !this.character.spells[this.newLevelClass.name] ) { this.character.spells[this.newLevelClass.name] = []; }
        this.newLevel.newSpells.forEach(spell => {
          if ( !this.character.spells[spell.class][spell.level] ) { this.character.spells[spell.class][spell.level] = {}; }
          this.character.spells[spell.class][spell.level][spell.name] = {
            "casts": 0,
            "castTime": "1 Standard",
            "components": "V, S, M/DF",
            "description": "UPDATE ALL FIELDS WITH SPELL INFO",
            "range": "Close",
            "target": "Self",
            "duration": "Instant",
            "save": "Ref (half)",
            "SR": true
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

      this.character.classes.total.levels++;
      this.addingLevel = false;
      this.dialog = false;
    },

    /***************************\
    *                           *
    *         ABILITIES         *
    *                           *
    \***************************/
    toggleAbility(abil) {
      if (this.activeConditions[abil.name]) {
        delete this.activeConditions[abil.name];
        abil.extras.active = false;
      } else {
        this.activeConditions[abil.name] = abil;
        abil.extras.active = true;
      }
    },
    abilShowMain(name, abil) { abil.extras.showMain = abil.extras.showMain ? false : true; },
    addNewAbility() {
      this.abilID++;
      this.abilities.push({
        name: "NEW ABILITY",
        description: "",
        shortText: "",
        location: "Self",
        trigger: "Standard",
        bonuses: {},
        extras: {
          id: this.abilID,
          active: false,
          category: "Other",
          showMain: false,
          notes: []
        }
      });
      this.showAbil = true;
      this.dialog = true;
    },
    editAbility(ability) {
      this.abil = {};
      this.abil = ability;
      this.showAbil = true;
      this.dialog = true;
    },
    saveAbility() {
      this.showAbil = false;
      this.dialog = false;
    },
    deleteAbil(index) {
      let name = this.abilities[index].name;
      this.abilities.splice(index, 1);
      this.$message({ message: `${name} was removed from abilities`, type: "warning" });
    },

    addNewAttack() {
      this.character.actions[this.atkName] = {
        atkNum: this.atkNum,
        "Damage": {  "fine": "1",  "diminuitive": "1d2",  "tiny": "1d3",  "small": "1d4",  "medium": "1d6",  "large": "1d8",  "huge": "2d6",  "gargantuan": "2d8",  "colossal": "4d6"  },
        "Critical": "20/x2",
        "Range": 0,
        "Damage Type": [ "Piercing" ],
        "Proficiency": "Natural",
        "Category": "Primary",
        "Extras": [],
      };
    },
    addAtkExtra(atkName) { this.character.actions[atkName].Extras.push('New Note'); },
    deleteAtkExtra(atkName, index) { this.character.actions[atkName].Extras.splice(index, 1); },


    /***************************\
    *                           *
    *         CONDITIONS        *
    *                           *
    \***************************/
    addNewContion() {
      this.condition = {
        name: "NEW CONDITION",
        description: "",
        bonuses: {},
        extras: { notes: [] }
      };
      this.conditions.push(this.condition);
      this.activeConditions.push(this.condition);
      this.showCondition = true;
      this.dialog = true;
    },
    editCondition(condition) {
      this.condition = {};
      this.condition = condition;
      this.showCondition = true;
      this.dialog = true;
    },
    saveCondition() {
      this.showCondition = false;
      this.dialog = false;
    },
    // DELETE DONE BY REMOVING FROM SLECT

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
    editItem(item) {
      if (!Object.keys(item).length) {
        item = {
          label: "",
          value: {
            Description: "",
            Cost: 0,
            Weight: 0,
            Amount: 1,
            Extras: { Notes: [] }
          }
        };
      }
      this.item = item;
      this.showItem = true;
      this.dialog = true;
    },
    saveItem() {
      this.showAbil = false;
      this.dialog = false;
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
          'components': 'V, S, M/DF',
          "description": "UPDATE ALL FIELDS WITH SPELL INFO",
          'range': 'Close',
          'target': 'Self',
          'duration': 'Instant',
          'save': 'Ref (half)',
          'SR': true
        };
        this.newSpell = { name: "", level: 0, class: "" };
      }
    },

    /***************************\
    *                           *
    *         CAMPAIGNS         *
    *                           *
    \***************************/
    // Get & show a list of campaigns, matching the input title
    findCampaign() {
      if (this.campaignName) {
        CampaignService.getCampaignByName(this.campaignName)
        .then((response) => {
          if (response.campaigns.length) {
            this.campaigns = response.campaigns;
          } else {
            this.$message({ message: `${this.campaignName} not found`, type: 'warning' });
          }

        })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      }
    },

    // Add character as a player toon to campaign
    joinCampaign() {
      CampaignService.joinCampaign(this.campaign, this.character)
      .then((response) => {
        if (response.warning) {
          this.$message({ message: response.warning, type: 'warning', });
        } else {
          this.$message({ message: response.message, type: 'success', });
        }
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },

    loadEncounters() {
      if (this.character.settings.isNPC) {
        EncounterService.getEncounterList(this.campaign.id, 0, 100)
        .then((response) =>{ this.encounters = response.encounters.rows; })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      }
    },

    joinEncounter() {
      if (!this.encounter.npcs.includes(this.character.id)) {
        let npc = {
          id: this.character.id,
          name: this.character.name,
          type: this.character.basics.type.name,
          alignment: this.character.basics.alignment,
          hp: this.character.health.total,
        };
        this.encounter.npcs.push(npc);

        EncounterService.updateEncounter(this.encounter)
        .then((response) => { this.$message({ message: `${response.encounter.name} updated`, type: 'success', }); })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });

      } else {
        this.$message({ message: 'You may only add a character to an encounter once', type: 'warning', });
      }
    },


    /***************************\
    *                           *
    *        ADMIN EDIT         *
    *                           *
    \***************************/
    copySection(name, obj) {
      navigator.clipboard.writeText(JSON.stringify(obj))
      .then(() => { this.$message({ message: `${this.capFirsts(name)} coppied to clipboard`, type: 'success', }); })
      .catch(err => { console.error('Could not copy text: ', err); });
    },
    loadJSON(name, obj) {
      try {
        this.character[name] = JSON.parse(obj);
        this.$message({ message: `${this.capFirsts(name)} updated`, type: 'success', });
      } catch (e) {
        console.error(e);
        this.$message({ message: e, type: 'error', });
      }
    },

  }
}
</script>

<style lang="css" scoped>
h4 { margin: 0; }
.el-row { margin-bottom: 10px; }
.basics .el-col { margin-bottom: 10px; }
.el-row label { margin: 0; }

.stat-controls > :not(:last-child) { margin-bottom: 20px; }

.class-abil {
  width: 48%;
  margin: 2px;
}
.class-abil .el-input-group__prepend { padding: 0 10px !important; }
.el-progress-bar__inner { text-align: center; }

.el-input-number span {
  font-size: 24px;
}

/* Skill Sparkle in levelup */
.el-input__suffix svg { margin: 0; }

</style>
