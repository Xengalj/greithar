<template>
  <div v-if="!loading" class="container">

    <div class="center-horz">
      <el-tag :color="lock.color" size="large" effect="dark">
        <g-icon iconSize="24px" iconName="lock" iconColor="#000" />
        Locked by {{ lock.username }} until {{ new Date(lock.releaseTime).getHours() }}:{{ new Date(lock.releaseTime).getMinutes() }}
      </el-tag>
    </div>
    <br><br>

    <!-- ACTIONS -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="10" :md="6" class="center-horz">
        <el-button type="success" @click="addItem">Add Item</el-button>
        <el-button type="success" @click="drawer=true">Add Horde</el-button>
      </el-col>
      <el-col :xs="24" :sm="10" :md="6" class="center-horz">
        <el-button type="primary" @click="saveCampaign"> Save Changes </el-button>
      </el-col>
      <el-col :xs="24" :sm="10" :md="6" class="center-horz">
        <el-button type="primary" @click="renewLock">Renew Lock</el-button>
        <el-button type="warning" @click="releaseLock">Release Lock</el-button>
      </el-col>
    </el-row>
    <br><br>

    <!-- TOTALS & COINS -->
    <el-row :gutter="10" justify="center" align="middle">
      <el-col :xs="24" :sm="6" :md="4" class="center-horz">
        <el-tag size="large" effect="dark" color="#FFDE0A" style="color:black; --el-tag-border-color: none;">
          <g-icon iconSize="24px" iconName="treasure" iconColor="#000" />
          {{ invTotal.value }} (gp) Total
        </el-tag>
        <el-tag size="large" effect="dark" :type="invTotal.color" style="color:black">
          <g-icon iconSize="24px" iconName="weight" iconColor="#000" />
          {{ invTotal.weight }} (lbs) Total
        </el-tag>
      </el-col>
      <el-col :xs="24" :span="9">
        <el-input v-model="campaign.extras.coins.pp" aria-label="Platinum Pieces Input" >
          <template #prepend> Platinum </template>
          <template #suffix> Coins </template>
          <template #append> {{ (campaign.extras.coins.pp / 50) }} lbs. </template>
        </el-input>
        <el-input v-model="campaign.extras.coins.gp" aria-label="Gold Pieces Input" >
          <template #prepend> Gold </template>
          <template #suffix> Coins </template>
          <template #append> {{ (campaign.extras.coins.gp / 50) }} lbs. </template>
        </el-input>
      </el-col>
      <el-col :xs="24" :span="9">
        <el-input v-model="campaign.extras.coins.sp" aria-label="Silver Pieces Input" >
          <template #prepend> Silver </template>
          <template #suffix> Coins </template>
          <template #append> {{ (campaign.extras.coins.sp / 50) }} lbs. </template>
        </el-input>
        <el-input v-model="campaign.extras.coins.cp" aria-label="Copper Pieces Input" >
          <template #prepend> Copper </template>
          <template #suffix> Coins </template>
          <template #append> {{ (campaign.extras.coins.cp / 50) }} lbs. </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- ITEMS -->
    <el-row :gutter="10" justify="center">
      <el-col :xs="24" :sm="12" :md="10">
        <el-input v-model="itemFilter" class="w-60 mb-2" placeholder="Item Search" aria-label="Item Search">
          <template #prefix>
            <g-icon iconSize="20px" iconName="search" />
          </template>
          <template #append>
            <el-button type="warning" @click="itemFilter = ''"> Reset </el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <el-row :gutter="10" justify="center">
      <el-col :span="24">
        <el-tree
          :data="campaign.loot"
          :filter-node-method="filterNode"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          ref="tree"
          node-key="label"
          draggable
          render-after-expand >
          <template #default="{ node, data }">

            <el-col :span="2" style="text-align: center; margin-right:2px;">
              <g-icon iconSize="20px" v-if="data.extras && data.extras.icon" :iconName="data.extras.icon" />
              <span v-else> • </span>
            </el-col>
            <el-col :xs="12" :sm="9" :md="7">
              {{ node.label }}
            </el-col>
            <el-col :xs="0" :sm="3" :md="2">
              <el-tag v-if="data.value" color="#FFDE0A" style="color:black; border:none;">
                {{ data.value.Cost }} gp
              </el-tag>
            </el-col>
            <el-col :xs="0" :sm="3" :md="2">
              <el-tag v-if="data.value" type="primary" effect="dark">
                {{ data.value.Weight }} lbs.
              </el-tag>
            </el-col>
            <el-col :xs="0" :sm="2" :md="2">
              <el-tag v-if="data.value && data.value.Amount" type="info" effect="dark">
                x {{ data.value.Amount }}
              </el-tag>
              <el-tag v-else type="info" effect="dark">
                x 1
              </el-tag>
            </el-col>
            <el-col :xs="0" :sm="0" :md="4">
              <div v-if="data.value && data.value.Extras && data.value.Extras.Notes && data.value.Extras.Notes.length">
                <el-input v-model="data.value.Extras.Notes[0]" disabled />
              </div>
            </el-col>
            <el-col :xs="5" :sm="2" :md="3">
              <!-- Edit Item (in modal component) -->
              <el-button type="info" circle size="small" @click="editItem(data)">
                <g-icon iconSize="16px" iconColor="#000" iconName="quill" />
              </el-button>

              <!-- Delete Item -->
              <el-popconfirm title="Are you sure to delete this?" hide-icon>
                <template #reference>
                  <el-button type="danger" circle size="small">
                    <g-icon iconSize="16px" iconColor="#000" iconName="trash" />
                  </el-button>
                </template>
                <template #actions="">
                  <el-button type="danger" size="small" @click="deleteItem(node, data)">Yes</el-button>
                </template>
              </el-popconfirm>

              <!-- Send to Toon -->
              <el-popconfirm title="Send to whom?" @confirm="sendToPlayer(node, data)" hide-icon :hide-after="2000">
                <template #reference>
                  <el-button type="warning" circle size="small">
                    <g-icon iconSize="16px" iconColor="#000" iconName="userAdd" />
                  </el-button>
                </template>
                <template #actions="{ confirm }">
                  <el-select v-model="transferToon" placeholder="Select" aria-label="Recipient Toon" style="margin-bottom:5px">
                    <el-option v-for="toon in campaign.characters" :key="toon.id" :label="capFirsts(toon.name)" :value="toon.id" />
                  </el-select>
                  <el-button type="success" size="small" @click="confirm">Send</el-button>
                </template>
              </el-popconfirm>
            </el-col>

          </template>
        </el-tree>
      </el-col>
    </el-row>


    <!-- Dialog -->
    <el-auto-resizer style="height: 10px">
      <template #default="{ width }">
        <el-dialog v-model="dialog" :width="width">
          <g-item v-if="showItem" :source="item" @save-item="saveItem"/>
        </el-dialog>
      </template>
    </el-auto-resizer>



    <!-- DRAWER -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header> <h4>Add Horde</h4> </template>
      <template #default>

        <el-collapse v-model="bulkAddCollapse">
          <el-collapse-item name="1">
            <template #title>
              <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="treasure" /> Coins </el-divider>
            </template>
            <el-input type="textarea" v-model="horde.coins" :autosize="{ minRows: 1, maxRows: 4 }" :aria-label="`Bulk Coins Input`" />
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="equipment" /> Itmes </el-divider>
            </template>

            <el-input type="textarea" v-model="horde.items" :autosize="{ minRows: 5, maxRows: 20 }" :aria-label="`Bulk Items Input`" />
          </el-collapse-item>
        </el-collapse>
      </template>
      <template #footer>
        <el-button @click="addHorde" size="large" type="success">
          Add Horde
        </el-button>
      </template>
    </el-drawer>

  </div>


  <div v-else>
    Someone else has locked this loot for editing. please wait until {{ new Date(lock.releaseTime) }}
    <br>

    <el-button @click="this.$router.back()" size="large" type="primary">
      Return
    </el-button>
  </div>


</template>

<script>
import CampaignService from "@/services/campaign.service";
import CharacterService from "@/services/character.service";
import GItem from '@/components/template/GItem.vue';

export default {
  name: "Edit Group Loot",
  components: { GItem },
  data() {
    return {
      loading: true,

      campaign: {},
      lock: {},
      loot: {},
      itemFilter: "",

      transferToon: '', // toon to send item to

      // Dialogs
      dialog: false,
      item: {},
      showItem: false,

      drawer: false,
      bulkAddCollapse: [ "1", "2" ],
      horde: { coins: "", items: "" },

    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    currentUser() { return this.$store.state.auth.user; },
    invTotal() {
      let invTotal = { "value": 0, "weight": 0 };
      // Coins
      invTotal.value += (this.campaign.extras.coins.pp * 10)
                        + (this.campaign.extras.coins.gp * 1)
                        + (this.campaign.extras.coins.sp * 0.1)
                        + (this.campaign.extras.coins.cp * 0.01);
      invTotal.weight += (this.campaign.extras.coins.pp / 50)
                        + (this.campaign.extras.coins.gp / 50)
                        + (this.campaign.extras.coins.sp / 50)
                        + (this.campaign.extras.coins.cp / 50);
      // Other Items
      this.recursiveInventory(this.loot, invTotal, false);
      return invTotal;
    },
  },
  mounted() {
    if (!this.rules) { this.$router.push("/"); }

    CampaignService.getCampaign(this.$route.params.id)
    .then((response) => {
      console.log('campaign', response);
      this.lock = response.campaign.loot_lock;

      if (!this.lock.id || this.lock.id == this.currentUser.id) {
        this.renewLock();
        this.campaign = response.campaign;
        this.loot = this.campaign.loot;
        this.loading = false;
      }
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })

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
    // Loops through all containers (in iitems, like backpacks) to add their value and weight
    // handles Bags of Holding and Handy Haversacks
    recursiveInventory(container, invTotal, BagOfHolding){
      for (let item of Object.values(container)) {
        if (item.value) {
          invTotal.value += item.value.Cost;
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

    /***************************\
    *                           *
    *          FILTERS          *
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

    /***************************\
    *                           *
    *          ITEMS            *
    *                           *
    \***************************/
    addHorde() {
      let coins, skip, items = this.horde.items.split("\n");

      // add coins
      coins = parseInt(this.horde.coins.match(/\d+ ?cp/gm)[0]);
      this.campaign.extras.coins.cp = coins + parseInt(this.campaign.extras.coins.cp);
      coins = parseInt(this.horde.coins.match(/\d+ ?sp/gm)[0]);
      this.campaign.extras.coins.sp = coins + parseInt(this.campaign.extras.coins.sp);
      coins = parseInt(this.horde.coins.match(/\d+ ?gp/gm)[0]);
      this.campaign.extras.coins.gp = coins + parseInt(this.campaign.extras.coins.gp);
      coins = parseInt(this.horde.coins.match(/\d+ ?pp/gm)[0]);
      this.campaign.extras.coins.pp = coins + parseInt(this.campaign.extras.coins.pp);

      items.forEach(item => {
        skip = item == '' ? true : false;
        // skip any rows that are headers or totals
        [ 'Art Objects', 'Coins', 'Gems', 'Magic Items', 'Masterwork Items', 'Total' ].forEach(category => {
          if (item.includes(category)) {
            skip = true;
          }
        });

        if (!skip) {
          // get the value
          const regex = /(\d+ ?(pp|gp|sp|cp))/gmi; // matches ""### gp"
          let value = parseInt(item.match(regex)[0]);
          // chop up the string
          let i = item.indexOf('(');
          let name = item.slice(0, i).trim();
          let notes = item.slice(i);
          // add it to inventory
          let thing = {
            'label': name,
            'value': {
              'Description': '',
              'Cost': value,
              'Weight': 1,
              'Amount': 1,
              'Extras': { 'Notes': [ notes ] }
            }
          };
          this.loot.push(thing);
        }

      });

      this.horde = {};
      this.drawer = false;
    },
    addItem() {
      let item = {
        label: 'New Item',
        value: {
          Description: '',
          Cost: 1,
          Weight: 1,
          Amount: 1,
          Extras: { Notes: [] } }
        };
      this.loot.push(item);
      this.editItem(item);
    },
    editItem(item) {
      if (!Object.keys(item).length) {
        item = {
          label: "",
          value: {
            Description: "",
            Cost: 0,
            Weight: 0,
            Amount: 1,
            Extras: { Notes: [] }
          }
        };
      }
      this.item = item;
      this.showItem = true;
      this.dialog = true;
    },
    saveItem() {
      this.showAbil = false;
      this.dialog = false;
    },
    deleteItem(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.$treeNodeId === data.$treeNodeId);
      children.splice(index, 1);
      this.$message({ message: `${data.label} was removed from inventory`, type: "warning" });
    },

    /***************************\
    *                           *
    *         CAMPAIGNS         *
    *                           *
    \***************************/
    saveCampaign() {
      CampaignService.updateCampaign(this.campaign)
      .then((response) => { this.$message({ message: `${response.campaign.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },
    renewLock() {
      CampaignService.setLock(this.$route.params.id)
      .then((response) => {
        this.lock = response.lock;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    releaseLock() {
      CampaignService.releaseLock(this.campaign.id)
      .then((response) => {
        if (!response.campaign.loot_lock.id) {
          this.$router.back();
        }
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    sendToPlayer(node, data) {
      CharacterService.addItem(this.transferToon, data)
      .then((response) => {
        this.$message({ message: `${response.character.name} updated`, type: 'success', });
        this.deleteItem(node, data);
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },



  }
};
</script>
<style>
.el-row {
  margin-bottom: 10px;
}
</style>
