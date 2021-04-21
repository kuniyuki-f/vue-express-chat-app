<template>
  <v-app>
    <v-app-bar class="header" app color="primary" dark>
      <h1>socket.io チャットアプリ</h1>
    </v-app-bar>
    <v-main>
      <router-view />
      <div id="nav"><router-link to="/">Home</router-link> |</div>
    </v-main>
  </v-app>
</template>

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
