<template lang="html">
<div v-if="this.creature.name">
<h2>{{ title }}</h2>

<!-- Basics -->
<el-row :gutter="20" style="margin-bottom: 15px;">
  <el-col :xs="24" :span="12" class="center-horz">
    <svg width="225" height="200">
      <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
    </svg>
    <el-row :gutter="5" justify="center">
      <el-col :span="12">
        <el-tooltip v-if="attributes.Str.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Str </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Str.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Str.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Str </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Str.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Str.mod }} </el-tag> </template>
        </el-input>
      </el-col>

      <el-col :span="12">
        <el-tooltip v-if="attributes.Dex.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Dex </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Dex.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Dex.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Dex </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Dex.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Dex.mod }} </el-tag> </template>
        </el-input>
      </el-col>

      <el-col :span="12">
        <el-tooltip v-if="attributes.Con.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Con </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Con.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Con.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Con </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Con.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Con.mod }} </el-tag> </template>
        </el-input>
      </el-col>

      <el-col :span="12">
        <el-tooltip v-if="attributes.Int.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Int </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Int.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Int.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Int </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Int.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Int.mod }} </el-tag> </template>
        </el-input>
      </el-col>

      <el-col :span="12">
        <el-tooltip v-if="attributes.Wis.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Wis </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Wis.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Wis.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Wis </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Wis.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Wis.mod }} </el-tag> </template>
        </el-input>
      </el-col>

      <el-col :span="12">
        <el-tooltip v-if="attributes.Cha.sources[0]" placement="top" effect="light">
          <el-input disabled>
            <template #prepend> Cha </template>
            <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Cha.total }} </el-tag> </template>
            <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Cha.mod }} </el-tag> </template>
          </el-input>
          <template #content>
            <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span>
          </template>
        </el-tooltip>
        <el-input v-else disabled>
          <template #prepend> Cha </template>
          <template #prefix> <el-tag effect="dark" type="info"> {{ attributes.Cha.total }} </el-tag> </template>
          <template #suffix> <el-tag effect="dark" type="primary"> {{ attributes.Cha.mod }} </el-tag> </template>
        </el-input>
      </el-col>
    </el-row>
  </el-col>

  <el-col :xs="24" :span="12">
    <div class="center-horz">
      <g-icon iconSize="128px" :icon-name="creature.basics.type" :key="creature.basics.type"/>
    </div>

    <el-row :gutter="10">
      <el-col :span="4" class="center-vert center-horz">
        <g-icon iconSize="24px" icon-name="compass"/>
      </el-col>
      <el-col :span="20">
        <el-row>
          <el-col :span="12">
            {{ creature.basics.alignment }} {{ capFirsts(creature.basics.size) }} ({{ sizeStats.space }})
          </el-col>

          <el-col :span="12">
            <el-tooltip v-if="creature.classes[creature.basics.type].hd" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{ capFirsts(creature.basics.type) }}</el-tag>
              <template #content>
                {{ creature.classes[creature.basics.type].levels }} HD (1d{{ creature.classes[creature.basics.type].hd }})
              </template>
            </el-tooltip>
            <el-tag v-else-if="creature.basics.type == 'humanoid'" size="small" effect="dark" type="primary">{{ creature.basics.race }}</el-tag>
            <el-tag v-else size="small" effect="dark" type="primary">{{ creature.basics.type }}</el-tag>
          </el-col>
        </el-row>

        <el-row>
          <span v-for="(cClass, cName) in creature.classes" :key="cName">
            <el-tooltip v-if="cName != creature.basics.type" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary" style="margin: 0 1px 0 0;">{{ capFirsts(cName) }} {{ cClass.levels }}</el-tag>
              <template #content>
                {{ cClass.levels }} HD (1d{{ cClass.hd }})
              </template>
            </el-tooltip>
          </span>
          <el-tag size="small" effect="dark" type="info" v-for="subtype in creature.basics.subtypes" :key="subtype" style="margin: 0 1px 0 2px;">
            {{ capFirsts(subtype) }}
          </el-tag>
        </el-row>
      </el-col>
    </el-row>

    <el-row v-if="this.creature.basics.appearance">
      <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="openScroll"/> </el-col>
      <el-col :span="20" class="center-vert"> {{ this.creature.basics.appearance.age }} years old, {{ this.creature.basics.appearance.height }}, {{ this.creature.basics.appearance.weight }} </el-col>
    </el-row>
    <el-row v-if="this.creature.basics.diety">
      <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="moon"/> </el-col>
      <el-col :span="20" class="center-vert"> Diety : {{ this.creature.basics.diety }} </el-col>
    </el-row>
    <el-row v-if="this.creature.basics.environment">
      <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="forest"/> </el-col>
      <el-col :span="20" class="center-vert"> {{ this.creature.basics.environment }} </el-col>
    </el-row>
    <el-row v-if="settings.isNPC || settings.isMonster">
      <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="sparkle"/> </el-col>
      <el-col :span="20" class="center-vert"> XP : {{ this.rules.experience[this.creature.basics.cr] }} </el-col>
    </el-row>

    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="9" :sm="9">
        <el-button @click="saveCreature()" type="primary" round> Save Changes </el-button>
      </el-col>
      <el-col :xs="3" :sm="3"  class="center-horz">
        <el-tooltip v-if="!settings.isMonster" placement="top" effect="light">
          <el-button @click="this.$router.push({ name: 'character-edit', params: { id: character.id } })" type="info" style="margin:0" circle>
            <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
          </el-button>
          <template #content>
            Edit Character
          </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="9" :sm="9">
        <el-button @click="openDrawer()" type="primary" round> Open Drawer </el-button>
      </el-col>
    </el-row>
  </el-col>
</el-row>


<!-- Content Tabs -->
<el-row :gutter="10" justify="center" align="middle">
  <el-col :xs="4" :sm="0">
    <el-button @click="rest()" id="restBtn" size="large" style="width:40px">
      <el-tooltip placement="top" effect="light">
        <g-icon iconSize="20px" iconName="campfire" />
        <template #content>Rest for 8 Hours</template>
      </el-tooltip>
    </el-button>
  </el-col>
</el-row>

<el-tabs v-model="settings.cardTab" type="card">

  <!-- Main -->
  <el-tab-pane name="Main">
    <template #label> <g-icon iconSize="20px" iconName="compass" /> Main </template>

    <el-collapse v-model="settings.mainSections">
      <!-- Defense -->
      <el-collapse-item name="defense">
        <template #title> <g-icon iconName="armor" /> Defense </template>
        <el-row :gutter="10" >

          <!-- HEALTH -->
          <el-col :xs="24" :span="10">
            <el-row>
              <el-col :xs="24" :span="22">
                <el-tooltip placement="top" effect="light">
                  <el-progress
                    v-if="health.total > 0"
                    :percentage="Math.max(0, Math.floor(((health.total-health.damage)/health.total)*100))"
                    :color="healthColors"
                    :text-inside="true"
                    :stroke-width="24">
                    HP : {{ health.total-health.damage }} / {{ health.total }}
                  </el-progress>
                  <template #content>
                    <span v-for="bonus in health.sources" :key="bonus"> {{ bonus+" " }} </span>
                  </template>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" class="center-horz">
                <el-tag size="large" effect="dark" type="danger"> Damage </el-tag>
              </el-col>
              <el-col :span="10">
                <el-input-number v-model="creature.health.damage" :min="0" :max="health.total + attributes.Cha.total" v-if="creature.basics.type == 'undead'" @change="healthCheck()" aria-label="Current Damage" />
                <el-input-number v-model="creature.health.damage" :min="0" :max="health.total + attributes.Con.total" v-else @change="healthCheck()" aria-label="Current Damage" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" class="center-horz">
                <el-tag size="large" effect="dark" type="warning"> Nonleathal </el-tag>
              </el-col>
              <el-col :span="10">
                <el-input-number v-model="creature.health.nonlethal" :min="0" :max="health.total+1" @change="healthCheck()" aria-label="Current Nonlethal Damage" />
              </el-col>
            </el-row>
            <el-row justify="center">
              <el-tooltip v-if="health.damage > health.total" placement="top" effect="light">
                <el-tag effect="dark" type="danger">
                  Stabilize (DC 10) : {{ attributes.Con.mod + (creature.health.total-creature.health.damage) }}
                </el-tag>
                <template #content>
                  ConMod: {{ attributes.Con.mod }} + Current Health: {{ (creature.health.total-creature.health.damage) }}
                </template>
              </el-tooltip>
            </el-row>
          </el-col>

          <!-- AC & Stabilize -->
          <el-col :xs="8" :span="4">
            <el-tooltip placement="top" effect="light">
              AC: {{ ac.total.total }}
              <template #content>
                <span v-for="bonus in ac.total.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <el-tooltip placement="top" effect="light">
              Touch: {{ ac.touch.total }}
              <template #content>
                <span v-for="bonus in ac.touch.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <el-tooltip placement="top" effect="light">
              Flat Footed: {{ ac.flat.total }}
              <template #content>
                <span v-for="bonus in ac.flat.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>
          </el-col>

          <!-- CMD & Saves -->
          <el-col :xs="8" :span="4">
            <el-tooltip placement="top" effect="light">
              CMD: {{ cmd.total }}
              <template #content>
                <span v-for="bonus in cmd.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <el-tooltip placement="top" effect="light">
              Fort: {{ saves.fort.total > 0 ? "+" : "" }}{{ saves.fort.total }}
              <template #content>
                <span v-for="bonus in saves.fort.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <el-tooltip placement="top" effect="light">
              Ref: {{ saves.ref.total > 0 ? "+" : "" }}{{ saves.ref.total }}
              <template #content>
                <span v-for="bonus in saves.ref.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <el-tooltip placement="top" effect="light">
              Will: {{ saves.will.total > 0 ? "+" : "" }}{{ saves.will.total }}
              <template #content>
                <span v-for="bonus in saves.will.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>
          </el-col>

          <!-- Init, Speed, Senses -->
          <el-col :xe="8" :span="5">
            <el-tooltip placement="top" effect="light">
              Init: {{ init.total > 0 ? "+" : "" }}{{ init.total }}
              <template #content>
                <span v-for="bonus in init.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>   <br>
            <span v-for="(mode, name) in speed" :key="name">
              <span v-if="mode.total">
                <el-tooltip v-if="mode.sources[0]" placement="top" effect="light">
                  <el-tag size="small" effect="dark" type="primary">
                    {{ capFirsts(name) }}: {{ mode.total }} ft.
                  </el-tag>
                  <template #content>
                    <span v-for="bonus in mode.sources" :key="bonus"> {{ bonus+" " }} </span>
                  </template>
                </el-tooltip>
                <el-tag v-else size="small" effect="dark" type="info">
                  {{ capFirsts(name) }}: {{ mode.total }} ft.
                </el-tag>
              </span>
            </span>   <br>
            Senses:
            <el-tag v-for="sense in senses" :key="sense" size="small" effect="dark" type="primary" style="margin-right:5px;">
              {{ sense }}
            </el-tag>
          </el-col>
        </el-row>

        <!-- Immunities & Weaknesses -->
        <el-row v-for="(type, name) in defenses" :key="name">
          <el-col :xs="6" :span="3" v-if="type.length"> {{ capFirsts(name) }} </el-col>
          <el-col :xs="18" :span="21" >
            <span v-for="defense in type" :key="defense">
              <el-tag v-for="item in defense" :key="item" size="small" effect="dark" type="info" style="margin-right:5px;">
                {{ capFirsts(item) }}
              </el-tag>
            </span>
          </el-col>
        </el-row>
      </el-collapse-item>

      <!-- Actions -->
      <el-collapse-item name="actions">
        <template #title> <g-icon iconName="swordShield" /> Actions </template>
        <el-tree
          :data="actions"
          :default-expanded-keys="[ 'Melee', 'Ranged', 'Special' ]"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          @node-drop="updateAction"
          node-key="label"
          render-after-expand
          draggable >
          <template #default="{ data }">

            <!-- Icon & Name -->
            <el-col :xs="2" :span="1" class="center-horz">
              <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
              <span v-else> • </span>
            </el-col>
            <el-col :xs="10" :sm="5" :md="5">
              <el-tooltip v-if="data.value" placement="left" effect="light">
                <el-button @click="actionBtn(data)" size="small" type="primary">
                  <span v-if="data.value.extras.AtkNum"> {{ data.value.extras.AtkNum }} &nbsp; </span>
                  {{ data.label }}
                  <span v-if="data.value.extras.AtkNum">s</span>
                </el-button>
                <template #content>
                  {{ data.value.trigger }}
                </template>
              </el-tooltip>
              <span v-else> {{ data.label }} </span>
            </el-col>

            <!-- CMB -->
            <el-col v-if="data.label == 'Special'" :span="3">
              <el-tooltip placement="top" effect="light">
                <el-tag size="small" effect="dark" type="primary">
                  CMB: {{ cmb.total }}
                </el-tag>
                <template #content>
                  <span v-for="bonus in cmb.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>
            </el-col>

            <!-- Attack Bonus (To Hit) -->
            <el-col v-if="data.value && data.value.atkBonus" :span="3">
              <el-row :gutter="10" justify="center">
                <el-col :span="6">
                  <el-tooltip placement="top" effect="light">
                    <span> <span v-if="data.value.atkBonus.total >= 0">+</span>{{ data.value.atkBonus.total }} </span>
                    <template #content>
                      <span v-for="bonus in data.value.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip v-if="bab>5 && !data.value.extras.naturalAtk" placement="top" effect="light">
                    <span> <span v-if="data.value.atkBonus.total >= 0">+</span>{{ data.value.atkBonus.total-5 }} </span>
                    <template #content>
                      <span v-for="bonus in data.value.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -5 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip v-if="bab>10 && !data.value.extras.naturalAtk" placement="top" effect="light">
                    <span> <span v-if="data.value.atkBonus.total >= 0">+</span>{{ data.value.atkBonus.total-10 }} </span>
                    <template #content>
                      <span v-for="bonus in data.value.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -10 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <el-col :span="6">
                  <el-tooltip v-if="bab>15 && !data.value.extras.naturalAtk" placement="top" effect="light">
                    <span> <span v-if="data.value.atkBonus.total >= 0">+</span>{{ data.value.atkBonus.total-15 }} </span>
                    <template #content>
                      <span v-for="bonus in data.value.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -15 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-col>

            <!-- Damage -->
            <el-col v-if="data.value && data.value.damage" :span="6">
              <el-tooltip placement="top" effect="light">
                <el-tag type="danger" effect="dark" size="small">
                  {{ data.value.damage[creature.basics.size] }}
                  <span v-if="data.value.dmgBonus.total">
                    <span v-if="data.value.dmgBonus.total >= 0">+</span>
                    {{ data.value.dmgBonus.total }}
                  </span>
                </el-tag>
                <template #content>
                  <span v-for="bonus in data.value.dmgBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                  <br>
                  <el-tag v-for="type in data.value.damageTypes" :key="type.value" size="small" effect="dark" type="info" style="margin-left:5px">
                    <span :style="`color:${type.color}`">
                      {{ type.label }}
                    </span>
                  </el-tag>
                </template>
              </el-tooltip>
              <!-- Bonus Damage -->
              <el-tooltip v-for="(obj, name) in data.value.extras.extraDamages" :key="name" placement="top" effect="light">
                <el-tag size="small" effect="dark" type="warning" style="margin-left:5px">
                  <span v-if="data.value.dmgBonus.total >= 0">+</span>
                  {{ obj.Damage }}
                </el-tag>
                <template #content>
                  From {{ name }}
                  <br>
                  <el-tag size="small" effect="dark" type="info" style="margin-left:5px">
                    {{ obj.Type }}
                  </el-tag>
                </template>
              </el-tooltip>
            </el-col>

            <!-- Crit -->
            <el-col v-if="data.value && data.value.crit" :xs="0" :span="2" class="center-horz">
              <el-tooltip placement="top" effect="light">
                <span>
                  (<span v-if="data.value.crit.range<20">{{ data.value.crit.range }}-</span>20 {{ data.value.crit.mult }})
                </span>
                <template #content>
                  Crit Range and Multiplyer
                </template>
              </el-tooltip>
            </el-col>

            <!-- Range -->
            <el-col v-if="data.value && data.value.range" :xs="0" :span="2">
              <span v-if="data.value.range"> {{ data.value.range }} ft. </span>
            </el-col>

            <!-- Special Abilities -->
            <el-col v-if="data.value && data.value.shortText" :span="14">
              {{ data.value.shortText }}
            </el-col>

            <!-- Notes -->
            <el-col v-if="data.value && data.value.extras && data.value.extras.notes" :xs="0" :span="2">
              <el-tooltip v-if="data.value.extras.notes.length" placement="left" effect="light">
                <el-tag size="small" effect="dark" type="primary"> Notes </el-tag>
                <template #content>
                  {{ data.value.extras.notes }}
                </template>
              </el-tooltip>
            </el-col>
          </template>
        </el-tree>
      </el-collapse-item>

      <!-- Resources -->
      <el-collapse-item name="resources">
        <template #title> <g-icon iconName="star" /> Resources </template>
        <div v-for="(res, name) in creature.resources" :key="name">
          <el-row :gutter="10" style="margin-bottom:10px">
            <el-col :span="6" class="center-horz">
              <el-tag size="large" effect="dark" type="primary"> {{ name }} </el-tag>
            </el-col>
            <el-col :span="17" class="center-horz">
              <el-progress
                :percentage="Math.floor((res.left/res.total)*100)"
                :color="res.color"
                :text-inside="true"
                :striped="true"
                :stroke-width="30">
                {{ res.left }} / {{ res.total }} {{ res.units }}
              </el-progress>
            </el-col>
          </el-row>
          <el-row :gutter="10" align="middle"  style="margin-bottom:10px">
            <el-col :span="6" class="center-horz">
              <el-input-number v-model="res.left" :min="0" :max="res.total" :aria-label="`Remaining ${name}`" />
            </el-col>
            <el-col :span="17">
              <el-input v-model="res.notes" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${name} Notes`" type="textarea" />
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-tab-pane>

  <!-- Items -->
  <el-tab-pane name="Items">
    <template #label> <g-icon iconSize="20px" iconName="inventory" /> Items </template>

    <!-- Coins -->
    <el-row :gutter="10">
      <el-col :xs="24" :span="6" class="center-horz">
        <el-tag size="large" effect="dark" color="#FFDE0A" style="color:black; --el-tag-border-color: none;">
          <g-icon iconSize="24px" iconName="treasure" iconColor="#000" />
          Total (gp) : {{ invTotal.value }}
        </el-tag> <br>
        <el-tooltip placement="right" effect="light">
          <el-tag size="large" effect="dark" :type="invTotal.color" style="color:black">
            <g-icon iconSize="24px" iconName="weight" iconColor="#000" />
            Total (lbs) : {{ invTotal.weight }}
          </el-tag>
          <template #content>
            {{ invTotal.level }} Load <br>
            Max Weight: {{ invTotal.carryCap }} lbs
          </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="24" :span="9">
        <el-input v-model="creature.coins.pp" aria-label="Platinum Pieces Input" >
          <template #prepend> Platinum </template>
          <template #suffix> Coins </template>
          <template #append> {{ (creature.coins.pp / 50) }} lbs. </template>
        </el-input>
        <el-input v-model="creature.coins.gp" aria-label="Gold Pieces Input" >
          <template #prepend> Gold </template>
          <template #suffix> Coins </template>
          <template #append> {{ (creature.coins.gp / 50) }} lbs. </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :span="9">
        <el-input v-model="creature.coins.sp" aria-label="Silver Pieces Input" >
          <template #prepend> Silver </template>
          <template #suffix> Coins </template>
          <template #append> {{ (creature.coins.sp / 50) }} lbs. </template>
        </el-input>
        <el-input v-model="creature.coins.cp" aria-label="Copper Pieces Input" >
          <template #prepend> Copper </template>
          <template #suffix> Coins </template>
          <template #append> {{ (creature.coins.cp / 50) }} lbs. </template>
        </el-input>
      </el-col>
    </el-row>

    <el-divider />
    <el-row :gutter="10">
      <el-col :xs="16" :span="20">
        <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search" />
      </el-col>
      <el-col :xs="7" :span="4">
        <el-button type="primary" @click="addItem">Add Item</el-button>
      </el-col>
    </el-row>

    <el-tree
      :data="inventory"
      :default-expanded-keys="creature.settings.expandInventory"
      :filter-node-method="filterNode"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      ref="tree"
      node-key="label"
      draggable
      render-after-expand >
      <template #default="{ node, data }">
        <el-col :xs="2" :span="1" style="text-align: center; margin-right:2px;">
          <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
          <span v-else> • </span>
        </el-col>
        <el-col :xs="11" :sm="5"> {{ node.label }} </el-col>
        <el-col :xs="0" :sm="0" :lg="6" style="overflow: hidden">
          <span v-if="data.value && data.value.Extras && data.value.Extras.Notes && data.value.Extras.Notes.length">
            <el-tag type="info" effect="dark">
              {{ data.value.Extras.Notes[0] }}
            </el-tag>
          </span>
        </el-col>
        <el-col :xs="0" :sm="3" :lg="2">
          <el-tag v-if="data.value" color="#FFDE0A" style="color:black; border:none;">
            {{ data.value.Cost }} gp
          </el-tag>
        </el-col>
        <el-col :xs="0" :sm="3" :lg="2">
          <el-tag v-if="data.value" type="info" effect="dark">
            {{ data.value.Weight }} lbs.
          </el-tag>
        </el-col>
        <el-col :xs="0" :sm="5" :lg="3">
          <el-input-number v-if="data.value && Number.isInteger(data.value.Amount)" v-model="data.value.Amount" :min="0" @change="refresh++" size="small" aria-label="Number of Items" />
        </el-col>
        <el-col :xs="7" :sm="4" :lg="3">
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
        </el-col>
      </template>
    </el-tree>
  </el-tab-pane>

  <!-- Skills -->
  <el-tab-pane name="Skills">
    <template #label> <g-icon iconSize="20px" iconName="sparkle" /> Skills </template>
    <el-row v-if="creature.skills.Linguistics && creature.skills.Linguistics.extras">
      <el-col :xs="6" :sm="3" :span="2"> Languages: </el-col>
      <el-col :xs="18" :sm="21" :span="23">
        <el-tag size="small" effect="dark" type="primary" v-for="language in creature.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
      </el-col>
    </el-row>

    <el-divider />
    <el-row :gutter="10" style="margin-bottom:5px; border-bottom:1px solid grey">
      <el-col :xs="6" :span="5" class="center-vert"> <h5> Name </h5> </el-col>
      <el-col :xs="2" :span="2" class="center-horz">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="28px" iconName="d20" />
          <template #content> Skill Bonus </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="6" :span="8" class="center-horz"> <h5> Notes </h5> </el-col>
      <el-col :xs="0" :span="2"></el-col>
      <el-col :offset="1" :xs="3" :span="2" class="center-horz">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="28px" iconName="sparkle" />
          <template #content> Ranks </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="2" :span="1">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="28px" iconName="magicSwirl" />
          <template #content> Class Skill </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="2" :span="1">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="28px" iconName="armor" />
          <template #content> Armor Penalty </template>
        </el-tooltip>
      </el-col>
      <el-col :xs="0" :span="1">
        <el-tooltip placement="top" effect="light">
          <g-icon iconSize="28px" iconName="openBook" />
          <template #content> Background Skill </template>
        </el-tooltip>
      </el-col>
    </el-row>

    <div v-for="(skill, name) in rules.skills" :key="name">
      <el-row :gutter="10" v-if="skill.untrained || skill.ranks" style="padding-bottom:5px; border-bottom:1px solid grey; margin-bottom:5px;" align="middle">
        <el-col :xs="6" :span="5">
          {{ name }}
          <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ creature.skills[name].extras.specialty }}) </span>
        </el-col>
        <el-col :xs="3" :span="2" class="center-horz">
          <el-tooltip placement="top" effect="light">
            {{ skills[name].bonus.total }}
            <template #content>
              <span v-for="bonus in skills[name].bonus.sources" :key="bonus"> {{ bonus+" " }} </span>
            </template>
          </el-tooltip>
        </el-col>
        <el-col :xs="6" :span="8">
          <el-input type="textarea" v-model="creature.skills[name].extras.notes" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${name} notes`" />
        </el-col>
        <el-col :xs="0" :span="2" class="center-horz">
          ({{ skill.ability }})
        </el-col>
        <el-col :offset="1" :xs="3" :span="2" class="center-horz">
          <span v-if="creature.skills[name].ranks">
            <el-tag effect="dark" type="info"> {{ creature.skills[name].ranks }} </el-tag>
          </span>
        </el-col>
        <el-col :xs="2" :span="1" class="center-horz">
          <g-icon v-if="creature.skills[name].class" iconSize="20px" iconName="magicSwirl" />
        </el-col>
        <el-col :xs="2" :span="1" class="center-horz">
          <g-icon v-if="skill.armor_pen" iconSize="20px" iconName="armor" />
        </el-col>
        <el-col :xs="0" :span="1" class="center-horz">
          <g-icon v-if="skill.background" iconSize="20px" iconName="openBook" />
        </el-col>
      </el-row>
    </div>
  </el-tab-pane>

  <!-- Abilities -->
  <el-tab-pane name="Abilities">
    <template #label> <g-icon iconSize="20px" iconName="abilityPalm" /> Abilities </template>
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
        <div v-for="(abil, index) in abilities" :key="abil.name">
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
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- Conditions -->
    <el-row :gutter="10" style="margin-top:7px;" justify="space-between">
      <el-col :xs="9" :sm="5" :span="4"> <g-icon iconSize="32px" iconName="dizzyStar" /> Conditions </el-col>
      <el-col :xs="10" :span="8">
        <el-select v-model="creature.conditions" value-key="name" multiple placeholder="Common Conditions" aria-label="Conditions Select">
          <template #tag>
            <el-tag v-for="(condition, index) in creature.conditions" :key="condition" effect="dark" closable @close="creature.conditions.splice(index, 1)"> {{ condition.name }} </el-tag>
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
    <el-divider> Active </el-divider>
    <el-row v-for="condition in creature.conditions" :key="condition.name">
      <el-col :span="6" class="center-vert">
        <el-tag type="info" size="large" effect="dark"> {{ condition.name }} </el-tag>
      </el-col>
      <el-col :span="18" class="center-vert">
        {{ condition.description }}
      </el-col>
    </el-row>
  </el-tab-pane>

  <!-- Magic -->
  <el-tab-pane name="Spells">
    <template #label> <g-icon iconSize="20px" iconName="spellBook" /> Spells </template>
    <el-popconfirm title="Learn New Spell?" @confirm="addSpell" hide-icon :hide-after="1000">
      <template #reference>
        <el-button type="primary" size="large" id="addSpell">Add Spell</el-button>
      </template>
      <template #actions="{ confirm }">
        Name: <br>
        <el-input v-model="newSpell.name" size="small" aria-label="New Spell Name" />
        Level: <br>
        <el-input-number v-model="newSpell.level" :min="0" :max="9" size="small" aria-label="New Spell Level" />
        Class: <br>
        <el-select v-model="newSpell.class" aria-label="New Spell Class">
          <el-option v-for="(cClass, cName) in creature.classes" :key="cName" :label="capFirsts(cName)" :value="cName" />
        </el-select>
        <el-button type="primary" size="small" @click="confirm" :disabled="newSpell.name == '' || newSpell.class == ''">Yes</el-button>
      </template>
    </el-popconfirm>

    <el-tabs v-model="spellTabs" type="card" style="padding-top:10px;">
      <el-tab-pane v-for="(cClass, cName) in creature.classes" :key="cName" :label="capFirsts(cName)" :name="cName" >
        <div v-if="cClass.magic">
          <el-row :gutter="10" style="margin-bottom:10px" align="middle">
            <el-col :span="12">
              <div v-if="cClass.useGaldur">
                <el-row :gutter="10">
                  <el-col :span="5">
                    <el-tag effect="dark" type="primary"> Open Pool </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-progress :text-inside="true" :stroke-width="24" :percentage=" Math.floor( ( cClass.openRemaining / cClass.openTotal ) * 100 ) ">
                      {{ cClass.openRemaining }} / {{ cClass.openTotal }}
                    </el-progress>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="5">
                    <el-tag effect="dark" type="warning"> Reserve Pool </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-progress :text-inside="true" :stroke-width="24" status="warning" :percentage=" Math.floor( ( cClass.reserveRemaining / cClass.reserveTotal ) * 100 ) ">
                      {{ cClass.reserveRemaining }} / {{ cClass.reserveTotal }}
                    </el-progress>
                  </el-col>
                </el-row>
                <el-row :gutter="10" v-if="cClass.extraPoolName">
                  <el-col :span="5">
                    <el-tag effect="dark" type="info"> {{ cClass.extraPoolName }} </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-progress :text-inside="true" :stroke-width="24" color="#909399" :percentage=" Math.floor( ( cClass.extraRemaining / cClass.extraTotal ) * 100 ) ">
                      {{ cClass.extraRemaining }} / {{ cClass.extraTotal }}
                    </el-progress>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row justify="space-between" align="middle">
                <el-col :span="12">
                  <el-tooltip placement="top" effect="light">
                    <el-tag effect="dark" type="primary" size="large">
                      Concentration: +{{ concentration[cName].total }}
                    </el-tag>
                    <template #content>
                      <span v-for="bonus in concentration[cName].sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <el-col :span="8" v-if="(knownMetas.length > 0) && (cClass.magic.style.includes('Spontaneous') || cClass.magic.useGaldur)" class="center-horz">
                  Metamagic
                  <el-select v-model="metamagic" value-key="name" clearable aria-label="Metamagic Select">
                    <el-option v-for="meta in knownMetas" :key="meta.name" :label="capFirsts(meta.name)" :value="meta" />
                  </el-select>
                  <el-tooltip v-if="metamagic" placement="left" effect="light">
                    <el-input-number v-model="metamagic.increase" :min="0" :max="8" aria-label="Metamagic Increase" />
                    <template #content>
                      Choose the level incrase
                    </template>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- Prepared Spell List -->
          <div v-if="cClass.magic.style.includes('Prepared') && !cClass.useGaldur">
            <el-collapse v-model="spellsCollapse">
              <el-collapse-item v-for="(spells, lvl) in cClass.magic.preparedSpells" :key="lvl" :name="lvl">
                <template #title>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-tag effect="dark"> Level {{ lvl }} Spells </el-tag>
                    </el-col>
                    <el-col :span="7">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Save DC : {{ 10 + lvl + (attributes[cClass.magic.castingAtr].mod) }} </el-tag>
                        <template #content>
                          10
                          + {{ attributes[cClass.magic.castingAtr].mod }} {{ cClass.magic.castingAtr }}
                          + {{ lvl }} Level Spell
                        </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="10">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Defensive Casting DC : {{ 15 + (lvl * 2) }} </el-tag>
                        <template #content>
                          Cast defensively to avoid an Attack of Opportunity <br>
                          15 + {{ lvl * 2 }} (Spell Level x 2)
                        </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </template>

                <!--
                  <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10" align="middle" style="margin-bottom:15px;">
                  <el-col :span="4" class="center-horz">
                  <el-button @click="castSSpell(cName, lvl)" :disabled="!cClass.magic.remainingCasts[lvl] > 0" type="primary" plain>
                    {{ sName }}
                  </el-button>
                -->
                <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10" align="middle" style="margin-bottom:15px;">
                  <el-col :span="4" class="center-horz">
                    <el-popconfirm :title="`Cast ${spell}`" @confirm="castPSpell(cName, lvl, spell, sName)" hide-icon>
                      <template #reference>
                        <el-button :ref="`${spell}-${sName}`" type="primary" plain> {{ spell }} </el-button>
                      </template>
                      <template #actions="{ confirm }">
                        <el-button @click="confirm" size="small" type="primary"> Yes </el-button>
                      </template>
                    </el-popconfirm>
                  </el-col>
                  <el-col :span="20">
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-input v-model="spell.components" aria-label="Components">
                          <template #prepend>Components</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.castTime" aria-label="Casting Time">
                          <template #prepend>Cast Time</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.duration" aria-label="Duration">
                          <template #prepend>Duration</template>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-input v-model="spell.description" :autosize="{ minRows: 2, maxRows: 4 }" :aria-label="`${sName} Spell Description`"  type="textarea" />
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.target" aria-label="Target">
                          <template #prepend>Target</template>
                        </el-input>
                        <el-input v-model="spell.range" aria-label="Range">
                          <template #prepend>Range</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8" class="center-horz">
                        <el-input v-model="spell.save" aria-label="Save">
                          <template #prepend>Save</template>
                        </el-input>
                        <el-tag effect="dark" :type="spell.SR ? 'warning' : 'info'"> {{ spell.SR ? 'Yes' : 'No' }} SR </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- Spontaneous Spell List -->
          <div v-else-if="cClass.magic.style.includes('Spontaneous') && !cClass.magic.useGaldur">
            <el-collapse v-model="spellsCollapse">
              <el-collapse-item v-for="(spells, lvl) in creature.spells[cName]" :key="lvl" :name="lvl">
                <template #title>
                  <el-row :gutter="10" justify="space-between">
                    <el-col :xs="11" :sm="6">
                      <el-tag effect="dark"> Level {{ lvl }} Spells </el-tag>
                    </el-col>
                    <el-col :xs="10" :sm="6">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Save DC : {{ 10 + lvl + (attributes[cClass.magic.castingAtr].mod) }} </el-tag>
                        <template #content>
                          10
                          + {{ attributes[cClass.magic.castingAtr].mod }} {{ cClass.magic.castingAtr }}
                          + {{ lvl }} Level Spell
                        </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :xs="0" :sm="11">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Defensive Casting DC : {{ 15 + (lvl * 2) }} </el-tag>
                        <template #content>
                          Cast defensively to avoid an Attack of Opportunity <br>
                          15 + {{ lvl * 2 }} (Spell Level x 2)
                        </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </template>
                <el-row class="center-horz, spell">
                  <el-col :span="11">
                    <el-tooltip placement="top" effect="light">
                      <el-progress :text-inside="true" :stroke-width="24" :color="healthColors"
                        :percentage=" Math.floor( ( cClass.magic.remainingCasts[lvl] / (cClass.magic.spellsPerDay[lvl] == -1 ? 1 : cClass.magic.spellsPerDay[lvl]) ) * 100 ) ">
                        {{ cClass.magic.spellsPerDay[lvl] == -1 ? "∞" : cClass.magic.spellsPerDay[lvl] }} / {{ cClass.magic.spellsPerDay[lvl] == -1 ? "∞" : cClass.magic.spellsPerDay[lvl] }}
                      </el-progress>
                      <template #content> Remaining Spell Slots </template>
                    </el-tooltip>
                  </el-col>
                </el-row>

                <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10" align="middle" class="spell">
                  <el-col :xs="12" :span="4" class="center-horz">
                    <el-button @click="castSSpell(cClass, lvl)" :disabled="!cClass.magic.remainingCasts[lvl] > 0" type="primary" plain> {{ sName }} </el-button>
                  </el-col>
                  <el-col :xs="24" :span="20">
                    <el-row :gutter="10">
                      <el-col :xs="24" :span="8">
                        <el-input v-model="spell.description" :autosize="{ minRows: 2, maxRows: 4 }" :aria-label="`${sName} Spell Description`"  type="textarea" />
                        <el-input v-model="spell.components" aria-label="Components">
                          <template #prepend>Components</template>
                        </el-input>
                      </el-col>
                      <el-col :xs="24" :span="8">
                        <el-input v-model="spell.castTime" aria-label="Casting Time">
                          <template #prepend>Cast Time</template>
                        </el-input>
                        <el-input v-model="spell.duration" aria-label="Duration">
                          <template #prepend>Duration</template>
                        </el-input>
                        <el-col :xs="0" :sm="24">
                          <el-input v-model="spell.save" aria-label="Save">
                            <template #prepend>Save</template>
                          </el-input>
                        </el-col>
                      </el-col>
                      <el-col :xs="24" :span="8">
                        <el-input v-model="spell.target" aria-label="Target">
                          <template #prepend>Target</template>
                        </el-input>
                        <el-input v-model="spell.range" aria-label="Range">
                          <template #prepend>Range</template>
                        </el-input>
                        <el-col :xs="0" :sm="24" class="center-horz">
                          <el-tag effect="dark" :type="spell.SR ? 'warning' : 'info'"> {{ spell.SR ? 'Yes' : 'No' }} SR </el-tag>
                        </el-col>
                      </el-col>
                      <el-col :xs="14" :span="0">
                        <el-input v-model="spell.save" aria-label="Save">
                          <template #prepend>Save</template>
                        </el-input>
                      </el-col>
                      <el-col :xs="10" :span="0" class="center-horz">
                        <el-tag effect="dark" :type="spell.SR ? 'warning' : 'info'"> {{ spell.SR ? 'Yes' : 'No' }} SR </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- Galdur Spell List -->
          <div v-else>
            <el-collapse v-model="spellsCollapse">
              <el-collapse-item v-for="(spells, lvl) in creature.spells[cName]" :key="lvl" :name="lvl">
                <template #title>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-tag effect="dark"> Level {{ lvl }} Spells </el-tag>
                    </el-col>
                    <el-col :span="7">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Save DC : {{ 10 + lvl + (attributes[cClass.magic.castingAtr].mod) }} </el-tag>
                        <template #content>
                          10
                          + {{ attributes[cClass.magic.castingAtr].mod }} {{ cClass.magic.castingAtr }}
                          + {{ lvl }} Level Spell
                        </template>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="10">
                      <el-tooltip placement="top" effect="light">
                        <el-tag effect="dark" type="info"> Defensive Casting DC : {{ 15 + (lvl * 2) }} </el-tag>
                        <template #content>
                          Cast defensively to avoid an Attack of Opportunity <br>
                          15 + {{ lvl * 2 }} (Spell Level x 2)
                        </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </template>
                <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10" align="middle" style="margin-bottom:15px;">

                  <el-col :span="4" class="center-horz">
                    <el-popover @show="spellPop(spell, lvl, cName)" trigger="click">
                      <template #reference>
                        <el-button plain :type="(creature.classes[cName].openRemaining > 0) ? 'primary' : 'warning'"> {{ sName }} </el-button>
                      </template>
                      <template #default>
                        <el-row> {{ `Cast for ${spellCost} Galdur?` }} </el-row>
                        <el-row v-if="(cClass.magic.openRemaining - this.spellCost) <= 0">
                          <el-tooltip placement="top" effect="light">
                            <el-tag type="warning"> {{ `Will Save (DC ${this.gFatigue})` }} </el-tag>
                            <template #content>
                              Will : {{ saves.will.total > 0 ? "+" : "" }}{{ saves.will.total }}
                            </template>
                          </el-tooltip>
                        </el-row>
                        <el-row justify="end">
                          <el-button
                            @click="castGSpell(sName, spell, lvl, cName)"
                            :disabled="( (cClass.magic.reserveRemaining - this.spellCost) < 0 ) || ( (lvl==0) && (cClass.magic.reserveRemaining==0) )"
                            :type="( ((cClass.magic.reserveRemaining - this.spellCost) < 0 ) || ((lvl==0) && (cClass.magic.reserveRemaining==0)) ) ? 'danger' : 'primary'"
                            size="small">
                            <span v-if="( (cClass.magic.reserveRemaining - this.spellCost) < 0 ) || ( (lvl==0) && (cClass.magic.reserveRemaining==0) )">
                              Not Enough Galdur
                            </span>
                            <span v-else> Yes </span>
                          </el-button>
                        </el-row>
                      </template>
                    </el-popover>
                  </el-col>

                  <el-col :span="20">
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-input v-model="spell.components" aria-label="Components">
                          <template #prepend>Components</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.castTime" aria-label="Casting Time">
                          <template #prepend>Cast Time</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.duration" aria-label="Duration">
                          <template #prepend>Duration</template>
                        </el-input>
                      </el-col>
                    </el-row>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-input v-model="spell.description" :autosize="{ minRows: 2, maxRows: 4 }" :aria-label="`${sName} Spell Description`"  type="textarea" />
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="spell.target" aria-label="Target">
                          <template #prepend>Target</template>
                        </el-input>
                        <el-input v-model="spell.range" aria-label="Range">
                          <template #prepend>Range</template>
                        </el-input>
                      </el-col>
                      <el-col :span="8" class="center-horz">
                        <el-input v-model="spell.save" aria-label="Save">
                          <template #prepend>Save</template>
                        </el-input>
                        <el-tag effect="dark" :type="spell.SR ? 'warning' : 'info'"> {{ spell.SR ? 'Yes' : 'No' }} SR </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>

        </div>
      </el-tab-pane>
    </el-tabs>
  </el-tab-pane>

  <!-- Edit -->
  <el-tab-pane name="Edit">
    <template #label> <g-icon iconSize="20px" iconName="quill" /> Edit </template>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <el-row align="middle">
          <el-col :xs="12" :sm="9" :span="4"> Hero Points </el-col>
          <el-col :xs="12" :span="6">
            <el-input-number v-model="creature.settings.heroPoints" :min="0" :max="4" aria-label="Hero Points" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-row align="middle">
          <el-col :xs="12" :sm="9" :span="4"> Your Size </el-col>
          <el-col :xs="12" :span="12">
            <el-select v-model="creature.basics.size" label="Size">
              <el-option v-for="size in Object.keys(rules.size)" :key="size" :label="capFirsts(size)" :value="size" />
            </el-select>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-row align="middle">
          <el-col :xs="12" :sm="9" :span="4"> <g-icon iconName="openScroll" /> Backstory </el-col>
          <el-col :span="12">
            <el-input v-model="creature.basics.backstory" :autosize="{ minRows: 3, maxRows: 10 }" aria-label="Backstory" type="textarea" />
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-row align="middle">
          <el-col :xs="12" :sm="9" :span="4"> <g-icon iconName="openBook" /> Notes </el-col>
          <el-col :span="12">
            <el-input v-model="creature.notes" :autosize="{ minRows: 3, maxRows: 10 }" aria-label="Notes" type="textarea" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-divider style="margin: 24px 0 10px 0"> Bonuses </el-divider>
    <el-row :gutter="5" justify="space-between">
      <el-col :xs="4" :span="6"> <el-tag effect="dark" type="primary"> Name </el-tag> </el-col>
      <el-col :xs="3" :span="2" class="center-horz"> <el-tag effect="dark" type="primary"> Value </el-tag> </el-col>
      <el-col :xs="4" :span="6" class="center-horz"> <el-tag effect="dark" type="primary"> Type </el-tag> </el-col>
      <el-col :xs="7" :span="8"> <el-tag effect="dark" type="primary"> Targets </el-tag> </el-col>
      <el-divider style="margin: 5px 0 10px 0" />
    </el-row>
    <el-row v-for="(bonus, name) in bonuses" :key="name" :gutter="5" justify="space-between">
      <el-col :xs="6" :span="6"> {{ name }} </el-col>
      <el-col :xs="1" :span="2" class="center-horz"> {{ bonus.value }} </el-col>
      <el-col :xs="4" :span="6" class="center-horz"> {{ bonus.type }} </el-col>
      <el-col :xs="7" :span="8"> {{ bonus.targets }} </el-col>
      <el-divider style="margin: 5px 0 10px 0" />
    </el-row>
  </el-tab-pane>
</el-tabs>

  <!-- Dialog -->
  <el-dialog v-model="dialog" :width="dialogWidth">
    <g-item     v-if="showItem" :source="item" @save-item="saveItem"/>
    <g-ability  v-if="showAbil" :source="abil" @save-abil="saveAbility"/>
  </el-dialog>

</div>
</template>

<script>
import HexGraph from '@/components/template/HexGraph.vue'
import GItem from '@/components/template/GItem.vue'
import GAbility from '@/components/template/GAbility.vue'

export default {
  name: "CreatureCard",
  components: { HexGraph, GItem, GAbility },
  emits: [ 'open-drawer', 'save-creature' ],
  props: { source: { type: Object } },
  data() {
    return {
      original: { name: "", val: "" },
      creature: {},

      sectionsCollapse: [ '' ],
      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      itemFilter: "",
      encumbrance: {
        name: "Encumbrance",
        description: "You carry too much",
        bonuses: {}
      },

      abilityCollapse: [],
      abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],

      newCondition: {},
      addingCondition: false,

      spellTabs: "",
      newSpell: { name: "", level: 0, class: "" },
      spellsCollapse: [],
      spellCost: "",
      gFatigue: "",
      metamagic: null,

      dialog: false,
      dialogWidth: 750,
      abil: {},
      showAbil: false,
      item: {},
      showItem: false,

    }
  },


  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },

    activeConditions() { return this.creature.conditions; },
    inventory() { return this.creature.inventory; },
    abilities() { return this.creature.abilities; },
    sizeStats() { return this.rules.size ? this.rules.size[this.creature.basics.size] : { "space": "5 ft." }; },
    settings() {
      let settings = {
        isMonster: false,
        cardTab: "Main",
        mainSections: [ "defense", "actions" ],
        expandInventory: [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
      };
      if ( this.creature.settings ) { settings = this.creature.settings; }
      return settings;
    },
    title() {
      let title = this.creature.name ? this.creature.name : "";
      if (this.creature.basics && this.creature.basics.cr) { title = title.concat(" CR ", this.creature.basics.cr); }
      return title;
    },


    // USES: inventory
    invTotal() {
      let invTotal = {
        "value": 0,
        "weight": 0,
        "carryCap": 0,
        "level": "",
        "color": "success",
        "maxDex": 100,
      };
      let enc = { speed: 0, skill: 0 };

      // Coins
      invTotal.value += (this.creature.coins.pp * 10)
                        + (this.creature.coins.gp * 1)
                        + (this.creature.coins.sp * 0.1)
                        + (this.creature.coins.cp * 0.01);
      invTotal.weight += (this.creature.coins.pp / 50)
                        + (this.creature.coins.gp / 50)
                        + (this.creature.coins.sp / 50)
                        + (this.creature.coins.cp / 50);

      // Magic Items
      if (this.inventory[0].children) {
        for (let slot of Object.values(this.inventory[0].children)) {
          for (let item of Object.values(slot.children)) {
            invTotal.value += item.value.Cost;
            invTotal.weight += item.value.Weight;
          }
        }
      }

      // Equipped Items
      let armor = this.inventory[1].children[0].children[0];
      if (armor) {
        invTotal.value += armor.value.Cost * armor.value.Amount;
        invTotal.weight += armor.value.Weight * armor.value.Amount;
        if (invTotal.maxDex > armor.value["Max Dex"]) {
          invTotal.maxDex = armor.value["Max Dex"];
        }
        enc.skill = armor.value.Penalty;
        if (["Medium", "Heavy"].includes(armor.value.Proficiency)) {
          enc.speed = (Math.floor(this.creature.basics.speed.base.total * 0.138) * 5) - this.creature.basics.speed.base.total;
        }
      }
      for (let slot of Object.values(this.inventory[1].children[1].children)) {
        for (let item of Object.values(slot.children)) {
          invTotal.value += item.value.Cost * item.value.Amount;
          invTotal.weight += item.value.Weight * item.value.Amount;
          if (slot.label == "Hands" && item.value.Penalty) {
            if (invTotal.maxDex > item.value["Max Dex"]) {
              invTotal.maxDex = item.value["Max Dex"];
            }
            enc.skill += item.value.Penalty;
          }
        }
      }
      this.encumbranceMalus("Encumbrance Speed", enc.speed, [ "baseSpeed" ]);
      this.encumbranceMalus("Encumbrance Skill", enc.skill, [ "armorSkills" ]);

      // Other Items
      this.recursiveInventory(this.inventory[2].children, invTotal, false);

      // CARRY CAPACITY
      let str = this.creature.attributes.Str.base;
      let bonus = 0; // TODO: +1 from mwk backpack OR +8 from muleback cords (bonus)
      let sizeMult = 1;

      // Quadruped
      let multiLeg = Object.keys(this.creature.abilities).includes("Quadruped");
      sizeMult = multiLeg ? this.rules.size[this.creature.basics.size]["extra legs"] :
                            this.rules.size[this.creature.basics.size]["carry mod"];

      if ((str + bonus) < 10) {
        invTotal.carryCap = (str + bonus) * 10 * sizeMult;
      } else {
        invTotal.carryCap = Math.floor( 20 * (2**0.2) ** (str + bonus - 10) * sizeMult ) * 5;
      }

      let light = invTotal.carryCap / 3;
      let medium = invTotal.carryCap * 2/3;
      let heavy = invTotal.carryCap;

      if (invTotal.weight < light) {
        invTotal.level = "Light";
        invTotal.color = "success";

      } else if (invTotal.weight < medium) {
        invTotal.level = "Medium";
        invTotal.color = "info";
        if (invTotal.maxDex > 3) {
          invTotal.maxDex = 3;
        }
        let tmpSpeed = (Math.floor(this.creature.basics.speed.base.total * 0.138) * 5) - this.creature.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -3) {
          this.encumbranceMalus("Encumbrance Skill", -3, [ "armorSkills" ]);
        }

      } else if (invTotal.weight < heavy) {
        invTotal.level = "Heavy";
        invTotal.color = "warning";
        invTotal.maxDex = 1;
        if (invTotal.maxDex > 1) {
          invTotal.maxDex = 1;
        }
        let tmpSpeed = (Math.floor(this.creature.basics.speed.base.total * 0.138) * 5) - this.creature.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -3) {
          this.encumbranceMalus("Encumbrance Skill", -3, [ "armorSkills" ]);
        }

      } else {
        invTotal.level = "Staggering";
        invTotal.color = "danger";
        invTotal.maxDex = 0;
        let tmpSpeed = 5 - this.creature.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -6) {
          this.encumbranceMalus("Encumbrance Skill", -6, [ "armorSkills" ]);
        }
      }

      return invTotal;
    },

    // USES: encumbrance(non-computed), activeConditions, inventory, abilities, encumbrance
    // an update to computed properties makes this loop re-evaluate
    // meaning updating armor will change the AC bonuses
    bonuses() {
      let bonuses = {};
      // Add racial ability / attribute bonuses
      if (this.races[this.creature.basics.race]) {
        for (let [name, val] of Object.entries(this.races[this.creature.basics.race].abilityMods)) {
          bonuses[`Racial ${name} Bonus`] = {};
          bonuses[`Racial ${name} Bonus`].type = "Racial";
          bonuses[`Racial ${name} Bonus`].targets = [ name ];
          bonuses[`Racial ${name} Bonus`].value = val;
        }
      }
      // Add feats and other abilities to bonuses
      for (const ability of Object.values(this.abilities)) {
        if (ability.extras.active && Object.keys(ability.bonuses).length>0) {
          for (const [name, bonus] of Object.entries(ability.bonuses)) {
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
        if (item.value["AC Bonus"]) {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = item.value.targets;
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . (slotted) Magic Items
      if (this.inventory[0].children) {
        for (const slot of this.inventory[0].children) {
          for (const item of slot.children) {
            if (item.value.Bonuses) {
              for (const [name, bonus] of Object.entries(item.value.Bonuses)) {
                bonuses[name] = {};
                bonuses[name].type = bonus.type;
                bonuses[name].targets = bonus.targets;
                bonuses[name].value = bonus.value;
              }
            }
          }
        }
      }
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
      if ( this.creature.attributes ) {
        for (let [name, attr] of Object.entries(this.creature.attributes)) {
          attributes[name].total = attr.base;
          this.bonusLoop(attributes[name], name);
          attributes[name].mod = Math.floor( (name=="-" ? 0 : attributes[name].total -10) / 2 );
        }
      }
      return attributes;
    },
    // USES: bonusLoop(bonuses), attributes
    health() {
      let hpMod, health = { total: 0, damage: 0, nonlethal: 0, sources: [] };
      // health.total += this.creature.health.total;
      health.damage += this.creature.health.damage;
      health.nonlethal += this.creature.health.nonlethal;
      // health.sources = this.creature.health.sources;

      // Type / Racial / Class HD
      let firstLevel = true;
      let bonus = 0;
      for (let [cName, cClass] of Object.entries(this.creature.classes)) {

        if (cName == this.creature.basics.type) {
          firstLevel = false;
          if (this.creature.basics.type == "construct") {
            switch (this.creature.basics.size) {
              case "small": health.total += 10; health.sources.push(`+10 Construct`); break;
              case "medium": health.total += 20; health.sources.push(`+20 Construct`); break;
              case "large": health.total += 30; health.sources.push(`+30 Construct`); break;
              case "huge": health.total += 40; health.sources.push(`+40 Construct`); break;
              case "gargantuan": health.total += 60; health.sources.push(`+60 Construct`); break;
              case "colossal": health.total += 80; health.sources.push(`+80 Construct`); break;
              default: health.total += 0;
            }
          } else if (this.creature.basics.type == "undead") {
            hpMod = "Cha";
          } else {
            hpMod = "Con";
          }
        }
        if ([ "adept", "aristocrat", "commoner ", "expert", "warrior" ].includes(cName)) { firstLevel = false; }

        // Level Loop
        for (let i = 1; i < cClass.levels+1; i++) {
          if (cClass.hd) {
            health.total += firstLevel ? cClass.hd : cClass.hd / 2 + 0.5;
            if (hpMod) { bonus += this.attributes[hpMod].mod; }
            firstLevel = false;
          }
        }
        health.sources.push( `+${cClass.levels}d${cClass.hd}` );
      }

      // HP Mod
      health.total += bonus;
      health.sources.push( `+${bonus} ${hpMod}` );
      health.total = Math.floor(health.total);

      this.bonusLoop(health, "HP");
      return health;
    },
    // USES: bonusLoop(bonuses), attributes, inventory, sizeStats
    ac() {
      let ac = { "total": { "total": 10, "sources": [] }, "touch": { "total": 10, "sources": [] }, "flat": { "total": 10, "sources": [] } };
      let armor = this.inventory[1].children[0].children[0];
      let bonus = 0;
      // total = All
      // touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      // flat = creature.ac.total - bonus.dex - bonus.dodge;
      if (armor) {
        bonus = Math.min(armor.value["Max Dex"], this.attributes.Dex.mod);
        this.applyBonus('Dex', bonus, ac.total);
        this.applyBonus('Dex', bonus, ac.touch);
      } else {
        bonus = this.attributes.Dex.mod;
        this.applyBonus('Dex', bonus, ac.total);
        this.applyBonus('Dex', bonus, ac.touch);
      }
      if (this.creature.basics.size != "medium") {
        bonus = this.sizeStats["ac / atk"];
        this.applyBonus('Size', bonus, ac.total);
        this.applyBonus('Size', bonus, ac.touch);
        this.applyBonus('Size', bonus, ac.flat);
      }
      // neg dex still applies to flat footed
      if (this.attributes.Dex < 0) {
        ac.flat.total += this.attributes.Dex.mod;
        ac.flat.sources.push(`${this.attributes.Dex} Dex`);
      }
      this.bonusLoop(ac.total, "totalAC");
      this.bonusLoop(ac.touch, "touchAC");
      this.bonusLoop(ac.flat, "flatAC");
      return ac;
    },
    // USES: bonusLoop(bonuses), attributes
    saves() {
      let saves = { "fort": { "total": 0, "sources": [] }, "ref": { "total": 0, "sources": [] }, "will": { "total": 0, "sources": [] } };
      let bonus, bName = "";

      for (let [name, save] of Object.entries(saves)) {
        // Abilities
        bonus = 0;
        switch (name) {
          case "fort":
            bonus += (this.creature.basics.type == "undead") ? this.attributes.Cha.mod : this.attributes.Con.mod;
            bName = (this.creature.basics.type == "undead") ? "Cha" : "Con";
            break;
          case "ref":
            bonus += this.attributes.Dex.mod;
            bName = "Dex";
            break;
          case "will":
            bonus += this.attributes.Wis.mod;
            bName = "Dex";
            break;
        }
        bonus = Math.floor(bonus);
        this.applyBonus(bName, bonus, save);

        // Racial HD Check
        if (this.creature.basics.type.levels) {
          bName = this.creature.basics.type;
          bonus = 0;
          let saveMult = this.rules.creature_types[bName][name].mult;
          bonus += saveMult * this.creature.basics.type.levels;
          bonus += this.rules.creature_types[bName][name].bonus;
          bonus = Math.floor(bonus);
          this.applyBonus(bName, bonus, save);
        }
        // Class Loop
        for (let [cName, cClass] of Object.entries(this.creature.classes)) {
          if (cClass.saves) {
            let levels = cClass.levels;
            bonus = 0;
            let saveMult = cClass.saves[name].mult;
            bonus += saveMult * levels;
            bonus += cClass.saves[name].bonus;
            bonus = Math.floor(bonus);
            this.applyBonus(cName, bonus, save);
          }
        }
      }
      // Bonus Loop
      this.bonusLoop(saves.fort, "fort");
      this.bonusLoop(saves.ref, "ref");
      this.bonusLoop(saves.will, "will");

      saves.fort.total = Math.floor(saves.fort.total);
      saves.ref.total = Math.floor(saves.ref.total);
      saves.will.total = Math.floor(saves.will.total);
      return saves;
    },
    // USES: bonusLoop(bonuses), attributes, bab, sizeStats
    cmd() {
      let cmd = { "total": 10, "sources": [] };
      this.applyBonus("BAB", this.bab, cmd);
      this.applyBonus("Str", this.attributes.Str.mod, cmd);
      this.applyBonus("Dex", this.attributes.Dex.mod, cmd);
      this.applyBonus("Size", this.sizeStats["cmb / cmd"], cmd);
      this.bonusLoop(cmd, "cmd");
      return cmd;
    },
    // USES: bonusLoop(bonuses), attributes, bab, sizeStats
    cmb() {
      let cmb = { "total": 0, "sources": [] };
      this.applyBonus("BAB", this.bab, cmb);
      if (["fine", "diminuitive", "tiny"].includes(this.creature.basics.size)) {
        this.applyBonus("Dex", this.attributes.Dex.mod, cmb);
      } else {
        this.applyBonus("Str", this.attributes.Str.mod, cmb);
      }
      this.applyBonus("Size", this.sizeStats["cmb / cmd"], cmb);
      this.bonusLoop(cmb, "cmb");
      return cmb;
    },
    // USES: bonusLoop(bonuses), attributes
    init() {
      let init = { "total": 0, "sources": [] };
      this.applyBonus("Dex", this.attributes.Dex.mod, init);
      this.bonusLoop(init, "initiative");
      return init;
    },
    // USES: bonusLoop(bonuses), abilities
    speed() {
      let speed = {};
      speed = this.creature.basics.speed;
      this.bonusLoop(speed.base, "baseSpeed");
      this.bonusLoop(speed.burrow, "burrowSpeed");
      this.bonusLoop(speed.climb, "climbSpeed");
      this.bonusLoop(speed.fly, "flySpeed");
      this.bonusLoop(speed.swim, "swimSpeed");
      Object.values(this.abilities).forEach(abil => {
        if (abil.benefit && abil.benefit.target == "speed") {
          speed.push(abil.benefit.text);
        }
      });
      return speed;
    },
    // USES: abilities, skills
    senses() {
      let senses = [];
      senses.push(`Perception ${this.skills.Perception.bonus.total}`);
      Object.values(this.abilities).forEach(abil => {
        if (abil.benefit && abil.benefit.target == "senses") {
          senses.push(abil.benefit.text);
        }
      });
      return senses;
    },
    // USES: abilities
    defenses() {
      let defenses = { immunities: [], weaknesses: [], special: [] };
      Object.values(this.abilities).forEach(abil => {
        if (abil.benefit) {
          switch (abil.benefit.target) {
            case "immunities":
              defenses.immunities.push(abil.benefit.text.split(','));
              break;
            case "weakness":
              defenses.weaknesses.push(abil.benefit.text.split(','));
              break;
            case "specialDef":
              defenses.special.push(abil.benefit.text);
              break;
          }
        }
      });
      return defenses
    },

    bab() {
      let bab = 0;
      // Class Loop (includes racial hd)
      for (let cClass of Object.values(this.creature.classes)) {
        if (cClass.bab) {
          bab += cClass.bab * cClass.levels;
        }
      }
      bab = Math.floor(bab);
      return bab;
    },
    // USES: bonusLoop(bonuses), abilities, attributes, bab, sizeStats, inventory
    actions() {
      let actions = [
        { "label": "Melee", "extras": { "icon": "meleeSword", "capacity": 50 }, "children": [] },
        { "label": "Ranged", "extras": { "icon": "rangedBow", "capacity": 50 }, "children": [] },
        { "label": "Special", "extras": { "icon": "abilityPalm", "capacity": 50 }, "children": [] }
      ];

      /***************************\
      *                           *
      *      Special Actions      *
      *                           *
      \***************************/
      // Abilities, like cleave, into 'special actions'
      for (const abil of this.abilities) {
        if (abil.extras.showMain) {
          actions[2].children.push({
            "label": abil.name, "value": abil
          });
        }
      }

      for (const [name, atk] of Object.entries(this.creature.actions)) {
        let newAtk = {
          "label": name,
          "value": {
            trigger: atk["trigger"],
            atkNum: atk["atkNum"],
            atkBonus: { "total": 0, "sources": [] },
            damage: atk["Damage"],
            dmgBonus: { "total": 0, "sources": [] },
            damageTypes: [],
            crit: {
              range: atk["Critical"].split("/")[0],
              mult: atk["Critical"].split("/")[1]
            },
            range: atk["Range"],
            extras: atk['Extras']
          }
        };

        // ATTACK BONUS
        this.applyBonus("BAB", this.bab, newAtk.value.atkBonus);
        this.applyBonus("Size", this.sizeStats["ac / atk"], newAtk.value.atkBonus);
        // Add AbilMod to atkBonus
        if (atk.atkAbilOverride) {
          this.applyBonus(atk.atkAbilOverride, this.attributes[atk.atkAbilOverride].mod, newAtk.value.atkBonus);
        } else if (atk.category == "Ranged") {
          this.applyBonus("Dex", this.attributes.Dex.mod, newAtk.value.atkBonus);
        } else if (atk.Category == "Secondary") {
          // all nat atks when using weapons too
          this.applyBonus("Str", this.attributes.Str.mod - 5, newAtk.value.atkBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.atkBonus);
        }

        // DAMAGE BONUS
        // Add AbilMod to dmgBonus
        if (atk.dmgAbilOverride) {
          this.applyBonus(atk.dmgAbilOverride, this.attributes[atk.dmgAbilOverride].mod, newAtk.value.atkBonus);
        } else if (!Object.keys(this.rules.natural_attacks).includes(name)) {
        // Fake Natural Attack, like Death Worm's Electrical Jolt
        // They get no bonuses to DMG
        } else if (atk.Category == "Secondary") {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), newAtk.value.dmgBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);
        }

        // Add Active Bonuses
        this.bonusLoop(newAtk.value.atkBonus, "meleeAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "meleeDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "rangedAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "rangedDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "specialAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "specialDmgBonus");

        // set damage types
        for (const category of Object.values(this.rules["Damage Types"])) {
          for (const cType of Object.values(category)) {
            atk["Damage Type"].forEach(aType => {
              if (aType == cType.value) {
                newAtk.value.damageTypes.push(cType);
              }
            });
          }
        }

        // choose atk location
        if (atk.style) {
          switch (atk.style) {
            case "Melee":
              actions[0]["children"].push(newAtk);
              break;
            case "Ranged":
              actions[1]["children"].push(newAtk);
              break;
            default:
              actions[2]["children"].push(newAtk);
          }
        } else {
          actions[2]["children"].push(newAtk);
        }

      } // End character.attacks loop

      /***************************\
      *                           *
      *      Weapon Actions       *
      *                           *
      \***************************/

      // Weapon Actions
      let mainHand = this.inventory[1].children[1].children[0].children[0];
      let offHand = this.inventory[1].children[1].children[0].children[1];

      for (const weapon of this.inventory[1].children[1].children[0].children) {
        // this.inventory[ equipped ].children[ weapons ].children[ hands ].children
        // If the wielded item is not a weapon or inproperly equipped, skip
        if (!weapon.value.Damage) { continue; }
        if (weapon.value.Group.includes("Bows") || weapon.value.Category == "Two-Handed"){
          if (weapon.label != mainHand.label || offHand != undefined) {
            continue;
          }
        }

        let type = (weapon.value.Category == "Ranged" || weapon.value.Group.includes("Thrown")) ? "Ranged" : "Melee";
        let newAtk = {
          "label": weapon.label,
          "value": {
            trigger: "Standard",
            atkBonus: { "total": 0, "sources": [] },
            damage: weapon.value["Damage"],
            dmgBonus: { "total": 0, "sources": [] },
            damageTypes: [],
            crit: {
              range: weapon.value["Critical"].split("/")[0],
              mult: weapon.value["Critical"].split("/")[1]
            },
            range: weapon.value.range,
            // notes: weapon.value["Extras"]["Notes"]
            extras: (weapon.value.Extras) ? weapon.value.Extras : []
          }
        };

        // Attack Bonus
        this.applyBonus("BAB", this.bab, newAtk.value.atkBonus);
        this.applyBonus("Size", this.sizeStats["ac / atk"], newAtk.value.atkBonus);
        // Add mwk or magic enhancements to atk bonus
        if (weapon.value.Extras["Enhancement"] > 0) {
          this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.value.atkBonus);
          this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.value.dmgBonus);
        } else if (weapon.value.Extras["Masterwork"]) {
          this.applyBonus("Masterwork", 1, newAtk.value.atkBonus);
        }
        // Add AbilMod to atkBonus
        if (weapon.value.Extras.atkAbilOverride) {
          this.applyBonus(weapon.value.Extras.atkAbilOverride, this.attributes[weapon.value.Extras.atkAbilOverride].mod, newAtk.value.atkBonus);
        } else if (type == "Ranged") {
          this.applyBonus("Dex", this.attributes.Dex.mod, newAtk.value.atkBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.atkBonus);
        }

        // Damage Bonus

        // Add AbilMod to dmgBonus
        if (weapon.value.Extras.dmgAbilOverride) {
          this.applyBonus(weapon.value.Extras.dmgAbilOverride, this.attributes[weapon.value.Extras.dmgAbilOverride].mod, newAtk.value.dmgBonus);

        } else if ( weapon.value.Group.includes("Thrown") ||
          (weapon.value.Group.includes("Bows") && this.attributes.Str.mod < 0) ||
          (weapon.value.Group.includes("Bows") && name.includes("Composite")) ) {
            // BOW && THROWN STR MOD
            this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);

        } else if ( type == "Melee"){
          if (weapon.label == mainHand.label) {
            // Main Hand
            if (offHand == undefined && (weapon.value.Category == "One-Handed" || weapon.value.Category == "Two-Handed")) {
              // if using two hands (off-hand empty)
              this.applyBonus("Str", Math.floor(this.attributes.Str.mod * 1.5), newAtk.value.dmgBonus);
            } else {
              // ie, main and shield
              this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);
            }

          } else {
            // Off Hand
            if (weapon.value.Category == "Light" || weapon.value.Category == "One-Handed") {
              this.applyBonus("Str", Math.floor(this.attributes.Str.mod / 2), newAtk.value.dmgBonus);
            }
          }
        }

        // Dual Wield penalties done in abilities -> bonuses
        /*
        penalties to AtkBonus, during a full-round atk
        light & feat      { main -2  off -2 }
        two-weapon feat   { main -4  off -4 }
        off hand light    { main -4  off -8 }
        normal            { main -6  off -10}
        */

        // Weapon Specific Bonuses (like for Weapon Focus)
        this.bonusLoop(newAtk.value.atkBonus, weapon.label.concat("AtkBonus"));
        this.bonusLoop(newAtk.value.dmgBonus, weapon.label.concat("DmgBonus"));

        // Add Active Bonuses
        this.bonusLoop(newAtk.value.atkBonus, type.concat("AtkBonus"));
        this.bonusLoop(newAtk.value.dmgBonus, type.concat("DmgBonus"));

        // set damage types
        for (const category of Object.values(this.rules["Damage Types"])) {
          for (const cType of Object.values(category)) {
            weapon.value["Damage Type"].forEach(aType => {
              if (aType == cType.value) {
                newAtk.value.damageTypes.push(cType);
              }
            });
          }
        }

        type = (type == 'Melee') ? 0 : 1;
        actions[type].children.push(newAtk);
      } // End Weapons loop

      // If only 1 Primary Natural Attack (no other atks), add 0.5 * Str
      let sum = actions[0].children.length + actions[1].children.length + actions[2].children.length;
      if ( sum == 1 ) {
        if (actions[0].children.length) {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), actions[0].children[0].value.dmgBonus);
        } else if (actions[1].children.length) {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), actions[1].children[0].value.dmgBonus);
        } else if (actions[2].children.length) {
          this.applyBonus("Str * 1.5", (this.attributes.Str.mod / 2), actions[2].children[0].value.dmgBonus);
        }
      }

      // console.log(actions);
      return actions;
    },
    // USES: bonusLoop(bonuses), attributes, inventory, sizeStats
    skills() {
      let skills = {};

      let armor = this.inventory[1].children[0].children[0];
      let mainHand = this.inventory[1].children[1].children[0].children[0];
      let offHand = this.inventory[1].children[1].children[0].children[1];
      let penalties = {};
      if (armor?.value.Penalty < 0) { penalties[armor.label] = armor.value.Penalty; }
      if (mainHand?.value.Penalty < 0) { penalties[mainHand.label] = mainHand.value.Penalty; }
      if (offHand?.value.Penalty < 0) { penalties[offHand.label] = offHand.value.Penalty; }

      for (const [name, skill] of Object.entries(this.creature.skills)) {
        let bonus = { "total": 0, "sources": [] };
        // Size Mod
        if (name == "Stealth" || name == "Fly") {
          this.applyBonus("Size", this.sizeStats[name.toLowerCase()], bonus);
        }
        // Ranks
        if (skill.ranks) {
          this.applyBonus("Ranks", skill.ranks, bonus);
          if (skill.class) {
            this.applyBonus("Class Skill", 3, bonus);
          }
        }
        // Ability
        this.applyBonus(this.rules.skills[name].ability.concat("Mod"), this.attributes[this.rules.skills[name].ability].mod, bonus);

        // Armor Penalty
        if (this.rules.skills[name].armor_pen) {
          for (let [name, penalty] of Object.entries(penalties)) {
            this.applyBonus(name, penalty, bonus);
          }
        }
        this.bonusLoop(bonus, name);
        // Add leading + to main display
        bonus.total = (bonus.total > -1) ? "+".concat(bonus.total) : bonus.total;
        skill.bonus = bonus;
        skills[name] = skill;
      }
      return skills;
    },

    castingClasses() {
      let classes = [];
      for (let [cName, cClass] of Object.entries(this.creature.classes)) {
        if (cClass.levels && cClass.magic) { classes.push(cName); }
      }
      return classes;
    },
    // USES: bonusLoop(bonuses), attributes
    concentration() {
      let classes = {};
      for (let [cName, cClass] of Object.entries(this.creature.classes)) {
        if (!cClass.magic) { continue; }
        classes[cName] = { "total": 0, "sources": [] };
        this.applyBonus(`${this.capFirsts(cName)} Caster Level`, cClass.magic.casterLevel, classes[cName]);
        this.applyBonus(`${cClass.magic.castingAtr}Mod`, this.attributes[cClass.magic.castingAtr].mod, classes[cName]);
        this.bonusLoop(classes[cName], `${this.capFirsts(cName)} Concentration`);
      } // end class loop
      return classes;
    },
    // USES: abilities
    knownMetas() {
      let knownMetas = [];
      let metas = [
        { "name": "Apocalyptic Spell", "increase": 1 },
        { "name": "Aquatic Spell", "increase": 1 },
        { "name": "Benthic Spell", "increase": 1 },
        { "name": "Blissful Spell", "increase": 1 },
        { "name": "Bouncing Spell", "increase": 1 },
        { "name": "Brackish Spell", "increase": 0 },
        { "name": "Brisk Spell", "increase": 0 },
        { "name": "Cherry Blossom Spell", "increase": 3 },
        { "name": "Coaxing Spell", "increase": 2 },
        { "name": "Concussive Spell", "increase": 2 },
        { "name": "Conditional Spell", "increase": 1 },
        { "name": "Consecrate Spell", "increase": 2 },
        { "name": "Contagious Spell", "increase": 2 },
        { "name": "Contingent Spell", "increase": 2 },
        { "name": "Crypt Spell", "increase": 1 },
        { "name": "Dazing Spell", "increase": 3 },
        { "name": "Delayed Spell", "increase": 1 },
        { "name": "Disruptive Spell", "increase": 1 },
        { "name": "Echoing Spell", "increase": 3 },
        { "name": "Eclipsed Spell", "increase": 0 },
        { "name": "Ectoplasmic Spell", "increase": 1 },
        { "name": "Elemental Spell", "increase": 1 },
        { "name": "Empower Spell", "increase": 2 },
        { "name": "Encouraging Spell", "increase": 1 },
        { "name": "Enlarge Spell", "increase": 1 },
        { "name": "Extend Spell", "increase": 1 },
        { "name": "Familiar Spell", "increase": 3 },
        { "name": "Fearsome Spell", "increase": 2 },
        { "name": "Flaring Spell", "increase": 1 },
        { "name": "Fleeting Spell", "increase": 0 },
        { "name": "Focused Spell", "increase": 1 },
        { "name": "Furious Spell", "increase": 1 },
        { "name": "Heighten Spell", "increase": 10 },
        { "name": "Intensified Spell", "increase": 1 },
        { "name": "Intuitive Spell", "increase": 1 },
        { "name": "Jinxed Spell", "increase": 1 },
        { "name": "Latent Curse", "increase":	1 },
        { "name": "Lingering Spell", "increase":	1 },
        { "name": "Logical Spell", "increase":	1 },
        { "name": "Maximize Spell", "increase":	3 },
        { "name": "Merciful Spell", "increase":	0 },
        { "name": "Murky Spell", "increase": 0 },
        { "name": "Persistent Spell", "increase":	2 },
        { "name": "Piercing Spell", "increase":	1 },
        { "name": "Quicken Spell", "increase": 4 },
        { "name": "Reach Spell", "increase": 10 },
        { "name": "Rime Spell", "increase": 1 },
        { "name": "Scarring Spell", "increase": 1 },
        { "name": "Scouting Summons", "increase": 2 },
        { "name": "Seeking Spell", "increase": 2 },
        { "name": "Selective Spell", "increase": 1 },
        { "name": "Shadow Grasp", "increase": 1 },
        { "name": "Sickening Spell", "increase": 2 },
        { "name": "Silent Spell", "increase": 1 },
        { "name": "Snuffing Spell", "increase": 2 },
        { "name": "Solar Spell", "increase": 1 },
        { "name": "Solid Shadows", "increase": 1 },
        { "name": "Still Spell", "increase": 1 },
        { "name": "Steam Spell", "increase": 0 },
        { "name": "Studied Spell", "increase": 2 },
        { "name": "Stygian Spell", "increase": 2 },
        { "name": "Stylized Spell", "increase": 1 },
        { "name": "Tenacious Spell", "increase": 1 },
        { "name": "Tenebrous Spell", "increase": 0 },
        { "name": "Thanatopic Spell", "increase": 2 },
        { "name": "Threatening Illusion", "increase": 1 },
        { "name": "Threnodic Spell", "increase": 2 },
        { "name": "Thundering Spell", "increase": 2 },
        { "name": "Toppling Spell", "increase": 1 },
        { "name": "Toxic Spell", "increase": 1 },
        { "name": "Traumatic Spell", "increase": 2 },
        { "name": "Trick Spell", "increase": 1 },
        { "name": "Tumultuous Spell", "increase": 1 },
        { "name": "Umbral Spell", "increase": 2 },
        { "name": "Vast Spell", "increase": 1 },
        { "name": "Verdant Spell", "increase": 2 },
        { "name": "Widen Spell", "increase": 3 },
        { "name": "Yai-Mimic Spell", "increase": 3 },
      ];
      for (const name of Object.keys(this.abilities)) {
        metas.forEach( meta => {
          if (meta.name == name) {
            knownMetas.push(meta);
          }
        });
      }
      return knownMetas;
    },

  },


  beforeMount(){
    this.original.name = this.source.name;
    this.original.val = JSON.stringify(this.source);
    this.creature = this.source;
    console.log(this.creature);
  },
  mounted() {
    let tabs = document.getElementsByClassName('el-tabs__nav-scroll');
    // add Rest button to tabs
    if (window.innerWidth > 360) {
      tabs[1].appendChild( document.getElementById('restBtn') );
    }

    // hide non magic classes from spells tab
    for (let button of Object.values( tabs[0].children[0].children )) {
      if (!this.castingClasses.includes(button.innerText.toLowerCase())) {
        button.hidden = true;
      }
    }
    // Put Add Spell button in class spells tabs
    tabs[0].appendChild( document.getElementById('addSpell') );
  },
  updated() {
    if (this.original.name != this.source.name) {
      this.original.name = this.source.name;
      this.original.val = JSON.stringify(this.source);
      this.creature = this.source;
    }
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
    bonusLoop(object, tString) {
      // console.log(tString, object);
      // object = the bonus object we are adding to: { total: #, sources: [] }
      // tString = the target string we match to add to the bonus object: "atkBonus"
      // Add Active Bonuses
      let typedBonuses = {};
      let prefix = "";


        for (let [name, bonus] of Object.entries(this.bonuses)) {
          prefix = (bonus.value > 0) ? "+" : "";
          // console.log(name, bonus);
          if (Object.keys(this.rules.bonuses).includes(bonus.type)) {
            // If the bonus type doesn't stack
            if (typedBonuses[bonus.type]) {
              // If we have the type of bonus already
              if (typedBonuses[bonus.type].value > bonus.value) {
                // If the current is higher, skip
                // addBonus = false;
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
          }
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
    healthCheck() {
      let deathNum, curr = this.health.total - this.health.damage;
      if (this.creature.basics.type == "construct") {
        deathNum = 0;
      } else if (this.creature.basics.type == "undead") {
        deathNum = 0 - this.attributes.Cha.total;
      } else {
        deathNum = 0 - this.attributes.Con.total;
      }

      if (this.health.nonlethal == curr) {
        // When (nonlethal damage == current HP) { you are STAGGERED }
        this.activeConditions.push(this.conditions[30]);
        this.$message({ message: "You become staggered", type: "warning" });

      } else if (this.health.nonlethal == curr+1) {
        // When (nonlethal damage > current HP) { you are UNCONSIOUS }
        this.activeConditions.push(this.conditions[32]);
        this.$message({ message: "You fall unconsious", type: "warning" });

      } else if (curr == 0) {
        // When (current HP == 0) { you are DISABLED }
        this.activeConditions.push(this.conditions[8]);
        this.$message({ message: "You become disabled", type: "error" });

      } else if (curr == -1) {
        // When (current HP < 0) { you are DYING }
        // check for hitting -1, then add the condition and don't keep adding it
        this.activeConditions.push(this.conditions[9]);
        this.$message({ message: "YOU ARE DYING", type: "error" });

      } else if (curr <= deathNum) {
        this.$alert( "<strong style='font-size:36px; color:red;'> YOU HAVE DIED </strong>", null, { center: true, dangerouslyUseHTMLString: true, });
      }

    },

    rest() {
      this.creature.health.damage = 0;
      this.creature.health.nonlethal = 0;
      // reset resources like rage
      for (const res of Object.values(this.creature.resources)) {
        res.left = res.total;
      }
      // reset P & G spells
      for (const cClass of Object.values(this.creature.spells)) {
        for (const spellLevel of Object.values(cClass)) {
          for (const spell of Object.values(spellLevel)) {
            spell.casts = 0;
          }
        }
      }
      // reset S spells
      for (let cClass of Object.values(this.creature.classes)) {
        if (cClass.magic.remainingCasts) {
          cClass.magic.remainingCasts = Array.from(cClass.magic.spellsPerDay);
          cClass.magic.remainingCasts[0] = 1;
        }
      }

      this.$message({ message: "Resting for 8 hours", type: "success" });
    },
    saveCreature() {
      this.$emit('save-creature', this.creature);

      // CharacterService.updateCharacter(this.creature)
      // .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    openDrawer() { this.$emit('open-drawer'); },

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
    // Loops through all containers (in iitems, like backpacks) to add their value and weight
    // handles Bags of Holding and Handy Haversacks
    recursiveInventory(container, invTotal, BagOfHolding){
      for (let item of Object.values(container)) {
        if (item.value) {
          invTotal.value += item.value.Cost * item.value.Amount;
          invTotal.weight += BagOfHolding ? 0 : item.value.Weight * (item.value.Amount ? item.value.Amount : 1);
        }
        if (item.children && item.children.length) {
          if (item.label.includes("Bag of Holding") || item.label.includes("Handy Haversack")) {
            BagOfHolding = true;
          }
          this.recursiveInventory(item.children, invTotal, BagOfHolding);
          BagOfHolding = false;
        }
      }
    },
    encumbranceMalus(bonusName, value, targets) {
      this.encumbrance.bonuses[bonusName] = {
        type: "Condition",
        value: value,
        targets: targets
      };
    },

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
    addItem() {
      let item = {
        label: 'New Item',
        value: {
          Description: '',
          Cost: 1,
          Weight: 1,
          Ammount: 1,
          Extras: { Notes: [] } }
        };
      this.inventory[2].children.push(item);
      this.editItem(item);
    },
    editItem(item) {
      this.item = {};
      this.item = item;
      this.showItem = true;
      this.dialog = true;
    },
    saveItem() {
      this.showItem = false;
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
    abilShowMain(abil) { abil.extras.showMain = abil.extras.showMain ? false : true; },
    addNewAbility() {
      this.abil = {
        name: "NEW ABILITY",
        description: "",
        shortText: "",
        location: "Self",
        trigger: "Standard",
        bonuses: {},
        extras: {
          active: false,
          showMain: false,
          category: "Feat",
          source: { class: "", level: 0 },
          notes: []
        }
      };
      this.abilities.push(this.abil);
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
    updateAction(draggingNode, dropNode) {
      let action = draggingNode.data.label;
      if (this.creature.actions[action]) {
        let style = ['Melee', 'Ranged', 'Special'].includes(dropNode.data.label) ? dropNode.data.label : dropNode.parent.data.label;
        this.creature.actions[action].style = style;
      }
    },

    /***************************\
    *                           *
    *          SPELLS           *
    *                           *
    \***************************/
    // Add a spell to spells known (by class)
    addSpell() {
      if (!this.creature.spells[this.newSpell.class]) {
        this.creature.spells[this.newSpell.class] = [];
      }
      let cClass = this.creature.spells[this.newSpell.class];

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



    // Prepared Spells
    castPSpell(cName, level, spell, index) {
      if (level == 0) { return; }
      let btn = this.$refs[`${spell}-${index}`][0].$el;
      btn.setAttribute('disabled', true);
      btn.classList.add('is-disabled');
      this.character.spells[cName][level][spell].casts++;
    },
    disabledCastPSPells() {
      let btn = "EL BTN";
      // For each class, if its a preppared caster
      for (const [cName, cClass] of Object.entries( this.character.classes )) {
        if (cClass.preparedSpells) {
          // For each preppared spell ([lvl][spell]),
          cClass.preparedSpells.forEach((spells, lvl) => {
            spells.forEach(spell => {
              // disable duplicate spells until the number of disabled spells == num of casts
              let preps = spells.filter(name => name === spell).length;
              for (let i = 0; i < preps; i++) {
                if ( this.$refs[`${spell}-${i}`]) {
                  btn = this.$refs[`${spell}-${i}`][0].$el;
                  if (i+1 <= this.character.spells[cName][lvl][spell].casts) {
                    btn.setAttribute('disabled', true);
                    btn.classList.add('is-disabled');
                  }
                }
              }
            });
          });
        }
      }
    },

    // Spontaneous Spells
    castSSpell(cClass, level) {
      if (this.metamagic && this.metamagic.increase) { level += this.metamagic.increase; }
      if (level > 0) { cClass.magic.remainingCasts[level] --; }
      this.metamagic = {};
    },


    // Add info into the spell popOver
    spellPop(spell, level, cName) {
      if (level == 0) {
        this.spellCost = 0;
      } else {
        let cost = 1 + level;
        // Spontaneous = (casts * 1) + metamagic increase
        // Prepared    = (casts * spell level)  + metamagic increase
        let mult = this.classes[cName].magic.style.includes('Spontaneous') ? 1 : level;
        cost += (mult * spell.casts);
        this.spellCost = cost;
        if (this.metamagic && this.metamagic.increase) {
          this.spellCost += this.metamagic.increase;
        }
        if ( (this.character.classes[cName].openRemaining - this.spellCost) <= 0 ) {
          this.gFatigue = 10 + cost;
        }
      }
    },
    // Galdur Spells
    castGSpell(sName, spell, level, cName) {
      if (level == 0 && !this.metamagic.increase) {
        return;
      } else if ( (this.character.classes[cName].openRemaining - this.spellCost) >= 0 ) {
        this.character.classes[cName].openRemaining -= this.spellCost;
      } else if (
        ( this.character.classes[cName].openRemaining != 0 ) &&
        ( (this.character.classes[cName].openRemaining - this.spellCost) < 0 )
      ) {
        let remain = Math.abs(this.character.classes[cName].openRemaining - this.spellCost);
        this.character.classes[cName].openRemaining = 0;
        this.character.classes[cName].reserveRemaining -= remain;
      } else if ( (this.character.classes[cName].reserveRemaining - this.spellCost) >= 0 ) {
        this.character.classes[cName].reserveRemaining -= this.spellCost;
      } else {
        this.$message({ message: `You do not have enough Galdur to cast ${sName}`, type: "error" });
        this.metamagic = {};
        return;
      }

      spell.casts++;
      this.metamagic = {};
      this.spellPop(spell, level, cName);
    },


  }
}
</script>

<style lang="css" scoped>
.el-tabs__nav-scroll {
  display: flex;
  justify-content: space-between;
}
.addCondition button {
  width: 100%;
  margin: 0 0 2px 5px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: end;
}

.el-button.el-button--danger.el-button--small.el-tooltip__trigger {
	margin-left: 0;
}

.spell {
  margin-bottom: 15px;
}
.spell .el-input, .spell .el-textarea {
  margin-bottom: 10px;
}

</style>
