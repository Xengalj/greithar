<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>

    <!--

        Hex             abilities



        init      hp
        senses    speed

      def
        ac
        saves
        immunes, resist, vuln


    off
      melee
      range
      magic
        concen

   -->

    <!-- https://www.svgrepo.com/collection/game-skills-vectors/ -->
    <el-row class="row-bg" justify="space-evenly">
      <el-col :span="6">
        {{ char.name }} <br>
        Level {{ char.level.currLvl }}
      </el-col>
      <el-col :span="6">
        Classes ( {{ char.level.classes }} )
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="9" class="center">
        <g-icon iconSize="128px" />
        <br>
        HP
        <br>
        init, sense, speed
      </el-col>


      <el-col :span="9" class="center">
        <svg width="200" height="200">
          <HexGraph :abilities="char.abilities"></HexGraph>
        </svg>
      </el-col>

      <el-col :span="6" style="display: inline-grid">
        <div v-for="(stat, index) in char.abilities" :key="index">
          <strong>{{ stat.label }}: </strong> {{ stat.value }}
        </div>
      </el-col>
    </el-row>



    <el-collapse>
      <el-collapse-item name="Defense">
        <template #title>
          <g-icon iconName="armor" />
          Defense
        </template>

        <div class="">
          {{ char.rp }}
        </div>

      </el-collapse-item>

      <el-collapse-item name="Offense">
        <template #title>
          <g-icon iconName="swordShield" />
          Offense
        </template>
        {{ char.rp }}
      </el-collapse-item>

      <el-collapse-item name="Special">
        <template #title>
          <g-icon iconName="star" />
          Special
        </template>
        {{ char.rp }}
      </el-collapse-item>

      <el-collapse-item name="Inventory">
        <template #title>
          <g-icon iconName="inventory" />
          Inventory
        </template>
        {{ char.rp }}
      </el-collapse-item>

      <el-collapse-item name="Notes">
        <template #title>
          <g-icon iconName="openBook" />
          Notes
        </template>
        {{ char.rp }}
      </el-collapse-item>

      <el-collapse-item name="Lore">
        <template #title>
          <g-icon iconName="openScroll" />
          Player Lore
        </template>
        {{ char.rp }}
      </el-collapse-item>


    </el-collapse>



    <el-row></el-row>




<br><br>

  <g-icon iconName="inventory" /> Inventory <br>
  <g-icon iconName="potion" /> Potions <br>
  <g-icon iconName="openScroll" /> Lore <br>
  <g-icon iconName="rolledScroll" /> Scrolls <br>
  <g-icon iconName="firebolt" /> Magic <br>








  </div>
</template>

<script>
import UserService from "../../services/user.service";
import HexGraph from '@/components/template/HexGraph.vue'

/*
TODO:

- get charID
- get char data from DB
- add purple out of 30 HexGraph
*/



export default {
  name: "Character",
  components: {
    HexGraph,
  },
  data() {
    return {
      content: "",
      class: {
        id: 3,
        gen: {
          hd: "d8",
          name: "Druid",
          skills: ["Climb (Str), Craft (Int), Fly (Dex), Handle Animal (Cha), Heal (Wis), Knowledge (geography) (Int), Knowledge (nature) (Int), Perception (Wis), Profession (Wis), Ride (Dex), Spellcraft (Int), Survival (Wis), and Swim (Str)"],
          ranks: 4, // 4 + int mod / level
          proficiency: [ "club", "dagger", "dart", "quarterstaff", "scimitar", "scythe", "sickle", "shortspear", "sling", "spear", "natural attacks", "light armor", "medium armor", "shields" ]
        },
        leveled: {
          bab: [],  // arr index is
          fort: [],
          ref: [],
          will: [],
          spells: [
            [3, 1],  // 3 orisons, 1 first level at level 0
            [4, 2],
            [4, 2, 1],
          ],
          galdur: [],
        },
        special: [
          [  // level 1 class abilities
            "Spontaneous Casting", "Bonus Languages", "Nature Bond (ex)", "Nature Sense (ex)", "Wild Empathy (ex)"
          ],
          [  // lvl 2
            "Woodland Stride (ex)"
          ],
        ],
        restrictions: {
          alignment: "Neutral",
          spells: "cannot cast spells of oposing alignment",
          armor: "can't be metal"
        },
      },
      char: {
        id: 0,
        player: 0, // user_id, 0 = Xengalj
        name: "Smelborp",
        abilities: [
          { label: 'Str', value: 16, location: { x: 100, y: 12 } },
          { label: 'Dex', value: 13, location: { x: 176, y: 56 } },
          { label: 'Con', value: 18, location: { x: 176, y: 144 } },
          { label: 'Int', value: 10, location: { x: 100, y: 193 } },
          { label: 'Wis', value: 11, location: { x: 10, y: 144 } },
          { label: 'Cha', value: 8, location: { x: 10, y: 56 } }
        ],
        rp: {
          alignment: "NG",
          race: 0, // race_id, 0 = zikaru
          diety: "",
          appearance: {
            gender: "",
            age: 1023,
            height: "6'1\"",
            weight: "170 lbs.",
          },
          backstory: "Old norseman turned vampire",
          notes: "Hard to kill",
        },
        level: {
          currLvl: 5,
          // get BAB from highest level in each class, add together
          // add new class obj as player multiclasses
          classes: [
            {
              id: 3, // class_id, 3 = druid
              levels: 4, // current levels in class
            },
            {
              id: 4,
              levels: 1,
            }
          ],
        },
        feats: {},
        traits: {},
        extras: {
          campaign: "", // allow to link to other players for better organization?
          favoredClassBonus: {
            class: 0, // druid id
            bonus: "+1 HP, Skill, or Galdur per Level"
          },
          heroPoints: 1,
        },
      },
    };
  },
  mounted() {
    UserService.getAdminBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    clearFilter() {
    //   tableRef.value.clearFilter()
      console.log("clearing...");
    }

  },
  computed: {
    // filterHandler(
    //   value: string,
    //   row: User,
    //   column: TableColumnCtx<User>
    // ) {
    //   const property = column['property']
    //   return row[property] === value
    // }

  }
};
</script>

<style media="screen">
  .center {
    text-align: center;
  }
</style>
