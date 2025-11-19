<template lang="html">
  <div v-if="!loading" class="container">

    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="12">
        <el-divider >
          <g-icon iconSize="32px" iconName="map" />
        </el-divider>

        <el-input v-model="campaign.name" @input="onChangeEvent" aria-label="inputName">
          <template #prepend>
            Title
          </template>
        </el-input>

        <br>
        <!-- Characters -->
        [Characters]
        [toon.name] ^[user]   // both in fave color

      </el-col>

      <!-- Notes -->
      <el-col :xs="24" :sm="12" class="center-horz">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="openScroll" /> Notes </h4>
        </el-divider>
        <el-input
          v-for="(note, index) in campaign.notes" :key="index"
          v-model="campaign.notes[index]"
          :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea"
          aria-label="textAreaName" />
        <el-button @click="campaign.notes.push('')" size="large" type="primary">
          Add Note
          <g-icon iconName="createScroll" iconSize="24px" iconColor="#CCC" />
        </el-button>
      </el-col>
    </el-row>
    <br>

    <el-row :gutter="10" justify="center" align="middle">
      <!-- Group Loot -->
      <el-col :xs="24" :sm="12">
        <el-divider >
          <h4> <g-icon iconSize="32px" iconName="inventory" /> Group Loot </h4>
        </el-divider>

        <el-row :gutter="10" justify="space-between">
          <el-col :xs="24" :sm="20">
            <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search">
              <template #prefix>
                <g-icon iconSize="20px" iconName="search" />
              </template>
              <template #append>
                <el-button type="warning" @click="clearFilter"> Reset </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="4">
            <el-button @click="viewLoot()" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button @click="editLoot()" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
          </el-col>
        </el-row>


        <!--
        draggable
        render-after-expand
        :default-expanded-keys="character.settings.expandInventory"
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        -->
        <el-tree
          :data="campaign.loot"
          ref="tree"
          node-key="label"
          :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-col :span="2" style="text-align: center; margin-right:2px;">
              <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
              <span v-else> • </span>
            </el-col>
            <el-col :sm="9" :md="7">
              {{ node.label }}
            </el-col>
            <el-col :sm="3" :md="3">
              <el-tag v-if="data.value" color="#FFDE0A" style="color:black; border:none;">
                {{ data.value.Cost }} gp
              </el-tag>
            </el-col>
            <el-col :sm="2" :md="3">
              <el-tag v-if="data.value" type="info" effect="dark">
                {{ data.value.Weight }} lbs.
              </el-tag>
            </el-col>
            <el-col :sm="5" :md="3">
              <el-tag v-if="data.value" type="info" effect="dark">
                x 1
              </el-tag>
              <el-tag v-if="data.value && data.value.Ammount" type="info" effect="dark">
                x {{ data.value.Ammount }}
              </el-tag>
            </el-col>
          </template>
        </el-tree>
      </el-col>

      <el-col :xs="24" :sm="12">
        <!-- Encounters -->
        <el-divider>
          <h4> <g-icon iconSize="32px" iconName="weapons" /> Encounters </h4>
        </el-divider>

        <el-row :gutter="10" justify="space-between">
          <el-col :xs="24" :span="14">
            <el-input v-model="encounterNameFilter" @input="searchByName" id="nameFilter" placeholder="Encounter Name" aria-label="Encounter Name Filter">
              <template #prefix>
                <g-icon iconSize="20px" iconName="search" />
              </template>
              <template #append>
                <el-button type="warning" @click="clearFilter"> Reset </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button @click="createEncounter" plain>
              Add Encounter
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="campaign.encounters"
          max-height="600"
          id="encounterTable"
          stripe
        >
          <el-table-column prop="id" label="Id" sortable />
          <el-table-column v-if="extras && extras.name" prop="extras.name" label="Name" min-width="100" sortable />

          <!--
          <el-table-column prop="npcs" label="NPCs" min-width="90" sortable>
            <template #default="scope">
              {{ scope }}
              <el-tag v-for="toon in scope" :key="toon.id">
                {{ toon.name }}
              </el-tag>
            </template>
          </el-table-column>
          -->

          <!--
          <el-table-column prop="monsters" label="Monsters" min-width="90" sortable>
            <template #default="scope">
              {{ scope }}
              <el-tag v-for="toon in scope" :key="toon.id">
                {{ toon.name }}
              </el-tag>
            </template>
          </el-table-column>
          -->

          <!-- <el-table-column label="Notes" width="100">
            <template #default="scope">
              <el-row class="row-bg" justify="space-between">

              extras . name?
              extras . prevEncounter : id #
              extras . nextEncounter : id #

                <el-button @click="viewLoot(scope.row.id)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>

              </el-row>
            </template>
          </el-table-column> -->


          <el-table-column label="Actions" width="100" fixed="right">
            <template #default="scope">
              <el-row class="row-bg" justify="space-between">

                <el-button @click="viewEncounter(scope.row.id)" type="info" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                </el-button>

                <el-button @click="editEncounter(scope.row.id)" type="primary" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
                </el-button>

                <el-popconfirm :title="`Delete Encounter?`">
                  <template #reference>
                    <el-button type="danger" style="margin:0" circle>
                      <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                    </el-button>
                  </template>
                  <template #actions="">
                    <el-button @click="deleteEncounter(scope.row.id, scope.$index)" type="danger" size="small"> Yes </el-button>
                  </template>
                </el-popconfirm>

              </el-row>
             </template>
           </el-table-column>
        </el-table>

        <el-row justify="center" class="char-pager">
          <el-col :xs="19" :span="0">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :background="true"
              layout="prev, pager, next, total"
              :total="totalCampaigns"
              @current-change="loadCampaigns"
              @size-change="loadCampaigns"
              hide-on-single-page
            />
          </el-col>
          <el-col :xs="0"  :span="11">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 25, 50, 100]"
              :background="true"
              layout="sizes, prev, pager, next, jumper, total"
              :total="totalCampaigns"
              @current-change="loadCampaigns"
              @size-change="loadCampaigns"
              hide-on-single-page
            />
          </el-col>
        </el-row>






      </el-col>

    </el-row>





    [loot]
    [encounters]


    <br>
    <br>
    <div v-for="(item, name) in campaign" :key="name">
      {{ name }} : {{ item }}
      <br>
    </div>

    <!-- EDIT ITEM DIALOG -->
    <!-- <el-dialog v-model="editingItem" width="800">
      <g-item :source="item" @save-item="saveItem"/>
    </el-dialog> -->

  </div>
</template>

<script>
import CampaignService from "@/services/campaign.service";

export default {
  name: "Edit Encounter",
  data() {
    return {
      loading: true,
      itemFilter: '',

      campaign: {},
    };
  },
  computed: {
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
  },
  mounted() {
    if (!this.rules.size) { this.$router.push("/"); }

    if ( this.currentUser.roles.includes("storyteller") ) {
      // CampaignService.getAllUsers()
      // .then(response => { this.users = response.data.map((user) => { return {'username': user.username, 'id': user.id} } ); })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });

      CampaignService.getCampaign(this.$route.params.id)
      .then((response) => {
        console.log(response);
        this.campaign = response.campaign;

        // if (!this.character.user) { this.character.user = {} }
        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      // .finally(() => {
      //   // Put [Add Spell] btn in class spells tabs, wait til refs loaded
      //   const spellTabs = this.$refs.spellsTab.$el.querySelector('.el-tabs__nav-scroll');
      //   spellTabs.appendChild(this.$refs.addSpell.$el);
      // });
    }

  },

  watch: {
    // Loot Search, part 1
    itemFilter(val) { this.$refs.tree.filter(val); }
  },

  methods: {
    // Helper Methods
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    // saveCharacter() {
    //   CharacterService.updateCharacter(this.character)
    //   .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
    //   .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    // },
    viewLoot() {
      console.log('view');
    },
    editLoot() {
      console.log('edit');
    },

    /***************************\
    *                           *
    *          FILTERS          *
    *                           *
    \***************************/
    // HIDES non-matching rows (display: none)
    searchByName(filter) {
      let table, tr, td, i, txtValue;
      filter = filter.toUpperCase();
      table = document.getElementById("campaignTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    },
    clearFilter() { this.charNameFilter = ""; this.searchByName(""); },
    // Loot Search, part 2
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    /***************************\
    *                           *
    *         ENCOUNTERS        *
    *                           *
    \***************************/
    viewEncounter(id) { this.$router.push({ name: 'campaign-view', params: { id: id } }); },
    editEncounter(id) { this.$router.push({ name: 'campaign-edit', params: { id: id } }); },
    deleteEncounter(id, rowIndex) {
      console.log('deleteEncounter', id);
      console.log(rowIndex);
      // CampaignService.deleteCampaign(id)
      // .then(response => { this.$message({ message: response, type: 'warning' }); this.campaigns.splice(rowIndex, 1); })
      // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },


  }
}
</script>

<style lang="css" scoped>
</style>
