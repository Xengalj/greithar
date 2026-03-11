<template>
  <div v-if="!loading" class="container">

    <CreatureCard
      :source="character"
      @save-creature="saveCharacter(character)"
      @open-drawer="openDrawer()"
      @send-to-group-loot="sendToGroupLoot($event)"
    />

  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import CreatureCard from '@/components/template/CreatureCard.vue'
// import OBR from "@owlbear-rodeo/sdk";

export default {
  name: "View Character",
  components: { CreatureCard },
  data() {
    return {
      loading: true,
      character: {},
    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
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
    openDrawer() {
      console.log('open drawer');
    },
    sendToGroupLoot(item) {
      console.log(item);
    }
  }
};
</script>
