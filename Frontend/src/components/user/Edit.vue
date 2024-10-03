<template lang="html">
  <div class="container">

    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <span><strong>{{ user.username }}'s'</strong> Profile</span>
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

<!-- Password -->
        <!--
         <el-form-item label="Username" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>

        <el-form-item label="Password" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="pass" label="Confirm" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
          />
        </el-form-item>

         -->

        <el-form-item label="Email" prop="email">
          <el-input v-model="user.email" />
        </el-form-item>

        <el-form-item v-if="isAdmin" label="Roles">
          <el-select v-model="user.roles" prop="roles" multiple >
            <el-option v-for="role in user.roles" :key="role" :label="role" :value="role" />
          </el-select>
        </el-form-item>

        <el-divider> Colors </el-divider>
        <el-form-item label="Darkmode">
          <el-switch v-model="user.usermeta.darkmode" >
            <template #active-action>
              <span class="custom-active-action">
                T
              </span>
            </template>
            <template #inactive-action>
              <span class="custom-inactive-action">
                F
              </span>
            </template>
          </el-switch>
        </el-form-item>

        <el-form-item label="Favorite Color">
          <el-color-picker v-model="user.usermeta.faveColor" />
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
// import { ElMessage } from 'element-plus'

export default {
  name: "View User",
  data() {
    let validateEmail = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('Please enter your email'));
       } else {
         let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!reg.test(value)) {
           return callback(new Error('Please enter a valid emiail'));
         }
         callback();
       }
     };
//      const validatePass = (rule: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('Please input the password'))
//   } else {
//     if (ruleForm.checkPass !== '') {
//       if (!ruleFormRef.value) return
//       ruleFormRef.value.validateField('checkPass', () => null)
//     }
//     callback()
//   }
// }
// const validatePass2 = (rule: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('Please input the password again'))
//   } else if (value !== ruleForm.pass) {
//     callback(new Error("Two inputs don't match!"))
//   } else {
//     callback()
//   }
// }

    return {
      orig: {},
      user: {
        usermeta: {
          hero: {
            classes: []
          }
        }
      },
      pass: "",
      checkPass: "",
      rules: {
        username: [
          { required: true, message: "Please enter a username", trigger: 'blur' },
        ],
        // pass: [{ validator: validatePass, trigger: 'blur' }],
        // checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' },
        ]
      }

    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isAdmin() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
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
          this.orig[key] = value;
        }
        console.log(this.user);
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

          console.log(this.user);
          UserService.updateUser(this.user)
          .then(response => {
          console.log(response);
            this.$message({
              message: 'User Submitted',
              type: 'success',
            })
          })
          .catch(err => {
            console.error(err);
          });




        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    resetForm() {
      this.user = this.orig;
      this.$refs.user.validate();
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

.color-display {
  width: 30px;
  height: 30px;
  background-color: var(--el-color-primary);
  border-radius: 5px;
}
</style>
