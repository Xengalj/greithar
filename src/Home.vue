<script>
export default {
  methods: {
    goToAbout() {
      this.$router.push('/lore')
    },
  },
}
</script>

<template>
  <h2>HomeView</h2>
  <button @click="goToAbout">Go to About</button>
</template>

<!-- <template>
  <header>
    <h1>Home</h1>

    <nav>
      <router-link :to="{ name: '/', params: {} }">Home</router-link>
      <router-link :to="{ name: '/lore', params: {} }">Page 2</router-link>
    </nav>
  </header>
</template> -->
