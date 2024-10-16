<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">

        <el-form-item label="User Search" prop="tableSearch">
          <el-input v-model="tableSearch" placeholder="Type to search" v-on:change="nameSearch()" />
        </el-form-item>


      </el-col>
      <el-col :span="3">
        <el-button @click="openModal">
          <g-icon iconSize="24px" iconName="userAdd" style="margin-right: 5px;" /> Create User
        </el-button>
      </el-col>
    </el-row>

    <el-table
      ref="userTable"
      :data="tableData"
      :default-sort="{ prop: 'name', order: 'ascending' }"
      v-loading="loading"
      table-layout="auto"
      height="500"
      style="width: 100%"
      stripe
      :lazy="true"
    >
      <el-table-column sortable prop="id" label="ID" width="65" />
      <el-table-column sortable prop="username" label="Name" min-width="120" />
      <el-table-column sortable prop="email" label="Email" />
      <el-table-column prop="roles" label="Roles" :filters="roles" :filter-method="filterRoles" filter-placement="bottom">
        <template #default="scope">
          <el-tag v-for="role in scope.row.roles" :key="role.id" type="primary" effect="dark" >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="140" style="display: flex">
        <template #default="scope">
          <el-button type="primary" circle @click="viewUser(scope.row.id)">
            <g-icon iconName="eye" iconSize="28" />
          </el-button>
          <el-button type="primary" circle @click="editUser(scope.row.id)">
            <g-icon iconName="quill" iconSize="24" />
          </el-button>
          <el-button type="primary" circle @click="deleteUser(scope.row.id)">
            <g-icon iconName="trash" iconSize="24" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- CREATE MODAL -->
    <el-dialog
      :model="cardVisible"
      :before-close="closeModal"
      title="Create User"
      width="650"
      style="margin-top: 20vh"
    >

      <el-form :model="newUser" :rules="rules" ref="user" label-width="auto" status-icon >
        <el-form-item label="Username" prop="username">
          <el-input v-model="newUser.username" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="newUser.email" />
        </el-form-item>
        <el-form-item label="Roles">
          <el-select v-model="newUser.roles" prop="roles" multiple >
            <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>

        <el-space v-if="newUser.usermeta" fill>
          <el-divider> Colors </el-divider>
          <el-form-item label="Darkmode">
            <el-switch v-model="newUser.usermeta.darkmode" >
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
            <el-color-picker v-model="newUser.usermeta.faveColor" />
          </el-form-item>
        </el-space>

        <el-space v-if="newUser.usermeta" fill style="max-width: 300px;">
          <el-divider> Hero </el-divider>
          <el-form-item label="Character Name" prop="heroName">
            <el-input v-model="newUser.usermeta.hero.name" disabled />
          </el-form-item>
          <el-form-item label="Classes">
            <el-select v-model="newUser.usermeta.hero.classes" prop="heroClasses" multiple disabled placeholder="" >
              <el-option v-for="item in newUser.usermeta.hero.classes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-space>
      </el-form>

      <div class="center-horz">
        <el-button type="primary" @click="createUser">
          <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Submit
        </el-button>
        <el-button type="primary" @click="closeModal">
          <g-icon iconName="quill" iconSize="25" style="margin-right: 5px;" /> Close
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "List Users",
  data() {
    return {
      loading: false,
      allUsers: [],
      tableData: [],
      tableSearch: "",
      roles: [
        { text: "Admin", value: "admin" },
        { text: "Story Teller", value: "storyteller" },
        { text: "User", value: "user" },
      ],

      // Create User Modal
      cardVisible: false,
      newUser: {},
      rules: {
        username: [{ required: true, message: "Please enter a username", trigger: 'blur' }],
        email: [{ required: true, validator: this.validateEmail, trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    this.loading = true;
    this.loadUsers();
  },

  methods: {
    nameSearch() {
      let uName, searchStr, users = this.allUsers;
      searchStr = this.tableSearch.toLowerCase();
      this.tableData = [];
      if (searchStr == "") {
        this.tableData = users;
        return;
      }
      this.loading = true;
      for (let i = 0; i < users.length; i++) {
        uName = users[i].username.toLowerCase();
        if ( uName.includes( searchStr ) ) {
          this.tableData.push(users[i]);
        }
      }
      this.loading = false;
    },
    filterRoles(value, row, column) {
      const property = column['property'];
      let hasRole = false;
      if (row[property]) {
        for (let role of row[property]) {
          if (role.name.toLowerCase() == value) {
            hasRole = true;
          }
        }
        return hasRole
      }
    },

    loadUsers() {
      UserService.getAllUsers()
      .then(response => {
        this.allUsers = response.data;
        this.tableData = response.data;
        this.loading = false;
      })
      .catch(err => {
        this.$message({ message: err, type: 'error', });
        console.error(err);
      });
    },
    createUser() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          this.newUser.password = `pwd4${this.newUser.username}`;
          UserService.createUser(this.newUser)
          .then(response => {
            this.$message({ message: response.message, type: 'success' });
            this.loadUsers();
          })
          .catch(err => {
            this.$message({ message: err, type: 'error', });
            console.error(err);
          });
        } else {
          console.log('Form not valid!');
          return false;
        }
      });
      this.cardVisible = false;
    },
    viewUser(id) {
      this.$router.push({ name: 'user-view', params: { id: id } });
    },
    editUser(id) {
      this.$router.push({ name: 'user-edit', params: { id: id } });
    },
    deleteUser(id) {
      UserService.deleteUser(id)
      .then(response => {
        this.$message({ message: response.message, type: 'success' });
        this.loadUsers();
      })
      .catch(err => {
        this.$message({ message: err, type: 'error', });
        console.error(err);
      });
    },

    openModal() {
      this.newUser.usermeta = { hero: {} };
      this.cardVisible = true;
    },
    closeModal() {
      this.$confirm('Entered data will be deleted', 'Cloase Modal?', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(() => {
        this.cardVisible = false;
        this.newUser = {};
      });
    }

  }
};
</script>
