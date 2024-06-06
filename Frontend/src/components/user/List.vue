<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>User List</strong>
      </h3>
    </header>

    <el-button @click="clearFilter">reset all filters</el-button>
    <el-button @click="createUser">
      <font-awesome-icon icon="user-plus" /> &nbsp; Create User
    </el-button>

    <el-table
      :data="tableData"
      :default-sort="{ prop: 'cr', order: 'ascending' }"
      v-loading="loading"
      height="500"
      style="width: 100%"
      stripe
    >
      <el-table-column sortable prop="id" label="ID" width="75" />
      <el-table-column sortable prop="username" label="Name" width="180" />
      <el-table-column sortable prop="email" label="Email" />
      <el-table-column sortable prop="roles" label="Roles" :filters="userRole" :filter-method="filterHandler" />

      <el-table-column fixed="right" label="Operations" width="120">
        <template #default>
          <el-button type="primary" circle>
            <g-icon iconName="eye" />
          </el-button>
          <el-button type="primary" circle>
            <g-icon iconName="quill" />
          </el-button>
          <el-button type="primary" circle>
            <g-icon iconName="trash" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
  name: "List Users",
  data() {
    return {
      loading: false,
      tableData: [],
      userRole: [
        {text: "Admins", value: "admins" },
        {text: "Moderators", value: "moderators" },
        {text: "Users", value: "users" }, // to filter for non admins, non mod?
      ]
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.loading = true;
      UserService.getAllUsers(this.currentUser)
      .then(response => {
        console.log("users", response.data);
        this.tableData = response.data;
        this.loading = false;
      })
      .catch(err => { console.error(err); });
    },
    clearFilter() {
      // just reload page...
      this.$router.go();
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick() {
      console.log('click');
    }
  }
};
</script>
