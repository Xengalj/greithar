<template>
  <el-row :gutter="10" justify="space-between">
    <el-col :span="20">
      <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search">
        <template #prefix>
          <g-icon iconSize="20px" iconName="search" />
        </template>
        <template #append>
          <el-button type="warning" @click="itemFilter = ''"> Reset </el-button>
        </template>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button @click="editLoot()" type="primary" style="margin:0" circle>
        <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
      </el-button>
    </el-col>
  </el-row>

  <el-tree
    :data="loot"
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
        <el-tag v-if="data.value && data.value.Ammount" type="info" effect="dark">
          x {{ data.value.Ammount }}
        </el-tag>
      </el-col>
    </template>
  </el-tree>
</template>

<script>
export default {
  name: "g-loot",
  emits: ['edit-loot'],
  props: {
    source: { type: Object }
  },
  data() {
    return {
      itemFilter: '',
    }
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; },
    loot() { return this.source; }
  },
  watch: {
    // Loot search part 1
    itemFilter(val) { this.$refs.tree.filter(val); }
  },
  methods: {
    // Loot search part 2
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    editLoot() { this.$emit('edit-loot', this.loot); },
  }
};
</script>
