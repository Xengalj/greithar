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
          <el-col :span="4" class="center-vert center-horz">
            <span v-if="character.userSettings.isNPC">
              <g-icon iconSize="24px" icon-name="forest"/>
            </span>
            <span v-else>
              <g-icon iconSize="24px" icon-name="openScroll"/>
            </span>
          </el-col>
          <el-col :span="20" class="center-vert">
            <span v-if="character.userSettings.isNPC">
              {{ character.basics.environment }}
            </span>
            <span v-else>
              {{ character.basics.appearance.age }} years old, {{ character.basics.appearance.height }}, {{ character.basics.appearance.weight }}
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="center-vert center-horz">
            <span v-if="character.userSettings.isNPC">
              <g-icon iconSize="24px" icon-name="sparkle"/>
            </span>
            <span v-else>
              <g-icon iconSize="24px" icon-name="moon"/>
            </span>
          </el-col>
          <el-col :span="20" class="center-vert">
            <span v-if="character.userSettings.isNPC">
              XP : {{ this.rules.experience[character.basics.cr] }}
            </span>
            <span v-else>
              Diety : {{ character.basics.diety }}
            </span>
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
    <el-tabs v-model="character.userSettings.cardTab" ref="tabs" type="card">

      <!-- Main -->
      <el-tab-pane name="Main">
        <template #label> <g-icon iconSize="20px" iconName="compass" /> Main </template>

        <el-collapse v-model="character.userSettings.mainSections">
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
                        :percentage="Math.floor(((character.health.total-character.health.damage)/character.health.total)*100)"
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
                    <el-input-number v-model="character.health.damage" :min="0" :max="character.health.total + attributes.Con.total" aria-label="Current Damage" />
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="10" class="center-horz">
                    <el-tag size="large" effect="dark" type="warning"> Nonleathal </el-tag>
                  </el-col>
                  <el-col :span="10">
                    <el-input-number v-model="character.health.nonlethal" :min="0" :max="character.health.total+1" aria-label="Current Nonlethal Damage" />
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
            >
              <template #default="{ data }">
                <el-col :span="1" class="center-horz">
                  <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
                  <span v-else> • </span>
                </el-col>
                <el-col :span="5">
                  <el-tooltip v-if="data.value" placement="left" effect="light">
                    <el-tag size="small" effect="dark" type="primary"> {{ data.label }} </el-tag>
                    <template #content>
                      {{ data.value.trigger }}
                    </template>
                  </el-tooltip>
                  <span v-else> {{ data.label }} </span>
                </el-col>
                <!-- Attack Bonus (To Hit) -->
                <el-col v-if="data.value" :span="3">
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
                <el-col v-if="data.value" :offset="1" :span="2">
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
                <el-col v-if="data.value" :span="4">
                  <el-tag v-for="type in data.value.damageTypes" :key="type.value" size="small" effect="dark" type="info" style="margin-left:5px">
                    <span :style="`color:${type.color}`">
                      {{ type.label }}
                    </span>
                  </el-tag>
                </el-col>
                <!-- Crit -->
                <el-col v-if="data.value" :span="2" class="center-horz">
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
                <el-col v-if="data.value" :span="2">
                  <span v-if="data.value.range"> {{ data.value.range }} ft. </span>
                </el-col>
                <!-- Notes -->
                <el-col v-if="data.value" :span="2">
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
            pools (arcana, ki, bardic inspiration, rage rounds, etc) <br />
            for (class in classes) {
              for (abil in class) {
                if (abil.extra.pool) {
                  el-progress w/ [-][+] btns
                }}}

              </el-collapse-item>








        </el-collapse>
      </el-tab-pane>

      <!-- Items -->
      <el-tab-pane name="Items">
        <template #label> <g-icon iconSize="20px" iconName="inventory" /> Items </template>
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
        <el-dialog v-model="editingAbil" width="800">
          <g-ability :newAbil="addAbil" :name="abilName" :source="abil" @save-abil="saveAbility"/>
        </el-dialog>

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

        <!-- Add New Condition -->
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
      </el-tab-pane>

      <!-- Magic -->
      <el-tab-pane name="Spells">
        <template #label> <g-icon iconSize="20px" iconName="spellBook" /> Spells </template>




        Spells
      </el-tab-pane>

      <!-- Edit -->
      <el-tab-pane name="Edit">
        <template #label> <g-icon iconSize="20px" iconName="quill" /> Edit </template>

        <g-icon iconName="openBook" />
        Notes

        <g-icon iconName="openScroll" />
        Player Lore


        <el-row>
          <el-col :span="4" class="center-vert"> Hero Points </el-col>
          <el-col :span="20"> <el-input-number v-model="character.userSettings.heroPoints" :min="0" :max="4" aria-label="Hero Points" /> </el-col>
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


      </el-tab-pane>
    </el-tabs>



    <el-dialog v-model="editingItem" width="800">
      <g-item :source="item" :newItem="addItem" @save-item="saveItem"/>
    </el-dialog>

    <el-divider />
    <div v-for="(item, name) in this.character" :key="name">
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
  name: "View Character",
  components: { HexGraph, GItem, GAbility },
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
    conditions() { return this.$store.state.data.conditions; },

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
          console.log(ability);
          for (const [name, bonus] of Object.entries(ability.bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Add conditions
      console.log(this.activeConditions);
      for (const condition in this.activeConditions) {
        console.log(condition);
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
      console.log("BONUSES", bonuses);
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

    // USES: bonusLoop(bonuses), inventory, abilities
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
    // USES: bonusLoop(bonuses)
    speed() {
      let speed = {};
      speed = this.character.basics.speed;
      this.bonusLoop(speed.base, "base");
      this.bonusLoop(speed.burrow, "burrow");
      this.bonusLoop(speed.climb, "climb");
      this.bonusLoop(speed.fly, "fly");
      this.bonusLoop(speed.swim, "swim");
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

      let character = {
        attacks: {
          // "Zap": {
          //   "Damage": {  "fine": "1",  "diminuitive": "1d2",  "tiny": "1d3",  "small": "1d4",  "medium": "1d6",  "large": "1d8",  "huge": "2d6",  "gargantuan": "2d8",  "colossal": "4d6"  },
          //   "Critical": "20/x2",
          //   "Range": 60,
          //   "Damage Type": [ "Slashing" ],
          //   "Proficiency": "Natural",
          //   "Category": "Special",
          //
          //   atkNum: 1,
          //   atkAbilOverride: "Dex",
          //   dmgAbilOverride: "",
          //   trigger: "Standard",
          //   extras: {}
          // },
          "Bite": {
            "Damage": {  "fine": "1",  "diminuitive": "1d2",  "tiny": "1d3",  "small": "1d4",  "medium": "1d6",  "large": "1d8",  "huge": "2d6",  "gargantuan": "2d8",  "colossal": "4d6"  },
            "Critical": "20/x2",
            "Range": 0,
            "Damage Type": [ "Piercing" ],
            "Proficiency": "Natural",
            "Category": "Primary",

            atkNum: 1,
            atkAbilOverride: "",
            dmgAbilOverride: "",
            trigger: "Standard",
            extras: {}
          }
        }
      };

      let actions = [
        { "label": "Melee", "extras": { "icon": "meleeSword", "capacity": 50 }, "children": [] },
        { "label": "Ranged", "extras": { "icon": "rangedBow", "capacity": 50 }, "children": [] },
        { "label": "Special", "extras": { "icon": "abilityPalm", "capacity": 50 }, "children": [] }
      ];

      // Abilities, like cleave, into 'special actions'
      for (const [name, abil] of Object.entries(this.abilities)) {
        if (abil.extras.showMain) {
          actions[2].children.push({
            "label": name, "value": abil
          });
        }
      }

      for (const [name, atk] of Object.entries(character.attacks)) {
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
        this.bonusLoop(newAtk.value.atkBonus, "MeleeAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "MeleeDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "RangedAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "RangedDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "SpecialAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "SpecialDmgBonus");

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
        actions[2]["children"].push(newAtk);
      } // End character.attacks loop

      // Weapon Actions
      // let mainHand = this.inventory[1].children[1].children[0].children[0];
      // let offHand = this.inventory[1].children[1].children[0].children[1];
      //
      // for (const weapon of this.inventory[1].children[1].children[0].children) {
      //   // this.inventory[ equipped ].children[ weapons ].children[ hands ].children
      //   console.log(weapon);
      //   // If the wielded item is not a weapon or inproperly equipped, skip
      //   if (!weapon.value.Damage) { continue; }
      //   if (weapon.value.Group.includes("Bows") || weapon.value.Category == "Two-Handed"){
      //     if (weapon.label != mainHand.label || offHand != undefined) {
      //       continue;
      //     }
      //   }
      //
      //   let type = (weapon.value.Category == "Ranged" || weapon.value.Group.includes("Thrown")) ? "Ranged" : "Melee";
      //   let newAtk = {
      //     "label": weapon.label,
      //     "value": {
      //       trigger: "Standard",
      //       atkNum: 1,
      //       atkBonus: { "total": 0, "sources": [] },
      //       damage: weapon.value["Damage"][this.character.basics.size],
      //       dmgBonus: { "total": 0, "sources": [] },
      //       damageType: weapon.value["Damage Type"],
      //       critical: {
      //         range: weapon.value["Critical"].split("/")[0],
      //         mult: weapon.value["Critical"].split("/")[1]
      //       },
      //       notes: weapon.value["Extras"]["Notes"]
      //     }
      //   };
      //
      //   newAtk.crit = {};
      //   newAtk.crit.range = weapon.value.Critical.split("/")[0];
      //   newAtk.crit.mult = weapon.value.Critical.split("/")[1];
      //   newAtk.extras = (weapon.value.Extras) ? weapon.value.Extras : [];
      //
      //   this.applyBonus("BAB", this.bab, newAtk.atkBonus);
      //   this.applyBonus("Size", this.basics.sizeStats["ac / atk"], newAtk.atkBonus);
      //   // Add mwk or magic enhancements to atk bonus
      //   if (weapon.value.Extras["Enhancement"] > 0) {
      //     this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.atkBonus);
      //     this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.dmgBonus);
      //   } else if (weapon.value.Extras["Masterwork"]) {
      //     this.applyBonus("Masterwork", 1, newAtk.atkBonus);
      //   }
      //
      //   // Add AbilMod to atkBonus
      //   // TODO: update to use abilOVerrides
      //   if (type == "Ranged" || weapon.value.Extras.Notes?.includes("DexBonus")) {
      //     // use DexBonus for weapon finesse
      //     this.applyBonus("Dex", this.attributes.DexMod, newAtk.atkBonus);
      //   } else {
      //     this.applyBonus("Str", this.attributes.StrMod, newAtk.atkBonus);
      //   }
      //
      //   // Add AbilMod to dmgBonus
      //   if (weapon.value.Extras.Notes.includes("DexDamage")) {
      //     this.applyBonus("Dex", this.attributes.DexMod, newAtk.dmgBonus);
      //
      //   } else if ( weapon.value.Group.includes("Thrown") ||
      //     (weapon.value.Group.includes("Bows") && this.attributes.StrMod < 0) ||
      //     (weapon.value.Group.includes("Bows") && name.includes("Composite")) ) {
      //       // BOW && THROWN STR MOD
      //       this.applyBonus("Str", this.attributes.StrMod, newAtk.dmgBonus);
      //
      //   } else if ( type == "Melee"){
      //     if (weapon.label == mainHand.label) {
      //       // Main Hand
      //       if (offHand == undefined && (weapon.value.Category == "One-Handed" || weapon.value.Category == "Two-Handed")) {
      //         // if using two hands (off-hand empty)
      //         this.applyBonus("Str", Math.floor(this.attributes.StrMod * 1.5), newAtk.dmgBonus);
      //       } else {
      //         // ie, main and shield
      //         this.applyBonus("Str", this.attributes.StrMod, newAtk.dmgBonus);
      //       }
      //
      //     } else {
      //       // Off Hand
      //       if (weapon.value.Category == "Light" || weapon.value.Category == "One-Handed") {
      //         this.applyBonus("Str", Math.floor(this.attributes.StrMod / 2), newAtk.dmgBonus);
      //       }
      //     }
      //   }
      //
      //   // Dual Wield penalties done in abilities -> bonuses
      //   /*
      //   penalties to AtkBonus, during a full-round atk
      //   light & feat      { main -2  off -2 }
      //   two-weapon feat   { main -4  off -4 }
      //   off hand light    { main -4  off -8 }
      //   normal            { main -6  off -10}
      //   */
      //
      //   // Weapon Specific Bonuses (like for Weapon Focus)
      //   this.bonusLoop(newAtk.atkBonus, weapon.label.concat("AtkBonus"));
      //   this.bonusLoop(newAtk.dmgBonus, weapon.label.concat("DmgBonus"));
      //
      //   // Add Active Bonuses
      //   this.bonusLoop(newAtk.atkBonus, type.concat("AtkBonus"));
      //   this.bonusLoop(newAtk.dmgBonus, type.concat("DmgBonus"));
      //
      //   type = (type == 'Melee') ? 0 : 1;
      //   actions[type].children.push(newAtk);
      // } // End Weapons loop

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



      console.log(actions);
      return actions;
    },









    // USES: bonusLoop(bonuses), attributes
    skills() {
      let skills = {};

      let armor = this.character.inventory[1].children[0].children[0];
      let mainHand = this.character.inventory[1].children[1].children[0].children[0];
      let offHand = this.character.inventory[1].children[1].children[0].children[1];
      let penalties = {};
      if (armor?.value.Penalty < 0) { penalties[armor.label] = armor.value.Penalty; }
      if (mainHand?.value.Penalty < 0) { penalties[mainHand.label] = mainHand.value.Penalty; }
      if (offHand?.value.Penalty < 0) { penalties[offHand.label] = offHand.value.Penalty; }

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

        // Armor Penalty
        if (skill.armor_pen) {
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
      document.getElementsByClassName('title')[0].innerHTML = this.character.name;

      this.character.userSettings.cardTab = 'Main';
      this.character.userSettings.isNPC = false;


      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    .finally(() => {
      // add Rest button to tabs
      const scrollbar = this.$refs.tabs.$el.querySelector('.el-tabs__nav-scroll');
      scrollbar.appendChild(this.$refs.restBtn.$el);

      // Put Add Spell btn in class spells tabs, wait til refs loaded
      // const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
      // spellTabs.appendChild(this.$refs.addSpell.$el);
    });


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
    applyBonus(name, value, obj) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },


    // TODO: HEALTH AUTO DISABLED / DEAD

    rest() {
      console.log('RESTING');
      this.character.health.damage = 0;
      this.character.health.nonlethal = 0;
    },
    saveCharacter() {
      console.log('SAVE ME');

      // CharacterService.updateCharacter(this.character)
      // .then((response) => {
      //   console.log('response:', response);
      //   // window.location.reload();
      // })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
</style>
