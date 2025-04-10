<template lang="html">

  <h2>{{ title }}</h2>

  <!-- Basics -->
  <el-row :gutter="20" style="margin-bottom: 15px;">
    <el-col :span="12" class="center-horz">
      <svg width="225" height="200">
        <HexGraph :abilities="[attributes.Str.total, attributes.Dex.total, attributes.Con.total, attributes.Int.total, attributes.Wis.total, attributes.Cha.total]"></HexGraph>
      </svg>
      <div class="stat-controls">
        <el-row style="justify-content: center;">
          <el-col :span="3">  Str:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Str.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Str.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Str.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Str.total}}</el-tag>
          </el-col>
          <el-col :span="3">  Int:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Int.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Int.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Int.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Int.total}}</el-tag>
          </el-col>
        </el-row>
        <el-row style="justify-content: center;">
          <el-col :span="3">  Dex:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Dex.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Dex.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Dex.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Dex.total}}</el-tag>
          </el-col>
          <el-col :span="3">  Wis:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Wis.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Wis.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Wis.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Wis.total}}</el-tag>
          </el-col>
        </el-row>
        <el-row style="justify-content: center;">
          <el-col :span="3">  Con:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Con.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Con.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Con.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Con.total}}</el-tag>
          </el-col>
          <el-col :span="3">  Cha:</el-col>
          <el-col :span="3">
            <el-tooltip placement="top" effect="light" v-if="attributes.Cha.sources[0]">
              <el-tag size="small" effect="dark" type="primary">{{attributes.Cha.total}}</el-tag>
              <template #content> <span v-for="bonus in attributes.Cha.sources" :key="bonus"> {{ bonus+" " }} </span> </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="primary" v-else>{{attributes.Cha.total}}</el-tag>
          </el-col>
        </el-row>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="center-horz">
        <g-icon iconSize="128px" :icon-name="basics.type.name" :key="basics.type.name"/>
      </div>
      <el-row>
        <el-col :span="4" class="center-vert center-horz">
          <g-icon iconSize="24px" icon-name="compass"/>
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="12">
              {{ basics.alignment }} {{ capFirsts(basics.size) }} ({{ basics.sizeStats.space }})
            </el-col>
            <el-col :span="12">
              <el-tooltip placement="top" effect="light">
                <el-tag size="small" effect="dark" type="primary">{{ capFirsts(basics.type.name) }}</el-tag>
                <template #content>
                  {{ basics.type.levels }} HD (1d{{ basics.type.hd }})
                </template>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row>
            <el-tooltip placement="top" effect="light" v-for="(cClass, name) in cClasses" :key="name">
              <el-tag size="small" effect="dark" type="primary" style="margin: 0 1px 0 0;">{{ capFirsts(name) }} {{ cClass.levels }}</el-tag>
              <template #content>
                {{ cClass.levels }} HD (1d{{ cClass.hd }})
              </template>
            </el-tooltip>
            <el-tag size="small" effect="dark" type="info" v-for="subtype in basics.type.subtypes" :key="subtype" style="margin: 0 1px 0 2px;">
              {{ capFirsts(subtype) }}
            </el-tag>
          </el-row>
          <el-row>
            <el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="treasure"/> </el-col>
        <el-col :span="20" class="center-vert">
          <!-- <span v-for="(item, index) in inventory[0].children" :key="index">
            {{ item.label }},
          </span> -->
         </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="center-vert center-horz"> <g-icon iconSize="24px" icon-name="forest"/> </el-col>
        <el-col :span="20" class="center-vert"> {{ basics.environment }} </el-col>
      </el-row>
    </el-col>
  </el-row>

  <!-- Content Tabs -->
  <el-button ref="restBtn" size="large" @click="rest()">
    <el-tooltip placement="top" effect="light">
      <g-icon iconSize="20px" iconName="campfire" />
      <template #content>Rest for 8 Hours</template>
    </el-tooltip>
  </el-button>
  <el-tabs ref="tabs" type="card" v-model="userSettings.cardTab">
    <!-- Main -->
    <el-tab-pane label="Main" name="Main">
      <el-collapse v-model="userSettings.mainSections">
        <!-- Defensse -->
        <el-collapse-item title="Defense" name="defense">
          <el-row :gutter="20">
            <el-col :span="3"> <g-icon iconSize="32px" iconName="Armor" /> </el-col>

            <!-- HP & AC -->
            <el-col :span="7">
              <el-tooltip placement="top" effect="light">
                <el-tag size="small" effect="dark" type="danger">
                  HP: {{ health.current }} / {{ health.total }}
                </el-tag>
                <template #content>
                  <span v-for="bonus in health.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>   <br>
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
            </el-col>

            <!-- CMD & Saves -->
            <el-col :span="7">
              <el-tooltip placement="top" effect="light">
                CMD: {{ cmd.total }}
                <template #content>
                  <span v-for="bonus in cmd.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>   <br>
              <el-tooltip placement="top" effect="light">
                Fort: +{{ saves.fort.total }}
                <template #content>
                  <span v-for="bonus in saves.fort.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>   <br>
              <el-tooltip placement="top" effect="light">
                Ref: +{{ saves.ref.total }}
                <template #content>
                  <span v-for="bonus in saves.ref.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>   <br>
              <el-tooltip placement="top" effect="light">
                Will: +{{ saves.will.total }}
                <template #content>
                  <span v-for="bonus in saves.will.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>
            </el-col>

            <!-- Init, Speed, Senses -->
            <el-col :span="7">
              <el-tooltip placement="top" effect="light">
                Init: +{{ init.total }}
                <template #content>
                  <span v-for="bonus in init.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>   <br>
              <el-tooltip placement="top" effect="light" v-if="speed.sources[0]">
                Speed: {{ speed.total }} ft.
                <template #content>
                  <span v-for="bonus in speed.sources" :key="bonus"> {{ bonus+" " }} </span>
                </template>
              </el-tooltip>
              <span v-else>
                Speed: {{ speed.total }} ft.
              </span>         <br>
              Senses: {{ senses }}
            </el-col>
          </el-row>

          <!-- Immunities & Weaknesses -->
          <el-row v-if="this.original.Immunities">
            <el-col :span="3">
            </el-col>
            <el-col :span="7">
              Immunities
            </el-col>
            <el-col :span="14">
              <span v-for="item in this.original.Immunities" :key="item.id">
                {{ item }},
              </span>
            </el-col>
          </el-row>
          <el-row v-if="this.original.Weaknesses">
            <el-col :span="3">
            </el-col>
            <el-col :span="7">
              Weaknesses
            </el-col>
            <el-col :span="14">
              <span v-for="item in this.original.Weaknesses" :key="item.id">
                {{ item }},
              </span>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- Actions -->
        <el-collapse-item title="Actions" name="actions">
          <el-row :gutter="20">
            <el-col :span="3">
              <g-icon iconSize="32px" iconName="swordShield" />
            </el-col>

            <!-- Melee Attacks -->
            <el-col :span="21">
              <el-row v-if="Object.keys(actions.melee).length > 0">
                <el-col :span="5">Melee</el-col>
                <el-col :span="3">To Hit</el-col>
                <el-col :span="6">Dmage</el-col>
                <el-col :span="3">Range</el-col>
              </el-row>
              <el-row v-for="(action, name) in actions.melee" :key="name">
                <el-col :span="5" class="center-vert">
                  <g-icon iconSize="20px" iconName="meleeSword" />
                  <span v-if="action.NatAtkNum">{{ action.NatAtkNum }} </span>
                  {{ name }}
                </el-col>
                <!-- Atk Bonus(es) -->
                <el-col :span="3" class="center-vert">
                  <el-tooltip placement="top" effect="light">
                    <span> <span v-if="action.atkBonus.total >= 0">+</span>{{ action.atkBonus.total }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>5 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-5 >= 0">+</span>{{ action.atkBonus.total-5 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -5 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>10 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-10 >= 0">+</span>{{ action.atkBonus.total-10 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -10 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>15 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-15 >= 0">+</span>{{ action.atkBonus.total-15 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -15 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <!-- Damage, Range, & Extras -->
                <el-col :span="6" class="center-vert">
                  {{ action.dmgDie }}
                  <el-tooltip placement="top" effect="light">
                    +{{ action.dmgBonus.total }}
                    <template #content>
                      <span v-for="bonus in action.dmgBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                  ( <span v-if="action.crit.range<20">{{ action.crit.range }}-</span>20 {{ action.crit.mult }} )
                </el-col>
                <el-col :span="3" class="center-vert">
                  <span v-if="action.range"> {{ action.range }} </span>
                </el-col>
                <el-col :span="6" class="center-vert">
                  <div v-if="Object.values(action.extras).length">
                    <el-collapse>
                      <el-collapse-item title="" name="1">
                        <template #title> <g-icon iconName="star" iconSize="20" /> Extras </template>
                        <ul>
                          <li v-for="(item, name) in action.extras" :key="name">
                            <span v-if="name == 'masterwork'"> {{ name }} </span>
                            <!-- <span v-else-if="name == 'Natural Attack'"> {{ name }} </span> -->
                            <span v-else> {{ name }} : {{ item }} </span>
                          </li>
                        </ul>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </el-col>
              </el-row>

              <!-- Ranged Attacks -->
              <el-row v-if="Object.keys(actions.ranged).length > 0">
                <el-divider />
                <el-col :span="5">Ranged</el-col>
                <el-col :span="3">To Hit</el-col>
                <el-col :span="6">Dmage</el-col>
                <el-col :span="3">Range</el-col>
              </el-row>
              <el-row v-for="(action, name) in actions.ranged" :key="name">
                <el-col :span="5" class="center-vert">
                  <g-icon iconSize="20px" iconName="rangedBow" />
                  <span v-if="action.NatAtkNum">{{ action.NatAtkNum }} </span>
                  {{ name }}
                </el-col>
                <!-- Atk Bonus(es) -->
                <el-col :span="3" class="center-vert">
                  <el-tooltip placement="top" effect="light">
                    <span> <span v-if="action.atkBonus.total >= 0">+</span>{{ action.atkBonus.total }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>5 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-5 >= 0">+</span>{{ action.atkBonus.total-5 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -5 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>10 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-10 >= 0">+</span>{{ action.atkBonus.total-10 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -10 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" v-if="bab>15 && !action.extras['Natural Attack']">
                    <span><span v-if="action.atkBonus.total-15 >= 0">+</span>{{ action.atkBonus.total-15 }} &nbsp; </span>
                    <template #content>
                      <span v-for="bonus in action.atkBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                      <span> -15 Subsequent Attack </span>
                    </template>
                  </el-tooltip>
                </el-col>
                <!-- Damage, Range, Extras -->
                <el-col :span="6" class="center-vert">
                  {{ action.dmgDie }}
                  <el-tooltip placement="top" effect="light" v-if="action.dmgBonus.total">
                    +{{ action.dmgBonus.total }}
                    <template #content>
                      <span v-for="bonus in action.dmgBonus.sources" :key="bonus"> {{ bonus+" " }} </span>
                    </template>
                  </el-tooltip>
                  ( <span v-if="action.crit.range<20">{{ action.crit.range }}-</span>20 {{ action.crit.mult }} )
                </el-col>
                <el-col :span="3" class="center-vert">
                  <span v-if="action.range"> {{ action.range }} </span>
                </el-col>
                <el-col :span="6" class="center-vert">
                  <div v-if="Object.values(action.extras).length">
                    <el-collapse>
                      <el-collapse-item title="" name="1">
                        <template #title> <g-icon iconName="star" iconSize="20" /> Extras </template>
                        <ul>
                          <li v-for="(item, name) in action.extras" :key="name">
                            <span v-if="name == 'masterwork'"> {{ name }} </span>
                            <span v-else> {{ name }} : {{ item }} </span>
                          </li>
                        </ul>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </el-col>
              </el-row>

              <!-- Special Actions -->
              <el-row v-if="Object.keys(actions.special).length > 0">
                <el-divider />
                <el-col :span="6">Special</el-col>
                <el-col :span="3">Action</el-col>
                <el-col :span="8">Effects</el-col>
                <el-col :span="6"><el-tag size="small" effect="dark" type="primary">CMB +{{ cmb.total }}</el-tag></el-col>
              </el-row>
              <el-row v-for="(action, name) in actions.special" :key="name" :gutter="2">
                  <el-col :span="5" class="center-vert" v-if="action.extras.showMain == true" >
                    <g-icon iconSize="20px" iconName="abilityPalm" />
                    {{ name }}
                  </el-col>
                  <el-col :span="4" class="center-vert center-horz" v-if="action.extras.showMain == true" >
                    <el-button :type=" (action.extras.active) ? 'primary' : 'info'" size="small" @click="toggleAbility(name, action)">{{ action.trigger == "Toggle" ? "Free" : action.trigger }}</el-button>
                  </el-col>
                  <el-col :span="12" class="center-vert" v-if="action.extras.showMain == true" >
                    {{ action.benefit }}
                  </el-col>
                </el-row>
            </el-col>
          </el-row>
        </el-collapse-item>


        <!-- Conditions -->
        <el-collapse-item title="Conditions" name="conditions">
          <el-row :gutter="20">
            <el-col :span="3">
              <g-icon iconSize="32px" iconName="dizzyStar" />
            </el-col>
            <el-col :span="21">
              <el-row>
                <el-col :span="8" :offset="16">
                  <!-- Conditions Dropdown -->
                  <el-select
                    v-model="conditions"
                    value-key="name"
                    multiple
                    placeholder="Common Conditions"
                  >
                  <!--
                  <template #tag>
                    <el-tag v-for="(item, name) in filterValue[key]" effect="dark" :color="item.color" :key="name" >
                      {{ item.label }}
                    </el-tag>
                  </template>
                 -->
                    <el-option v-for="item in conditionSelect" :key="item.name" :label="item.name" :value="item" >
                      <div class="flex items-center">
                        <el-tag type="primary" style="margin-right: 8px" size="small" effect="dark" />
                        <span>{{ item.name }}</span>
                      </div>
                    </el-option>
                    <template #footer>
                      <el-button v-if="!addingCondition" text bg size="small" @click="addNewContion()"> Add custom condition </el-button>
                    </template>
                  </el-select>

                  <!-- Add New Condition -->
                  <el-dialog v-model="addingCondition" title="New Condition" width="800">
                    <el-row :gutter="5">
                      <el-col :span="5">
                        <el-input v-model="newCondition.name" size="small" placeholder="Condition Name" />
                      </el-col>
                      <el-col :span="10">
                        <el-input v-model="newCondition.description" :rows="2" type="textarea" placeholder="Enter condition description" />
                      </el-col>

                      <!-- New Condition Bonuses -->
                      <el-col :span="4">
                        <span class="">Bonuses</span>
                        <el-button size="small" @click="addNewConditionBonus">+</el-button>
                        <br>

                        <el-row v-for="(bonus, name) in newCondition.bonuses" :key="name">
                          {{ name }}
                          <el-input v-model="bonus.value" size="small" placeholder="Modifier" />
                          <el-select
                            v-model="bonus.targets"
                            value-key="name"
                            multiple
                            placeholder="Modifier Target"
                          >
                            <el-option v-for="item in bonusTargets" :key="item.value" :label="item.name" :value="item.value" >
                              <div class="flex items-center">
                                <el-tag type="primary" style="margin-right: 8px" size="small" effect="dark" />
                                <span>{{ item.name }}</span>
                              </div>
                            </el-option>
                          </el-select>
                          {{ bonus.targets }}
                        </el-row>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="3" class="addCondition">
                        <el-button size="small" type="primary" @click="addCondition()">confirm</el-button>
                        <el-button size="small" @click="newCondition = {}; addingCondition = false;">cancel</el-button>
                      </el-col>
                    </el-row>
                  </el-dialog>
                </el-col>
              </el-row>

              <el-row v-for="condition in conditions" :key="condition.name">
                <el-col :span="6" class="center-vert">
                  {{ condition.name }}
                </el-col>
                <el-col :span="18" class="center-vert">
                  {{ condition.description }}
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-tab-pane>

    <!-- Items -->
    <el-tab-pane label="Items" name="Items">
      <el-row>
        <g-icon iconSize="16px" iconName="treasure" />
        COINS
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
        :data="inventory"
        node-key="id"
        ref="tree"
        draggable
        render-after-expand
        :default-expand-all="userSettings.expandInventory"
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
            <el-tooltip placement="top" effect="light">
              <el-button type="info" circle size="small" @click="editItem(data)">
                <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
              </el-button>
              <template #content> Edit Item </template>
            </el-tooltip>

            <!-- Delete Item -->
            <el-tooltip placement="top" effect="light">
              <div style="margin-left:12px;">
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
              <template #content> Delete Item </template>
            </el-tooltip>
          </div>
        </template>
      </el-tree>
      <el-dialog v-model="editingItem" width="800">
        <g-item :source="item" :newItem="addItem" @save-item="saveItem"/>
      </el-dialog>
    </el-tab-pane>


    <!-- Skills -->
    <el-tab-pane label="Skills" name="Skills">
      <el-row v-if="skills.Linguistics && skills.Linguistics.extras">
        <el-col :span="3"> Languages: </el-col>
        <el-col :span="21">
          <el-tag size="small" effect="dark" type="primary" v-for="language in skills.Linguistics.extras.languages" :key="language">{{ language }}</el-tag>
        </el-col>
      </el-row>
      <el-divider />

      <div v-for="(skill, name) in skills" :key="name">
        <el-row v-if="skill.untrained || skill.ranks" style="margin-bottom:5px; border-bottom:1px solid grey">
          <el-col :span="5">{{ name }}</el-col>
          <el-col :span="5" class="center-horz"><!-- Bonus -->
            <el-tooltip placement="top" effect="light">
              {{ skill.bonus.total }}
              <template #content>
                <span v-for="bonus in skill.bonus.sources" :key="bonus"> {{ bonus+" " }} </span>
              </template>
            </el-tooltip>
          </el-col>
          <el-col :span="2"> {{ skill.ability }} </el-col>
        </el-row>
      </div>
    </el-tab-pane>

    <!-- Abilities -->
    <el-tab-pane label="Abilities" name="Abilities">
      <el-row class="center-horz">
        <el-col :span="5">Name</el-col>
        <el-col :span="3">Toggles</el-col>
        <el-col :span="12">Description</el-col>
        <el-col :span="2">Source</el-col>
        <el-col :span="2">Edit</el-col>
      </el-row>
      <el-divider />

      <el-row v-for="(abil, name) in abilities" :key="name" style="margin-bottom:5px;">
        <el-col :span="5">{{ name }}</el-col>
        <el-col :span="3">
          <el-button style="width:95%; margin: 0;" :type="abil.extras.active?'primary':'info'" size="small" :disabled="abil.trigger=='Continuous'?true:false" @click="toggleAbility(name, abil)">{{ abil.trigger == "Toggle" ? "Free" : abil.trigger }}</el-button>
          <el-button style="width:95%; margin: 0;" :type="abil.extras.showMain?'primary':'info'" size="small" @click="abilShowMain(name, abil)">{{ abil.extras.showMain ? "On Main" : "Just Here" }}</el-button>
        </el-col>
        <el-col :span="12"> {{ abil.description }} </el-col>
        <el-col :span="2" class="center-horz;">
          <el-tag size="small" effect="dark" type="primary">
            {{ abil.extras.source }}
          </el-tag>
        </el-col>
        <el-col :span="2" class="center-horz;">
          <el-button type="info" circle @click="editAbility(abil)">
            <g-icon iconSize="20px" iconColor="#000" iconName="quill" />
          </el-button>
        </el-col>
      </el-row>
      <!-- <el-dialog v-model="editingItem" width="800">
        <g-item :source="item" />
      </el-dialog> -->
    </el-tab-pane>

    <!-- Magic -->
    <el-tab-pane label="Magic" name="Magic">
      <el-row :gutter="20">
        <el-col :span="3">
          <g-icon iconSize="32px" iconName="rolledScroll" />
        </el-col>
        <el-col :span="21">
          {{ this.original.Magic }}
        </el-col>
      </el-row>
    </el-tab-pane>

    <el-tab-pane label="Edit" name="Edit">
      <!-- [LEVEL UP] -->
      <!-- add ability (ability & bonuses -> actions) -->
      <!-- EDIT BASICS (name, race, alignment, attributes, casting style, etc) -->
      <!--
      Size <el-select-v2 v-model="basics.size" :options="this.sizeSelect" size="small" style="width: 120px" />
      <br><br>
      Bonuses
      <div v-for="(item, name) in bonuses" :key="name">
        {{ name }} : {{ item }}
      </div>
    -->
    </el-tab-pane>
  </el-tabs>

  <!-- FOOTER -->
  <el-row :gutter="20">
    <el-col :span="3" class="center">
      <el-button type="primary" @click="saveMonster()"> Save Changes </el-button>
    </el-col>
  </el-row>

</template>

<script>
import HexGraph from '@/components/template/HexGraph.vue'
import GItem from '@/components/template/GItem.vue'

export default {
  name: "CreatureCard",
  components: { HexGraph, GItem },
  props: { source: { type: Object } },
  data() {
    return {
      sizeSelect: [
        { value: "Fine", label: "Fine", },
        { value: "Diminuitive", label: "Diminuitive", },
        { value: "Tiny", label: "Tiny", },
        { value: "Small", label: "Small", },
        { value: "Medium", label: "Medium", },
        { value: "Large", label: "Large", },
        { value: "Huge", label: "Huge", },
        { value: "Gargantuan", label: "Gargantuan", },
        { value: "Colossal", label: "Colossal", }
      ],


      conditions: [],
      conditionSelect: [
        { name: "Dazed", description: "The creature is unable to act normally. A dazed creature can take no actions, but has no penalty to AC.", bonuses: {} },
        { name: "Dazzled", description: "The creature is unable to see well because of over-stimulation of the eyes. A dazzled creature takes a –1 penalty on attack rolls and sight-based Perception checks.",
          bonuses: {
            "Dazzled": {
              type: "Condition",
              value: -1,
              targets: [ "meleeAtkBonus", "rangedAtkBonus" ]
            }
          }
        },
        { name: "Prone", description: "The character is lying on the ground. A prone attacker has a –4 penalty on melee attack rolls and cannot use a ranged weapon (except for a crossbow). A prone defender gains a +4 bonus to Armor Class against ranged attacks, but takes a –4 penalty to AC against melee attacks.",
          bonuses: {
            "Prone": {
              type: "Condition",
              value: -4,
              targets: [ "meleeAtkBonus" ]
            }
          }
        }
      ],
      bonusTargets: [
        { name: "Total AC", value: "totalAC" },
        { name: "Touch AC", value: "touchAC" },
        { name: "Flat-Foot AC", value: "flatAC" },
        { name: "Fortitude Saves", value: "fort" },
        { name: "Reflex Saves", value: "ref" },
        { name: "Will Saves", value: "will" }
        // "atkBonus", "dmgBonus", "cmb", "cmd", "Str", "Con", "Dex",
      ],
      newCondition: {},
      addingCondition: false,
      editingAbil: false,
      abil: {},
      addItem: false,
      editingItem: false,
      item: {},
      itemFilter: "",



      original: {}
    }
  },
  mounted() {
    // add rest button to tabs
    const scrollbar = this.$refs.tabs.$el.querySelector('.el-tabs__nav-scroll');
    scrollbar.appendChild(this.$refs.restBtn.$el);
  },


  computed: {
    rules() { return this.$store.state.data.rules; },
    classes() { return this.$store.state.data.classes; },
    equipment() { return this.$store.state.data.equipment; },
    userSettings() {
      let userSettings = this.source.userSettings;
      userSettings.cardTab = this.capFirsts(this.source.userSettings.cardTab);
      return userSettings;
    },
    title() { return this.source.name ? this.source.name.concat(" CR ", this.source.basics.cr) : ""; },
    bonuses() {
      let bonuses = {};
      // Add feats and other abilities to bonuses
      for (const ability in this.abilities) {
        if (this.abilities[ability].extras.active && this.abilities[ability].bonuses) {
          for (const [name, bonus] of Object.entries(this.abilities[ability].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Add conditions
      for (const condition in this.conditions) {
        if (this.conditions[condition].bonuses) {
          for (const [name, bonus] of Object.entries(this.conditions[condition].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Armor
      let item = this.inventory[0].children[0].children[0];
      if (item) {
        bonuses[item.label] = {};
        bonuses[item.label].type = "Armor";
        bonuses[item.label].targets = item.value.targets;
        bonuses[item.label].value = item.value["AC Bonus"];
      }
      // Shields          For items in equipment . equipped . hands
      for (const item of this.inventory[0].children[1].children[0].children) {
        if (item.value.Proficiency == "Shields") {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = item.value.targets;
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . Magic Items
      for (const slot of this.inventory[1].children) {
        for (const item of slot.children) {
          if (item.bonuses) {
            for (const [name, bonus] of Object.entries(item.bonuses)) {
              console.log(name, bonus);
              bonuses[name] = {};
              bonuses[name].type = bonus.type;
              bonuses[name].targets = bonus.targets;
              bonuses[name].value = bonus.value;
            }
          }
        }
      } // end magic items
      // console.log(bonuses);
      return bonuses;
    },
    actions() {
      let actions = { melee: {}, ranged: {}, special: {} };
      // if (this.source.name && this.rules.natural_attacks) {
        let NatAtkNum = 0;
        for (let type of Object.entries(this.source.actions)) {
          type = type[0];

          for (const [name, atk] of Object.entries(this.source.actions[type])) {
            if (type == 'special') {
              actions.special[name] = atk;
              continue;
            }

            // TODO: split nat atk num from nat atk name (2 wings)

            let newAtk = {
              dmgBonus: { "total": 0, "sources": [] },
              atkBonus: { "total": 0, "sources": [] }
            };

            NatAtkNum += (atk.Proficiency == "Natural" && Object.keys(this.rules.natural_attacks).includes(name)) ? 1 : 0;
            newAtk.atkBonus.total += this.bab;
            newAtk.atkBonus.sources.push(`+${this.bab} BAB`);
            if (this.basics.size != "medium") {
              newAtk.atkBonus.total += this.basics.sizeStats["ac / atk"];
              newAtk.atkBonus.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
            }

            // Add AbilMod to atkBonus
            if (atk.category == "Ranged" || type == "ranged") {
              newAtk.atkBonus.total += this.attributes.DexMod;
              newAtk.atkBonus.sources.push(`+${this.attributes.DexMod} Dex`);
            } else if (atk.Category == "Secondary") {
              newAtk.atkBonus.total += this.attributes.StrMod - 5;
              newAtk.atkBonus.sources.push(`+${this.attributes.StrMod - 5} Str`);
            } else {
              newAtk.atkBonus.total += this.attributes.StrMod;
              newAtk.atkBonus.sources.push(`+${this.attributes.StrMod} Str`);
            }

            // Add AbilMod to dmgBonus
            if (!Object.keys(this.rules.natural_attacks).includes(name)) {
              // Fake Natural Attack, like Death Worm's Electrical Jolt
              // They get no bonuses to DMG

            } else if (atk.Category == "Secondary") {
              newAtk.dmgBonus.total += this.attributes.StrMod / 2;
              newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod / 2} Str`);

            } else {
              newAtk.dmgBonus.total += this.attributes.StrMod;
              newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod} Str`);
            }

            // Add Active Bonuses
            this.bonusLoop(newAtk.atkBonus, type.concat("AtkBonus"));
            this.bonusLoop(newAtk.dmgBonus, type.concat("DmgBonus"));

            if (NatAtkNum>1) { newAtk.atkNum = NatAtkNum; }
            newAtk.dmgDie = atk.Damage[this.basics.size];
            newAtk.crit = {};
            newAtk.crit.range = atk.Critical.split("/")[0];
            newAtk.crit.mult = atk.Critical.split("/")[1];
            newAtk.extras = (atk.Extras) ? atk.Extras : [];
            actions[type][name] = newAtk;

          } // End Action Loop
        } // End Action Types Loop
        if (NatAtkNum == 1) {
          console.log('Extra Strength to Nat Attack');
          for (const atk of Object.values(actions.melee)) {
            atk.dmgBonus.total += Math.floor(this.attributes.StrMod / 2);
            atk.dmgBonus.sources.push(`+${Math.floor(this.attributes.StrMod / 2)} Str`);
          }
        }

        // Weapon Actions
        let mainHand = this.inventory[0].children[1].children[0].children[0];
        let offHand = this.inventory[0].children[1].children[0].children[1];

        for (const weapon of this.inventory[0].children[1].children[0].children) {
          // this.inventory[ equipped ].children[ weapons ].children[ hands ].children

          if (!weapon.value.Damage) { continue; }
          if (weapon.value.Group.includes("Bows") || weapon.value.Category == "Two-Handed"){
            if (weapon.label != mainHand.label || offHand != undefined) {
              continue;
            }
          }

          let type = (weapon.value.Category == "Ranged" || weapon.value.Group.includes("Thrown")) ? "ranged" : "melee";
          let newAtk = { dmgBonus: { "total": 0, "sources": [] }, atkBonus: { "total": 0, "sources": [] } };

          newAtk.atkBonus.total += this.bab;
          newAtk.atkBonus.sources.push(`+${this.bab} BAB`);
          if (this.basics.size != "medium") {
            newAtk.atkBonus.total += this.basics.sizeStats["ac / atk"];
            newAtk.atkBonus.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
          }

          // Add mwk or magic enhancements to atk bonus
          if (weapon.value.Extras["Enhancement"] > 0) {
            newAtk.atkBonus.total += weapon.value.Extras["Enhancement"];
            newAtk.atkBonus.sources.push(`+${weapon.value.Extras["Enhancement"]} Magic Enhancement`);
            newAtk.dmgBonus.total += weapon.value.Extras["Enhancement"];
            newAtk.dmgBonus.sources.push(`+${weapon.value.Extras["Enhancement"]} Magic Enhancement`);
          } else if (weapon.value.Extras["Masterwork"]) {
            newAtk.atkBonus.total += 1;
            newAtk.atkBonus.sources.push(`+1 Masterwork`);
          }


          // Add AbilMod to atkBonus
          if (type == "ranged") {
            newAtk.atkBonus.total += this.attributes.DexMod;
            newAtk.atkBonus.sources.push(`+${this.attributes.DexMod} Dex`);
            // BOW && THROWN STR MOD
            if (weapon.value.Group.includes("Thrown") ||
                (weapon.value.Group.includes("Bows") && this.attributes.StrMod < 0) ||
                (weapon.value.Group.includes("Bows") && name.includes("Composite")) ) {
              newAtk.dmgBonus.total += this.attributes.StrMod;
              newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod} Str`);
            }

          } else {
            newAtk.atkBonus.total += this.attributes.StrMod;
            newAtk.atkBonus.sources.push(`+${this.attributes.StrMod} Str`);

            if (weapon.label == mainHand.label) {
              // Main Hand

              if (offHand == undefined && (weapon.value.Category == "One-Handed" || weapon.value.Category == "Two-Handed")) {
                // if only mainHand
                newAtk.dmgBonus.total += Math.floor(this.attributes.StrMod * 1.5);
                newAtk.dmgBonus.sources.push(`+${Math.floor(this.attributes.StrMod * 1.5)} Str`);

              } else {
                newAtk.dmgBonus.total += this.attributes.StrMod;
                newAtk.dmgBonus.sources.push(`+${this.attributes.StrMod} Str`);
              }

            } else {
              // Off Hand
              if (weapon.value.Category == "Light" || weapon.value.Category == "One-Handed") {
                newAtk.dmgBonus.total += Math.floor(this.attributes.StrMod / 2);
                newAtk.dmgBonus.sources.push(`+${Math.floor(this.attributes.StrMod / 2)} Str`);
              }
            }
          }

          // Dual Wield Off Hand penalty done in abilities / bonuses
          /*
          penalties to AtkBonus, during a full-round atk
          light & feat      { main -2  off -2 }
          two-weapon feat   { main -4  off -4 }
          off hand light    { main -4  off -8 }
          normal            { main -6  off -10}
          */


          this.bonusLoop(newAtk.atkBonus, type.concat("AtkBonus"));
          this.bonusLoop(newAtk.dmgBonus, type.concat("DmgBonus"));

          // TODO: change wpn dmg die back to obj based on size, to allow size changing
          newAtk.dmgDie = weapon.value.Damage;
          // newAtk.dmgDie = weapon.value.Damage[this.basics.size];
          newAtk.crit = {};
          newAtk.crit.range = weapon.value.Critical.split("/")[0];
          newAtk.crit.mult = weapon.value.Critical.split("/")[1];
          newAtk.extras = (weapon.value.Extras) ? weapon.value.Extras : [];
          // console.log(`${NatAtkNum>1 ? NatAtkNum : ""} ${name} +${newAtk.atkBonus.total} (${newAtk.dmgDie}+${newAtk.dmgBonus.total} /${atk.Critical})`);
          actions[type][weapon.label] = newAtk;
        }



      // }
      return actions;
    },
    abilities() {
      let abilities = this.source.abilities;
      if (this.source.name) {
        for (let actions of Object.entries(this.actions)) {
          if (actions[0] == "special") {
            actions = actions[1];
            for (var action in actions) {
              if (!Object.keys(abilities).includes(action)) {
                abilities[action] = actions[action];
              }
            }
          }
        }
      }
      // console.log(abilities);
      return abilities;
    },
    inventory() { return this.source.equipment; },

    attributes() {
      let attributes = {
        Str: { total: 0, sources: [] }, StrMod: -5,
        Dex: { total: 0, sources: [] }, DexMod: -5,
        Con: { total: 0, sources: [] }, ConMod: -5,
        Int: { total: 0, sources: [] }, IntMod: -5,
        Wis: { total: 0, sources: [] }, WisMod: -5,
        Cha: { total: 0, sources: [] }, ChaMod: -5
      };
      if (this.source.name) {
        attributes = this.source.attributes;
      }
      return attributes;
    },
    basics() {
      let basics = this.source.basics ? this.source.basics : { "type": {}, "size": "medium"};
      basics.sizeStats = this.rules.size ? this.rules.size[basics.size] : { "space": "5 ft." };
      return basics;
    },
// TODO: classes loop
    cClasses() {
      let classes = {};
      if (this.source.name && this.source.classes["commoner"]) {
        classes = this.source.classes;
        classes.warrior.hd = 10;
      }
      return classes;
     },
    health() {
      let health = { current: 0, total: 0, sources: [] };
      if (this.source.name) {
        let firstLevel = true;
        let ModBonus = 0;
        // Racial HD Check
        if (this.basics.type.levels) { health.sources.push( `+${this.basics.type.levels}d${this.basics.type.hd}` ); }
        for (let i = 1; i < this.basics.type.levels+1; i++) {
          firstLevel = false;
          health.total += this.basics.type.hd / 2 + 0.5;
          if (this.basics.type.name == "undead") {
            health.total += this.attributes.ChaMod;
            ModBonus += this.attributes.ChaMod;
          } else if (this.basics.type.name == "construct") {
            switch (this.basics.size) {
              case "small": health.total += 10; health.sources.push(`+10 Construct`); break;
              case "medium": health.total += 20; health.sources.push(`+20 Construct`); break;
              case "large": health.total += 30; health.sources.push(`+30 Construct`); break;
              case "huge": health.total += 40; health.sources.push(`+40 Construct`); break;
              case "gargantuan": health.total += 60; health.sources.push(`+60 Construct`); break;
              case "colossal": health.total += 80; health.sources.push(`+80 Construct`); break;
              default: health.total += 0;
            }
          } else {
            health.total += this.attributes.ConMod;
            ModBonus += this.attributes.ConMod;
          }
        }

        // Class Loop
        for (let [name, cClass] of Object.entries(this.source.classes)) {
          let levels = cClass.levels;
          cClass = this.classes[name] ? this.classes[name] : { "hd": 0 };
          health.sources.push( `+${levels}d${cClass.hd}` );

          // Level Loop
          for (let i = 1; i < levels+1; i++) {
            health.total += firstLevel ? cClass.hd : cClass.hd / 2 + 0.5;
            if (this.basics.type.name == "undead") {
              health.total += this.attributes.ChaMod;
              ModBonus += this.attributes.ChaMod;
            } else if (this.basics.type.name != "construct") {
              health.total += this.attributes.ConMod;
              ModBonus += this.attributes.ConMod;
            }
          }
        }
        this.bonusLoop(health, "health");
        ModBonus = ModBonus.toString().concat(this.basics.type.name == "undead" ? " Cha" : " Con");
        health.sources.push(`+${ModBonus}`);

        health.total = Math.floor(health.total);
        health.current = this.source.health.current ? this.source.health.current : health.total;
      } // end if have source

      return health;
    },
    ac() {
      let ac = { "total": { "total": 10, "sources": [] }, "touch": { "total": 10, "sources": [] }, "flat": { "total": 10, "sources": [] } };
      let armor = this.inventory[0].children[0].children[0];
      // total = All
      if (armor) {
        ac.total.total += Math.min(armor.value["Max Dex"], this.attributes.DexMod);
        ac.total.sources.push(`+${this.attributes.DexMod} Dex`);
      } else {
        ac.total.total += this.attributes.DexMod;
        ac.total.sources.push(`+${this.attributes.DexMod} Dex`);
      }
      if (this.basics.size != "medium") {
        ac.total.total += this.basics.sizeStats["ac / atk"];
        ac.total.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
      }

      // touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      if (armor) {
        ac.touch.total += Math.min(armor.value["Max Dex"], this.attributes.DexMod);
        ac.touch.sources.push(`+${this.attributes.DexMod} Dex`);
      } else {
        ac.touch.total += this.attributes.DexMod;
        ac.touch.sources.push(`+${this.attributes.DexMod} Dex`);
      }
      if (this.basics.size != "medium") {
        ac.touch.total += this.basics.sizeStats["ac / atk"];
        ac.touch.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
      }

      // flat = creature.ac.total - bonus.dex - bonus.dodge;
      if (this.basics.size != "medium") {
        ac.flat.total += this.basics.sizeStats["ac / atk"];
        ac.flat.sources.push(`+${this.basics.sizeStats["ac / atk"]} Size`);
      }

      this.bonusLoop(ac.total, "totalAC");
      this.bonusLoop(ac.touch, "touchAC");
      this.bonusLoop(ac.flat, "flatAC");
      return ac;
    },
    saves() {
      let saves = { "fort": { "total": 0, "sources": [] }, "ref": { "total": 0, "sources": [] }, "will": { "total": 0, "sources": [] } };
      if (this.source.name) {
        let total, bName = "";
        for (let [name, save] of Object.entries(saves)) {
          // Abilities
          total = 0;
          switch (name) {
            case "fort":
              total += (this.basics.type.name == "undead") ? this.attributes.ChaMod : this.attributes.ConMod;
              bName = (this.basics.type.name == "undead") ? "Cha" : "Con";
              break;
            case "ref":
              total += (name == "ref") ? this.attributes.DexMod : 0;
              bName = "Dex";
              break;
            case "will":
              total += (name == "will") ? this.attributes.WisMod : 0;
              bName = "Dex";
              break;
          }
          total = Math.floor(total);
          if (total > 0) {
            save.total += total;
            save.sources.push(`+${total} ${bName}`);
          }
          // Racial HD Check
          if (this.basics.type.levels && this.rules.creature_types) {
            bName = this.basics.type.name;
            total = 0;
            let saveMult = this.rules.creature_types[bName][name].mult;
            total += saveMult * this.basics.type.levels;
            total += this.rules.creature_types[bName][name].bonus;
            total = Math.floor(total);
            if (total > 0) {
              save.total += total;
              save.sources.push(`+${total} ${bName}`);
            }
          }
          // Class Loop
          for (let [cName, cClass] of Object.entries(this.source.classes)) {
            if (this.classes[cName]) {
              let levels = cClass.levels;
              cClass = this.classes[cName];
              total = 0;
              let saveMult = cClass[name].mult;
              total += saveMult * levels;
              total += cClass[name].bonus;
              total = Math.floor(total);
              if (total > 0) {
                save.total += total;
                save.sources.push(`+${total} ${cName}`);
              }
            }
          }
        }
        // Bonus Loop
        this.bonusLoop(saves.fort, "fort");
        this.bonusLoop(saves.ref, "ref");
        this.bonusLoop(saves.will, "will");
      }
      saves.fort.total = Math.floor(saves.fort.total);
      saves.ref.total = Math.floor(saves.ref.total);
      saves.will.total = Math.floor(saves.will.total);
      return saves;
    },
    cmd() {
      let cmd = { "total": 10, "sources": [] };
      if (this.source.name) {
        if (this.bab > 0) {
          cmd.sources.push(`+${this.bab} BAB`);
          cmd.total += this.bab;
        }
        if (this.attributes.StrMod > 0) {
          cmd.sources.push(`+${this.attributes.StrMod} Str`);
          cmd.total += this.attributes.StrMod;
        }
        if (this.attributes.DexMod) {
          cmd.sources.push(`+${this.attributes.DexMod} Dex`);
          cmd.total += this.attributes.DexMod;
        }
        if (this.basics.sizeStats["cmb / cmd"]) {
          cmd.sources.push(`+${this.basics.sizeStats["cmb / cmd"]} Size`);
          cmd.total += this.basics.sizeStats["cmb / cmd"];
        }
        this.bonusLoop(cmd, "cmd");
      }
      return cmd;
    },
    cmb() {
      let cmb = { "total": 0, "sources": [] };
      if (this.source.name) {
        if (this.bab > 0) {
          cmb.sources.push(`+${this.bab} BAB`);
          cmb.total += this.bab;
        }
        if (["fine", "diminuitive", "tiny"].includes(this.basics.size)) {
          if (this.attributes.DexMod > 0) {
            cmb.sources.push(`+${this.attributes.DexMod} Str`);
            cmb.total += this.attributes.DexMod;
          }
        } else {
          if (this.attributes.StrMod > 0) {
            cmb.sources.push(`+${this.attributes.StrMod} Str`);
            cmb.total += this.attributes.StrMod;
          }
        }
        if (this.basics.sizeStats["cmb / cmd"]) {
          cmb.sources.push(`+${this.basics.sizeStats["cmb / cmd"]} Size`);
          cmb.total += this.basics.sizeStats["cmb / cmd"];
        }
        this.bonusLoop(cmb, "cmb");
      }
      return cmb;
    },
    init() {
      let init = { "total": 0, "sources": [] };
      if (this.source.name) {
        if (this.attributes.DexMod > 0) {
          init.sources.push(`+${this.attributes.DexMod} Dex`);
          init.total += this.attributes.DexMod;
        }
        this.bonusLoop(init, "Initiative");
      }
      return init;
    },
    senses() {
      let senses = [];
      if (this.source.name) {
        if (this.skills && this.skills.Perception) {
          senses.push(`Perception ${this.skills.Perception.bonus}`);
        }
        Object.values(this.abilities).forEach(abil => {
          if (abil.benefit && abil.benefit.target == "senses") {
            senses.push(abil.benefit.text);
          }
        });
      }
      return senses;
    },
    speed() {
      let speed = { "total": 0, "sources": [] };
      if (this.source.name) {
        speed.total += this.source.basics.speed;
        this.bonusLoop(speed, "speed");
      }
      return speed;
    },
    bab() {
      let bab = 0;
      if (this.source.name) {
        // Racial HD Check
        if (this.basics.type.levels) {
          let racialBAB = this.rules.creature_types ? this.rules.creature_types[this.basics.type.name].bab : 0;
          bab += racialBAB * this.basics.type.levels;
        }
        // Class Loop
        for (let [name, cClass] of Object.entries(this.source.classes)) {
          let classBAB = this.classes[name] ? this.classes[name].bab : 0;
          bab += classBAB * cClass.levels;
        }
      }
      bab = Math.floor(bab);
      return bab;
    },
    skills() {
      let skills = {};
      if (this.source.name && this.classes["commoner"] && this.rules.skills) {
        for (const [name, skill] of Object.entries(this.source.skills)) {
          let bonus = { "total": 0, "sources": [] };

          // Size Mod
          if (name == "Stealth" || name == "Fly") {
            bonus.total += this.basics.sizeStats[name.toLowerCase()];
            let str = (this.basics.sizeStats[name.toLowerCase()] < 0) ? "" : "+";
            str = str.concat(`${this.basics.sizeStats[name.toLowerCase()]} Size`);
            bonus.sources.push(str);
          }

          // Ranks
          if (skill.ranks) {
            bonus.total += skill.ranks;
            bonus.sources.push(`+${skill.ranks} Ranks`);
            if (skill.class) {
              bonus.total += 3;
              bonus.sources.push("+3 Class Skill");
            }
          }

          // Ability
          bonus.total += this.attributes[skill.ability.concat("Mod")];
          let str = this.attributes[skill.ability.concat("Mod")] < 0 ? "" : "+";
          str = str.concat(`${this.attributes[skill.ability.concat("Mod")]} ${skill.ability.concat("Mod")}`);
          bonus.sources.push(str);

          // Armor Penalty
          if (skill.armor_pen) {
            for (const iName of Object.keys(this.bonuses)) {
              if (this.inventory[iName] && this.inventory[iName].Penalty) {
                bonus.total += this.inventory[iName].Penalty;
                bonus.sources.push(`${this.inventory[iName].Penalty} ${iName}`);
              }
            }
          }
          this.bonusLoop(bonus, name);

          // Add leading +
          bonus.total = (bonus.total > -1) ? "+".concat(bonus.total) : bonus.total;
          skill.bonus = bonus;
          skills[name] = skill;
        }
      }
      return skills;
    },

    magic() { return "" },
  },

  watch: {
    itemFilter(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    capFirsts(string) {
      return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : "";
    },
    bonusLoop(object, tString) {
      // object = the bonus object we are adding to: { total: #, sources: [] }
      // tString = the target string we match to add to the bonus object: "atkBonus"
      // Add Active Bonuses
      let typedBonuses = {};
      if (this.bonuses) {
        for (let [name, bonus] of Object.entries(this.bonuses)) {
          // If the bonus type doesn't stack
          // If we have that type already && the current is higher, skip
          // Else, replace / add it
          if (this.rules.bonuses && Object.keys(this.rules.bonuses).includes(bonus.type)) {
            if (typedBonuses[bonus.type] && typedBonuses[bonus.type].value > bonus.value) {
              continue;
            } else {
              // remove previos values from either atk or dmg or both
              if (typedBonuses[bonus.type]) {
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
              typedBonuses[bonus.type] = { name: name, value: bonus.value };
            }
          }
          // If bonus.targets includes tString, apply it
          bonus.targets.forEach(target => {
            if (target == tString) {
              object.total += parseInt(bonus.value);
              object.sources.push(`+${bonus.value} ${name}`);
            }
          });
        } // End Bonuses Loop
      }

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
      this.inventory[2].children.push(item);
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
    *         ABILITIES         *
    *                           *
    \***************************/
    toggleAbility(name, abil) {
      if (this.conditions[name]) {
        delete this.conditions[name];
        this.actions.special[name].extras.active = false;
      } else {
        this.conditions[name] = abil;
        this.actions.special[name].extras.active = true;
      }
    },
    abilShowMain(name, abil) { abil.extras.showMain = abil.extras.showMain ? false : true; },
    editAbility(abil) {
      console.log(abil);
      // TODO: set up like items, with new dialog?
      this.$message({ message: "NOT YET IMPLEMENTED", type: "warning" });
    },

    // MAGIC METHODS

    // EDIT METHODS

    rest() {
      console.log('REST UP: HP, SPELLS');
    },

    saveMonster() {
      console.log(this);
    }

  }
}
</script>

<style lang="css" scoped>
.stat-controls .el-input-number {
  width: 70px;
}
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
</style>
