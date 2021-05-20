<template>
  <v-app>
    <h2>チャットルーム</h2>
    <chatForm :socket="socket" />
    <section>
      <h2>メッセージリスト</h2>
      <messageList :socket="socket" />
    </section>
    <logoutBtn />
  </v-app>
</template>

<script>
import io from "socket.io-client";
import chatForm from "@/components/chatForm";
import messageList from "@/components/messageList";
import logoutBtn from "@/components/logoutBtn";

export default {
  name: "room",
  data() {
    return {
      messages: [],
      logs: [],
      socket: io("localhost:3000", { withCredentials: true }),
    };
  },
  components: { chatForm, logoutBtn, messageList },
  methods: {},
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      if (!vm.isAuthenticated) {
        await vm.checkLoggedIn();
      }

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