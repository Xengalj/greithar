<template>
  <div v-if="!loading" class="container">

    <CreatureCard
      :source="character"
      @save-creature="saveCharacter(character)"
      @open-drawer="this.drawer = true"
      @send-to-group-loot="sendToGroupLoot($event)"
    />

    <!-- ALLY MODAL -->
    <el-auto-resizer style="height: 10px">
      <template #default="{ width }">
        <el-dialog v-model="allyVisible" :width="width" style="margin-top: 75px" >
          <CreatureCard :source="ally" @save-creature="saveAlly($event)" />
        </el-dialog>
      </template>
    </el-auto-resizer>


    <!-- DRAWER -->
    <el-drawer v-model="drawer" direction="rtl">
      <template #header> <h4> {{ campaign.name }} </h4> </template>
      <template #default>

        <el-select v-model="campaign" @change="getLock" filterable placeholder="Choose a Campaign" aria-label="Select Campaign">
          <el-option v-for="campaign in character.campaigns" :key="campaign.id" :label="campaign.name" :value="campaign" >
            {{ campaign.name }}
          </el-option>
        </el-select>

        <el-collapse v-model="drawerCollapse">
          <!-- Character Allies -->
          <el-collapse-item name="1">
            <template #title>
              <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="userList" /> Allies </el-divider>
            </template>

            <!-- character.allies (toon.resources) -->
            <!-- <el-table :data="this.encounter.npcs" stripe >
              <el-table-column label="Type" min-width="55">
                <template #default="scope">
                  <g-icon :iconName="scope.row.type" iconSize="24px" />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="Name" min-width="120" sortable />
              <el-table-column prop="alignment" label="Align" min-width="90" sortable />
              <el-table-column prop="hp" label="HP" sortable />
              <el-table-column label="Actions" fixed="right">
                <template #default="scope">
                  <el-row class="row-bg" justify="space-between">
                    <el-button @click="loadCharacter(scope.row.id, scope.$index)" type="info" style="margin:0" circle>
                      <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                    </el-button>
                  </el-row>
                </template>
              </el-table-column>
            </el-table> -->
          </el-collapse-item>

          <!-- Group Loot -->
          <el-collapse-item name="2">
            <template #title>
              <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="cart" /> Loot </el-divider>
            </template>
            <template #default>
              <h4 v-if="campaign.id">
                <g-icon iconSize="32px" iconName="inventory" /> Group Loot
                <el-tooltip v-if="campaign.loot_lock.username" placement="top" effect="light">
                  <el-button type="warning" style="margin:0" circle>
                    <g-icon iconSize="32px" iconColor="#000" iconName="lock" />
                  </el-button>
                  <template #content>
                    <el-tag :color="campaign.loot_lock.color" size="small" effect="dark">
                      {{ campaign.loot_lock.username }} ({{ new Date(campaign.loot_lock.releaseTime).getHours() }}:{{ new Date(campaign.loot_lock.releaseTime).getMinutes() }})
                    </el-tag>
                  </template>
                </el-tooltip>
              </h4>
              <g-loot :source="campaign.loot" @edit-loot="editLoot"/>
            </template>
          </el-collapse-item>


            <!-- Encounter Extras -->
            <!-- <el-collapse-item name="4">
              <template #title>
                <el-divider style="max-width:75%"> <g-icon iconSize="20px" iconName="map" /> Extras </el-divider>
              </template>
              <el-row>
                <el-col :span="19">
                  <el-input v-model="encounter.extras.prev.name" disabled>
                    <template #prepend> Prev </template>
                  </el-input>
                </el-col>
                <el-col :span="5" class="center-horz">
                  <el-button @click="this.$router.push({ name: 'dm-screen', params: { campaign: campaign.id, encounter: encounter.extras.prev.id } });" type="info" style="margin:0" circle>
                    <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="19">
                  <el-input v-model="encounter.extras.next.name" disabled>
                    <template #prepend> Next </template>
                  </el-input>
                </el-col>
                <el-col :span="5" class="center-horz">
                  <el-button @click="this.$router.push({ name: 'dm-screen', params: { campaign: campaign.id, encounter: encounter.extras.next.id } });" type="info" style="margin:0" circle>
                    <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
                  </el-button>
                </el-col>
              </el-row>
            </el-collapse-item> -->
          </el-collapse>

      </template>
    </el-drawer>




  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import CampaignService from "@/services/campaign.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
import GLoot from '@/components/template/GLoot.vue';
// import OBR from "@owlbear-rodeo/sdk";

export default {
  name: "View Character",
  components: { CreatureCard, GLoot },
  data() {
    return {
      loading: true,
      character: {},

      allyVisible: false,
      ally: {},

      // DRAWER
      drawer: false,
      drawerCollapse: [ '' ],
      campaign: "",
    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    currentUser() { return this.$store.state.auth.user; }
  },
  mounted() {
    if (!this.rules) { this.$router.push("/"); }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
      this.character = response.character;
      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    .finally(() => {


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

      // Hide selected items when clicking a context menu item
      // OBR.contextMenu.create({
      //   id: "rodeo.owlbear.example",
      //   icons: [
      //     { icon: "icon.svg", label: "Example", },
      //   ],
      //   onClick(context) {
      //     OBR.scene.items.updateItems(context.items, (items) => {
      //       for (let item of items) {
      //         item.visible = false;
      //       }
      //     });
      //   },
      // });

    }); // end getCharacter .finally()
  },
  watch: { itemFilter(val) { this.$refs.tree.filter(val); } },
  methods: {
    /***************************\
    *                           *
    *          HELPERS          *
    *                           *
    \***************************/
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },
    saveCharacter() {
      CharacterService.updateCharacter(this.character)
      .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    /***************************\
    *                           *
    *           LOOT            *
    *                           *
    \***************************/
    getLock() {
      CampaignService.getLock(this.campaign.id)
      .then((response) => { if (!response.lock.id) { this.campaign.loot_lock = {}; } })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    },
    editLoot() {
      if ( !this.campaign.loot_lock.id || this.campaign.loot_lock.id == this.currentUser.id ) {
        this.$router.push({ name: 'campaign-loot', params: { id: this.campaign.id } });
      } else {
        this.$message({ message: 'You do not control the lock', type: 'error', });
      }
    },
    sendToGroupLoot(node) {
      let item = node.data;

      if (this.campaign) {
        if ( !this.campaign.loot_lock.id || this.campaign.loot_lock.id == this.currentUser.id ) {
          this.campaign.loot.push(item)

          CampaignService.updateCampaign(this.campaign)
          .then(() => {
            this.campaign = "";
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.$treeNodeId === item.$treeNodeId);
            children.splice(index, 1);
            this.$message({ message: `${item.label} was sent to group inventory`, type: "success" });
          })
          .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })

        } else {
          this.$message({ message: 'You do not control the lock', type: 'error', });
        }

      } else {
        this.$message({ message: 'Please choose a campaign first', type: 'warning', });
        this.drawer = true;
      }
      // end Send Item to Group Loot
    }

  }
};
</script>
