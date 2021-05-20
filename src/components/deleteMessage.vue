<template>
  <v-btn
    v-if="msg.email === user.email"
    @click="deleteMessage(msg)"
    color="error"
    >delete
  </v-btn>
</template>

<script>
export default {
  name: "deleteMessage",
  props: ["msg", "socket"],
  data() {
    return {};
  },
  methods: {
    deleteMessage(msg) {
      const id = msg.id;

      this.socket.emit("c2s_delete_message", msg);

      const messages = this.messages.filter((el) => el.id !== id);
      const logs = this.logs.filter((el) => el.id !== id);

      this.$store.commit("setMessages", messages);
      this.$store.commit("setLogs", logs);
    },
  },
  computed: {
    logs: function () {
      return this.$store.state.logs;
    },
    messages: function () {
      return this.$store.state.messages;
    },
    user: function () {
      return this.$store.state.user;
    },
  },
};
</script>