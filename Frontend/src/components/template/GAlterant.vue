<template>
  <h3>
    <el-row :gutter="10" justify="space-between" align="middle">
      {{ alterant.label }}
      <el-switch v-model="advanced" inline-prompt active-text="Advanced" inactive-text="Normal" aria-label="Advanced Mode Switch" />
    </el-row>
  </h3>

  <div v-if="alterant.value">
    <!-- Label, Description, & Notes -->
    <el-row :gutter="10" style="margin-bottom:10px;">
      <el-col :xs="24" :sm="12">
        <el-input v-model="alterant.label" aria-label="Name Field" style="margin-bottom:5px;">
          <template #prepend> Name </template>
        </el-input>
        <el-input type="textarea" v-model="alterant.value.description" :autosize="{ minRows: 1, maxRows: 4 }" placeholder="Enter description"  style="margin-bottom:5px;" />
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-row :gutter="10" justify="space-evenly" style="margin-bottom:5px;">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Notes </el-tag>
          <el-button @click="alterant.value.notes.push('');" type="success" >
            <g-icon iconSize="16px" iconColor="#FFF" iconName="createScroll" />
          </el-button>
        </el-row>
        <el-row v-for="(note, index) in alterant.value.notes" :key="index" :gutter="10" style="margin-bottom:5px;">
          <el-col :span="22">
            <el-input type="textarea" v-model="alterant.value.notes[index]" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`${alterant.label} note #${index}`" />
          </el-col>
          <el-col :span="2">
            <el-popconfirm title="Are you sure to delete this?">
              <template #reference>
                <el-button type="danger" circle size="small">
                  <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="alterant.value.notes.splice(index, 1);"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="10" justify="space-evenly" style="margin-bottom:5px;">
      <!-- [ADD BONUSES] -->
      <el-popconfirm v-if="!alterant.value.bonuses" title="Add bonuses section?" @confirm="addBonuses" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Bonuses </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [ADD DAMAGE] -->
      <el-popconfirm v-if="!alterant.value.damage" title="Add damage section?" @confirm="addDamage" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Damage </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [ON MAIN] -->
      <el-popconfirm v-if="!alterant.value.onMain" title="Add 'on main tab' section?" @confirm="addOnMain" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add 'On Main' </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [USES] -->
      <el-popconfirm v-if="!alterant.value.uses" title="Add uses section?" @confirm="addUses" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Uses </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [DURATION] -->
      <el-popconfirm v-if="!alterant.value.duration" title="Add duration section?" @confirm="addDuration" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Duration </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [RANGE] -->
      <el-popconfirm v-if="!alterant.value.range" title="Add range section?" @confirm="addRange" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Range </el-button> </template>
        <template #actions="{ confirm }"> <el-button size="small" type="primary" @click="confirm"> Yes </el-button> </template>
      </el-popconfirm>
      <!-- [ADD PROPERTY] -->
      <el-popconfirm title="Add New Property?" @confirm="addProperty" hide-icon>
        <template #reference> <el-button size="small" type="success" style="margin-bottom:5px"> Add Property </el-button> </template>
        <template #actions="{ confirm }">
          <el-input v-model="propName" size="small" placeholder="Property Name" />
          <el-button size="small" type="primary" @click="confirm" :disabled="propName == ''"> Yes </el-button>
        </template>
      </el-popconfirm>
      <el-tooltip placement="top" effect="light">
        <el-tag type="warning" style="font-size:14px;"> Property Options </el-tag>
        <template #content>
          Here are some built in options for properties:
          <el-tag v-for="prop in propsList" :key="prop" size="small" type="info"> {{ prop }} </el-tag>
        </template>
      </el-tooltip>
    </el-row>

    <!-- Properties -->
    <el-divider> Properties </el-divider>
    <div v-for="(value, prop) in alterant.value" :key="prop" style="margin-bottom:5px">
    <div v-if="!skipProperties.includes(prop)">

      <el-row :gutter="5" justify="center">
        <el-col :xs="10" :sm="4" :md="3" align="right">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> {{ capFirsts(prop) }} </el-tag>
        </el-col>

        <el-col :span="12">
          <el-switch v-if="value === true || value === false"
          v-model="alterant.value[prop]" active-text="True" inactive-text="False" inline-prompt />

          <el-select v-else-if="Object.keys(selects).includes(prop)"
          v-model="alterant.value[prop]" :aria-label="`Alterant ${prop}`">
            <template #tag>
              <el-tag v-for="(element, index) in alterant.value[prop]" effect="dark" :key="element" closable @close="alterant.value[prop].splice(index, 1)"> {{ element }} </el-tag>
            </template>
            <el-option v-for="element in selects[prop]" :key="element.label" :label="element.label" :value="element.value" >
              <div class="flex items-center">
                <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: element.color }"> {{ element.label }} </span>
              </div>
            </el-option>
          </el-select>

          <el-select v-else-if="Object.keys(multiSelects).includes(prop)"
          v-model="alterant.value[prop]" :aria-label="`Alterant ${prop}`" multiple>
            <template #tag>
              <el-tag v-for="(element, index) in alterant.value[prop]" effect="dark" :key="element" closable @close="alterant.value[prop].splice(index, 1)"> {{ element }} </el-tag>
            </template>
            <el-option v-for="element in multiSelects[prop]" :key="element.label" :label="element.label" :value="element.value" >
              <div class="flex items-center">
                <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: element.color }"> {{ element.label }} </span>
              </div>
            </el-option>
          </el-select>

          <span v-else>
            <el-input v-model="alterant.value[prop]" :aria-label="`Alterant ${prop}`" />
          </span>
        </el-col>

        <el-col :span="2">
          <el-button @click="deleteProperty(prop)" circle>
            <g-icon iconSize="16px" iconColor="#f56c6c" iconName="trash" />
          </el-button>
        </el-col>

      </el-row>
    </div>
    </div>

    <!-- Numbers -->
    <el-row :gutter="5" justify="center">
      <el-col :xs="8" :sm="3" :md="2" v-if="alterant.value.cost != null" align="right">
        <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Cost </el-tag>
      </el-col>
      <el-col :xs="14" :sm="6" :md="4" v-if="alterant.value.cost != null">
        <el-input-number v-model="alterant.value.cost" :precision="2" aria-label="Alterant Cost">
          <template #suffix> gp </template>
        </el-input-number>
      </el-col>
      <el-col :xs="8" :sm="3" :md="2" v-if="alterant.value.weight != null" align="right">
        <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Weight </el-tag>
      </el-col>
      <el-col :xs="14" :sm="6" :md="4" v-if="alterant.value.weight != null">
        <el-input-number v-model="alterant.value.weight" :precision="2" aria-label="Alterant Weight">
          <template #suffix> lbs </template>
        </el-input-number>
      </el-col>
      <!-- Tablet formatting help -->
      <el-col :xs="0" :sm="24" :md="0" v-if="alterant.value.cost != null && alterant.value.weight != null && alterant.value.amount != null" />
      <el-col :xs="8" :sm="3" :md="2" v-if="alterant.value.amount != null" align="right">
        <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Amount </el-tag>
      </el-col>
      <el-col :xs="14" :sm="6" :md="4" v-if="alterant.value.amount != null">
        <el-input-number v-model="alterant.value.amount" :min="0" aria-label="Alterant Amount" />
      </el-col>
    </el-row>

    <!-- Damage -->
    <div v-if="alterant.value.damage">
      <el-divider> Damage </el-divider>
      <el-row :gutter="10" justify="center">
        <el-col :xs="20" :sm="8" v-for="(value, name) in alterant.value.damage" :key="name">
          <el-input v-model="alterant.value.damage[name]" :aria-label="`${capFirsts(name)} Damage`" style="margin-bottom:5px;" >
            <template #prepend> {{ capFirsts(name) }} </template>
            <template #append v-if="name=='fine'">
              <el-tooltip placement="top" effect="light">
                <el-button @click=" for (let k of Object.keys(alterant.value.damage)) { alterant.value.damage[k]=value; } " type="info"> Copy </el-button>
                <template #content> Copy this damage die to all sizes </template>
              </el-tooltip>
            </template>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-select v-model="alterant.value['damage type']" aria-label="Damage Type" multiple>
            <template #tag>
              <el-tag v-for="(element, index) in alterant.value['damage type']" effect="dark" :key="element" closable @close="alterant.value[prop].splice(index, 1)"> {{ element }} </el-tag>
            </template>
            <el-option v-for="element in multiSelects['damage type']" :key="element.label" :label="element.label" :value="element.value" >
              <div class="flex items-center">
                <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: element.color }"> {{ element.label }} </span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- On Main -->
    <div v-if="alterant.value.onMain">
      <el-divider> Display on Main Tab </el-divider>
      <el-row :gutter="10" justify="center">
        <el-col :xs="24" :sm="24" :md="4" align="center">
          <el-switch v-model="alterant.value.onMain.showMain"
          active-text="Show on Main Tab" inactive-text="Only Details Tab" inline-prompt />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-input v-model="alterant.value.onMain.shortText" placeholder="Text on Main Tab">
            <template #prepend> Short Text </template>
          </el-input>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-row>
            <el-col :xs="7" :sm="6" :md="5">
              <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Location </el-tag>
            </el-col>
            <el-col :xs="17" :sm="18" :md="18">
              <el-select v-model="alterant.value.onMain.location" :aria-label="`Alterant onMain location`">
                <template #tag>
                  <el-tag effect="dark"> {{ alterant.value.onMain.location }} </el-tag>
                </template>
                <el-option v-for="element in selects.onMainLocation" :key="element.label" :label="element.label" :value="element.value" >
                  <div class="flex items-center">
                    <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                    <span :style="{ color: element.color }"> {{ element.label }} </span>
                  </div>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- Uses -->
    <div v-if="alterant.value.uses">
      <el-divider> Uses </el-divider>
      <el-row :gutter="10" justify="center">
        <el-col :xs="0" :sm="8" :md="8" align="center"> Label </el-col>
        <el-col :xs="0" :sm="6" :md="4" align="center"> Left </el-col>
        <el-col :xs="0" :sm="6" :md="4" align="center"> Total </el-col>
        <el-col :xs="0" :sm="2" :md="1" align="center"> Color </el-col>
      </el-row>
      <el-row :gutter="10" justify="center">
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Label </el-tag> </el-col>
        <el-col :xs="14" :sm="8" :md="8">
          <el-input v-model="alterant.value.uses.label" aria-label="Uses Label" />
        </el-col>
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Left </el-tag> </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-input-number v-model="alterant.value.uses.left" aria-label="Uses Left" />
        </el-col>
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Total </el-tag> </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-input-number v-model="alterant.value.uses.total" aria-label="Total Uses"/>
        </el-col>
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Color </el-tag> </el-col>
        <el-col :xs="14" :sm="2" :md="1" align="center">
          <el-color-picker v-model="alterant.value.uses.color" :predefine="[ '#4167F0', '#FFDE0A', '#E63415', '#bfef45', '#ADD8E6', '#42d4f4', '#E63415', '#911eb4', '#f032e6', '#71797E' ]"  aria-label="Ablity Uses Color" />
        </el-col>
      </el-row>
    </div>

    <!-- Duration -->
    <div v-if="alterant.value.duration">
      <el-divider> Duration </el-divider>
      <el-row :gutter="10" justify="center">
        <el-col :xs="0" :sm="8" :md="8" align="center"> Label </el-col>
        <el-col :xs="0" :sm="6" :md="4" align="center"> Left </el-col>
        <el-col :xs="0" :sm="6" :md="4" align="center"> Total </el-col>
      </el-row>
      <el-row :gutter="10" justify="center">
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Label </el-tag> </el-col>
        <el-col :xs="14" :sm="8" :md="8">
          <el-input v-model="alterant.value.duration.label" aria-label="Uses Label" />
        </el-col>
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Left </el-tag> </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-input-number v-model="alterant.value.duration.left" aria-label="Uses Left" />
        </el-col>
        <el-col :xs="6" :sm="0" align="right"> <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Total </el-tag> </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-input-number v-model="alterant.value.duration.total" aria-label="Total Uses"/>
        </el-col>
      </el-row>
    </div>

    <!-- Range -->
    <div v-if="alterant.value.range">
      <el-divider> Range </el-divider>
      <el-row :gutter="10" justify="center">
        <el-col :xs="8" :sm="3" :md="2" align="right">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Distance </el-tag>
        </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-input-number v-model="alterant.value.range.distance" aria-label="Alterant Range Distance">
            <template #suffix> ft </template>
          </el-input-number>
        </el-col>
        <el-col :xs="8" :sm="3" :md="2" align="right">
          <el-tag size="large" type="info" color="#262727" style="font-size:14px;"> Shape </el-tag>
        </el-col>
        <el-col :xs="14" :sm="6" :md="4">
          <el-select  v-model="alterant.value.range.shape" aria-label="Alterant Range Shape">
            <template #tag>
              <el-tag effect="dark"> {{ alterant.value.range.shape }} </el-tag>
            </template>
            <el-option v-for="element in selects.rangeShapes" :key="element.label" :label="element.label" :value="element.value" >
              <div class="flex items-center">
                <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: element.color }"> {{ element.label }} </span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- Magic -->
    <div v-if="alterant.value.magic">
      <el-divider> Magic  Item </el-divider>
      <el-row :gutter="10" justify="center" align="middle">
        <el-col :xs="24" :sm="12" :md="8">
          <el-row>
            <el-col :xs="10" :sm="8" :md="8">
              <el-tag size="large" type="info" color="#262727" style="font-size:14px; margin-bottom:5px;"> Enhancement </el-tag>
            </el-col>
            <el-col :xs="12" :sm="11" :md="11">
              <el-input-number v-model="alterant.value.range.distance" :min="0" :max="5" aria-label="Magic Enhancement" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :md="16">
          <el-row justify="center">
            <el-col :xs="8" :sm="6" :md="3">
              <el-tag size="large" type="info" color="#262727" style="font-size:14px; margin-bottom:5px;"> Qualities </el-tag>
            </el-col>
            <el-col :xs="6" :sm="5" :md="3">
              <el-button @click="this.alterant.value.magic.qualities.push( {} )" type="success">
                <g-icon iconSize="16px" iconColor="#FFF" iconName="createScroll" />
              </el-button>
            </el-col>
            <!-- [Name]        [+] / [dmg die] [type] -->
            <el-col :span="24">
              <el-row v-for="(quality, index) in alterant.value.magic.qualities" :key="index" :gutter="10" justify="center" style="margin-bottom:5px">
                <el-col :xs="24" :sm="8" :md="10">
                  <el-input v-model="alterant.value.magic.qualities[index].label" placeholder="Quality Name" aria-label="Mqgic Quality Name" />
                </el-col>
                <el-col :xs="14" :sm="9" :md="14" v-if="quality.die == null">
                  <el-button @click="quality.die=''; quality.type='';" type="success"> Add Damage </el-button>
                </el-col>
                <el-col :xs="12" :sm="8" :md="6" v-if="quality.die != null">
                  <el-input v-model="quality.die" placeholder="Damage Die" aria-label="Damage Die" />
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" v-if="quality.die != null">
                  <el-select v-model="quality.type" placeholder="Damage Type" aria-label="Damage Type">
                    <el-option v-for="element in multiSelects['damage type']" :key="element.label" :label="element.label" :value="element.value" >
                      <div class="flex items-center">
                        <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                        <span :style="{ color: element.color }"> {{ element.label }} </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <!-- Bonuses -->
    <div v-if="alterant.value.bonuses">
      <el-divider> Bonuses </el-divider>
      <el-row :gutter="10">
        <el-col :xs="0" :sm="6"> Name </el-col>
        <el-col :xs="0" :sm="5"> Value </el-col>
        <el-col :xs="0" :sm="5"> Type </el-col>
        <el-col :xs="0" :sm="4"> Targets </el-col>
        <el-col :xs="24" :sm="3" :md="4" class="center-horz">
          <el-button size="small" type="success" @click="addBonus()"> Add Bonus </el-button>
        </el-col>
        <el-col :xs="24" :span="0"> &nbsp; </el-col>
      </el-row>
      <el-row v-for="(bonus, name) in alterant.value.bonuses" :key="name" :gutter="10" align="middle" style="margin-bottom:5px">
        <el-col :xs="20" :sm="6" style="margin-bottom:5px">
          <el-tag size="large" type="primary" effect="dark"> {{ name }} </el-tag>
        </el-col>
        <el-col :xs="3" :sm="0">
          <el-popconfirm title="Are you sure to delete this?">
            <template #reference>
              <el-button type="danger" circle size="small">
                <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
              </el-button>
            </template>
            <template #actions="">
              <el-button type="danger" size="small" @click="delete alterant.value.bonuses[name];"> Yes </el-button>
            </template>
          </el-popconfirm>
        </el-col>
        <el-col :xs="6" :sm="0" align="right" style="margin-bottom:5px"> <el-tag size="large" type="info" style="font-size:14px;"> Value </el-tag> </el-col>
        <el-col :xs="14" :sm="5"> <el-input-number v-model="bonus.value" size="small" /> </el-col>
        <el-col :xs="6" :sm="0" align="right" style="margin-bottom:5px"> <el-tag size="large" type="info" style="font-size:14px;"> Type </el-tag> </el-col>
        <el-col :xs="14" :sm="5">
          <el-select v-model="bonus.type" size="small" filterable allow-create default-first-option :reserve-keyword="false" placeholder="Bonus Type" >
            <el-option v-for="type in selects.bonusTypes" :key="type" :label="type" :value="type" />
          </el-select>
        </el-col>
        <el-col :xs="24" :span="6">
          <el-select v-model="bonus.targets" value-key="name" multiple filterable  allow-create default-first-option :reserve-keyword="false" placeholder="Modifier Target" >
            <template #tag>
              <el-tag v-for="(target, index) in bonus.targets" :key="target" effect="dark" closable @close="bonus.targets.splice(index, 1)"> {{ target }} </el-tag>
            </template>
            <el-option v-for="item in multiSelects.targets" :key="item.label" :label="item.label" :value="item.value" >
              <div class="flex items-center">
                <el-tag :color="item.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: item.color }"> {{ item.label }} </span>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="0" :span="1" class="center-horz center-vert">
          <el-popconfirm title="Are you sure to delete this?">
            <template #reference>
              <el-button type="danger" circle size="small">
                <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
              </el-button>
            </template>
            <template #actions="">
              <el-button type="danger" size="small" @click="delete alterant.value.bonuses[name];"> Yes </el-button>
            </template>
          </el-popconfirm>
        </el-col>
      </el-row>
    </div>

    <!-- Advanced -->
    <div v-if="advanced">
      <el-divider>Advanced</el-divider>
      <el-row v-if="alterant.value.ability" :gutter="10" justify="center" style="margin-bottom:5px">
        <el-col :xs="12" :sm="5" :md="3">
          <el-tag size="large" type="info" style="font-size:14px;"> Ability Category </el-tag>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12">
          <el-select v-model="alterant.value.ability.category" aria-label="Ability Category">
            <template #tag>
              <el-tag effect="dark"> {{ alterant.value.range.shape }} </el-tag>
            </template>
            <el-option v-for="element in selects.abilityTypes" :key="element.label" :label="element.label" :value="element.value" >
              <div class="flex items-center">
                <el-tag :color="element.color" style="margin-right: 8px" size="small" />
                <span :style="{ color: element.color }"> {{ element.label }} </span>
              </div>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4">
          <el-input v-model="alterant.value.ability.id" aria-label="Ability ID" disabled>
            <template #prepend> Ability ID </template>
          </el-input>
        </el-col>
      </el-row>
      <el-divider style="width=75%"> Object Code  </el-divider>
      <div v-for="(item, name) in alterant.value" :key="name">
        {{ name }} : {{ item }}
      </div>
    </div>

    <el-row :gutter="10" justify="space-around">
      <el-button @click="reset()" type="warning"> Reset </el-button>
      <el-button @click="save()" type="primary"> Save </el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'g-alterant',
  emits: ['save'],
  props: { source: { type: Object } },
  data() {
    return {
      alterant: {},
      original: {},
      advanced: this.$store.state.auth.user.roles.includes('admin'),

      selects: {
        "bonusTypes": [],
        "trigger": [],
        "onMainLocation": [],
        "abilityTypes": [],
        "proficiency": [],
        "rangeShapes": []
      },
      multiSelects: {
        "targets": [],
        "damage type": [],
        "group": []
      },
      skipProperties: [
        'description', 'notes', 'bonuses',
        'ability', 'item', 'condition',

        'onMain', 'uses', 'duration', 'range',

        'cost', 'weight', 'amount',
        'damage', 'damage type',
        'magic'
      ],
      propsList: [ "trigger", "active", "cost", "weight", "amount", "masterwork", "proficiency", "category", "group", "critical", "range", "noDexAC" ],

      newBonusName: "",
      propName: '',
    }
  },
  mounted() {
    console.log(this.rules);

    this.selects.bonusTypes = Object.keys(this.rules.bonuses);
    this.selects.bonusTypes.push( "Untyped" );
    this.selects.trigger = this.rules.triggers;
    this.selects.onMainLocation = this.rules.onMainLocations;
    this.selects.abilityTypes = this.rules.abilityTypes;
    this.selects.proficiency = this.rules.Proficiencies;
    this.selects.rangeShapes = this.rules.rangeShapes;

    this.multiSelects.targets = this.rules.targets;
    this.multiSelects['damage type'] = this.multiSelects["damage type"].concat(this.rules["Damage Types"].Weapon);
    this.multiSelects['damage type'] = this.multiSelects["damage type"].concat(this.rules["Damage Types"].Energy);
    this.multiSelects['damage type'] = this.multiSelects["damage type"].concat(this.rules["Damage Types"].Aligned);
    this.multiSelects['damage type'] = this.multiSelects["damage type"].concat(this.rules["Damage Types"].Misc);
    this.multiSelects['damage type'] = this.multiSelects["damage type"].concat(this.rules["Damage Types"].Substance);
    this.multiSelects['group'] = this.rules["Weapon Groups"];

    this.alterant = this.source;
    this.original = JSON.stringify(this.source);
    console.log('Alterant', this.alterant);
  },
  updated() {
    if (this.source.label != this.alterant.label) {
      this.alterant = this.source;
      this.original = JSON.stringify(this.source);
    }
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
  },
  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    addBonuses() { if (!this.alterant.value.bonuses) { this.alterant.value.bonuses = {}; } },
    addBonus() {
      // make new bonus object with label = `ability name & length + 1`
      this.alterant.value.bonuses[this.alterant.label.concat(" ", Object.keys(this.alterant.value.bonuses).length+1)] = {
        value: 0, type: "Untyped", targets: []
      };
    },
    addDamage() {
      this.alterant.value.damage = {'fine':'0','diminuitive':'1','tiny':'1d2','small':'1d3','medium':'1d4','large':'1d6','huge':'1d8','gargantuan':'2d6','colossal':'3d6'};
      this.alterant.value["damage type"] = [ "Piercing" ];
    },
    addOnMain() { this.alterant.value.onMain = { showMain: false, shortText: "", location: "actions" }; },
    addUses() { this.alterant.value.uses = { label: "Uses", color: "#FFDE0A", left: 4, total: 4 }; },
    addDuration() { this.alterant.value.duration = { label: "rounds", total: 4, left: 3 }; },
    addRange() { this.alterant.value.range = { distance: 0, shape: "" }; },
    addProperty() {
      if (this.alterant.value[this.propName] == null) {
        this.alterant.value[this.propName] = '';
      } else {
        this.$message({ message: "Property already exists", type: "warning" });
      }
      this.propName = '';
    },

    save() { this.$emit('save'); },
    reset() {
      this.alterant = {};
      let old = JSON.parse(this.original);
      for (let [prop, value] of Object.entries(old)) {
        this.alterant[prop] = value;
      }
      this.$message({ message: "Changes Discarded", type: "warning" });
    }
  }
}
</script>
