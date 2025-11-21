<template>
  <div v-if="!loading" class="container">


<!--


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

 -->

    <!-- Edit Item Dialog -->
    <el-dialog v-model="editingItem" width="750">
      <g-item :source="item" @save-item="saveItem"/>
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
import GItem from '@/components/template/GItem.vue';

export default {
  name: "Edit Group Loot",
  components: { GItem },
  data() {
    return {
      loading: true,

      editingItem: false,
      item: {},
      itemFilter: "",

    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },

  },
  mounted() {
    if (!this.rules) { this.$router.push("/"); }


    // get lock,
        // if no id, set {id: toon_id, name:username}
        // edit
        // on save, release lock & nav to view toon
    // if locked, go to view toon




    // CharacterService.getCharacter(this.$route.params.id)
    // .then((response) => {
    //   console.log('response', response);
    //   this.character = response.character;
    //   document.getElementsByClassName('title')[0].innerHTML = this.character.name;
    //   this.spellTabs = Object.keys(this.character.spells)[0];
    //
    //   this.loading = false;
    // })
    // .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })

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

    // saveCharacter() {
    //   console.log(this.character);
    //
    //   CharacterService.updateCharacter(this.character)
    //   .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
    //   .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    // },


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

  }
};
</script>
