<template lang="html">
  <div class="container">

    <el-card v-if="!loading" class="user-card">
      <template #header>
        <el-row justify="space-evenly" align="middle">
          <el-col :xs="8" :span="12">
            <strong>{{ user.username }}'s</strong> Profile
          </el-col>
          <el-col :span="8">
            <el-button type="primary" :onclick="editUser">
              <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Edit
            </el-button>
          </el-col>
        </el-row>
      </template>

      <el-descriptions :column="1" border >
        <el-descriptions-item>
          <template #label> Email </template>
          <el-input v-model="user.email" disabled />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> Roles </template>
          <el-select v-model="user.roles" prop="roles" multiple disabled >
            <el-option v-for="role in user.roles" :key="role" :label="role" :value="role" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> Darkmode </template>
          <el-switch v-model="user.usermeta.darkmode" disabled>
            <template #active-action>
              <span class="custom-active-action">T</span>
            </template>
            <template #inactive-action>
              <span class="custom-inactive-action">F</span>
            </template>
          </el-switch>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> Favorite Color </template>
          <div class="color-display"></div>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider> Hero </el-divider>
      <el-row v-if="hero" :gutter="10" align="middle">
        <el-col :span="4">
          <el-button type="primary" circle @click="viewCharacter(hero.id)">
            <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
          </el-button>
        </el-col>
        <el-col :span="20">
          <el-input v-model="hero.name" aria-label="Character Name" disabled>
            <template #prepend> Name </template>
          </el-input>
          <el-tag v-for="(cClass, cName) in hero.classes" :key="cName" effect="dark" style="margin-right: 5px;">
            {{ capFirsts(cName) }} {{ cClass.levels }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row v-else justify="center">
        Please select a character while editing
      </el-row>

    </el-card>
  </div>
</template>

<script>
import UserService from "@/services/user.service";
import CharacterService from "@/services/character.service";

export default {
  name: "View User",
  data() {
    return {
      loading: true,
      hero: {},
      user: {},
    };
  },
  computed: {
    currentUser() { return this.$store.state.auth.user; }
  },
  mounted() {
    if (this.currentUser.roles.includes("admin")) {
      UserService.getUser(this.$route.params.id)
      .then(response => {
        this.user = Object.create(response.data);
        this.user.roles = [];
        for (let role of response.data.roles) {
          this.user.roles.push(role.name);
        }

      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      .finally(() => {
        CharacterService.getCharacter(this.user.usermeta.hero)
        .then(response => { this.hero = response.character; })
        .catch(err => { console.error(err); })
        .finally(() => { this.loading = false; });
      }); // End getUser

    // If user is not an admin, get logged in user's data
    } else {
      UserService.getUser(this.currentUser.id)
      .then(response => {
        this.user = Object.create(response.data);
        this.user.roles = [];
        for (let role of response.data.roles) {
          this.user.roles.push(role.name);
        }

      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      .finally(() => {
        CharacterService.getCharacter(this.user.usermeta.hero)
        .then(response => {
          this.hero = response.character;
        })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
        .finally(() => { this.loading = false; });
      }); // End getUser
    }
  },

  methods: {
    capFirsts(string) { return string ? string.replace(/(^\w|\s\w)/g, m => m.toUpperCase()) : ""; },
    editUser() { this.$router.push({ name: 'user-edit', params: { id: this.user.id } }); },
    viewCharacter(id) { this.$router.push({ name: 'character-view', params: { id: id } }); },
  }
}
</script>

<style lang="css" scoped>
.container {
  display: flex;
  justify-content: center;
}
.card-header {
  display: flex;
  justify-content: space-between;
}

.color-display {
  width: 30px;
  height: 30px;
  background-color: var(--el-color-primary);
  border-radius: 5px;
}
</style>
