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
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Dex.total-10)/2) }}</el-tag>
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
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Con.total-10)/2) }}</el-tag>
          </el-col>
          <el-col :offset="1" :span="2"> Cha: </el-col>
          <el-col :span="3">
            <el-tooltip v-if="attributes.Cha.sources[0]" placement="top" effect="light">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag v-else size="small" effect="dark" type="info">{{attributes.Cha.total}}</el-tag>
            <el-tag size="large" effect="dark" type="primary">{{ Math.floor((attributes.Cha.total-10)/2) }}</el-tag>
          </el-col>
        </el-row>
      </el-col>

      <!-- Icon & Lore -->
      <el-col :span="12">
        <div class="center-horz">
          <g-icon iconSize="128px" :icon-name="character.basics.type.name" :key="character.basics.type.name"/>
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
                <el-tag v-else-if="character.basics.type.name != 'Humanoid'" size="small" effect="dark" type="primary">{{ character.basics.type.name }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-tag size="small" effect="dark" type="info" v-for="subtype in character.basics.type.subtypes" :key="subtype" style="margin: 0 1px 0 2px;">
                {{ capFirsts(subtype) }}
              </el-tag>
              <el-tooltip placement="top" effect="light" v-for="(cClass, name) in character.classes" :key="name">
                <el-tag size="small" effect="dark" type="primary" style="margin: 0 1px 0 0;">{{ capFirsts(name) }} {{ cClass.levels }}</el-tag>
                <template #content>
                  {{ cClass.levels }} HD ({{ cClass.levels }}d{{ classes[name].hd }})
                </template>
              </el-tooltip>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz">
            <span v-if="character.settings.isNPC">
              <g-icon iconSize="24px" icon-name="forest"/>
            </span>
            <span v-else>
              <g-icon iconSize="24px" icon-name="openScroll"/>
            </span>
          </el-col>
          <el-col :span="20" class="center-vert">
            <span v-if="character.settings.isNPC">
              {{ character.basics.environment }}
            </span>
            <span v-else>
              {{ character.basics.appearance.age }} years old, {{ character.basics.appearance.height }}, {{ character.basics.appearance.weight }}
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz">
            <span v-if="character.settings.isNPC">
              <g-icon iconSize="24px" icon-name="sparkle"/>
            </span>
            <span v-else>
              <g-icon iconSize="24px" icon-name="moon"/>
            </span>
          </el-col>
          <el-col :span="20" class="center-vert">
            <span v-if="character.settings.isNPC">
              XP : {{ this.rules.experience[character.basics.cr] }}
            </span>
            <span v-else>
              Diety : {{ character.basics.diety }}
            </span>
          </el-col>
        </el-row>

        <el-row :gutter="10" justify="center" align="middle">
          <el-col :sm="8" :lg="6" class="center-horz">
            <el-button @click="saveCharacter()" type="primary" round> Save Changes </el-button>
          </el-col>
          <el-col :sm="4" :lg="2" class="center-horz">
            <el-tooltip placement="top" effect="light">
              <el-button @click="this.$router.push({ name: 'character-edit', params: { id: character.id } })" type="info" style="margin:0" circle>
                <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
              </el-button>
              <template #content>
                Edit Character
              </template>
            </el-tooltip>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

    <!-- Content Tabs -->
    <el-button @click="rest()" ref="restBtn" size="large" style="width:40px">
      <el-tooltip placement="top" effect="light">
        <g-icon iconSize="20px" iconName="campfire" />
        <template #content>Rest for 8 Hours</template>
      </el-tooltip>
    </el-button>
    <el-tabs v-model="character.settings.cardTab" ref="mainTabs" type="card">

      <!-- Main -->
      <el-tab-pane name="Main">
        <template #label> <g-icon iconSize="20px" iconName="compass" /> Main </template>
{{ invTotal }} <br>
{{ speed }}
        <el-collapse v-model="character.settings.mainSections">
          <!-- Defense -->
          <el-collapse-item name="defense">
            <template #title> <g-icon iconName="armor" /> Defense </template>

            <el-row :gutter="10" >
              <!-- HEALTH -->
              <el-col :span="10">
                <el-row :gutter="10" style="margin-bottom:10px">
                  <el-col :span="22">
                    <el-tooltip placement="top" effect="light">
                      <el-progress
                        v-if="character.health.total > 0"
                        :percentage="Math.max(0, Math.floor(((character.health.total-character.health.damage)/character.health.total)*100))"
                        :color="healthColors"
                        :text-inside="true"
                        :stroke-width="24">
                        HP : {{ character.health.total-character.health.damage }} / {{ character.health.total }}
                      </el-progress>
                      <template #content>
                        <span v-for="bonus in character.health.sources" :key="bonus"> {{ bonus+" " }} </span>
                      </template>
                    </el-tooltip>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-bottom:5px">
                  <el-col :span="10" class="center-horz">
                    <el-tag size="large" effect="dark" type="danger"> Damage </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-input-number v-model="character.health.damage" :min="0" :max="character.health.total + attributes.Con.total"  @change="healthCheck()" aria-label="Current Damage" />
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="10" class="center-horz">
                    <el-tag size="large" effect="dark" type="warning"> Nonleathal </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-input-number v-model="character.health.nonlethal" :min="0" :max="character.health.total+1" @change="healthCheck()" aria-label="Current Nonlethal Damage" />
                  </el-col>
                </el-row>
              </el-col>

              <!-- AC & Stabilize -->
              <el-col :span="5">
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
                </el-tooltip>   <br>
                <el-tooltip v-if="character.health.damage > character.health.total" placement="top" effect="light">
                  <el-tag effect="dark" type="danger">
                    Stabilize (DC 10) : {{ attributes.Con.mod + (character.health.total-character.health.damage) }}
                  </el-tag>
                  <template #content>
                    ConMod: {{ attributes.Con.mod }} + Current Health: {{ (character.health.total-character.health.damage) }}
                  </template>
                </el-tooltip>
              </el-col>

              <!-- CMD & Saves -->
              <el-col :span="4">
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
              <el-col :span="5">
                <el-tooltip placement="top" effect="light">
                  Init: {{ init.total > 0 ? "+" : "" }}{{ init.total }}
                  <template #content>
                    <span v-for="bonus in init.sources" :key="bonus"> {{ bonus+" " }} </span>
                  </template>
                </el-tooltip>   <br>
                <span v-for="(mode, name) in speed" :key="name">
                  <span v-if="mode.total">
                    <el-tooltip placement="top" effect="light" v-if="mode.sources[0]">
                      {{ capFirsts(name) }}: {{ mode.total }} ft.
                      <template #content>
                        <span v-for="bonus in mode.sources" :key="bonus"> {{ bonus+" " }} </span>
                      </template>
                    </el-tooltip>
                    <span v-else>
                      {{ capFirsts(name) }}: {{ mode.total }} ft.
                    </span>
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
              <el-col :span="5" v-if="type.length"> {{ capFirsts(name) }} </el-col>
              <el-col :span="16">
                <span v-for="defense in type" :key="defense">
                  <span v-if="Array.isArray(defense)">
                    <el-tag v-for="item in defense" :key="item" size="small" effect="dark" type="info" style="margin-right:5px;">
                      {{ capFirsts(item) }}
                    </el-tag>
                  </span>
                  <span v-else>
                    <el-tag size="small" effect="dark" type="info" style="margin-right:5px;">
                      {{ capFirsts(defense) }}
                    </el-tag>
                  </span>
                </span>
              </el-col>
            </el-row>
          </el-collapse-item>

          <!-- Actions -->
          <el-collapse-item name="actions">
            <template #title> <g-icon iconName="swordShield" /> Actions </template>
            <el-tree
              :data="actions"
              draggable
              render-after-expand
              node-key="label"
              :default-expanded-keys="[ 'Melee', 'Ranged', 'Special' ]"
              :allow-drag="allowDrag"
              :allow-drop="allowDrop"
              @node-drop="updateAction"
            >
              <template #default="{ data }">
                <el-col :span="1" class="center-horz">
                  <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
                  <span v-else> • </span>
                </el-col>
                <el-col :span="5">
                  <el-tooltip v-if="data.value" placement="left" effect="light">
                    <el-button @click="actionBtn(data)" size="small" type="primary">
                      {{ data.label }}
                    </el-button>
                    <template #content>
                      {{ data.value.trigger }}
                    </template>
                  </el-tooltip>
                  <span v-else> {{ data.label }} </span>
                </el-col>
                <!-- Attack Bonus (To Hit) -->
                <el-col v-if="data.value && data.value.atkBonus" :span="3">
                  <el-row :gutter="10" class="center-horz">
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
                <el-col v-if="data.value && data.value.damage" :offset="1" :span="2">
                  <el-tag type="danger" effect="dark" size="small">
                    {{ data.value.damage[character.basics.size] }}
                    <el-tooltip v-if="data.value.dmgBonus.total" placement="top" effect="light">
                      <span> <span v-if="data.value.dmgBonus.total >= 0">+</span>{{ data.value.dmgBonus.total }} </span>
                      <template #content>
                        <span v-for="bonus in data.value.dmgBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      </template>
                    </el-tooltip>
                  </el-tag>
                </el-col>
                <!-- Damage Types -->
                <el-col v-if="data.value && data.value.damageTypes" :span="4">
                  <el-tag v-for="type in data.value.damageTypes" :key="type.value" size="small" effect="dark" type="info" style="margin-left:5px">
                    <span :style="`color:${type.color}`">
                      {{ type.label }}
                    </span>
                  </el-tag>
                </el-col>
                <!-- Crit -->
                <el-col v-if="data.value && data.value.crit" :span="2" class="center-horz">
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
                <el-col v-if="data.value && data.value.range" :span="2">
                  <span v-if="data.value.range"> {{ data.value.range }} ft. </span>
                </el-col>
                <!-- Special Abilities -->
                <el-col v-if="data.value && data.value.benefit" :span="14">
                  {{ data.value.benefit.text }}
                </el-col>
                <!-- Notes -->
                <el-col v-if="data.value && data.value.extras" :span="2">
                  <el-tooltip v-if="data.value.extras.notes" placement="left" effect="light">
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
            <div v-for="(res, name) in character.resources" :key="name">
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
          <el-col :span="6" class="center-vert center-horz">
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
          <el-col :span="9">
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
          <el-col :span="9">
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
              <el-col :sm="9" :lg="7"> {{ node.label }} </el-col>

              <el-col :sm="0" :lg="6" style="overflow: hidden">
                <span v-if="data.value && data.value.Extras && data.value.Extras.Notes && data.value.Extras.Notes.length">
                  <el-tag type="info" effect="dark">
                    {{ data.value.Extras.Notes[0] }}
                  </el-tag>
                </span>
              </el-col>

              <el-col :sm="3" :lg="2">
                <el-tag v-if="data.value" color="#FFDE0A" style="color:black; border:none;">
                  {{ data.value.Cost }} gp
                </el-tag>
              </el-col>

              <el-col :sm="2" :lg="2">
                <el-tag v-if="data.value" type="info" effect="dark">
                  {{ data.value.Weight }} lbs.
                </el-tag>
              </el-col>

              <el-col :sm="5" :lg="3">
                <el-input-number v-if="data.value && data.value.Ammount" v-model="data.value.Ammount" :min="0" size="small" aria-label="Number of Items" />
              </el-col>

              <el-col :sm="3" :lg="2">
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

        <el-row v-if="character.skills.Linguistics && character.skills.Linguistics.extras">
          <el-col :span="2"> Languages: </el-col>
          <el-col :span="21">
            <el-tag size="small" effect="dark" type="primary" v-for="language in character.skills.Linguistics.extras.languages" :key="language" style="margin-left:5px;">{{ language }}</el-tag>
          </el-col>
        </el-row>
        <el-divider />

        <el-row :gutter="10" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="5" class="center-vert"> <h5> Name </h5> </el-col>
          <el-col :span="1" class="center-horz">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="28px" iconName="d20" />
              <template #content> Skill Bonus </template>
            </el-tooltip>
          </el-col>
          <el-col :span="8" class="center-horz"> <h5> Notes </h5> </el-col>
          <el-col :offset="3" :span="1" class="center-horz">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="28px" iconName="sparkle" />
              <template #content> Ranks </template>
            </el-tooltip>
          </el-col>
          <el-col :span="1">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="28px" iconName="magicSwirl" />
              <template #content> Class Skill </template>
            </el-tooltip>
          </el-col>
          <el-col :span="1">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="28px" iconName="armor" />
              <template #content> Armor Penalty </template>
            </el-tooltip>
          </el-col>
          <el-col :span="1">
            <el-tooltip placement="top" effect="light">
              <g-icon iconSize="28px" iconName="openBook" />
              <template #content> Background Skill </template>
            </el-tooltip>
          </el-col>
        </el-row>

        <div v-for="(skill, name) in rules.skills" :key="name">
          <el-row :gutter="10" v-if="skill.untrained || skill.ranks" style="padding-bottom:5px; border-bottom:1px solid grey; margin-bottom:5px;">
            <el-col :span="5" class="center-vert">
              {{ name }}
              <span v-if="['Artistry', 'Craft', 'Lore', 'Perform', 'Profession'].includes(name)"> ({{ character.skills[name].extras.specialty }}) </span>
            </el-col>
            <!-- Bonus -->
            <el-col :span="1">
              <el-tooltip placement="top" effect="light">
                {{ skills[name].bonus.total }}
                <template #content>
                  <span v-for="bonus in skills[name].bonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>
            </el-col>
            <!-- Notes -->
            <el-col :span="8">
              <el-input type="textarea" v-model="character.skills[name].extras.notes" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${name} notes`" />
            </el-col>
            <el-col :offset="1" :span="1" class="center-horz">
              ({{ skill.ability }})
            </el-col>
            <!-- Ranks -->
            <el-col :offset="1" :span="1" class="center-horz">
              <span v-if="character.skills[name].ranks">
                <el-tag effect="dark" type="info"> {{ character.skills[name].ranks }} </el-tag>
              </span>
            </el-col>
            <el-col :span="1" class="center-horz">
              <g-icon v-if="character.skills[name].class" iconSize="20px" iconName="magicSwirl" />
            </el-col>
            <el-col :span="1" class="center-horz">
              <g-icon v-if="skill.armor_pen" iconSize="20px" iconName="armor" />
            </el-col>
            <el-col :span="1" class="center-horz">
              <g-icon v-if="skill.background" iconSize="20px" iconName="openBook" />
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- Abilities -->
      <el-tab-pane name="Abilities">
        <template #label> <g-icon iconSize="20px" iconName="abilityPalm" /> Abilities </template>

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

        <!-- Conditions -->
        <el-row :gutter="10">
          <el-col :span="4">
            <g-icon iconSize="32px" iconName="dizzyStar" /> Conditions
          </el-col>
          <el-col :span="8" :offset="12">
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
        <el-row v-for="condition in character.conditions" :key="condition.name">
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
        <el-tabs v-model="spellTabs" type="card" ref="spellTabs" style="padding-top:10px;">
          <el-tab-pane v-for="(cClass, cName) in character.spells" :key="cName" :label="capFirsts(cName)" :name="cName" >

            <el-row :gutter="10" style="margin-bottom:10px" align="middle">
              <el-col :span="12">
                <div v-if="character.classes[cName].useGaldur">
                  <el-row :gutter="10">
                    <el-col :span="5">
                      <el-tag effect="dark" type="primary"> Open Pool </el-tag>
                    </el-col>
                    <el-col :span="10">
                      <el-progress :text-inside="true" :stroke-width="24" :percentage=" Math.floor( ( character.classes[cName].openRemaining / character.classes[cName].openTotal ) * 100 ) ">
                        {{ character.classes[cName].openRemaining }} / {{ character.classes[cName].openTotal }}
                      </el-progress>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="5">
                      <el-tag effect="dark" type="warning"> Reserve Pool </el-tag>
                    </el-col>
                    <el-col :span="10">
                      <el-progress :text-inside="true" :stroke-width="24" status="warning" :percentage=" Math.floor( ( character.classes[cName].reserveRemaining / character.classes[cName].reserveTotal ) * 100 ) ">
                        {{ character.classes[cName].reserveRemaining }} / {{ character.classes[cName].reserveTotal }}
                      </el-progress>
                    </el-col>
                  </el-row>
                  <el-row :gutter="10" v-if="classes[cName].magic.extraGaldur">
                    <el-col :span="5">
                      <el-tag effect="dark" type="info"> {{ classes[cName].magic.extraGaldur.poolName }} </el-tag>
                    </el-col>
                    <el-col :span="10">
                      <el-progress :text-inside="true" :stroke-width="24" color="#909399" :percentage=" Math.floor( ( character.classes[cName].extraRemaining / character.classes[cName].extraTotal ) * 100 ) ">
                        {{ character.classes[cName].extraRemaining }} / {{ character.classes[cName].extraTotal }}
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
                  <el-col :span="8" v-if="(knownMetas.length > 0) && (classes[cName].magic.style.includes('Spontaneous') || character.classes[cName].useGaldur)" class="center-horz">
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
            <div v-if="classes[cName].magic.style.includes('Prepared') && !character.classes[cName].useGaldur">
              <el-collapse v-model="spellsCollapse">
                <el-collapse-item v-for="(spells, lvl) in character.classes[cName].preparedSpells" :key="lvl" :name="lvl">
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
                            Cast defensively to avoid an Attack of Opportunity <br>
                            15 + {{ lvl * 2 }} (Spell Level x 2)
                          </template>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </template>
                  <el-row v-for="(spell, index) in spells" :key="index" :gutter="10" align="middle" style="margin-bottom:15px;">
                    <el-col :span="4" class="center-horz">
                      <el-popconfirm :title="`Cast ${spell}`"
                      @confirm="castPSpell(cName, lvl, spell, index)" hide-icon>
                        <template #reference>
                          <el-button :ref="`${spell}-${index}`" type="primary" plain>
                            {{ spell }}
                          </el-button>
                        </template>
                        <template #actions="{ confirm }">
                          <el-button @click="confirm" size="small" type="primary">
                            Yes
                          </el-button>
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
            <div v-else-if="classes[cName].magic.style.includes('Spontaneous') && !character.classes[cName].useGaldur">
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
                            Cast defensively to avoid an Attack of Opportunity <br>
                            15 + {{ lvl * 2 }} (Spell Level x 2)
                          </template>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </template>
                  <el-row class="center-horz">
                    <el-col :span="11">
                      <el-tooltip placement="top" effect="light">
                        <el-progress :text-inside="true" :stroke-width="24" :color="healthColors"
                          :percentage=" Math.floor( ( character.classes[cName].remainingCasts[lvl] / (character.classes[cName].spellsPerDay[lvl] == '∞' ? 1 : character.classes[cName].spellsPerDay[lvl]) ) * 100 ) ">
                          {{ character.classes[cName].remainingCasts[lvl] }} / {{ character.classes[cName].spellsPerDay[lvl] }}
                        </el-progress>
                        <template #content> Remaining Spell Slots </template>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                  <el-row v-for="(spell, sName) in spells" :key="sName" :gutter="10" align="middle" style="margin-bottom:15px;">
                    <el-col :span="4" class="center-horz">
                      <el-button @click="castSSpell(cName, lvl)" :disabled="!character.classes[cName].remainingCasts[lvl] > 0" type="primary" plain>
                        {{ sName }}
                      </el-button>
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

            <!-- Galdur Spell List -->
            <div v-else>
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
                          <el-button plain :type="(character.classes[cName].openRemaining > 0) ? 'primary' : 'warning'">
                            {{ sName }}
                          </el-button>
                        </template>
                        <template #default>
                          <el-row>
                            {{ `Cast for ${spellCost} Galdur?` }}
                          </el-row>
                          <el-row v-if="(character.classes[cName].openRemaining - this.spellCost) <= 0">
                            <el-tooltip placement="top" effect="light">
                              <el-tag type="warning">
                                {{ `Will Save (DC ${this.gFatigue})` }}
                              </el-tag>
                              <template #content>
                                Will : {{ saves.will.total > 0 ? "+" : "" }}{{ saves.will.total }}
                              </template>
                            </el-tooltip>
                          </el-row>
                          <el-row justify="end">
                            <el-button
                              @click="castGSpell(sName, spell, lvl, cName)"
                              :disabled="( (character.classes[cName].reserveRemaining - this.spellCost) < 0 ) || ( (lvl==0) && (character.classes[cName].reserveRemaining==0) )"
                              :type="( ((character.classes[cName].reserveRemaining - this.spellCost) < 0 ) || ((lvl==0) && (character.classes[cName].reserveRemaining==0)) ) ? 'danger' : 'primary'"
                              size="small">
                              <span v-if="( (character.classes[cName].reserveRemaining - this.spellCost) < 0 ) || ( (lvl==0) && (character.classes[cName].reserveRemaining==0) )">
                                Not Enough Galdur
                              </span>
                              <span v-else>
                                Yes
                              </span>
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
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <!-- Edit -->
      <el-tab-pane name="Edit">
        <template #label> <g-icon iconSize="20px" iconName="quill" /> Edit </template>
        <el-row :gutter="10" align="middle" style="margin-bottom:10px">
          <el-col :span="4"> Hero Points </el-col>
          <el-col :span="6">
            <el-input-number v-model="character.settings.heroPoints" :min="0" :max="4" aria-label="Hero Points" />
          </el-col>
          <el-col :offset="2" :span="4"> Your Size </el-col>
          <el-col :span="8">
            <el-select v-model="character.basics.size" label="Size">
              <el-option v-for="size in Object.keys(rules.size)" :key="size" :label="capFirsts(size)" :value="size" />
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12"> <g-icon iconName="openScroll" /> Backstory </el-col>
          <el-col :span="12"> <g-icon iconName="openBook" /> Notes </el-col>
        </el-row>
        <el-row :gutter="10" align="middle" style="margin-bottom:10px">
          <el-col :span="12">
            <el-input v-model="character.basics.backstory" :autosize="{ minRows: 3, maxRows: 10 }" aria-label="Backstory" type="textarea" />
          </el-col>
          <el-col :span="12">
            <el-input v-model="character.notes" :autosize="{ minRows: 3, maxRows: 10 }" aria-label="Notes" type="textarea" />
          </el-col>
        </el-row>
        <el-divider style="margin: 24px 0 10px 0"> Bonuses </el-divider>
        <div>
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
      </el-tab-pane>
    </el-tabs>


    <!-- Edit Item Dialog -->
    <el-dialog v-model="editingItem" width="750">
      <g-item :source="item" @save-item="saveItem"/>
    </el-dialog>

    <!-- Edit Ablity Dialog -->
    <el-dialog v-model="editingAbil" width="750">
      <g-ability :name="abilName" :source="abil" @save-abil="saveAbility"/>
    </el-dialog>

    <!-- Add New Condition Dialog -->
    <el-dialog v-model="addingCondition" title="New Condition" width="750">
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


    <!--
    <el-divider />
    <div v-for="(item, name) in this.character" :key="name">
      {{ name }} : {{ item }}
      <br><br>
    </div>
    -->


  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import HexGraph from '@/components/template/HexGraph.vue';
import GItem from '@/components/template/GItem.vue';
import GAbility from '@/components/template/GAbility.vue';
// import OBR from "@owlbear-rodeo/sdk";

export default {
  name: "View Character",
  components: { HexGraph, GItem, GAbility },
  data() {
    return {
      loading: true,

      sectionsCollapse: [ '' ],
      healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],

      abilityCollapse: [],
      abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],
      abilName: "",
      editingAbil: false,
      abil: {},

      newCondition: {},
      addingCondition: false,

      editingItem: false,
      item: {},
      itemFilter: "",

      spellTabs: "",
      newSpell: { name: "", level: 0, class: "" },
      spellsCollapse: [],
      spellCost: "",
      gFatigue: "",
      metamagic: null,

      character: {},

    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },

    activeConditions() { return this.character.conditions; },
    inventory() { return this.character.inventory; },
    abilities() { return this.character.abilities; },
    sizeStats() { return this.rules.size ? this.rules.size[this.character.basics.size] : { "space": "5 ft." }; },

    // USES: activeConditions, inventory, abilities
    // an update to computed properties makes this loop re-evaluate
    // meaning updating armor will change the AC bonuses
    bonuses() {
      let bonuses = {};
      if (this.loading) { return bonuses; }

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

    // USES: inventory, attributes
    invTotal() {
      let invTotal = {
        "value": 0,
        "weight": 0,
        "carryCap": 0,
        "level": "",
        "color": "success",
        "maxDex": 100,
        "skill_pen": 0,
        "speed_pen": 0
      };

      // Coins
      invTotal.value += (this.character.coins.pp * 10)
                        + (this.character.coins.gp * 1)
                        + (this.character.coins.sp * 0.1)
                        + (this.character.coins.cp * 0.01);
      invTotal.weight += (this.character.coins.pp / 50)
                        + (this.character.coins.gp / 50)
                        + (this.character.coins.sp / 50)
                        + (this.character.coins.cp / 50);

      // Magic Items
      for (let slot of Object.values(this.inventory[0].children)) {
        for (let item of Object.values(slot.children)) {
          invTotal.value += item.value.Cost;
          invTotal.weight += item.value.Weight;
        }
      }

      // Equipped Items      
      let armor = this.inventory[1].children[0].children;
      if (armor.length) {
        invTotal.value += armor.value.Cost;
        invTotal.weight += armor.value.Weight;
        
        console.log(armor);
        // if armor has maluses, add em
      }
      for (let slot of Object.values(this.inventory[1].children[1].children)) {
        for (let item of Object.values(slot.children)) {
                  console.log(slot);
        // if slot == hands
        // if item has maluses, add em

          invTotal.value += item.value.Cost;
          invTotal.weight += item.value.Weight;
        }
      }

      // Other Items
      this.recursiveInventory(this.inventory[2].children, invTotal, false);

      // CARRY CAPACITY
      let str = this.attributes.Str.total;
      let bonus = 0; // TODO: +1 from mwk backpack OR +8 from muleback cords (bonus)
      let sizeMult = 1;

      // Quadruped
      let multiLeg = Object.keys(this.character.abilities).includes("Quadruped");
      sizeMult = multiLeg ? this.rules.size[this.character.basics.size]["extra legs"] :
                            this.rules.size[this.character.basics.size]["carry mod"];

      if ((str + bonus) < 10) {
        invTotal.carryCap = (str + bonus) * 10 * sizeMult;
      } else {
        invTotal.carryCap = Math.floor( 20 * (2**0.2) ** (str + bonus - 10) * sizeMult ) * 5;
      }

      let light = invTotal.carryCap / 3;
      let medium = invTotal.carryCap * 2/3;
      let heavy = invTotal.carryCap;

      let encumbrance = {
        "name": "Encumbered",
        "description": "You are carrying more than a light load, slowing you down.",
        "bonuses": {}
      };

      if (invTotal.weight < light) {
        invTotal.color = "success";
        invTotal.level = "Light";

      } else if (invTotal.weight < medium) {
        invTotal.color = "info";
        invTotal.level = "Medium";
        
        invTotal.skill_pen = -3;
        invTotal.speed_pen = (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total;
        invTotal.maxDex = 3;

        encumbrance.bonuses["Encumbrance Skill Malus"] = {
            "type": "Encumbrance",
            "value": -3,
            "targets": [ "armorSkills" ]          
        };
        encumbrance.bonuses["Encumbrance Speed Malus"] = {
            "type": "Encumbrance",
            "value": (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total,
            "targets": [ "baseSpeed" ]          
        };
        encumbrance.extras = { "noDexAC": true };
        this.newCondition = encumbrance;
        this.addCondition();


      } else if (invTotal.weight < heavy) {
        invTotal.color = "warning";
        invTotal.level = "Heavy";
        invTotal.skill_pen = -6;
        invTotal.maxDex = 1;
        invTotal.speed_pen = (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total;

      } else {              // Staggering
        invTotal.color = "danger";
        invTotal.level = "Staggering";
        invTotal.skill_pen = -6;
        invTotal.maxDex = 0;
        invTotal.speed_pen = 5 - this.character.basics.speed.base.total;
      }

      return invTotal;
    },

    // USES: bonusLoop(bonuses), inventory, abilities, invTotal
    ac() {
      // total = All
      // touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      // flat = creature.ac.total - bonus.dex - bonus.dodge;
      let ac = { "total": { "total": 10, "sources": [] }, "touch": { "total": 10, "sources": [] }, "flat": { "total": 10, "sources": [] } };
      let armor = this.inventory[1].children[0].children[0];

      // Min (Dex Mod, Armor Max Dex, Carry Cap Max Dex)
      let bonus = Math.min(this.attributes.Dex.mod, this.invTotal.maxDex, (armor ? armor.value["Max Dex"] : 100) );
      this.applyBonus('Dex', bonus, ac.total);
      this.applyBonus('Dex', bonus, ac.touch);

      if (this.character.basics.size != "medium") {
        bonus = this.sizeStats["ac / atk"];
        this.applyBonus('Size', bonus, ac.total);
        this.applyBonus('Size', bonus, ac.touch);
        this.applyBonus('Size', bonus, ac.flat);
      }
      // neg dex still applies to flat footed
      if (this.attributes.Dex.mod < 0) {
        ac.flat.total += this.attributes.Dex.mod;
        ac.flat.sources.push(`${this.attributes.Dex.mod} Dex`);
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
            bonus += (this.character.basics.type.name == "undead") ? this.attributes.Cha.mod : this.attributes.Con.mod;
            bName = (this.character.basics.type.name == "undead") ? "Cha" : "Con";
            break;
          case "ref":
            bonus += this.attributes.Dex.mod;
            bName = "Dex";
            break;
          case "will":
            bonus += this.attributes.Wis.mod;
            bName = "Wis";
            break;
        }
        bonus = Math.floor(bonus);
        this.applyBonus(bName, bonus, save);

        // Racial HD Check
        if (this.character.basics.type.levels) {
          bName = this.character.basics.type.name;
          bonus = 0;
          let saveMult = this.rules.creature_types[bName][name].mult;
          bonus += saveMult * this.character.basics.type.levels;
          bonus += this.rules.creature_types[bName][name].bonus;
          bonus = Math.floor(bonus);
          this.applyBonus(bName, bonus, save);
        }
        // Class Loop
        for (let [cName, cClass] of Object.entries(this.character.classes)) {
          if (this.classes[cName]) {
            let levels = cClass.levels;
            cClass = this.classes[cName];
            bonus = 0;
            let saveMult = cClass[name].mult;
            bonus += saveMult * levels;
            bonus += cClass[name].bonus;
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
    // USES: bonusLoop(bonuses), bab, attributes, sizeStats
    cmd() {
      let cmd = { "total": 10, "sources": [] };
      this.applyBonus("BAB", this.bab, cmd);
      this.applyBonus("Str", this.attributes.Str.mod, cmd);
      this.applyBonus("Dex", this.attributes.Dex.mod, cmd);
      this.applyBonus("Size", this.sizeStats["cmb / cmd"], cmd);
      this.bonusLoop(cmd, "cmd");
      return cmd;
    },
    // USES: bonusLoop(bonuses), bab, attributes, sizeStats
    cmb() {
      let cmb = { "total": 0, "sources": [] };
      this.applyBonus("BAB", this.bab, cmb);
      if (["fine", "diminuitive", "tiny"].includes(this.character.basics.size)) {
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
    // USES: bonusLoop(bonuses), invTotal
    speed() {
      let speed = {};
      speed = this.character.basics.speed;
      this.bonusLoop(speed.base, "baseSpeed");
      this.bonusLoop(speed.burrow, "burrow");
      this.bonusLoop(speed.fly, "fly");
      this.bonusLoop(speed.climb, "climb");
      this.bonusLoop(speed.swim, "swim");

      // climb  & swim @ 25% base (base/4)
      if (speed.climb.total == 0) {
        speed.climb.total = speed.base.total / 4;
      }
      if (speed.swim.total == 0) {
        speed.swim.total = speed.base.total / 4;
      }

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
      // Racial HD Check
      if (this.character.basics.type.levels) {
        let racialBAB = this.rules.creature_types ? this.rules.creature_types[this.character.basics.type.name].bab : 0;
        bab += racialBAB * this.character.basics.type.levels;
      }
      // Class Loop
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        let classBAB = this.classes[cName] ? this.classes[cName].bab : 0;
        bab += classBAB * cClass.levels;
      }
      bab = Math.floor(bab);
      return bab;
    },

    // USES: basics, inventory, bab, bonusLoop(bonuses), attributes
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
      for (const [name, abil] of Object.entries(this.abilities)) {
        if (abil.extras.showMain) {
          actions[2].children.push({
            "label": name, "value": abil
          });
        }
      }

      for (const [name, atk] of Object.entries(this.character.attacks)) {
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
            extras: {
              naturalAtk: true,
              notes: atk.extras.notes
            }
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
            atkNum: 1,
            atkBonus: { "total": 0, "sources": [] },
            damage: weapon.value["Damage"],
            dmgBonus: { "total": 0, "sources": [] },
            damageTypes: [],
            crit: {
              range: weapon.value["Critical"].split("/")[0],
              mult: weapon.value["Critical"].split("/")[1]
            },
            // notes: weapon.value["Extras"]["Notes"]
          }
        };

        newAtk.value.crit = {};
        newAtk.value.crit.range = weapon.value.Critical.split("/")[0];
        newAtk.value.crit.mult = weapon.value.Critical.split("/")[1];
        newAtk.value.extras = (weapon.value.Extras) ? weapon.value.Extras : [];

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

      return actions;
    },

    // USES: bonusLoop(bonuses), attributes, invTotal
    skills() {
      let skills = {};

      // let armor = this.character.inventory[1].children[0].children[0];
      // let mainHand = this.character.inventory[1].children[1].children[0].children[0];
      // let offHand = this.character.inventory[1].children[1].children[0].children[1];
      // let penalties = {};
      // if (armor?.value.Penalty < 0) { penalties[armor.label] = armor.value.Penalty; }
      // if (mainHand?.value.Penalty < 0) { penalties[mainHand.label] = mainHand.value.Penalty; }
      // if (offHand?.value.Penalty < 0) { penalties[offHand.label] = offHand.value.Penalty; }
      // if (this.invTotal.skill_pen < 0) { penalties["Encumberance"] = this.invTotal.skill_pen; }

      for (const [name, skill] of Object.entries(this.character.skills)) {
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
        let abil = this.rules.skills[name].ability;
        this.applyBonus(abil.concat("Mod"), this.attributes[abil].mod, bonus);

        // Armor / Encumberance Penalty
        if (this.rules.skills[name].armor_pen) {
          this.bonusLoop(bonus, 'armorSkills');
          // for (let [label, penalty] of Object.entries(penalties)) {
          //   this.applyBonus(label, penalty, bonus);
          // }
        }
        this.bonusLoop(bonus, name);
        this.bonusLoop(bonus, 'skills');
        // Add leading + to main display
        bonus.total = (bonus.total > -1) ? "+".concat(bonus.total) : bonus.total;
        skill.bonus = bonus;
        skills[name] = skill;
      }
      return skills;
    },

    // USES: bonusLoop(bonuses), attributes
    concentration() {
      let classes = {};
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        if (!this.classes[cName].magic) { continue; }
        classes[cName] = { "total": 0, "sources": [] };
        this.applyBonus(`${this.capFirsts(cName)} Caster Level`, cClass.levels, classes[cName]);
        this.applyBonus(`${this.classes[cName].magic.castingAtr}Mod`, this.attributes[this.classes[cName].magic.castingAtr].mod, classes[cName]);
        this.bonusLoop(classes[cName], `${this.capFirsts(cName)} Concentration`);
      } // end class loop
      return classes;
    },

    // USES: abilites
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
  mounted() {
    if (!this.rules) { this.$router.push("/"); }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
      console.log('response', response);
      this.character = response.character;
      document.getElementsByClassName('title')[0].innerHTML = this.character.name;
      this.spellTabs = Object.keys(this.character.spells)[0];

      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    .finally(() => {
      // Wait until refs are loaded:
      this.disabledCastPSPells();

      // add Rest button to tabs
      const mainTabs = this.$refs.mainTabs.$el.children[1].querySelector('.el-tabs__nav-scroll');
      mainTabs.appendChild(this.$refs.restBtn.$el);

      // Put Add Spell btn in class spells tabs, wait til refs loaded
      const spellTabs = this.$refs.spellTabs.$el.querySelector('.el-tabs__nav-scroll');
      spellTabs.appendChild(this.$refs.addSpell.$el);

      // Link up Owlbear Rodeo :)
      // OBR.onReady(() => {
      //   OBR.scene.items.onChange(
      //     (items) => {
      //       items.forEach(item => {
      //         if ( item.layer === "CHARACTER" && item.name === "Lillian" ) {
      //           console.log(item.name);
      //           let toon = item.metadata["com.bitperfect-software.hp-tracker/data"];
      //           console.log(toon);
      //         }
      //
      //       });
      //     }
      //   ); // End OBR onChange
      // });
      /*
      Hide selected items when clicking a context menu item

      OBR.contextMenu.create({
      id: "rodeo.owlbear.example",
      icons: [
      {
      icon: "icon.svg",
      label: "Example",
      },
      ],
      onClick(context) {
      OBR.scene.items.updateItems(context.items, (items) => {
      for (let item of items) {
      item.visible = false;
      }
      });
      },
      });
      */


    }); // end getCharacter .finally()


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
    applyBonus(name, value, obj) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },
    healthCheck() {
      let deathNum, curr = this.character.health.total - this.character.health.damage;
      if (this.character.basics.type.name == "undead") {
        deathNum = 0 - this.attributes.Cha.total;
      } else if (this.character.basics.type.name == "construct") {
        deathNum = 0;
      } else {
        deathNum = 0 - this.attributes.Con.total;
      }

      if (this.character.health.nonlethal == curr) {
        // When (nonlethal damage == current HP) { you are STAGGERED }
        this.activeConditions.push(this.conditions[30]);
        this.$message({ message: "You become staggered", type: "warning" });
        // this.$alert( "You become disabled", null, { center: true, dangerouslyUseHTMLString: true, });

      } else if (this.character.health.nonlethal == curr+1) {
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
      this.character.health.damage = 0;
      this.character.health.nonlethal = 0;
      // reset resources like rage
      for (const res of Object.values(this.character.resources)) {
        res.left = res.total;
      }
      // reset P & G spells
      for (const cClass of Object.values(this.character.spells)) {
        for (const spellLevel of Object.values(cClass)) {
          for (const spell of Object.values(spellLevel)) {
            spell.casts = 0;
          }
        }
      }
      // reset S spells
      for (const cClass of Object.values(this.character.classes)) {
        if (cClass.remainingCasts) {
          cClass.remainingCasts = Array.from(cClass.spellsPerDay);
          cClass.remainingCasts[0] = 1;
        }
      }

      this.$message({ message: "Resting for 8 hours", type: "success" });
    },
    saveCharacter() {
      console.log(this.character);

      CharacterService.updateCharacter(this.character)
      .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
      this.abilName = name;
      this.abil = {};
      this.abil = ability;
      this.editingAbil = true;
    },
    deleteAbil(name) {
      delete this.abilities[name];
      this.$message({ message: `${name} was removed from abilities`, type: "warning" });
    },
    actionBtn(action) {
      console.log(action);
      // TODO: do magic
    },
    updateAction(draggingNode, dropNode) {
      let action = draggingNode.data.label;
      let style = ['Melee', 'Ranged', 'Special'].includes(dropNode.data.label) ? dropNode.data.label : dropNode.parent.data.label;
      this.character.attacks[action].style = style;
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
    // Loops through all containers (in iitems, like backpacks) to add their value and weight
    // handles Bags of Holding and Handy Haversacks
    recursiveInventory(container, invTotal, BagOfHolding){
      for (let item of Object.values(container)) {
        if (item.value) {
          invTotal.value += item.value.Cost;
          invTotal.weight += BagOfHolding ? 0 : item.value.Weight * (item.value.Ammount ? item.value.Ammount : 1);
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
      // console.log(item);
      // console.log( this.$refs['tree'].getNode(item.label) );

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
    // Add a spell to spells known (by class)
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
    castSSpell(cName, level) {
      if (this.metamagic && this.metamagic.increase) { level += this.metamagic.increase; }
      if (level > 0) { this.character.classes[cName].remainingCasts[level] --; }
      this.metamagic = {};
    },
  }
};
</script>
