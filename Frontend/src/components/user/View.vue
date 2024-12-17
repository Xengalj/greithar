<template lang="html">
  <div class="container">

    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <span><strong>{{ user.username }}'s'</strong> Profile</span>
          <el-button type="primary" :onclick="editUser">
            <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Edit
          </el-button>
        </div>
      </template>

      <el-form :model="user" label-width="auto">
        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" disabled />
        </el-form-item>
        <el-form-item label="Roles">
          <el-select v-model="user.roles" prop="roles" multiple disabled >
            <el-option v-for="role in user.roles" :key="role" :label="role" :value="role" />
          </el-select>
        </el-form-item>

        <el-divider> Colors </el-divider>
        <el-form-item label="Darkmode">
          <el-switch v-model="user.usermeta.darkmode" disabled>
            <template #active-action>
              <span class="custom-active-action">T</span>
            </template>
            <template #inactive-action>
              <span class="custom-inactive-action">F</span>
            </template>
          </el-switch>
        </el-form-item>
        <el-form-item label="Favorite Color">
          <div class="color-display"></div>
        </el-form-item>

        <el-divider> Hero </el-divider>
        <el-form-item label="Character Name" prop="heroName">
          <el-input v-model="user.usermeta.hero.name" disabled />
        </el-form-item>
        <el-form-item label="Classes">
          <el-select v-model="user.usermeta.hero.classes" prop="heroClasses" multiple disabled placeholder="" >
            <el-option v-for="item in user.usermeta.hero.classes" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "View User",
  data() {
    return {
      user: {
        roles: [],
        usermeta: {
          hero: {
            classes: []
          }
        }
      }
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },

  mounted() {
    if (this.currentUser.roles.includes("admin")) {
      UserService.getUser(this.$route.params.id)
      .then(response => {
        for(const [key, value] of Object.entries(response.data)) {
          if (key == "roles") {
            for (const role of value) {
              this.user['roles'].push(role.name);
            }
          } else {
            this.user[key] = value;
          }
        }
      })
      .catch(err => {
        this.$message({ message: err, type: 'error', });
        console.error(err);
      });

    // If user is not an admin, get logged in user's data
    } else {
      UserService.getUser(this.currentUser.id)
      .then(response => {
        for(const [key, value] of Object.entries(response.data)) {
          if (key == "roles") {
            for (let role of value) {
              this.user['roles'].push(role.name);
            }
          } else {
            this.user[key] = value;
          }
        }
      })
      .catch(err => {
        this.$message({ message: err, type: 'error', });
        console.error(err);
      });
    }
  },

  methods: {
    editUser() {
      this.$router.push({ name: 'user-edit', params: { id: this.user.id } });
    }
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
