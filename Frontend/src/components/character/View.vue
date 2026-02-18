<template>
  <div v-if="!loading" class="container">

    <CreatureCard :source="character" @save-creature="saveCreature(character)" @open-drawer="openDrawer(character)"></CreatureCard>



  </div>
</template>

<script>
import CharacterService from "@/services/character.service";
import CreatureCard from '@/components/template/CreatureCard.vue'

// import HexGraph from '@/components/template/HexGraph.vue';
// import GItem from '@/components/template/GItem.vue';
// import GAbility from '@/components/template/GAbility.vue';
// import OBR from "@owlbear-rodeo/sdk";

export default {
  name: "View Character",
  components: { CreatureCard },
  data() {
    return {
      loading: true,

      // sectionsCollapse: [ '' ],
      // healthColors: [ { color: '#f56c6c', percentage: 30 }, { color: '#e6a23c', percentage: 60 }, { color: '#5cb87a', percentage: 100 } ],
      //
      // abilityCollapse: [],
      // abilityTypes: [ "Race", "Trait", "Class", "Feat", "Other" ],
      // abilName: "",
      // editingAbil: false,
      // abil: {},
      //
      // newCondition: {},
      // addingCondition: false,
      //
      // editingItem: false,
      // item: {},
      // itemFilter: "",
      //
      // spellTabs: "",
      // newSpell: { name: "", level: 0, class: "" },
      // spellsCollapse: [],
      // spellCost: "",
      // gFatigue: "",
      // metamagic: null,

      character: {},
      // encumbrance: {
      //   name: "Encumbrance",
      //   description: "You carry too much",
      //   bonuses: {}
      // }

    };
  },
  computed:{
    rules() { return JSON.parse(localStorage.getItem('rules')); },
    races() { return JSON.parse(localStorage.getItem('races')); },
    classes() { return JSON.parse(localStorage.getItem('classes')); },
    equipment() { return JSON.parse(localStorage.getItem('equipment')); },
    conditions() { return JSON.parse(localStorage.getItem('conditions')); },

    activeConditions() { return this.character.conditions; },
    inventory() { return this.character.inventory; },
    abilities() { return this.character.abilities; },
    sizeStats() { return this.rules.size ? this.rules.size[this.character.basics.size] : { "space": "5 ft." }; },


    // USES: inventory
    invTotal() {
      let invTotal = {
        "value": 0,
        "weight": 0,
        "carryCap": 0,
        "level": "",
        "color": "success",
        "maxDex": 100,
      };
      let enc = { speed: 0, skill: 0 };

      // Coins
      invTotal.value += (this.character.coins.pp * 10)
                        + (this.character.coins.gp * 1)
                        + (this.character.coins.sp * 0.1)
                        + (this.character.coins.cp * 0.01);
      invTotal.weight += (this.character.coins.pp / 50)
                        + (this.character.coins.gp / 50)
                        + (this.character.coins.sp / 50)
                        + (this.character.coins.cp / 50);

      // Magic Items
      for (let slot of Object.values(this.inventory[0].children)) {
        for (let item of Object.values(slot.children)) {
          invTotal.value += item.value.Cost;
          invTotal.weight += item.value.Weight;
        }
      }

      // Equipped Items
      let armor = this.inventory[1].children[0].children[0];
      if (armor) {
        invTotal.value += armor.value.Cost;
        invTotal.weight += armor.value.Weight;
        if (invTotal.maxDex > armor.value["Max Dex"]) {
          invTotal.maxDex = armor.value["Max Dex"];
        }
        enc.skill = armor.value.Penalty;
        if (["Medium", "Heavy"].includes(armor.value.Proficiency)) {
          enc.speed = (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total;
        }
      }
      for (let slot of Object.values(this.inventory[1].children[1].children)) {
        for (let item of Object.values(slot.children)) {
          invTotal.value += item.value.Cost;
          invTotal.weight += item.value.Weight;
          if (slot.label == "Hands" && item.value.Penalty) {
            if (invTotal.maxDex > item.value["Max Dex"]) {
              invTotal.maxDex = item.value["Max Dex"];
            }
            enc.skill += item.value.Penalty;
          }
        }
      }
      this.encumbranceMalus("Encumbrance Speed", enc.speed, [ "baseSpeed" ]);
      this.encumbranceMalus("Encumbrance Skill", enc.skill, [ "armorSkills" ]);

      // Other Items
      this.recursiveInventory(this.inventory[2].children, invTotal, false);

      // CARRY CAPACITY
      let str = this.character.attributes.Str.base;
      let bonus = 0; // TODO: +1 from mwk backpack OR +8 from muleback cords (bonus)
      let sizeMult = 1;

      // Quadruped
      let multiLeg = Object.keys(this.character.abilities).includes("Quadruped");
      sizeMult = multiLeg ? this.rules.size[this.character.basics.size]["extra legs"] :
                            this.rules.size[this.character.basics.size]["carry mod"];

      if ((str + bonus) < 10) {
        invTotal.carryCap = (str + bonus) * 10 * sizeMult;
      } else {
        invTotal.carryCap = Math.floor( 20 * (2**0.2) ** (str + bonus - 10) * sizeMult ) * 5;
      }

      let light = invTotal.carryCap / 3;
      let medium = invTotal.carryCap * 2/3;
      let heavy = invTotal.carryCap;

      if (invTotal.weight < light) {
        invTotal.level = "Light";
        invTotal.color = "success";

      } else if (invTotal.weight < medium) {
        invTotal.level = "Medium";
        invTotal.color = "info";
        if (invTotal.maxDex > 3) {
          invTotal.maxDex = 3;
        }
        let tmpSpeed = (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -3) {
          this.encumbranceMalus("Encumbrance Skill", -3, [ "armorSkills" ]);
        }

      } else if (invTotal.weight < heavy) {
        invTotal.level = "Heavy";
        invTotal.color = "warning";
        invTotal.maxDex = 1;
        if (invTotal.maxDex > 1) {
          invTotal.maxDex = 1;
        }
        let tmpSpeed = (Math.floor(this.character.basics.speed.base.total * 0.138) * 5) - this.character.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -3) {
          this.encumbranceMalus("Encumbrance Skill", -3, [ "armorSkills" ]);
        }

      } else {
        invTotal.level = "Staggering";
        invTotal.color = "danger";
        invTotal.maxDex = 0;
        let tmpSpeed = 5 - this.character.basics.speed.base.total;
        if (enc.speed > tmpSpeed) {
          this.encumbranceMalus("Encumbrance Speed", tmpSpeed, [ "baseSpeed" ]);
        }
        if (enc.skill > -6) {
          this.encumbranceMalus("Encumbrance Skill", -6, [ "armorSkills" ]);
        }
      }

      return invTotal;
    },

    // USES: activeConditions, inventory, abilities, encumbrance
    // an update to computed properties makes this loop re-evaluate
    // meaning updating armor will change the AC bonuses
    bonuses() {
      let bonuses = {};
      if (this.loading) { return bonuses; }

      // Add racial ability / attribute bonuses
      for (let [name, val] of Object.entries(this.races[this.character.basics.race].abilityMods)) {
        bonuses[`Racial ${name} Bonus`] = {};
        bonuses[`Racial ${name} Bonus`].type = "Racial";
        bonuses[`Racial ${name} Bonus`].targets = [ name ];
        bonuses[`Racial ${name} Bonus`].value = val;
      }

      // Add feats and other abilities to bonuses
      for (const ability of Object.values(this.abilities)) {
        if (ability.extras.active && Object.keys(ability.bonuses).length>0) {
          for (const [name, bonus] of Object.entries(ability.bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Add conditions
      for (const condition in this.activeConditions) {
        if (this.activeConditions[condition].bonuses) {
          for (const [name, bonus] of Object.entries(this.activeConditions[condition].bonuses)) {
            bonuses[name] = bonus;
          }
        }
      }
      // Armor
      let item = this.inventory[1].children[0].children[0];
      if (item) {
        bonuses[item.label] = {};
        bonuses[item.label].type = "Armor";
        bonuses[item.label].targets = ["totalAC", "flatAC"];
        bonuses[item.label].value = item.value["AC Bonus"];
      }
      // Shields          For items in equipment . equipped . hands
      for (const item of this.character.inventory[1].children[1].children[0].children) {
        if (item.value["AC Bonus"]) {
          bonuses[item.label] = {};
          bonuses[item.label].type = "Shield";
          bonuses[item.label].targets = ["totalAC", "flatAC"];
          bonuses[item.label].value = item.value["AC Bonus"];
        }
      }
      // Magic Items        For items in equipment . (slotted) Magic Items
      for (const slot of this.character.inventory[0].children) {
        for (const item of slot.children) {
          if (item.value.Bonuses) {
            for (const [name, bonus] of Object.entries(item.value.Bonuses)) {
              bonuses[name] = {};
              bonuses[name].type = bonus.type;
              bonuses[name].targets = bonus.targets;
              bonuses[name].value = bonus.value;
            }
          }
        }
      }
      // Encumbrance
      if (Object.keys(this.encumbrance.bonuses).length) {
        for (let [name, bonus] of Object.entries(this.encumbrance.bonuses)) {
          bonuses[name] = bonus;
        }
      }

      // console.log("BONUSES", bonuses);
      return bonuses;
    },

    // USES: bonusLoop(bonuses)
    attributes() {
      let attributes = {
        Str: { total: 10, sources: [], mod: 0 },
        Dex: { total: 10, sources: [], mod: 0 },
        Con: { total: 10, sources: [], mod: 0 },
        Int: { total: 10, sources: [], mod: 0 },
        Wis: { total: 10, sources: [], mod: 0 },
        Cha: { total: 10, sources: [], mod: 0 }
      };
      if (this.loading) { return attributes; }
      for (let [name, attr] of Object.entries(this.character.attributes)) {
        attributes[name].total = attr.base;
        this.bonusLoop(attributes[name], name);
        attributes[name].mod = Math.floor( (name == "-" ? 0 : attributes[name].total - 10) / 2 );
      }
      return attributes;
    },

    // USES: bonusLoop(bonuses), attributes
    health() {
      let health = this.character.health;

      // let hpMod, health = { total: 0, damage: 0, nonlethal: 0, sources: [] };
      // health.total += this.creature.health.total;
      // health.damage += this.creature.health.damage;
      // health.nonlethal += this.creature.health.nonlethal;
      // health.sources = this.creature.health.sources;
      //
      // // Racial HD Check
      // if (this.creature.basics.type.hd) {
      //   if (this.creature.basics.type.name == "construct") {
      //     switch (this.creature.basics.size) {
      //       case "small": health.total += 10; health.sources.push(`+10 Construct`); break;
      //       case "medium": health.total += 20; health.sources.push(`+20 Construct`); break;
      //       case "large": health.total += 30; health.sources.push(`+30 Construct`); break;
      //       case "huge": health.total += 40; health.sources.push(`+40 Construct`); break;
      //       case "gargantuan": health.total += 60; health.sources.push(`+60 Construct`); break;
      //       case "colossal": health.total += 80; health.sources.push(`+80 Construct`); break;
      //       default: health.total += 0;
      //     }
      //   } else if (this.creature.basics.type.name == "undead") {
      //     hpMod = "Cha";
      //   } else {
      //     hpMod = "Con";
      //   }
      // }
      //
      // // Racial HD Check
      // let bonus = 0;
      // if (this.creature.basics.type.hd) {
      //   for (let i = 1; i < this.creature.basics.type.levels+1; i++) {
      //     bonus += this.attributes[hpMod].mod;
      //   }
      // }
      // // Class Loop
      // for (let cClass of Object.values(this.creature.classes)) {
      //   for (let i = 1; i < cClass.levels+1; i++) {
      //     bonus += this.attributes[hpMod].mod;
      //   }
      // }
      // health.total += bonus;
      // health.sources.push( `+${bonus} ${hpMod}` );
      // health.total = Math.floor(health.total);

      this.bonusLoop(health, "HP");
      return health;
    },



    // USES: bonusLoop(bonuses), inventory, attributes, invTotal
    ac() {
      // total = All
      // touch = creature.ac.total - bonus.armor - bonus.shield - bonus.natural;
      // flat = creature.ac.total - bonus.dex - bonus.dodge;
      let ac = { "total": { "total": 10, "sources": [] }, "touch": { "total": 10, "sources": [] }, "flat": { "total": 10, "sources": [] } };
      let armor = this.inventory[1].children[0].children[0];

      // Min (Dex Mod, Armor Max Dex, Carry Cap Max Dex)
      // TODO: lose dex from blinded (and others)
      let dex = this.attributes.Dex.mod;
      let bonus = Math.min(dex, this.invTotal.maxDex, (armor ? armor.value["Max Dex"] : 100) );
      this.applyBonus('Dex', bonus, ac.total);
      this.applyBonus('Dex', bonus, ac.touch);

      if (this.character.basics.size != "medium") {
        bonus = this.sizeStats["ac / atk"];
        this.applyBonus('Size', bonus, ac.total);
        this.applyBonus('Size', bonus, ac.touch);
        this.applyBonus('Size', bonus, ac.flat);
      }
      // neg dex still applies to flat footed
      if (this.attributes.Dex.mod < 0) {
        ac.flat.total += this.attributes.Dex.mod;
        ac.flat.sources.push(`${this.attributes.Dex.mod} Dex`);
      }
      this.bonusLoop(ac.total, "totalAC");
      this.bonusLoop(ac.touch, "touchAC");
      this.bonusLoop(ac.flat, "flatAC");
      return ac;
    },
    // USES: bonusLoop(bonuses), attributes
    saves() {
      let saves = { "fort": { "total": 0, "sources": [] }, "ref": { "total": 0, "sources": [] }, "will": { "total": 0, "sources": [] } };
      let bonus, bName = "";

      for (let [name, save] of Object.entries(saves)) {
        // Abilities
        bonus = 0;
        switch (name) {
          case "fort":
            bonus += (this.character.basics.type.name == "undead") ? this.attributes.Cha.mod : this.attributes.Con.mod;
            bName = (this.character.basics.type.name == "undead") ? "Cha" : "Con";
            break;
          case "ref":
            bonus += this.attributes.Dex.mod;
            bName = "Dex";
            break;
          case "will":
            bonus += this.attributes.Wis.mod;
            bName = "Wis";
            break;
        }
        bonus = Math.floor(bonus);
        this.applyBonus(bName, bonus, save);

        // Racial HD Check
        if (this.character.basics.type.levels) {
          bName = this.character.basics.type.name;
          bonus = 0;
          let saveMult = this.rules.creature_types[bName][name].mult;
          bonus += saveMult * this.character.basics.type.levels;
          bonus += this.rules.creature_types[bName][name].bonus;
          bonus = Math.floor(bonus);
          this.applyBonus(bName, bonus, save);
        }
        // Class Loop
        for (let [cName, cClass] of Object.entries(this.character.classes)) {
          if (this.classes[cName]) {
            let levels = cClass.levels;
            cClass = this.classes[cName];
            bonus = 0;
            let saveMult = cClass.saves[name].mult;
            bonus += saveMult * levels;
            bonus += cClass.saves[name].bonus;
            bonus = Math.floor(bonus);
            this.applyBonus(cName, bonus, save);
          }
        }
      }
      // Bonus Loop
      this.bonusLoop(saves.fort, "fort");
      this.bonusLoop(saves.ref, "ref");
      this.bonusLoop(saves.will, "will");

      saves.fort.total = Math.floor(saves.fort.total);
      saves.ref.total = Math.floor(saves.ref.total);
      saves.will.total = Math.floor(saves.will.total);
      return saves;
    },
    // USES: bonusLoop(bonuses), bab, attributes, sizeStats
    cmd() {
      let cmd = { "total": 10, "sources": [] };
      this.applyBonus("BAB", this.bab, cmd);
      this.applyBonus("Str", this.attributes.Str.mod, cmd);
      this.applyBonus("Dex", this.attributes.Dex.mod, cmd);
      this.applyBonus("Size", this.sizeStats["cmb / cmd"], cmd);
      this.bonusLoop(cmd, "cmd");
      return cmd;
    },
    // USES: bonusLoop(bonuses), bab, attributes, sizeStats
    cmb() {
      let cmb = { "total": 0, "sources": [] };
      this.applyBonus("BAB", this.bab, cmb);
      if (["fine", "diminuitive", "tiny"].includes(this.character.basics.size)) {
        this.applyBonus("Dex", this.attributes.Dex.mod, cmb);
      } else {
        this.applyBonus("Str", this.attributes.Str.mod, cmb);
      }
      this.applyBonus("Size", this.sizeStats["cmb / cmd"], cmb);
      this.bonusLoop(cmb, "cmb");
      return cmb;
    },
    // USES: bonusLoop(bonuses), attributes
    init() {
      let init = { "total": 0, "sources": [] };
      this.applyBonus("Dex", this.attributes.Dex.mod, init);
      this.bonusLoop(init, "initiative");
      return init;
    },
    // USES: bonusLoop(bonuses)
    speed() {
      let speed = {
        "base":   { "total": 0, "sources": [] },
        "fly":    { "total": 0, "sources": [] },
        "swim":   { "total": 0, "sources": [] },
        "climb":  { "total": 0, "sources": [] },
        "burrow": { "total": 0, "sources": [] }
      };

      this.applyBonus("Racial Base", this.races[this.character.basics.race].speed, speed.base);
      this.bonusLoop(speed.base, "baseSpeed");
      this.bonusLoop(speed.burrow, "burrow");
      this.bonusLoop(speed.fly, "fly");
      this.bonusLoop(speed.climb, "climb");
      this.bonusLoop(speed.swim, "swim");

      // climb  & swim @ 25% base (base/4)
      if (speed.climb.total == 0) {
        speed.climb.total = speed.base.total / 4;
      }
      if (speed.swim.total == 0) {
        speed.swim.total = speed.base.total / 4;
      }

      return speed;
    },
    // USES: abilities, skills
    senses() {
      let senses = [];
      senses.push(`Perception ${this.skills.Perception.bonus.total}`);
      Object.values(this.abilities).forEach(abil => {
        if (abil.benefit && abil.benefit.target == "senses") {
          senses.push(abil.benefit.text);
        }
      });
      return senses;
    },
    // USES: abilities
    defenses() {
      let defenses = { immunities: [], weaknesses: [], special: [] };
      Object.values(this.abilities).forEach(abil => {
        if (abil.benefit) {
          switch (abil.benefit.target) {
            case "immunities":
            defenses.immunities.push(abil.benefit.text.split(','));
            break;
            case "weakness":
            defenses.weaknesses.push(abil.benefit.text.split(','));
            break;
            case "specialDef":
            defenses.special.push(abil.benefit.text);
            break;
          }
        }
      });
      return defenses
    },

    bab() {
      let bab = 0;
      // Racial HD Check
      if (this.character.basics.type.levels) {
        let racialBAB = this.rules.creature_types ? this.rules.creature_types[this.character.basics.type.name].bab : 0;
        bab += racialBAB * this.character.basics.type.levels;
      }
      // Class Loop
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        let classBAB = this.classes[cName] ? this.classes[cName].bab : 0;
        bab += classBAB * cClass.levels;
      }
      bab = Math.floor(bab);
      return bab;
    },
    // USES: inventory, bab, bonusLoop(bonuses), attributes
    actions() {
      let actions = [
        { "label": "Melee", "extras": { "icon": "meleeSword", "capacity": 50 }, "children": [] },
        { "label": "Ranged", "extras": { "icon": "rangedBow", "capacity": 50 }, "children": [] },
        { "label": "Special", "extras": { "icon": "abilityPalm", "capacity": 50 }, "children": [] }
      ];

      /***************************\
      *                           *
      *      Special Actions      *
      *                           *
      \***************************/
      // Abilities, like cleave, into 'special actions'
      for (const [name, abil] of Object.entries(this.abilities)) {
        if (abil.extras.showMain) {
          actions[2].children.push({
            "label": name, "value": abil
          });
        }
      }

      for (const [name, atk] of Object.entries(this.character.actions)) {
        let newAtk = {
          "label": name,
          "value": {
            trigger: atk["trigger"],
            atkNum: atk["atkNum"],
            atkBonus: { "total": 0, "sources": [] },
            damage: atk["Damage"],
            dmgBonus: { "total": 0, "sources": [] },
            damageTypes: [],
            crit: {
              range: atk["Critical"].split("/")[0],
              mult: atk["Critical"].split("/")[1]
            },
            range: atk["Range"],
            extras: {
              naturalAtk: true,
              notes: atk.extras.notes
            }
          }
        };

        // ATTACK BONUS
        this.applyBonus("BAB", this.bab, newAtk.value.atkBonus);
        this.applyBonus("Size", this.sizeStats["ac / atk"], newAtk.value.atkBonus);
        // Add AbilMod to atkBonus
        if (atk.atkAbilOverride) {
          this.applyBonus(atk.atkAbilOverride, this.attributes[atk.atkAbilOverride].mod, newAtk.value.atkBonus);
        } else if (atk.category == "Ranged") {
          this.applyBonus("Dex", this.attributes.Dex.mod, newAtk.value.atkBonus);
        } else if (atk.Category == "Secondary") {
          // all nat atks when using weapons too
          this.applyBonus("Str", this.attributes.Str.mod - 5, newAtk.value.atkBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.atkBonus);
        }

        // DAMAGE BONUS
        // Add AbilMod to dmgBonus
        if (atk.dmgAbilOverride) {
          this.applyBonus(atk.dmgAbilOverride, this.attributes[atk.dmgAbilOverride].mod, newAtk.value.atkBonus);
        } else if (!Object.keys(this.rules.natural_attacks).includes(name)) {
        // Fake Natural Attack, like Death Worm's Electrical Jolt
        // They get no bonuses to DMG
        } else if (atk.Category == "Secondary") {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), newAtk.value.dmgBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);
        }

        // Add Active Bonuses
        this.bonusLoop(newAtk.value.atkBonus, "meleeAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "meleeDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "rangedAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "rangedDmgBonus");
        this.bonusLoop(newAtk.value.atkBonus, "specialAtkBonus");
        this.bonusLoop(newAtk.value.dmgBonus, "specialDmgBonus");

        // set damage types
        for (const category of Object.values(this.rules["Damage Types"])) {
          for (const cType of Object.values(category)) {
            atk["Damage Type"].forEach(aType => {
              if (aType == cType.value) {
                newAtk.value.damageTypes.push(cType);
              }
            });
          }
        }

        // choose atk location
        if (atk.style) {
          switch (atk.style) {
            case "Melee":
              actions[0]["children"].push(newAtk);
              break;
            case "Ranged":
              actions[1]["children"].push(newAtk);
              break;
            default:
              actions[2]["children"].push(newAtk);
          }
        } else {
          actions[2]["children"].push(newAtk);
        }

      } // End character.attacks loop

      /***************************\
      *                           *
      *      Weapon Actions       *
      *                           *
      \***************************/

      // Weapon Actions
      let mainHand = this.inventory[1].children[1].children[0].children[0];
      let offHand = this.inventory[1].children[1].children[0].children[1];

      for (const weapon of this.inventory[1].children[1].children[0].children) {
        // this.inventory[ equipped ].children[ weapons ].children[ hands ].children
        // If the wielded item is not a weapon or inproperly equipped, skip
        if (!weapon.value.Damage) { continue; }
        if (weapon.value.Group.includes("Bows") || weapon.value.Category == "Two-Handed"){
          if (weapon.label != mainHand.label || offHand != undefined) {
            continue;
          }
        }

        let type = (weapon.value.Category == "Ranged" || weapon.value.Group.includes("Thrown")) ? "Ranged" : "Melee";
        let newAtk = {
          "label": weapon.label,
          "value": {
            trigger: "Standard",
            atkNum: 1,
            atkBonus: { "total": 0, "sources": [] },
            damage: weapon.value["Damage"],
            dmgBonus: { "total": 0, "sources": [] },
            damageTypes: [],
            crit: {
              range: weapon.value["Critical"].split("/")[0],
              mult: weapon.value["Critical"].split("/")[1]
            },
            range: weapon.value.range
            // notes: weapon.value["Extras"]["Notes"]
          }
        };

        newAtk.value.crit = {};
        newAtk.value.crit.range = weapon.value.Critical.split("/")[0];
        newAtk.value.crit.mult = weapon.value.Critical.split("/")[1];
        newAtk.value.extras = (weapon.value.Extras) ? weapon.value.Extras : [];

        // Attack Bonus

        this.applyBonus("BAB", this.bab, newAtk.value.atkBonus);
        this.applyBonus("Size", this.sizeStats["ac / atk"], newAtk.value.atkBonus);
        // Add mwk or magic enhancements to atk bonus
        if (weapon.value.Extras["Enhancement"] > 0) {
          this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.value.atkBonus);
          this.applyBonus("Magic Enhancement", weapon.value.Extras["Enhancement"], newAtk.value.dmgBonus);
        } else if (weapon.value.Extras["Masterwork"]) {
          this.applyBonus("Masterwork", 1, newAtk.value.atkBonus);
        }
        // Add AbilMod to atkBonus
        if (weapon.value.Extras.atkAbilOverride) {
          this.applyBonus(weapon.value.Extras.atkAbilOverride, this.attributes[weapon.value.Extras.atkAbilOverride].mod, newAtk.value.atkBonus);
        } else if (type == "Ranged") {
          this.applyBonus("Dex", this.attributes.Dex.mod, newAtk.value.atkBonus);
        } else {
          this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.atkBonus);
        }

        // Damage Bonus

        // Add AbilMod to dmgBonus
        if (weapon.value.Extras.dmgAbilOverride) {
          this.applyBonus(weapon.value.Extras.dmgAbilOverride, this.attributes[weapon.value.Extras.dmgAbilOverride].mod, newAtk.value.dmgBonus);

        } else if ( weapon.value.Group.includes("Thrown") ||
          (weapon.value.Group.includes("Bows") && this.attributes.Str.mod < 0) ||
          (weapon.value.Group.includes("Bows") && name.includes("Composite")) ) {
            // BOW && THROWN STR MOD
            this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);

        } else if ( type == "Melee"){
          if (weapon.label == mainHand.label) {
            // Main Hand
            if (offHand == undefined && (weapon.value.Category == "One-Handed" || weapon.value.Category == "Two-Handed")) {
              // if using two hands (off-hand empty)
              this.applyBonus("Str", Math.floor(this.attributes.Str.mod * 1.5), newAtk.value.dmgBonus);
            } else {
              // ie, main and shield
              this.applyBonus("Str", this.attributes.Str.mod, newAtk.value.dmgBonus);
            }

          } else {
            // Off Hand
            if (weapon.value.Category == "Light" || weapon.value.Category == "One-Handed") {
              this.applyBonus("Str", Math.floor(this.attributes.Str.mod / 2), newAtk.value.dmgBonus);
            }
          }
        }

        // Dual Wield penalties done in abilities -> bonuses
        /*
        penalties to AtkBonus, during a full-round atk
        light & feat      { main -2  off -2 }
        two-weapon feat   { main -4  off -4 }
        off hand light    { main -4  off -8 }
        normal            { main -6  off -10}
        */

        // Weapon Specific Bonuses (like for Weapon Focus)
        this.bonusLoop(newAtk.value.atkBonus, weapon.label.concat("AtkBonus"));
        this.bonusLoop(newAtk.value.dmgBonus, weapon.label.concat("DmgBonus"));

        // Add Active Bonuses
        this.bonusLoop(newAtk.value.atkBonus, type.concat("AtkBonus"));
        this.bonusLoop(newAtk.value.dmgBonus, type.concat("DmgBonus"));

        // set damage types
        for (const category of Object.values(this.rules["Damage Types"])) {
          for (const cType of Object.values(category)) {
            weapon.value["Damage Type"].forEach(aType => {
              if (aType == cType.value) {
                newAtk.value.damageTypes.push(cType);
              }
            });
          }
        }

        type = (type == 'Melee') ? 0 : 1;
        actions[type].children.push(newAtk);
      } // End Weapons loop

      // If only 1 Primary Natural Attack (no other atks), add 0.5 * Str
      let sum = actions[0].children.length + actions[1].children.length + actions[2].children.length;
      if ( sum == 1 ) {
        if (actions[0].children.length) {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), actions[0].children[0].value.dmgBonus);
        } else if (actions[1].children.length) {
          this.applyBonus("Str", (this.attributes.Str.mod / 2), actions[1].children[0].value.dmgBonus);
        } else if (actions[2].children.length) {
          this.applyBonus("Str * 1.5", (this.attributes.Str.mod / 2), actions[2].children[0].value.dmgBonus);
        }
      }

      return actions;
    },
    // USES: bonusLoop(bonuses), attributes, invTotal
    skills() {
      let skills = {};

      for (const [name, skill] of Object.entries(this.character.skills)) {
        let bonus = { "total": 0, "sources": [] };
        // Size Mod
        if (name == "Stealth" || name == "Fly") {
          this.applyBonus("Size", this.sizeStats[name.toLowerCase()], bonus);
        }
        // Ranks
        if (skill.ranks) {
          this.applyBonus("Ranks", skill.ranks, bonus);
          if (skill.class) {
            this.applyBonus("Class Skill", 3, bonus);
          }
        }
        // Ability
        let abil = this.rules.skills[name].ability;
        this.applyBonus(abil.concat("Mod"), this.attributes[abil].mod, bonus);

        // Armor / Encumberance Penalty
        if (this.rules.skills[name].armor_pen) {
          this.bonusLoop(bonus, 'armorSkills');
        }

        this.bonusLoop(bonus, name);
        this.bonusLoop(bonus, 'skills');
        // Add leading + to main display
        bonus.total = (bonus.total > -1) ? "+".concat(bonus.total) : bonus.total;
        skill.bonus = bonus;
        skills[name] = skill;
      }
      return skills;
    },
    // USES: bonusLoop(bonuses), attributes
    concentration() {
      let classes = {};
      for (let [cName, cClass] of Object.entries(this.character.classes)) {
        if (!this.classes[cName].magic) { continue; }
        classes[cName] = { "total": 0, "sources": [] };
        this.applyBonus(`${this.capFirsts(cName)} Caster Level`, cClass.levels, classes[cName]);
        this.applyBonus(`${this.classes[cName].magic.castingAtr}Mod`, this.attributes[this.classes[cName].magic.castingAtr].mod, classes[cName]);
        this.bonusLoop(classes[cName], `${this.capFirsts(cName)} Concentration`);
      } // end class loop
      return classes;
    },
    // USES: abilities
    knownMetas() {
      let knownMetas = [];
      let metas = [
        { "name": "Apocalyptic Spell", "increase": 1 },
        { "name": "Aquatic Spell", "increase": 1 },
        { "name": "Benthic Spell", "increase": 1 },
        { "name": "Blissful Spell", "increase": 1 },
        { "name": "Bouncing Spell", "increase": 1 },
        { "name": "Brackish Spell", "increase": 0 },
        { "name": "Brisk Spell", "increase": 0 },
        { "name": "Cherry Blossom Spell", "increase": 3 },
        { "name": "Coaxing Spell", "increase": 2 },
        { "name": "Concussive Spell", "increase": 2 },
        { "name": "Conditional Spell", "increase": 1 },
        { "name": "Consecrate Spell", "increase": 2 },
        { "name": "Contagious Spell", "increase": 2 },
        { "name": "Contingent Spell", "increase": 2 },
        { "name": "Crypt Spell", "increase": 1 },
        { "name": "Dazing Spell", "increase": 3 },
        { "name": "Delayed Spell", "increase": 1 },
        { "name": "Disruptive Spell", "increase": 1 },
        { "name": "Echoing Spell", "increase": 3 },
        { "name": "Eclipsed Spell", "increase": 0 },
        { "name": "Ectoplasmic Spell", "increase": 1 },
        { "name": "Elemental Spell", "increase": 1 },
        { "name": "Empower Spell", "increase": 2 },
        { "name": "Encouraging Spell", "increase": 1 },
        { "name": "Enlarge Spell", "increase": 1 },
        { "name": "Extend Spell", "increase": 1 },
        { "name": "Familiar Spell", "increase": 3 },
        { "name": "Fearsome Spell", "increase": 2 },
        { "name": "Flaring Spell", "increase": 1 },
        { "name": "Fleeting Spell", "increase": 0 },
        { "name": "Focused Spell", "increase": 1 },
        { "name": "Furious Spell", "increase": 1 },
        { "name": "Heighten Spell", "increase": 10 },
        { "name": "Intensified Spell", "increase": 1 },
        { "name": "Intuitive Spell", "increase": 1 },
        { "name": "Jinxed Spell", "increase": 1 },
        { "name": "Latent Curse", "increase":	1 },
        { "name": "Lingering Spell", "increase":	1 },
        { "name": "Logical Spell", "increase":	1 },
        { "name": "Maximize Spell", "increase":	3 },
        { "name": "Merciful Spell", "increase":	0 },
        { "name": "Murky Spell", "increase": 0 },
        { "name": "Persistent Spell", "increase":	2 },
        { "name": "Piercing Spell", "increase":	1 },
        { "name": "Quicken Spell", "increase": 4 },
        { "name": "Reach Spell", "increase": 10 },
        { "name": "Rime Spell", "increase": 1 },
        { "name": "Scarring Spell", "increase": 1 },
        { "name": "Scouting Summons", "increase": 2 },
        { "name": "Seeking Spell", "increase": 2 },
        { "name": "Selective Spell", "increase": 1 },
        { "name": "Shadow Grasp", "increase": 1 },
        { "name": "Sickening Spell", "increase": 2 },
        { "name": "Silent Spell", "increase": 1 },
        { "name": "Snuffing Spell", "increase": 2 },
        { "name": "Solar Spell", "increase": 1 },
        { "name": "Solid Shadows", "increase": 1 },
        { "name": "Still Spell", "increase": 1 },
        { "name": "Steam Spell", "increase": 0 },
        { "name": "Studied Spell", "increase": 2 },
        { "name": "Stygian Spell", "increase": 2 },
        { "name": "Stylized Spell", "increase": 1 },
        { "name": "Tenacious Spell", "increase": 1 },
        { "name": "Tenebrous Spell", "increase": 0 },
        { "name": "Thanatopic Spell", "increase": 2 },
        { "name": "Threatening Illusion", "increase": 1 },
        { "name": "Threnodic Spell", "increase": 2 },
        { "name": "Thundering Spell", "increase": 2 },
        { "name": "Toppling Spell", "increase": 1 },
        { "name": "Toxic Spell", "increase": 1 },
        { "name": "Traumatic Spell", "increase": 2 },
        { "name": "Trick Spell", "increase": 1 },
        { "name": "Tumultuous Spell", "increase": 1 },
        { "name": "Umbral Spell", "increase": 2 },
        { "name": "Vast Spell", "increase": 1 },
        { "name": "Verdant Spell", "increase": 2 },
        { "name": "Widen Spell", "increase": 3 },
        { "name": "Yai-Mimic Spell", "increase": 3 },
      ];
      for (const name of Object.keys(this.abilities)) {
        metas.forEach( meta => {
          if (meta.name == name) {
            knownMetas.push(meta);
          }
        });
      }
      return knownMetas;
    },

  },
  mounted() {
    if (!this.rules) { this.$router.push("/"); }

    CharacterService.getCharacter(this.$route.params.id)
    .then((response) => {
      console.log('response', response);
      this.character = response.character;
      document.getElementsByClassName('title')[0].innerHTML = this.character.name;
      this.spellTabs = Object.keys(this.character.spells)[0];

      this.loading = false;
    })
    .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
    .finally(() => {
      // Wait until refs are loaded:
      this.disabledCastPSPells();

      // add Rest button to tabs
      console.log(this.$refs.mainTabs.$el.children[1]);
      const mainTabs = this.$refs.mainTabs.$el.children[1].querySelector('.el-tabs__nav-scroll');
      mainTabs.appendChild(this.$refs.restBtn.$el);

      // Put Add Spell btn in class spells tabs, wait til refs loaded
      const spellTabs = this.$refs.spellTabs.$el.querySelector('.el-tabs__nav-scroll');
      spellTabs.appendChild(this.$refs.addSpell.$el);

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
      /*
      Hide selected items when clicking a context menu item

      OBR.contextMenu.create({
      id: "rodeo.owlbear.example",
      icons: [
      {
      icon: "icon.svg",
      label: "Example",
      },
      ],
      onClick(context) {
      OBR.scene.items.updateItems(context.items, (items) => {
      for (let item of items) {
      item.visible = false;
      }
      });
      },
      });
      */


    }); // end getCharacter .finally()


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
    // Add Active Bonuses
    bonusLoop(object, tString) {
      // object = the bonus object we are adding to: { total: #, sources: [] }
      // tString = the target string we match to add to the bonus object: "atkBonus" || "Str" || "touchAC"
      let typedBonuses = {};
      let prefix = "";
      // if (tString == "totalAC") { console.log(tString, object); }

      for (let [name, bonus] of Object.entries(this.bonuses)) {
        prefix = (bonus.value > 0) ? "+" : "";
        // If the bonus type doesn't stack
        if (Object.keys(this.rules.bonuses).includes(bonus.type)) {
          // If we have the type of bonus already
          if (typedBonuses[bonus.type]) {
            // If the current is higher, skip
            if (typedBonuses[bonus.type].value > bonus.value) {
              continue;
            } else {
              // remove current bonus & value
              bonus.targets.forEach(target => {
                if (target == tString) {
                  object.total -= typedBonuses[bonus.type].value;
                  // loop on sources looking for the one to remove
                  object.sources.forEach((source, i) => {
                    if ( source.includes(typedBonuses[bonus.type].name) ) {
                      object.sources.splice(i, 1);
                    }
                  });
                }
              });
            }
          }
          typedBonuses[bonus.type] = { name: name, value: bonus.value };
        } // End typed bonus prep

        if (!object.sources.includes(`${prefix}${bonus.value} ${name}`)) {
          // if we dont already have that specific bonus applied, add it
          bonus.targets.forEach(target => {
            if (target == tString) {
              // If bonus.targets includes tString, apply it
              object.total += parseInt(bonus.value);
              object.sources.push(`${prefix}${bonus.value} ${name}`);
            }
          });
        }
      } // End Bonuses Loop
    },
    applyBonus(name, value, obj) {
      if (value != 0) {
        let prefix = (value > 0) ? "+" : "";
        obj.total += value;
        obj.sources.push(`${prefix}${value} ${name}`);
      }
    },
    healthCheck() {
      let deathNum, curr = this.health.total - this.health.damage;
      if (this.character.basics.type.name == "undead") {
        deathNum = 0 - this.attributes.Cha.total;
      } else if (this.character.basics.type.name == "construct") {
        deathNum = 0;
      } else {
        deathNum = 0 - this.attributes.Con.total;
      }

      if (this.health.nonlethal == curr) {
        // When (nonlethal damage == current HP) { you are STAGGERED }
        this.activeConditions.push(this.conditions[30]);
        this.$message({ message: "You become staggered", type: "warning" });

      } else if (this.health.nonlethal == curr+1) {
        // When (nonlethal damage > current HP) { you are UNCONSIOUS }
        this.activeConditions.push(this.conditions[32]);
        this.$message({ message: "You fall unconsious", type: "warning" });

      } else if (curr == 0) {
        // When (current HP == 0) { you are DISABLED }
        this.activeConditions.push(this.conditions[8]);
        this.$message({ message: "You become disabled", type: "error" });

      } else if (curr == -1) {
        // When (current HP < 0) { you are DYING }
        // check for hitting -1, then add the condition and don't keep adding it
        this.activeConditions.push(this.conditions[9]);
        this.$message({ message: "YOU ARE DYING", type: "error" });

      } else if (curr <= deathNum) {
        this.$alert( "<strong style='font-size:36px; color:red;'> YOU HAVE DIED </strong>", null, { center: true, dangerouslyUseHTMLString: true, });
      }

    },

    rest() {
      this.character.health.damage = 0;
      this.character.health.nonlethal = 0;
      // reset resources like rage
      for (const res of Object.values(this.character.resources)) {
        res.left = res.total;
      }
      // reset P & G spells
      for (const cClass of Object.values(this.character.spells)) {
        for (const spellLevel of Object.values(cClass)) {
          for (const spell of Object.values(spellLevel)) {
            spell.casts = 0;
          }
        }
      }
      // reset S spells
      for (const cClass of Object.values(this.character.classes)) {
        if (cClass.remainingCasts) {
          cClass.remainingCasts = Array.from(cClass.spellsPerDay);
          cClass.remainingCasts[0] = 1;
        }
      }

      this.$message({ message: "Resting for 8 hours", type: "success" });
    },
    saveCharacter() {
      console.log(this.character);

      CharacterService.updateCharacter(this.character)
      .then((response) => { this.$message({ message: `${response.character.name} updated`, type: 'success', }); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
    },

    /***************************\
    *                           *
    *         ABILITIES         *
    *                           *
    \***************************/
    toggleAbility(name, abil) {
      if (this.activeConditions[name]) {
        delete this.activeConditions[name];
        this.actions.special[name].extras.active = false;
      } else {
        this.activeConditions[name] = abil;
        this.actions.special[name].extras.active = true;
      }
    },
    abilShowMain(name, abil) { abil.extras.showMain = abil.extras.showMain ? false : true; },
    addNewAbility() {
      this.abil = {
        trigger: "Standard",
        description: "",
        benefit: { target: "Self", text: "" },
        bonuses: {},
        extras: { active: true, source: "Feat", showMain: false }
      };
      this.editingAbil = true;
    },
    saveAbility(abil) {
      let name = Object.keys(abil)[0];
      this.abilities[name] = abil[name];
      this.editingAbil = false;
    },
    editAbility(name, ability) {
      this.abilName = name;
      this.abil = {};
      this.abil = ability;
      this.editingAbil = true;
    },
    deleteAbil(name) {
      delete this.abilities[name];
      this.$message({ message: `${name} was removed from abilities`, type: "warning" });
    },
    actionBtn(action) {
      console.log(action);
      // TODO: do magic
    },
    updateAction(draggingNode, dropNode) {
      let action = draggingNode.data.label;
      if (this.character.attacks[action]) {
        let style = ['Melee', 'Ranged', 'Special'].includes(dropNode.data.label) ? dropNode.data.label : dropNode.parent.data.label;
        this.character.attacks[action].style = style;
      }
    },

    /***************************\
    *                           *
    *         CONDITIONS        *
    *                           *
    \***************************/
    addNewContion() {
      this.addingCondition = true;
      this.newCondition = {
        name: "",
        description: "",
        bonuses: {}
      };
    },
    addNewConditionBonus() {
      let name = this.newCondition.name;
      if (name) {
        this.newCondition.bonuses[name.concat(" ", Object.keys(this.newCondition.bonuses).length)] = {
          type: "Condition",
          value: 0,
          targets: []
        };
      } else {
        this.$message({ message: "Input Condition Name First", type: "error" });
      }
    },
    addCondition() {
      this.conditions.push(this.newCondition);
      this.addingCondition = false;
    },

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
    encumbranceMalus(bonusName, value, targets) {
      this.encumbrance.bonuses[bonusName] = {
        type: "Condition",
        value: value,
        targets: targets
      };
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
      // BUG: When changing the name of an item, duplicates it, since we check item name for updates
      if (this.$refs['tree'].getNode(item.label)) {
        this.$message({ message: `${item.label} Updated`, type: "success" });
      } else {
        this.inventory[2].children.push(item);
      }
      this.editingItem = false;
    },
    editItem(item) {
      if (!item.value) { item.value = {}; }
      let base = { Description:'', Cost:0, Weight:0, Ammount:1, Extras:{ Notes: [] } };
      for (let [key, value] of Object.entries(base)) {
        if (!item.value[key]) {
          item.value[key] = value;
        }
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

    /***************************\
    *                           *
    *          SPELLS           *
    *                           *
    \***************************/
    // Add a spell to spells known (by class)
    addSpell() {
      let cClass = this.character.spells[this.newSpell.class];

      if ( !cClass[this.newSpell.level] ) { cClass[this.newSpell.level] = {}; }
      if (cClass[this.newSpell.level][this.newSpell.name]) {
        this.$message({ message: `You already know a ${this.newSpell.class} spell called ${this.newSpell.name}`, type: "warning" });
        return;
      } else {
        cClass[this.newSpell.level][this.newSpell.name] = {
          'casts': 0,
          'castTime': '1 Standard',
          'components': 'V,S,M/DF',
          'target': 'Self',
          'range': 'Close',
          'duration': 'Instant',
          'save': 'Ref (half)',
          'SR': true,
          'description': ""
        };
        this.newSpell = { name: "", level: 0, class: "" };
      }
    },
    // Add info into the spell popOver
    spellPop(spell, level, cName) {
      if (level == 0) {
        this.spellCost = 0;
      } else {
        let cost = 1 + level;
        // Spontaneous = (casts * 1) + metamagic increase
        // Prepared    = (casts * spell level)  + metamagic increase
        let mult = this.classes[cName].magic.style.includes('Spontaneous') ? 1 : level;
        cost += (mult * spell.casts);
        this.spellCost = cost;
        if (this.metamagic && this.metamagic.increase) {
          this.spellCost += this.metamagic.increase;
        }
        if ( (this.character.classes[cName].openRemaining - this.spellCost) <= 0 ) {
          this.gFatigue = 10 + cost;
        }
      }
    },
    // Galdur Spells
    castGSpell(sName, spell, level, cName) {
      if (level == 0 && !this.metamagic.increase) {
        return;
      } else if ( (this.character.classes[cName].openRemaining - this.spellCost) >= 0 ) {
        this.character.classes[cName].openRemaining -= this.spellCost;
      } else if (
        ( this.character.classes[cName].openRemaining != 0 ) &&
        ( (this.character.classes[cName].openRemaining - this.spellCost) < 0 )
      ) {
        let remain = Math.abs(this.character.classes[cName].openRemaining - this.spellCost);
        this.character.classes[cName].openRemaining = 0;
        this.character.classes[cName].reserveRemaining -= remain;
      } else if ( (this.character.classes[cName].reserveRemaining - this.spellCost) >= 0 ) {
        this.character.classes[cName].reserveRemaining -= this.spellCost;
      } else {
        this.$message({ message: `You do not have enough Galdur to cast ${sName}`, type: "error" });
        this.metamagic = {};
        return;
      }

      spell.casts++;
      this.metamagic = {};
      this.spellPop(spell, level, cName);
    },
    // Prepared Spells
    castPSpell(cName, level, spell, index) {
      if (level == 0) { return; }
      let btn = this.$refs[`${spell}-${index}`][0].$el;
      btn.setAttribute('disabled', true);
      btn.classList.add('is-disabled');
      this.character.spells[cName][level][spell].casts++;
    },
    disabledCastPSPells() {
      let btn = "EL BTN";
      // For each class, if its a preppared caster
      for (const [cName, cClass] of Object.entries( this.character.classes )) {
        if (cClass.preparedSpells) {
          // For each preppared spell ([lvl][spell]),
          cClass.preparedSpells.forEach((spells, lvl) => {
            spells.forEach(spell => {
              // disable duplicate spells until the number of disabled spells == num of casts
              let preps = spells.filter(name => name === spell).length;
              for (let i = 0; i < preps; i++) {
                if ( this.$refs[`${spell}-${i}`]) {
                  btn = this.$refs[`${spell}-${i}`][0].$el;
                  if (i+1 <= this.character.spells[cName][lvl][spell].casts) {
                    btn.setAttribute('disabled', true);
                    btn.classList.add('is-disabled');
                  }
                }
              }
            });
          });
        }
      }
    },
    // Spontaneous Spells
    castSSpell(cName, level) {
      if (this.metamagic && this.metamagic.increase) { level += this.metamagic.increase; }
      if (level > 0) { this.character.classes[cName].remainingCasts[level] --; }
      this.metamagic = {};
    },
  }
};
</script>
