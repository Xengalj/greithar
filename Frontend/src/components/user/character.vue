<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>


<!-- https://www.svgrepo.com/collection/game-skills-vectors/ -->

    <font-awesome-icon icon="octopus-deploy" /> Abberations
    <font-awesome-icon icon="horse" /> Beasts
    <font-awesome-icon icon="cogs" /> Constructs
    <font-awesome-icon icon="dragon" /> Dragons



    <svg width="32px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
      <path fill="#000000" d="M58.03 24.5C23.27 94.19 12.043 159.392 21.813 208.344c9.777 48.98 38.724 81.862 88.157 91.562.273 7.875 1.34 15.623 3.155 23.156.002.01-.002.022 0 .032-28.127 27.637-42.97 61.425-43.5 97.03 48.38 13.457 82.514 3.99 106.563-18.905 6.406 3.07 13.175 5.595 20.28 7.5 7.128 1.91 14.27 3.113 21.376 3.655.156.957.32 1.9.5 2.844C225.29 452 247.24 480.26 292.53 491.81c17.09-29.536 21.327-63.994 10.94-107.906 5.174-4.5 9.967-9.482 14.31-14.875 22.468 14.3 43.262 19.52 62.158 17.595 19.33-1.97 37.185-11.402 53.218-28.28 31.266-32.916 54.233-94.763 59.906-176.876-24.374-11.548-48.163-16.737-71-16.657-24.58.086-48.055 6.17-70.03 16.593-16.08 7.626-31.292 17.67-45.313 29.47-13.61-12.85-30.473-22.608-49.783-27.782-11.663-3.125-23.398-4.37-34.875-3.906-6.836.276-13.57 1.18-20.156 2.625C178.323 111.115 129.416 47.12 58.03 24.5zm23.94 66.688c18.666 0 33.593 14.926 33.593 33.593 0 18.672-14.926 33.595-33.594 33.595-18.67 0-33.626-14.926-33.626-33.594 0-18.666 14.957-33.593 33.625-33.593zm-24.376 82.53c10.23 0 18.312 8.116 18.312 18.345 0 10.228-8.083 18.312-18.312 18.312-10.23 0-18.313-8.08-18.313-18.313 0-10.228 8.085-18.343 18.314-18.343zm156.156 24.876c-32.586 12.06-55.813 43.41-55.813 80.187 0 47.21 38.26 85.5 85.47 85.5 37.43 0 69.24-24.062 80.812-57.56-.55 4.852-1.448 9.728-2.75 14.592-14.055 52.448-67.71 83.43-120.158 69.375-52.447-14.053-83.428-67.74-69.375-120.187 10.592-39.528 43.698-66.854 81.813-71.906zm215.938 16.47c18.667 0 33.593 14.956 33.593 33.624 0 18.67-14.924 33.593-33.592 33.593s-33.625-14.925-33.625-33.592c0-18.668 14.957-33.625 33.625-33.625zm-354.75 13.155c8.86 0 15.843 6.982 15.843 15.843 0 8.86-6.982 15.843-15.843 15.843-8.86 0-15.843-6.98-15.843-15.844 0-8.86 6.983-15.843 15.843-15.843zm341.093 71.874c10.23 0 18.314 8.083 18.314 18.312 0 10.232-8.083 18.344-18.313 18.344-10.228 0-18.31-8.115-18.31-18.344 0-10.23 8.082-18.312 18.31-18.312zm-41.31 37.156c8.86 0 15.874 6.983 15.874 15.844 0 8.863-7.014 15.844-15.875 15.844-8.862 0-15.845-6.984-15.845-15.844s6.983-15.844 15.844-15.844zm-265.533 37.594c8.86 0 15.844 6.983 15.844 15.844 0 8.862-6.98 15.843-15.843 15.843-8.86 0-15.843-6.982-15.843-15.842s6.983-15.844 15.844-15.844zm163.532 52.03c8.86 0 15.874 6.984 15.874 15.845 0 8.862-7.014 15.842-15.875 15.842-8.862 0-15.845-6.983-15.845-15.843 0-8.862 6.983-15.845 15.844-15.845z"></path></g></svg>
Fey


<font-awesome-icon icon="male" /> Humanoids
<font-awesome-icon icon="phoenix" /> Mag Beast


<svg width="32px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M110 18.906c-3.766 9.014-2.938 15.91-2.938 28.032 0 26.995 24.076 48.413 52.563 52.562 19.28 2.807 39.315 4.758 59.594 5.813-8.56 7.39-13.907 18.092-13.907 35.124 0 17.576 6.436 37.856 16.562 52.97 10.126 15.112 23.233 24.374 36.03 24.374 12.8 0 25.906-9.26 36.033-24.374 10.126-15.113 16.562-35.392 16.562-52.97 0-17.186-5.43-27.946-14.125-35.342 19.053-1.09 37.854-2.952 56-5.594 28.487-4.147 51.47-23.72 52.563-52.563.368-9.723-1.637-18.74-2.938-28.03-2.943 27.71-26.205 45.69-54.313 49.656-59.833 8.443-123.54 8.443-183.375 0-28.107-3.966-51.37-21.945-54.312-49.657zm79.78 99.313c-248.928 7.213-200.628 194.293-22.124 242.5 40.812-39.456-6.55-101.937-43.72-57.033-23.22-43.474-20.674-82.77 4.5-95.03 48.72 27.067 83.566 88.52 86.126 148.405-33.595 23.148-59.625 63.032-59.625 63.032l26.344 38.78-41.31 23.5h82.124c-40.513-40.52-11.77-86.093 36.22-86.093 48.645 0 74.12 48.22 36.248 86.095h81.282l-40.47-23.5 26.345-38.78s-26.458-40.502-60.44-63.564c2.744-59.716 37.52-120.887 86.095-147.874 25.176 12.262 27.722 51.557 4.5 95.03-37.168-44.903-84.53 17.578-43.72 57.033 178.5-48.206 226.788-235.28-22.124-242.5 2.054 6.73 3.158 14.17 3.158 22.218 0 21.95-7.423 45.024-19.72 63.375-12.295 18.35-30.17 32.656-51.562 32.656-21.392 0-39.266-14.306-51.562-32.657-12.296-18.352-19.72-41.426-19.72-63.375 0-8.048 1.105-15.488 3.157-22.22z"></path></g></svg>
Monst Humanoids

<font-awesome-icon icon="splotch" /> Oozes


<svg width="32px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M61.5 20.313S35.274 174.364 44.187 218.5c11.368 56.304 43.725 84.982 71.657 86.78 28.856 61.26 81.21 126.335 141.562 186.69 63.627-63.63 114.57-127.272 142.5-186.72 27.856-2.006 60.022-30.67 71.344-86.75 8.913-44.135-17.313-198.188-17.313-198.188s-25.825 44.997-50.968 93.313c-59.33-121.507-231.224-122.252-290.533-.03C87.297 65.286 61.5 20.312 61.5 20.312zm93.125 116.406c27.414-.006 49.235 14.294 66.156 41.155-32.622 17.113-60.617-1.23-86.06-38.844 6.93-1.547 13.58-2.31 19.905-2.31zm205.125 0c6.326 0 12.944.763 19.875 2.31-25.445 37.616-53.408 55.958-86.03 38.845 16.92-26.86 38.74-41.16 66.155-41.156zm-158.125 74.5l31.094 84.593 26.624-84.594 27.094 85.874 30.25-82.438 25.468 84.72 30.97-77.876c20.487 43.275-12.03 117.294-41.595 154.125l-22.56-62.72-22.064 118.658-23.812-102.657-26.78 94.656-24.564-99.218-22.563 58.125c-40.972-55.047-53.096-112.023-32.625-160.97l21.657 66.47 23.405-76.75z"></path></g></svg>
Outsider

<font-awesome-icon icon="seedling" /> Plants
<font-awesome-icon icon="skull-crossbones" /> Undead
<font-awesome-icon icon="frog" /> Vermin

  </div>
</template>

<script>
import UserService from "../../services/user.service";

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
};
</script>
