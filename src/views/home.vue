<template>
  <main>
    <h1>ようこそ{{ userName }}さん</h1>

    <section v-if="!this.isAuthenticated">
      <p><router-link to="/login">ログイン</router-link>してください。</p>
      <p>
        登録がまだの方は
        <router-link to="/entry">メンバー登録</router-link>
        してください。
      </p>
    </section>
    <section v-if="this.isAuthenticated">
      <p>チャットルームは<router-link to="/chat">こちら</router-link></p>
    </section>
  </main>
</template>

<script>
export default {
  name: "home",
  mounted() {
    this.checkLoggedIn();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.checkLoggedIn();
      next();
    });
  },
  computed: {
    userName: function () {
      return this.$store.state.user.name;
    },
  },
};
</script>