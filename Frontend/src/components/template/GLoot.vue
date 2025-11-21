<template>
  <div v-if="!loading" class="container">

    [SEARCH]  [reset]  [edit] // pop up for lock status
    <el-row :gutter="10" justify="space-between">
      <el-col :xs="24" :sm="20">
        <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search">
          <template #prefix>
            <g-icon iconSize="20px" iconName="search" />
          </template>
          <template #append>
            <el-button type="warning" @click="itemFilter = ''"> Reset </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="4">
        <el-button @click="editLoot()" type="primary" style="margin:0" circle>
          <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
        </el-button>
      </el-col>
    </el-row>

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
  </div>
</template>

<script>
import CampaignServerice from "@/services/campaign.service";

export default {
  name: "g-loot",
  // components: { HexGraph, GItem, GAbility },
  props: {
    source: { type: Object }
  },
  data() {
    return {
      loading: true,
      itemFilter: '',
    }
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
    loot() { return this.source; }
  },
  mounted() {},
  watch: {
    // Loot search part 1
    itemFilter(val) { this.$refs.tree.filter(val); }
  },
  methods: {
    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },

    // Loot search part 2
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    editLoot() {
      console.log('edit loot');
      CampaignService.getLock(this.currentUser.id)
      .then((response) => {
        console.log(response);
        if (response.lootLock.id == 0) {
          // router push edit
          // this.$router.push({ name: 'loot-edit', params: { id: id } });
        } else {
          this.$message({ message: `${response.lootLock.username} is editing the loot`, type: 'warning' });
        }
      })
      .catch(err => { this.$message({ message: err, type: 'error' }); console.error(err); })
    },
    

  }
};
</script>
