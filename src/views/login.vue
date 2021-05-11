<template>
  <!-- <form action="/login" method="POST"> -->
  <v-form @submit.prevent>
    <dl>
      <h2>ログインフォーム</h2>
      <dt>e-mail</dt>
      <dd>
        <input type="text" name="email" v-model="user.email" />
      </dd>
      <dt>password</dt>
      <dd>
        <input type="password" name="password" v-model="user.password" />
      </dd>
    </dl>
    <v-btn @click="login">ログイン</v-btn>
    <v-btn @click="confirmation">確認</v-btn>
    <v-btn @click="logout">ログアウト</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "login-form",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    login: async function () {
      const params = new URLSearchParams();
      params.append("email", this.user.email);
      params.append("password", this.user.password);
      console.log("params:", params);

      await this.axios
        .post("http://localhost:3000/login", params)
        .then((res) => {
          this.$store.commit("setUserName", res.data.user.name);
        })
        .catch((err) => {
          console.log("error:", err.response);
        });
      await this.checkLoggedIn();

      if (this.isAuthenticated) {
        this.$router.push("/");
      }
    },
    confirmation: function () {
      this.axios.get("http://localhost:3000").then((res) => {
        console.log(res);
      });
    },
    logout: function () {
      this.axios.get("http://localhost:3000/logout").then((res) => {
        console.log(res);
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.checkLoggedIn();
      if (vm.isAuthenticated) {
        vm.$router.push("/");
      } else {
        next();
      }
    });
  },
};
</script>