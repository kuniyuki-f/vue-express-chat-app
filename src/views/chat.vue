<template>
  <v-app>
    <h2>チャットルーム</h2>
    <chatForm :socket="socket" />
    <chatMessages :socket="socket" />
    <chatLogs :socket="socket" />
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
};
</script>

<style lang="scss" scoped>
li {
  display: grid;
  grid-template-columns: 20rem 10rem;
}
</style>