<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>

<script>
import UserService from "../services/user.service";

export default {
  name: "Moderator",
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
        abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
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
    UserService.getModeratorBoard().then(
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
};
</script>
