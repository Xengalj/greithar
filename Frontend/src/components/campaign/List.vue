<template>
  <div class="container">

    <el-row :gutter="10" justify="space-between" style="margin-bottom:20px">
      <el-col :xs="24" :span="12">
        <el-input v-model="campaignNameFilter" @input="searchByName" id="nameFilter" placeholder="Campaign Name" aria-label="Campaign Name Filter" style="margin-bottom:5px">
          <template #prepend>
            <g-icon iconSize="20px" iconName="search" />
          </template>
          <template #append>
            <el-button type="warning" @click="clearFilter"> Reset </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :offset="8" :span="3">
        <el-button @click="createCampaign" plain>
          <g-icon iconSize="24px" iconName="createScroll" style="margin-right: 5px;" /> New
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="campaigns"
      max-height="600"
      id="campaignTable"
      stripe
    >
      <el-table-column prop="name" label="Name" min-width="100" sortable />
      <el-table-column prop="user.username" label="User" sortable v-if="!userID" />

      <!--
      <el-table-column prop="characters" label="Characters" min-width="90" sortable>
        <template #default="scope">
          {{ scope }}
          <el-tag v-for="toon in scope" :key="toon.id">
            {{ toon.name }}
          </el-tag>
        </template>
      </el-table-column>
      -->

      <el-table-column label="Loot" width="55">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button @click="viewLoot(scope.row)" type="info" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="100" fixed="right">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">

            <el-button @click="editCampaign(scope.row.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>

            <el-popconfirm :title="`Delete ${scope.row.name}?`">
              <template #reference>
                <el-button type="danger" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button @click="deleteCampaign(scope.row.id, scope.$index)" type="danger" size="small"> Yes </el-button>
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

    <!-- {{ campaigns }} -->


    <!-- DRAWER -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header> <h4>{{ campaign.name }}</h4> </template>
      <template #default>

        <h4>
          <g-icon iconSize="32px" iconName="inventory" />
          Group Loot
          <el-tooltip v-if="campaign.loot_lock.username" placement="top" effect="light">
            <el-button type="warning" style="margin:0" circle>
              <g-icon iconSize="32px" iconColor="#000" iconName="lock" />
            </el-button>
            <template #content>
              <el-tag :color="campaign.loot_lock.color" size="small" effect="dark">
                {{ campaign.loot_lock.username }}
              </el-tag>
            </template>
          </el-tooltip>
        </h4>
        <g-loot :source="campaign.loot" @edit-loot="editLoot"/>

      </template>
    </el-drawer>

  </div>
</template>

<script>
import CampaignService from "@/services/campaign.service";
import GLoot from '@/components/template/GLoot.vue';

export default {
  name: "List Campaigns",
  components: { GLoot },
  computed: {
    currentUser() { return this.$store.state.auth.user; }
  },
  data() {
    return {
      loading: true,
      advanced: false,
      userID: this.$route.params.id, // user id

      // filters
      campaignNameFilter: "",

      // pagination
      currentPage: 1,
      pageSize: 10,
      totalCampaigns: 0,

      campaigns: [],

      // DRAWER
      drawer: false,
      campaign: {},

    }
  },

  mounted() {
    if (!this.currentUser.roles.includes("admin")) {
      this.userID = this.currentUser.id;
    }
    this.loadCampaigns();
  },

  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    loadCampaigns() {
      let offset = this.pageSize * (this.currentPage-1);
      CampaignService.getCampaignList(this.userID, offset, this.pageSize)
      .then(response => {
        let tmp = JSON.parse(response.campaigns);
        this.totalCampaigns = tmp.count;
        this.campaigns = tmp.rows;
        this.loading = false;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    createCampaign() {
      CampaignService.createCampaign()
      .then(response => {
        // console.log(response);
        let id = response.campaign.id;
        this.$router.push({ name: 'campaign-edit', params: { id: id } });
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err.message); });
    },
    // viewCampaign(id) { this.$router.push({ name: 'campaign-view', params: { id: id } }); },
    editCampaign(id) { this.$router.push({ name: 'campaign-edit', params: { id: id } }); },
    deleteCampaign(id, rowIndex) {
      console.log('deleteCampaign', id);
      console.log(rowIndex);
      CampaignService.deleteCampaign(id)
      .then(response => { this.$message({ message: response, type: 'warning' }); this.campaigns.splice(rowIndex, 1); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    viewLoot(campaign) {
      this.campaign = campaign;
      this.drawer = true;
    },
    editLoot() {
      if (!this.campaign.loot_lock.id) {
       this.$router.push({ name: 'campaign-loot', params: { id: this.campaign.id } });
      }
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
    clearFilter() { this.charNameFilter = ""; this.searchByName(""); }

  }
};
</script>
<style media="screen">
.char-pager {
  margin-top: 10px;
}
.char-pager .el-pagination button .el-icon {
  display: flex;
}
</style>
