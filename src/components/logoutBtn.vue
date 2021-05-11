<template>
  <v-btn @click="logout" class="btn" :color="'red'" v-if="isAuthenticated">
    ログアウト
  </v-btn>
</template>

<script>
export default {
  name: "logoutBtn",
  methods: {
    logout: function () {
      this.axios
        .post("http://localhost:3000/logout")
        .then((res) => {
          console.log(res.data);
          this.$store.commit("setUserName", "ゲスト");
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.btn {
  color: white;
  width: 10rem;
}
</style>