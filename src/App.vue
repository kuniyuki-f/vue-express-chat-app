<template>
  <v-app>
    <myHeader />
    <v-main>
      <router-view />
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/login">login</router-link> |
        <router-link to="/entry">entry</router-link> |
        <router-link to="/chat">chat</router-link> |
      </div>
    </v-main>
  </v-app>
</template>

<script>
import myHeader from "@/components/header";
export default {
  name: "app",
  components: { myHeader },
};
</script>

<style lang="scss">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
