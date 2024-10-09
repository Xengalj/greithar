<template>
  <div class="container">

    <!-- FILTERS -->
    <el-row class="row-bg" justify="space-between">
      <el-col :span="6">
        <el-input v-model="tableSearch" size="small" placeholder="Type to search" v-on:change="nameSearch()" />
      </el-col>
      <el-col :span="3">
        <el-button @click="createUser">
          <g-icon iconSize="24px" iconName="userAdd" /> Create User
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
      <el-table-column prop="roles" label="Roles" :filters="roleFilter" :filter-method="filterRoles" filter-placement="bottom">
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
      width="650"
      style="margin-top: 75px"
      v-model="cardVisible"
      :before-close="closeModal"
    >
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
      roleFilter: [
        { text: "Admin", value: "admin" },
        { text: "Story Teller", value: "storyteller" },
        { text: "User", value: "user" },
      ],

      // Create User Modal
      cardVisible: false,
      newUser: {},

    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    this.loading = true;
    UserService.getAllUsers()
    .then(response => {
      this.allUsers = response.data
      this.tableData = this.allUsers;
      this.loading = false;
    })
    .catch(err => { console.error(err); });
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

    viewUser(id) {
      this.$router.push({ name: 'user-view', params: { id: id } });
    },
    editUser(id) {
      this.$router.push({ name: 'user-edit', params: { id: id } });
    },
    deleteUser(id) {
      console.log('delete', id);
    },



    createUser() {
      console.log("create user, open modal");
      this.cardVisible = true;
    },
    closeModal() {
      // alert('oops');
    }




  }
};
</script>
