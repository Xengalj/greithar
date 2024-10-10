<template lang="html">
  <div class="container">

    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <span><strong>{{ user.username }}'s</strong> Profile</span>
        </div>
      </template>

      <el-form
        :model="user"
        :rules="rules"
        ref="user"
        label-width="auto"
        status-icon
      >

        <el-form-item label="Username" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>

        <div v-if="this.currentUser.id == this.$route.params.id">
          <el-form-item label="New Password" prop="pass">
            <el-input v-model="pass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="pass" label="Confirm" prop="checkPass">
            <el-input v-model="checkPass" type="password" autocomplete="off" />
          </el-form-item>
        </div>

        <el-form-item v-if="isAdmin" label="Roles">
          <el-select v-model="user.roles" prop="roles" multiple >
            <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>


        <el-space v-if="user.usermeta" fill>
          <el-divider> Colors </el-divider>
          <el-form-item label="Darkmode">
            <el-switch v-model="user.usermeta.darkmode" >
              <template #active-action>
                <span class="custom-active-action">
                  <g-icon iconName="moon" iconSize="16" iconColor="black" />
                </span>
              </template>
              <template #inactive-action>
                <span class="custom-inactive-action">
                  <g-icon iconName="sun" iconSize="16" iconColor="black" />
                </span>
              </template>
            </el-switch>
          </el-form-item>

          <el-form-item label="Favorite Color">
            <el-color-picker v-model="user.usermeta.faveColor" />
          </el-form-item>
        </el-space>


        <el-space v-if="user.usermeta" fill>
          <el-divider> Hero </el-divider>
          <el-form-item label="Character Name" prop="heroName">
            <el-input v-model="user.usermeta.hero.name" disabled />
          </el-form-item>

          <el-form-item label="Classes">
            <el-select v-model="user.usermeta.hero.classes" prop="heroClasses" multiple disabled placeholder="" >
              <el-option v-for="item in user.usermeta.hero.classes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-space>

      </el-form>

      <template #footer>
        <div class="card-footer">
          <el-button type="primary" :onclick="submitForm">
            <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Submit
          </el-button>
          <el-button type="primary" :onclick="resetForm">
            <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Reset
          </el-button>
        </div>
      </template>
    </el-card>

  </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "View User",
  data() {
    return {
      user: {},
      pass: "",
      checkPass: "",
      roles: [
        { label: "Admin", value: "admin" },
        { label: "Story Teller", value: "storyteller" },
        { label: "User", value: "user" },
      ],
      rules: {
        username: [{ required: true, message: "Please enter a username", trigger: 'blur' }],
        email: [{ required: true, validator: this.validateEmail, trigger: 'blur' }],
        checkPass: [{ validator: this.validatePass2, trigger: 'blur' }]
      }

    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isAdmin() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('admin');
      }
      return false;
    },
    canEdit() {
      return (this.isAdmin || this.currentUser.id == this.$route.params.id);
    }
  },
  mounted() {
    // allow editing if we are an admin or user to be edited
    if (this.canEdit) {
      UserService.getUser(this.$route.params.id)
      .then(response => {
        for(const [key, value] of Object.entries(response)) {
          this.user[key] = value;
        }
      })
      .catch(err => {
        console.error(err);
      });
    }
  },

  methods: {
    submitForm() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          UserService.updateUser(this.user)
          .then(response => {
            this.$message({
              message: `${response.username} updated sucessfully`,
              type: 'success'
            });

            this.$router.push({ name: 'user-view', params: { id: this.currentUser.id } });
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'error',
            });
          });

        } else {
          console.log('submition error!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$router.go()
    },
    validateEmail(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please enter your email'));
      } else {
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!reg.test(value)) {
          return callback(new Error('Please enter a valid emiail'));
        }
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.pass) {
        callback(new Error("The passwords don't match"));
      } else {
        callback();
      }
    }
  }

}
</script>

<style lang="css" scoped>
.container {
  display: flex;
  justify-content: center;
}
.jumbotron.center-horz.title {
  margin-bottom: 1rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.card-footer {
  text-align: center;
}
.custom-active-action, .custom-inactive-action {
  display: flex;
}
</style>
