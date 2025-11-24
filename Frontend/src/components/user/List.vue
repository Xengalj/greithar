<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row justify="space-between" style="margin-bottom:20px;">
      <el-col :span="14">
        <el-input v-model="tableSearch" v-on:change="nameSearch()" aria-label="User Search">
          <template #prepend> Search </template>
        </el-input>
      </el-col>
      <el-col :xs="9" :span="3">
        <el-button @click="openModal">
          <g-icon iconSize="24px" iconName="userAdd" style="margin-right: 5px;" /> Create
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableUsers"
      :default-sort="{ prop: 'name', order: 'ascending' }"
      :lazy="true"
      max-height="600"
      stripe
    >
      <el-table-column prop="username" label="Name" min-width="100" sortable />
      <el-table-column :filters="roles" :filter-method="filterRoles" filter-placement="bottom" prop="roles" label="Roles" min-width="90">
        <template #default="scope">
          <el-tag v-for="role in scope.row.roles" :key="role.id" type="primary" effect="dark" style="margin-right: 5px;">
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Email" sortable min-width="100" />
      <el-table-column label="Actions" width="130" fixed="right">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button @click="viewUser(scope.row.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button @click="editUser(scope.row.id)" type="primary" style="margin:0" circle>
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
            <el-popconfirm :title="`Delete ${scope.row.username}?`" hide-icon>
              <template #reference>
                <el-button type="danger" style="margin:0" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button @click="deleteUser(scope.row.id, scope.$index)" type="danger" size="small"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- CREATE MODAL -->
    <el-dialog
      v-model="cardVisible"
      :before-close="closeModal"
      title="Create User"
      style="width: 90vw"
    >

      <el-form
        :model="newUser"
        :rules="rules"
        ref="user"
        label-width="auto"
        status-icon
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="newUser.username" aria-label="Username Input" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="newUser.email" aria-label="Email Input" />
        </el-form-item>
        <el-form-item label="Roles">
          <el-select v-model="newUser.roles" multiple aria-label="Roles Select" >
            <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
          </el-select>
        </el-form-item>

        <div v-if="newUser.usermeta">
          <el-divider> Theme </el-divider>
          <el-form-item label="Darkmode">
            <el-switch v-model="newUser.usermeta.darkmode" aria-label="Darkmode Switch" >
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
            <el-color-picker v-model="newUser.usermeta.faveColor" aria-label="Favorite Color Picker" />
          </el-form-item>
        </div>
      </el-form>

      <div>
        <el-row justify="end" align="middle">
          <el-col :xs="7" :span="3">
            <el-button :onclick="closeModal" type="warning" plain> Close </el-button>
          </el-col>
          <el-col :xs="6" :span="3">
            <el-button :onclick="createUser" type="primary"> Submit </el-button>
          </el-col>
        </el-row>
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
      loading: true,
      tableUsers: [],
      allUsers: [], // used in nameSearch

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
    currentUser() { return this.$store.state.auth.user; },
  },
  mounted() {
    this.loadUsers();
  },

  methods: {
    nameSearch() {
      let uName, searchStr, users = this.allUsers;
      searchStr = this.tableSearch.toLowerCase();
      this.tableUsers = [];
      if (searchStr == "") {
        this.tableUsers = users;
        return;
      }
      this.loading = true;
      for (let i = 0; i < users.length; i++) {
        uName = users[i].username.toLowerCase();
        if ( uName.includes( searchStr ) ) {
          this.tableUsers.push(users[i]);
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
        this.allUsers = response.data.rows;
        this.tableUsers = response.data.rows;
      })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
      .finally(() => { this.loading = false; });
    },

    /***************************\
    *                           *
    *       USER ACTIONS        *
    *                           *
    \***************************/
    createUser() {
      this.$refs.user.validate((valid, fields) => {
        if (valid) {
          this.newUser.password = `pwd4${this.newUser.username}`;
          UserService.createUser(this.newUser)
          .then(response => {
            this.$message({ message: response.message, type: 'success' });
            this.loadUsers();
          })
          .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); })
          .finally(() => { this.newUser = {}; this.cardVisible = false; });

        } else {
          for(const value of Object.values(fields)) {
            this.$message({ message: value[0].message, type: 'error', });
          }
          return false;
        }
      });
    },
    viewUser(id) { this.$router.push({ name: 'user-view', params: { id: id } }); },
    editUser(id) { this.$router.push({ name: 'user-edit', params: { id: id } }); },
    deleteUser(id) {
      UserService.deleteUser(id)
      .then(response => { this.$message({ message: response.message, type: 'success' }); this.loadUsers(); })
      .catch(err => { this.$message({ message: err, type: 'error', }); console.error(err); });
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
