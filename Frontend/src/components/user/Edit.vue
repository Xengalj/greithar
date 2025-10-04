<template lang="html">
  <div class="container">

    <el-card v-if="!loading" class="user-card">
      <template #header>
        <strong>{{ user.username }}'s'</strong> Profile
      </template>

      <el-form
        :model="user"
        :rules="rules"
        ref="user"
        label-width="auto"
        status-icon
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="user.username" aria-label="Username Input" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" aria-label="Email Input" />
        </el-form-item>
        <el-form-item v-if="isAdmin" label="Roles">
          <el-select v-model="user.roles" multiple aria-label="Roles Select" >
            <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>

        <el-row :gutter="10" justify="center">
          <el-col :xs="24" :span="12">
            <el-divider> Theme </el-divider>
            <el-form-item label="Darkmode">
              <el-switch v-model="user.usermeta.darkmode" aria-label="Darkmode Switch" >
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
              <el-color-picker v-model="user.usermeta.faveColor" aria-label="Favorite Color Picker" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :span="12">
            <el-divider> Hero </el-divider>
            <el-form-item label="Hero">
              <el-select v-model="user.usermeta.hero" placeholder="Choose User" aria-label="User Select" >
                <el-option v-for="toon in characters" :key="toon.id" :label="toon.name" :value="toon.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="this.currentUser.id == this.$route.params.id">
        <el-form
          :model="userPass"
          :rules="passRules"
          ref="pass"
          label-width="auto"
          status-icon
        >
          <el-row  :gutter="10" justify="center" align="middle">
            <el-divider> New Password </el-divider>
            <el-col :span="24">
              <el-form-item label="New Password" prop="pass">
                <el-input v-model="userPass.pass" type="password" autocomplete="off" aria-label="New Passowrd Input" />
              </el-form-item>
              <el-form-item v-if="userPass.pass" label="Confirm" prop="checkPass">
                <el-input v-model="userPass.checkPass" type="password" autocomplete="off" aria-label="Password Confirmation" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <el-row justify="end" align="middle">
          <el-col :xs="7" :span="3">
            <el-button :onclick="resetForm" type="warning" plain> Reset </el-button>
          </el-col>
          <el-col :xs="6" :span="3">
            <el-button :onclick="submitForm" type="primary"> Submit </el-button>
          </el-col>
        </el-row>
      </template>
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
      roles: [
        { label: "Admin", value: "admin" },
        { label: "Story Teller", value: "storyteller" },
        { label: "User", value: "user" },
      ],
      rules: {
        username: [{ required: true, message: "Please enter a username", trigger: 'blur' }],
        email: [{ required: true, validator: this.validateEmail, trigger: 'blur' }],
      },
      passRules: {
        checkPass: [{ validator: this.validatePass2, trigger: 'blur' }]
      },

      user: { roles: [] },
      characters: [],
      userPass: {
        pass: "",
        checkPass: ""
      },

    };
  },
  computed: {
    currentUser() { return this.$store.state.auth.user; },
    isAdmin() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('admin');
      }
      return false;
    },
    canEdit() { return (this.isAdmin || this.currentUser.id == this.$route.params.id); }
  },
  mounted() {
    // allow editing if we are an admin or user to be edited
    if (this.canEdit) {
      UserService.getUser(this.$route.params.id)
      .then(response => {
        for (const [key,value] of Object.entries(response.data)) {
          if (key == 'roles') {
            value.forEach(role => {
              this.user.roles.push(role.name);
            });
          } else if (!['password', 'createdAt', 'updatedAt'].includes(key)) {
            this.user[key] = value;
          }
        }
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      .finally(() => {
        CharacterService.getAllCharacters(this.user.id)
        .then(response => { this.characters = JSON.parse(response.characters).rows; })
        .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
        .finally(() => { this.loading = false; });
      }); // End getUser
    }
  },

  methods: {
    resetForm() { this.$router.go() },
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
      } else if (value !== this.userPass.pass) {
        callback(new Error("The passwords don't match"));
      } else {
        callback();
      }
    },
    submitForm() {
      let passUpdated = this.userPass.pass ? true : false;


      this.$refs.user.validate((valid, fields) => {
        if (valid) {
          UserService.updateUser(this.user)
          .then(response => {
            this.$message({ message: `${response.username} updated sucessfully`, type: 'success' });

            // Update Fave Color
            let faveColor = "--el-color-primary: " + response.usermeta.faveColor + " !important";
            document.documentElement.style.cssText = faveColor;

            // Update Theme
            let theme = response.usermeta.darkmode ? "dark" : "";
            let html = document.getElementsByTagName("html")[0];
            html.setAttribute("class", theme);

            if (!passUpdated) {
              this.user.accessToken = response.token
              localStorage.setItem('user', JSON.stringify(this.user));
              this.$router.push({ name: 'user-view', params: { id: this.user.id } });
            }
          })
          .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });

        } else {
          for(const value of Object.values(fields)) {
            this.$message({ message: value[0].message, type: 'error', });
          }
          return false;
        }
      });

      if (passUpdated) {
        this.$refs.pass.validate((valid, fields) => {
          if (valid) {
            UserService.updatePassword(this.user.id, this.userPass.pass)
            .then(() => {
              this.$store.dispatch('auth/logout');
              this.$router.push('/login');
            })
            .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });

          } else {
            for(const value of Object.values(fields)) {
              this.$message({ message: value[0].message, type: 'error', });
            }
            return false;
          }
        });
      }






    },
  }

}
</script>

<style lang="css">
</style>
