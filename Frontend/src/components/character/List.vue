<template>
  <div class="container">

    <el-table v-loading="loading" :data="characters" style="width: 100%" height="200">
      <el-table-column prop="id" label="ID" width="40" fixed />
      <el-table-column prop="name" label="Name" width="120" fixed />
      <el-table-column prop="user.username" label="User" width="120" v-if="!listID" />

      <el-table-column prop="basics" label="Basics">
        <template #default="scope">
          {{ scope.row.basics.appearance.age }} yr
          {{ scope.row.basics.alignment }}
          {{ scope.row.basics.type }}
          {{ scope.row.basics.appearance.gender }}
        </template>
      </el-table-column>

      <el-table-column prop="classes" label="Class">
        <template #default="scope">
          {{ scope.row.classes }}
          <!-- class.name (subclass.name) -->
        </template>
      </el-table-column>

      <el-table-column prop="attributes" label="Abilities">
        <template #default="scope">
          <el-row>
            <el-col :span="12">
              Str: {{ scope.row.attributes.Str.total}} <br>
              Dex: {{ scope.row.attributes.Dex.total}} <br>
              Con: {{ scope.row.attributes.Con.total}}
            </el-col>
            <el-col :span="12">
              Int: {{ scope.row.attributes.Int.total}} <br>
              Wis: {{ scope.row.attributes.Wis.total}} <br>
              Cha: {{ scope.row.attributes.Cha.total}}
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="Actions" width="145px;">
        <template #default="scope">
          <el-row class="row-bg" justify="space-between">
            <el-button type="primary" circle @click="viewCharacter(scope.row.id)">
              <g-icon iconSize="24px" iconColor="#000" iconName="eye" />
            </el-button>
            <el-button type="primary" circle @click="editCharacter(scope.row.id)">
              <g-icon iconSize="24px" iconColor="#000" iconName="quill" />
            </el-button>
            <el-popconfirm title="Are you sure to delete this?">
              <template #reference>
                <el-button type="danger" circle>
                  <g-icon iconSize="24px" iconColor="#000" iconName="trash" />
                </el-button>
              </template>
              <template #actions="">
                <el-button type="danger" size="small" @click="deleteCharacter(scope.row.id)"> Yes </el-button>
              </template>
            </el-popconfirm>
          </el-row>
         </template>
       </el-table-column>

    </el-table>

<!--
    <div class="demo-pagination-block">
        <div class="demonstration">All combined</div>
        <el-pagination
          v-model:current-page="currentPage4"
          v-model:page-size="pageSize4"
          :page-sizes="[100, 200, 300, 400]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    -->

    <div v-if="!this.loading">
      <div v-for="toon in this.characters" :key="toon.id">
        <div v-for="item in toon" :key="item">
          {{ item }}
        </div>
        <br>

      </div>
    </div>
  </div>


  <el-switch v-model="value1">
    <template #active-action>
      <span class="custom-active-action">T</span>
    </template>
    <template #inactive-action>
      <span class="custom-inactive-action">F</span>
    </template>
  </el-switch>


</template>

<script>
import CharacterService from "@/services/character.service";

export default {
  name: "List Characters",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data() {
    return {
      loading: true,
      listID: this.$route.params.id,
      characters: [],

      value1: false
    }
  },

  mounted() {
    if (!this.currentUser) { this.$router.push('/login'); }

    console.log(`listID: ${this.listID}`);

    CharacterService.getAllCharacters(this.listID).then(response => {
      this.characters = JSON.parse(response.characters);
      console.log(this.characters);
      this.loading = false;
    })
    .catch(err => { console.error(err); });
  },

  methods: {
    viewCharacter(id) {
      console.log(id);
      this.$router.push({ name: 'character-view', params: { id: id } });
    },
    editCharacter(id) {
      console.log(id);
      this.$router.push({ name: 'character-edit', params: { id: id } });
    },
    deleteCharacter(id) {
      console.log(id);
    }

  }
};
</script>
