<template>
  <v-app>
    <h2>チャットルーム</h2>
    <chatForm :socket="socket" />
    <chatMessages :socket="socket" />
    <chatLogs :socket="socket" />
    <v-btn @click="logout">ログアウト</v-btn>
    {{ isAuthenticated }}
  </v-app>
</template>

<script>
import io from "socket.io-client";
import chatForm from "@/components/chatForm";
import chatLogs from "@/components/chatLogs";
import chatMessages from "@/components/chatMessages";

export default {
  name: "room",
  data() {
    return {
      messages: [],
      logs: [],
      socket: io("localhost:3000"),
    };
  },
  components: { chatForm, chatLogs, chatMessages },
  methods: {
    logout: function () {
      this.axios.get("http://localhost:3000/logout").then((res) => {
        console.log(res.data);
        this.$store.commit("setUserName", "ゲスト");
      });
      this.$router.push("/");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.checkLoggedIn();
      if (vm.isAuthenticated) {
        next();
      } else {
        vm.$router.push("/login");
      }
    });
  },
};
</script>

<style lang="scss" scoped>
li {
  display: grid;
  grid-template-columns: 20rem 10rem;
}
</style>