<template lang="html">
  <div v-if="!loading" class="container">

    <!-- NAME & ADVANCED -->
    <el-row>
      <el-col :span="12">
        <h3>
          {{ character.name }}
          <el-tag v-if="advanced" effect="dark" type="info" style="margin-right:10px;">
            ID : {{ character.id }}
          </el-tag>
          <span v-if="character.basics.race && ['male','female','agander'].includes(character.basics.appearance.gender) && advanced">
            <el-button type="primary" @click="genRandomName()"> Random Name! </el-button>
          </span>
        </h3>
      </el-col>
      <el-col :span="1"> <span v-if="advanced"> User: </span> </el-col>
      <el-col :span="4">
        <el-select v-if="advanced && $store.state.auth.user.roles.includes('admin')" v-model="character.user.id" size="small" placeholder="Choose User" aria-label="User Select">
          <template #label="{ label }">
            <span>{{ label }}</span>
          </template>
          <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id">
            <span>{{ user.username }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :offset="1" :span="6" style="display: flex; justify-content: space-evenly;">
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
              <el-select v-model="character.basics.race" @change="onRaceChange()" size="small" placeholder="Choose Race" aria-label="Race Select">
                <template #label="{ label }">
                  <span style="float: left">{{ label }}</span>
                  <span style="float: right">
                    <el-tag size="small" effect="dark" type="primary">{{ capFirsts(character.basics.type.name) }}</el-tag>
                    <el-tag v-for="subtype in character.basics.type.subtypes" :key="subtype" size="small" effect="dark" type="info" style="margin-left:5px;"> {{ subtype }} </el-tag>
                  </span>
                </template>
                <el-option v-for="(race, name) in races" :key="name" :label="name" :value="name">
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
                  <el-option v-if="races[character.basics.race].male" label="Male" value="male" />
                  <el-option v-if="races[character.basics.race].female" label="Female" value="female" />
                  <el-option v-if="races[character.basics.race].agender" label="Agender" value="agender" />
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
                    Space: {{ rules.size[character.basics.size].space }}
                  </span>
                </template>
              </el-input>
            </el-col>
            <!-- Speeds -->
            <el-col :span="8">
              <span v-for="(mode, name) in character.basics.speed" :key="name">
                <span v-if="mode.total">
                  <el-tooltip placement="top" effect="light">
                    <el-tag size="large" effect="dark" type="info" style="margin-left:5px;"> {{ capFirsts(name) }}: {{ mode.total }} ft. </el-tag>
                    <template #content>
                      <span v-for="bonus in mode.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
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
                <template #content v-if="character.basics.race">
                  <span v-for="(range, name) in races[character.basics.race].age" :key="name">
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
                    {{ races[character.basics.race][character.basics.appearance.gender].height }}
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
                    {{ races[character.basics.race][character.basics.appearance.gender].weight }}
                  </span>
                  <span v-else>Choose within reason</span>
                </template>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>

        <!-- Favored Class Bonus & Level -->
        <el-col :span="6">
          <el-row class="center-horz">
            <el-col :span="12">
              <el-input v-model="character.basics.cr" aria-label="Character Level" disabled>
                <template #prepend>Level</template>
              </el-input>
            </el-col>
            <el-col :span="12">
              <el-popconfirm title="Choose a class" @confirm="openLevelDialog" hide-icon :hide-after="2000">
                <template #reference>
                  <el-button type="primary">
                    <g-icon iconSize="24px" iconName="sparkle" />
                    <span style="padding:5px"> Level Up </span>
                  </el-button>
                </template>
                <template #actions="{ confirm }">
                  <el-select v-model="newLevel.class" aria-label="New Level Class" style="margin-bottom:5px">
                    <el-option v-for="(cClass, cName) in classes" :key="cName" :label="capFirsts(cName)" :value="cName" />
                  </el-select>
                  <el-button type="primary" size="small" @click="confirm" :disabled="newLevel.class == ''"> Go! </el-button>
                </template>
              </el-popconfirm>
            </el-col>
          </el-row>
          <el-row>
            <span style="font-size:16px;">
              <g-icon iconName="magicSwirl" iconSize="24"/> Favored Class Bonus
            </span>
            <el-select v-model="character.basics.favoredClass.name" aria-label="Favored Class Select">
              <el-option v-for="(cClass, cName) in classes" :key="cName" :label="cName" :value="cName" />
            </el-select>
            <el-input v-model="character.basics.favoredClass.bonus" aria-label="Favored Class Bonus Input" />
          </el-row>
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
                  <el-badge :max="5" :value="attributes.Str.sources.length" v-if="attributes.Str.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Str.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Str.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Str.total-10)/2) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Str.base" :min="1" aria-label="Base Strength Input" />
                </el-col>
                <!-- Intelligence -->
                <el-col :span="2" :offset="1" class="center-vert">Int:</el-col>
                <el-col :span="3">
                  <el-badge :max="5" :value="attributes.Int.sources.length" v-if="attributes.Int.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Int.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Int.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Int.total-10)/2) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Int.base" :min="1" aria-label="Base Intelligence Input" />
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- Dexterity -->
                <el-col :span="2" class="center-vert">Dex:</el-col>
                <el-col :span="3">
                  <el-badge :max="5" :value="attributes.Dex.sources.length" v-if="attributes.Dex.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Dex.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Dex.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Dex.total-10)/2) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Dex.base" :min="1" aria-label="Base Dexterity Input" />
                </el-col>
                <!-- Wisdom -->
                <el-col :span="2" :offset="1" class="center-vert">Wis:</el-col>
                <el-col :span="3">
                  <el-badge :max="5" :value="attributes.Wis.sources.length" v-if="attributes.Wis.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Wis.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Wis.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Wis.total-10)/2) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Wis.base" :min="1" aria-label="Base Wisdom Input" />
                </el-col>
              </el-row>

              <el-row :gutter="10">
                <!-- Constitution -->
                <el-col :span="2" class="center-vert">Con:</el-col>
                <el-col :span="3">
                  <el-badge :max="5" :value="attributes.Con.sources.length" v-if="attributes.Con.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Con.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Con.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Con.total-10)/2) }}</el-tag>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model="character.attributes.Con.base" :min="1" aria-label="Base Constitution Input" />
                </el-col>
                <!-- Charisma -->
                <el-col :span="2" :offset="1" class="center-vert">Cha:</el-col>
                <el-col :span="3">
                  <el-badge :max="5" :value="attributes.Cha.sources.length" v-if="attributes.Cha.sources[0]">
                    <el-tooltip placement="top" effect="light">
                      <el-tag size="large" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
                      <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
                    </el-tooltip>
                  </el-badge>
                  <el-tag size="large" effect="dark" type="info" v-else>{{attributes.Cha.total}}</el-tag>
                  <el-tag size="small" effect="dark" type="primary">{{ Math.floor((attributes.Cha.total-10)/2) }}</el-tag>
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
                  {{ cClass.levels }}d{{ classes[cName].hd }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Fort </template>
                  +{{ Math.floor(cClass.levels * classes[cName].fort.mult) + classes[cName].fort.bonus }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Reflex </template>
                  +{{ Math.floor(cClass.levels * classes[cName].ref.mult) + classes[cName].ref.bonus }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Will </template>
                  +{{ Math.floor(cClass.levels * classes[cName].will.mult) + classes[cName].will.bonus }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Ranks </template>
                  {{ cClass.levels * classes[cName].ranks }}
                </el-descriptions-item>
              </el-descriptions>
            </el-col>

            <el-col :span="6">
              <div v-if="classes[cName].alignment.length < 9">
                Allowed Alignments <br>
                <el-tag size="small" effect="dark" type="primary" v-for="name in classes[cName].alignment" :key="name" style="margin-left:10px;">
                  {{ name }}
                </el-tag>
              </div>
              <div>
                Class Skills <br>
                <el-tag size="small" effect="dark" type="primary" v-for="name in classes[cName].skills" :key="name" style="margin-left:10px;">
                  {{ name }}
                </el-tag>
              </div>
              <div>
                Proficiencies <br>
                <el-tag size="small" effect="dark" type="primary" v-for="item in classes[cName].proficiency" :key="item" style="margin-left:10px;">
                  {{ item }}
                </el-tag>
              </div>
            </el-col>

            <el-col :span="14">
              Special Abilities <br>
              <div class="class-abils">
                <span v-for="(abilities, level) in classes[cName].special" :key="level">
                  <span v-if="level > 0 && level <= cClass.levels">
                    <span v-for="(abil, index) in abilities" :key="index">
                      <el-input v-model="classes[cName].special[level][index]" class="class-abil" :aria-label="`Class Ability: ${abil}`" disabled>
                        <template #prepend>Level {{ level }} </template>
                      </el-input>
                    </span>
                  </span>
                </span>

              </div>
            </el-col>
          </el-row>

          <!-- Magic -->
          <el-row v-if="classes[cName].magic" :gutter="10">
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
                  {{ classes[cName].magic.spellsKnown.perLevel }}
                  {{ classes[cName].magic.spellsKnown.byLevel[cClass.levels] }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label> Galdur / <br> Spell Slots </template>
                  <el-switch
                    v-model="cClass.useGaldur"
                    inline-prompt active-text=" Galdur "
                    inactive-text=" Spell Slots "
                    aria-label="Casting Style Switch" />

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
                      :percentage=" Math.floor( ( cClass.openRemaining / cClass.openTotal ) * 100 ) "
                    >
                      {{ cClass.openRemaining }} / {{ cClass.openTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.openRemaining" :min="0" :max="cClass.openTotal" aria-label="Remaining Open Galdur" />
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
                      :percentage=" Math.floor( ( cClass.reserveRemaining / cClass.reserveTotal ) * 100 ) "
                    >
                      {{ cClass.reserveRemaining }} / {{ cClass.reserveTotal }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.reserveRemaining" :min="0" :max="cClass.reserveTotal" aria-label="Remaining Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Total Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.reserveTotal" aria-label="Total Reserve Galdur" />
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row :gutter="10" v-if="classes[cName].magic.extraGaldur">
                  <el-col :span="4">
                    <el-tag effect="dark" type="info"> {{ classes[cName].magic.extraGaldur.poolName }} </el-tag>
                  </el-col>
                  <el-col :span="8">
                    <el-progress :text-inside="true" :stroke-width="24" color="#909399"
                      :percentage=" Math.floor( ( cClass.extraRemaining / classes[cName].magic.extraGaldur.total[cClass.levels] ) * 100 ) "
                    >
                      {{ cClass.extraRemaining }} / {{ classes[cName].magic.extraGaldur.total[cClass.levels] }}
                    </el-progress>
                  </el-col>
                  <el-col :span="6" class="center-horz"  v-if="advanced">
                    <el-tooltip content="Remaining Galdur" placement="top" effect="light">
                      <el-input-number v-model="cClass.extraRemaining" :min="0" :max="classes[cName].magic.extraGaldur.total[cClass.levels]" :aria-label="`Remaining ${classes[cName].magic.extraGaldur.poolName} Galdur`" />
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>

              <div v-else-if="classes[cName].magic.style.includes('Prepared')">
                <el-row :gutter="10" v-for="(numOfSpells, level) in classes[cName].magic.spellsPerDay[cClass.levels]" :key="level">
                  <el-col :span="2">
                    Level {{ level }}
                  </el-col>
                  <el-col :span="22">
                    <span v-for="num in numOfSpells" :key="num">
                      <el-select v-model="cClass.preparedSpells[level][num-1]" :aria-label="`Prepared Spell Select for Level ${level} Number ${num}`" filterable allow-create style="max-width:33%">
                        <el-option v-for="(spell, name) in character.spells[cName][level]" :key="name" :label="name" :value="name" >
                          {{ name }}
                        </el-option>
                      </el-select>
                    </span>
                  </el-col>
                </el-row>
              </div>

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
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>

      <!-- ABILITIES -->
      <el-collapse-item name="3">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="abilityPalm" /> Abilities </h4>
          </el-divider>
        </template>

        <el-row class="center-horz" id="abilities" :gutter="5">
          <el-col :span="5">Name</el-col>
          <el-col :span="14">Description</el-col>
          <el-col :span="5">
            Actions
            <el-popconfirm title="Add New Ability?" @confirm="addNewAbility" hide-icon>
              <template #reference>
                <el-button type="primary" size="small">New</el-button>
              </template>
              <template #actions="{ confirm }">
                <el-input v-model="abilName" size="small" placeholder="Ability Name" style="margin-bottom:5px;" aria-label="New Ability Name" />
                <el-button type="primary" size="small" @click="confirm" :disabled="abilName == ''" aria-label="Create New Ability">Yes</el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
        <el-divider style="margin-top: 5px;" />
        <el-collapse v-model="abilityCollapse">

          <!-- abilities -->
          <el-collapse-item v-for="type in abilityTypes" :key="type" :title="type" :name="type">
            <div v-for="(abil, name) in abilities" :key="name">
              <el-row v-if="abil.extras.source == type" :gutter="5" style="margin-bottom:5px;">
                <el-col :span="5">
                  <el-tag size="small" effect="dark" type="primary"> {{ name }} </el-tag>
                </el-col>
                <el-col :span="14"> {{ abil.description }} </el-col>
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

          <!-- Attacks -->
          <el-collapse-item name="atacks">
            <template #title>
              <g-icon iconSize="32px" iconName="swordShield" /> Special Attacks
            </template>
            <el-row :gutter="10" justify="space-between">
              <el-col :span="16">
                This section is for any extra attacks you may have like natural bite attacks or other unique damage dealling abilities
              </el-col>
              <el-col :span="3">
                <el-popconfirm title="Add New Attack?" @confirm="addNewAttack" hide-icon>
                  <template #reference>
                    <el-button type="primary" size="small">New</el-button>
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
            <el-row v-for="(atk, name) in character.attacks" :key="name" :gutter="10">
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
                    <el-button type="danger" size="small" @click="delete character.attacks[name]; this.$message({ message: `${name} was removed from attacks`, type: 'warning' });">Yes</el-button>
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
                    <el-input
                      v-model="atk.Extras[index]"
                      :aria-label="`Extra ${index+1} Input`"
                    >
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

          <!-- Resources -->
          <el-collapse-item name="resources">
            <template #title>
              <g-icon iconSize="32px" iconName="star" /> Resources
            </template>
            <el-row :gutter="10" justify="space-between">
              <el-col :span="16">
                This section is for any resources your character may use, like rounds of rage, or a Monk's Ki pool
              </el-col>
              <el-col :span="3">
                <el-popconfirm title="Add New Attack?" @confirm="addNewResource" hide-icon>
                  <template #reference>
                    <el-button type="primary" size="small">New</el-button>
                  </template>
                  <template #actions="{ confirm }">
                    <el-input v-model="resourceName" size="small" style="margin-bottom:5px;" placeholder="Resource Name" aria-label="New Resource Name" />
                    <el-button @click="confirm" :disabled="resourceName == ''" type="primary" size="small" aria-label="Create New Resource">Yes</el-button>
                  </template>
                </el-popconfirm>
              </el-col>
            </el-row>
            <el-divider />
            <el-row v-for="(res, name) in character.resources" :key="name" :gutter="10" align="middle">
              <el-col :span="2" class="center-horz">
                <el-tag size="large" effect="dark" type="primary">
                  {{ name }}
                </el-tag>
              </el-col>
              <el-col :span="3">
                <el-tooltip :content="`Remaining ${name}`" effect="light" placement="top">
                  <el-input-number v-model="res.left" :min="0" size="small" :aria-label="`${name} Remaining`" />
                </el-tooltip>
              </el-col>
              <el-col :span="3">
                <el-tooltip :content="`Total ${name}`" effect="light" placement="top">
                  <el-input-number v-model="res.total" :min="1" size="small" :aria-label="`${name} Total`" />
                </el-tooltip>
              </el-col>
              <el-col :span="4">
                <el-input v-model="res.units" size="small" :aria-label="`${name} Units`">
                  <template #prepend> Units </template>
                </el-input>
              </el-col>
              <el-col :span="1">
                <el-color-picker v-model="res.color" :predefine="[ '#4167F0', '#FFDE0A', '#E63415', '#bfef45', '#ADD8E6', '#42d4f4', '#E63415', '#911eb4', '#f032e6', '#71797E' ]" />
              </el-col>
              <el-col :span="8">
                <el-input v-model="res.notes" size="small" type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" aria-label="`${name} Notes`" />
              </el-col>
              <el-col :offset="1" :span="2" class="center-horz;">
                <el-popconfirm title="Are you sure to delete this?">
                  <template #reference>
                    <el-button type="danger" size="small" style="margin:0">
                      <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button type="danger" size="small" @click="delete character.resources[name]; this.$message({ message: `${name} was removed from resources`, type: 'warning' });">Yes</el-button>
                  </template>
                </el-popconfirm>
              </el-col>
            </el-row>
          </el-collapse-item>

          <!-- Conditions -->
          <el-collapse-item name="conditions">
            <template #title>
              <g-icon iconSize="32px" iconName="dizzyStar" /> Conditions
            </template>
            <el-row :gutter="10" justify="space-between">
              <el-col :span="8">
                The current conditions affecting you
              </el-col>
              <el-col :span="8">
                <el-select v-model="character.conditions" value-key="name" multiple placeholder="Common Conditions" aria-label="Conditions Select">
                  <template #tag>
                    <el-tag v-for="(condition, index) in character.conditions" :key="condition" effect="dark" closable @close="character.conditions.splice(index, 1)"> {{ condition.name }} </el-tag>
                  </template>
                  <el-option v-for="item in conditions" :key="item.name" :label="item.name" :value="item" >
                    <el-tag type="primary" style="margin-right: 8px" size="small" effect="dark"> {{ item.name }} </el-tag>
                  </el-option>
                  <template #footer>
                    <el-button v-if="!addingCondition" text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
                  </template>
                </el-select>
              </el-col>
            </el-row>
            <el-divider />
            <el-row v-for="condition in character.conditions" :key="condition.name">
              <el-col :span="6" class="center-vert">
                <el-tag type="info" size="large" effect="dark"> {{ condition.name }} </el-tag>
              </el-col>
              <el-col :span="18" class="center-vert">
                {{ condition.description }}
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
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
      </el-collapse-item>

      <!-- INVENTORY -->
      <el-collapse-item name="5">
        <template #title>
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="chest" /> Inventory </h4>
          </el-divider>
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
              <el-input-number v-if="data.value" v-model="data.value.Ammount" :min="0" size="small" aria-label="Number of Items" />
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
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="spellBook" /> Spells Known </h4>
          </el-divider>
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
              <el-option v-for="(cClass, cName) in character.classes" :key="cName" :label="cName" :value="cName" />
            </el-select>
            <el-button type="primary" size="small" @click="confirm" :disabled="newSpell.name == '' || newSpell.class == ''">Yes</el-button>
          </template>
        </el-popconfirm>

        <el-tabs v-model="spellsTab" type="card" ref="spellsTab" style="padding-top:10px;">
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
                          Save DC : {{ 10 + lvl + (attributes[classes[cName].magic.castingAtr].mod) }}
                        </el-tag>
                        <template #content>
                          10
                          + {{ attributes[classes[cName].magic.castingAtr].mod }} {{ classes[cName].magic.castingAtr }}
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
                      :title="`Cast for ${spell.casts} Galdur?`"
                      confirm-button-text="Yes"
                      cancel-button-text="No"
                      @confirm="console.log('yep')"
                      @cancel="console.log('nnnope')"
                      hide-icon
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
          <el-divider style="max-width:50%">
            <h4> <g-icon iconSize="32px" iconName="openScroll" /> Extras </h4>
          </el-divider>
        </template>
        <el-row>
          <el-col :span="4" class="center-vert"> Hero Points </el-col>
          <el-col :span="5"> <el-input-number v-model="character.settings.heroPoints" :min="0" :max="4" aria-label="Hero Points" /> </el-col>
          <el-col v-if="advanced" :offset="13" :span="2" class="center-horz">
            <el-switch v-model="character.settings.isNPC" inline-prompt active-text=" NPC " inactive-text=" PLAYER " aria-label="Player / NPC Switch" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert"> Open Tab </el-col>
          <el-col :span="20">
            <el-select v-model="character.settings.cardTab" size="small" aria-label="View's Tab Select">
              <el-option label="Main" value="Main" />
              <el-option label="Items" value="Items" />
              <el-option label="Skills" value="Skills" />
              <el-option label="abilities" value="abilities" />
              <el-option label="Spells" value="Spells" />
              <el-option label="Edit" value="Edit" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert"> Open Main Sections </el-col>
          <el-col :span="20">
            <el-select v-model="character.settings.mainSections" size="small" multiple aria-label="View's main tab open sections">
              <el-option label="Defense" value="defense" />
              <el-option label="Actions" value="actions" />
              <el-option label="Resources" value="resources" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert"> Open Inventory Sections </el-col>
          <el-col :span="20">
            <el-select v-model="character.settings.expandInventory" size="small" multiple aria-label="Gender Select">
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
        <el-row>
          <el-col :span="4" class="center-vert"> Backstory </el-col>
          <el-col :span="20">
            <el-input v-model="character.basics.backstory" type="textarea" autosize aria-label="Backstory Textarea" />
          </el-col>
        </el-row>
        <el-row style="margin-bottom:30px;">
          <el-col :span="4" class="center-vert"> Notes </el-col>
          <el-col :span="20">
            <el-input v-model="character.notes" type="textarea" autosize aria-label="Notes Textarea" />
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <!-- FOOTER -->
    <div style="text-align: right; margin-top: 10px;">
      <el-button @click="$router.push({ name: 'character-list' })" type="warning" plain> Back to All Characters </el-button>

      <el-button @click="this.$router.push({ name: 'character-view', params: { id: character.id } })" type="info"> View </el-button>
      <el-button @click="saveCharacter()" type="primary"> Save Changes </el-button>
    </div>

    <!-- LEVEL UP DIALOG -->
    <el-dialog v-model="addingLevel" width="800">
      <h2> <g-icon iconName="magicSwirl" />
        Level Up - Level {{ newLevel.level }} {{ capFirsts(newLevel.class) }}
      </h2>

      <!-- New Abilities -->
      <div v-if="newLevel.abilities.length > 0">
        <el-divider style="max-width:50%"> <h3> Abilities </h3> </el-divider>
        <el-row :gutter="10" v-for="ability in newLevel.abilities" :key="ability">
          <el-col :span="10">
            <el-input v-model="ability.name" :aria-label="`Class Ability: ${ability}`">
              <template #prepend> Name </template>
            </el-input>
          </el-col>
          <el-col :span="13">
            <el-input v-model="ability.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="Enter ability description" aria-label="Ability Description"/>
          </el-col>
        </el-row>
      </div>

      <!-- New Magic -->
      <div v-if="classes[newLevel.class].magic">
        <el-divider style="max-width:50%"> <h3> Magic </h3> </el-divider>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-descriptions :column="1" border >
              <el-descriptions-item>
                <template #label> Casting Style </template>
                {{ classes[newLevel.class].magic.style }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label> Casting Attribute </template>
                {{ classes[newLevel.class].magic.castingAtr }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label> Galdur / <br> Spell Slots </template>
                <el-switch
                  v-model="newLevel.useGaldur"
                  inline-prompt active-text=" Galdur "
                  inactive-text=" Spell Slots "
                  aria-label="Casting Type Switch" />
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  {{ newLevel.useGaldur ? "Additional Galdur" : "Total Spell Slots" }}
                </template>
                {{
                  newLevel.useGaldur ?
                  classes[newLevel.class].magic.galdur[newLevel.level] :
                  classes[newLevel.class].magic.spellsPerDay[newLevel.level]
                }}
              </el-descriptions-item>
            </el-descriptions>
            <div class="center-horz" style="margin-top:10px">
              <div v-if="classes[newLevel.class].magic.spellsKnown">
                <span v-if="classes[newLevel.class].magic.spellsKnown.total">
                  {{ classes[newLevel.class].magic.spellsKnown.total }}
                </span>
                <span v-else-if="newLevel.level == 1 && classes[newLevel.class].magic.spellsKnown.byLevel[newLevel.level]">
                  Add
                  <span v-for="(num, index) in classes[newLevel.class].magic.spellsKnown.byLevel[newLevel.level]" :key="index">
                    {{ num }} level {{ index }}s{{ classes[newLevel.class].magic.spellsKnown.byLevel[newLevel.level].length-1 > index ? ', and ' : '' }}
                  </span>
                </span>
                <span v-else-if="newLevel.level == 1 && classes[newLevel.class].magic.spellsKnown.starting">
                  Add {{ classes[newLevel.class].magic.spellsKnown.starting }} 1
                </span>
                <span v-else-if="classes[newLevel.class].magic.spellsKnown.perLevel">
                  Add {{ classes[newLevel.class].magic.spellsKnown.perLevel }} 2
                </span>
              </div>
              <el-button @click="newLevel.newSpells.push({ 'name': '', 'level': 0, 'class': newLevel.class })" type="primary"  ref="addSpell">
                Add Spell
              </el-button>
            </div>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="10" v-for="(spell, index) in newLevel.newSpells" :key="index">
              <el-col :offset="2" :span="6">
                <el-tooltip placement="top" content="Spell Level">
                  <el-input-number v-model="spell.level" :min="0" :max="9" size="small" aria-label="New Spell Level" />
                </el-tooltip>
              </el-col>
              <el-col :span="14">
                <el-input v-model="spell.name" size="small" aria-label="New Spell Name">
                  <template #prepend> Name </template>
                </el-input>
              </el-col>
              <el-col :span="1">
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
            </el-row>
          </el-col>
        </el-row>
      </div>

      <!-- New Skills -->
      <div>
        <el-divider style="max-width:50%"> <h3> Skills </h3> </el-divider>
        <div v-if="newLevel.level == 1">
          Class Skills:
          <el-tag v-for="skill in classes[newLevel.class].skills" :key="skill" size="small" effect="dark" type="primary" style="margin-left:5px;">{{ skill }}</el-tag>
        </div>
        <el-row :gutter="10" class="center-vert" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="6" class="center-vert"> <h5> Name (Ability) </h5> </el-col>
          <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="24px" iconName="magicSwirl" />
              <template #content> Class Skill </template>
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
          <el-col :offset="2" :span="10" :style=" (newRanks > Math.max(1, classes[newLevel.class].ranks + attributes.Int.mod)) || (backgroundRanks > 2) ? 'color:red' : ''">
            <el-row :gutter="10">
              <el-col :span="4" class="center-vert">
                <el-tooltip placement="top" effect="light">
                  <g-icon iconSize="24px" iconName="sparkle" />
                  <template #content> Current Ranks </template>
                </el-tooltip>
              </el-col>
              <el-col :span="10" class="center-horz center-vert">
                {{ newRanks }} / {{ Math.max(1, classes[newLevel.class].ranks + attributes.Int.mod) }} New Ranks
              </el-col>
              <el-col :span="10" class="center-horz">
                {{ backgroundRanks }} / 2 New Background Ranks
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-for="(skill, name) in rules.skills" :key="name" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="6">
            {{ name }}
            <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
            ({{ skill.ability }})
          </el-col>
          <el-col :span="4" class="center-horz" style="display:flex; justify-content:space-evenly;">
            <div style="width:33%">
              <g-icon v-if="character.skills[name].class" iconSize="20px" iconName="magicSwirl" />
            </div>
            <div style="width:33%">
              <g-icon v-if="skill.armor_pen" iconSize="20px" iconName="armor" />
            </div>
            <div style="width:33%">
              <g-icon v-if="skill.background" iconSize="20px" iconName="openBook" />
            </div>
          </el-col>
          <el-col :offset="2" :span="10">
            <el-row :gutter="10">
              <el-col :span="4">
                <el-tag :effect="character.skills[name].ranks ? 'dark' : 'plain'">
                  {{ character.skills[name].ranks }}
                </el-tag>
              </el-col>
              <el-col :span="10">
                <el-input-number v-model="newLevel.skills[name].newRanks" :min="0" :max="character.basics.cr+1-character.skills[name].ranks-newLevel.skills[name].backgroundRanks" size="small" aria-label="New Ranks" />
              </el-col>
              <el-col :span="10">
                <el-input-number v-if="skill.background" v-model="newLevel.skills[name].backgroundRanks" :min="0" :max="Math.min(2, character.basics.cr+1-character.skills[name].ranks-newLevel.skills[name].newRanks)" size="small" aria-label="New Background Ranks" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <el-row style="flex-direction:row-reverse">
        <el-button
          type="primary"
          @click="addLevel()"
          :disabled="
          (newRanks == 0) ||
          (newRanks > Math.max(1, classes[newLevel.class].ranks + attributes.Int.mod)) ||
          (backgroundRanks > 2) ||
          (backgroundRanks == 0)
        ">
          Confirm Level Up
        </el-button>
      </el-row>
    </el-dialog>

    <!-- EDIT ITEM DIALOG -->
    <el-dialog v-model="editingItem" width="800">
      <g-item :source="item" @save-item="saveItem"/>
    </el-dialog>

    <!-- EDIT ABILITY DIALOG -->
    <el-dialog v-model="editingAbil" width="800">
      <g-ability :newAbil="addAbil" :name="abilName" :source="abil" @save-abil="saveAbility"/>
    </el-dialog>

    <!-- ADD NEW CONDITION DIALOG -->
    <el-dialog v-model="addingCondition" title="New Condition" width="800">
      <el-row :gutter="10">
        <el-col :span="5">
          <el-input v-model="newCondition.name" size="small" placeholder="Condition Name" aria-label="Condition Name" />
        </el-col>
        <el-col :span="15">
          <el-input v-model="newCondition.description" :rows="2" type="textarea" placeholder="Enter condition description" aria-label="Condition Description" />
        </el-col>
      </el-row>
      <!-- New Condition Bonuses -->
      <el-divider> Bonuses </el-divider>
      <el-row class="center-horz" :gutter="5" style="margin-bottom:5px;">
        <el-col :span="5"> Name </el-col>
        <el-col :span="4"> Value </el-col>
        <el-col :span="5"> Targets </el-col>
        <el-col :span="5">
          <el-button size="small" type="primary" @click="addNewConditionBonus"> New Bonus </el-button>
        </el-col>
      </el-row>
      <el-row v-for="(bonus, name) in newCondition.bonuses" :key="name" :gutter="5" style="margin-bottom:5px;">
        <el-col :span="5" class="center-horz">
          <el-tag type="primary" effect="dark"> {{ name }} </el-tag>
        </el-col>
        <el-col :span="5"> <el-input-number v-model="bonus.value" size="small" aria-label="bonue value" /> </el-col>
        <el-col :span="10">
          <el-select v-model="bonus.targets" value-key="name" multiple placeholder="Modifier Target" aria-label="bonus targets">
            <template #tag>
              <el-tag v-for="(target, index) in bonus.targets" :key="target" effect="dark" closable @close="bonus.targets.splice(index, 1)"> {{ target }} </el-tag>
            </template>
            <el-option v-for="target in rules.targets" :key="target.label" :label="target.label" :value="target.value" >
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
              <el-button type="danger" size="small" @click="delete newCondition.bonuses[name];"> Yes </el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-button size="small" type="primary" @click="addCondition()" style="margin-left:auto"> Confirm </el-button>
        <el-button size="small" type="info" @click="newCondition = {}; addingCondition = false;"> Cancel </el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import UserService from "@/services/user.service";
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
      advanced: this.$store.state.auth.user.roles.includes('admin'),
      sectionsCollapse: [ '' ],
      users: {},
      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      addingLevel: false,
      newLevel: { class: '' },

      abilityCollapse: [],
      abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],
      addAbil: false,
      abilName: "",
      editingAbil: false,
      abil: {},

      atkName: "",
      atkNum: 0,

      resourceName: "",

      newCondition: {},
      addingCondition: false,

      editingItem: false,
      item: {},
      itemFilter: "",

      spellsTab: "",
      newSpell: { name: "", level: 0, class: "" },
      spellsCollapse: [],

      character: {},
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
    if (!this.rules.size) { this.$router.push("/"); }
    // TODO: Feats and Default Actions stuff

    if ( this.currentUser.roles.includes("admin") ) {
      UserService.getAllUsers()
      .then(response => { this.users = response.data.map((user) => { return {'username': user.username, 'id': user.id} } ); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
      this.character = response.character;
      if (!this.character.user) { this.character.user = {} }
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
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },
    bonusLoop(object, tString) {
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
    applyBonus(name, value, obj) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },
    saveCharacter() {
      CharacterService.updateCharacter(this.character)
      .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
        "abilities": [],
        "newSpells": [],
        "useGaldur": this.character.classes[this.newLevel.class] ? this.character.classes[this.newLevel.class].useGaldur : false,
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
        lvl.abilities.push(newAbil);
      });

      // magic
      if (this.classes[lvl.class].magic) {
        if (lvl.level != 1) {
          let newSpellArr = this.classes[lvl.class].magic.spellsKnown.byLevel[lvl.level];
          for (let level = 0; level < newSpellArr.length; level++) {
            let lvlNum = newSpellArr[level] - Object.keys(this.character.spells[lvl.class][level]).length;
            for (let j = 0; j < lvlNum; j++) {
              lvl.newSpells.push({ "name": '', "level": level, "class": lvl.class });
            }

          }
        }
      }

      this.newLevel = lvl;
      this.addingLevel = true;
    },
    addLevel() {
      // New abilities
      this.newLevel.abilities.forEach(newAbil => {
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
        cClass.openTotal = Math.floor( source.magic.galdurTotal[this.newLevel.level] / 2 );
        cClass.openRemaining = cClass.openRemaining ? cClass.openRemaining : cClass.openTotal;

        cClass.reserveTotal = Math.ceil( source.magic.galdurTotal[this.newLevel.level] / 2 );
        cClass.reserveRemaining = cClass.reserveRemaining ? cClass.reserveRemaining : cClass.reserveTotal;

        if (source.magic.extraGaldur) {
          cClass.extraTotal = source.magic.extraGaldur.total[cClass.levels];
          cClass.extraRemaining = cClass.extraRemaining ? cClass.extraRemaining : source.magic.extraGaldur.total;
        }

        cClass.spellsPerDay = source.magic.spellsPerDay[this.newLevel.level];

        if (source.magic.style.includes('Prepared')) {
          cClass.preparedSpells = [];
          source.magic.spellsPerDay[this.newLevel.level].forEach((spells, level) => {
            cClass.preparedSpells[level] = [];
            for (let i = 0; i < spells; i++) {
              cClass.preparedSpells[level].push([]);
            }
          });
        } else if (source.magic.style.includes('Spontaneous')) {
          cClass.remainingCasts = Array.from(cClass.spellsPerDay);
          cClass.remainingCasts[0] = 1;
        }

        // Even if no spells were added at level up, create the spot for em
        if ( !this.character.spells[this.newLevel.class] ) { this.character.spells[this.newLevel.class] = []; }
        this.newLevel.newSpells.forEach(spell => {
          if ( !this.character.spells[spell.class][spell.level] ) { this.character.spells[spell.class][spell.level] = {}; }
          this.character.spells[spell.class][spell.level][spell.name] = {
            "SR": false,
            "castTime": "",
            "casts": 0,
            "components": "V,S",
            "description": "",
            "duration": "",
            "range": "",
            "save": "",
            "target": ""
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

    addNewAttack() {
      this.character.attacks[this.atkName] = {
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
    addAtkExtra(atkName) { this.character.attacks[atkName].Extras.push('New Note'); },
    deleteAtkExtra(atkName, index) { this.character.attacks[atkName].Extras.splice(index, 1); },
    addNewResource() {
      this.character.resources[this.resourceName] = {
        units: 'rounds',
        left: 1,
        total: 1,
        notes: 'Notes'
      };
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
      if (this.$refs['tree'].getNode(item.label)) {
        this.$message({ message: `${item.label} Updated`, type: "success" });
      } else {
        this.character.inventory[2].children.push(item);
      }
      this.editingItem = false;
    },
    editItem(item) {
      if (!Object.keys(item).length) {
        item = {
          label: "",
          value: {
            Description: "",
            Cost: 0,
            Weight: 0,
            Ammount: 1,
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

.el-input-number span {
  font-size: 24px;
}
</style>
