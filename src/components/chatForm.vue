<template>
  <form @submit.prevent>
    <v-text-field
      type="text"
      @keyup.enter="sendMessage(message)"
      v-model="message"
    />
    <v-btn color="primary" primary @click="sendMessage(message)">send</v-btn>
  </form>
</template>

<script>
export default {
  name: "chatForm",
  data() {
    return {
      message: "",
    };
  },
  props: ["socket"],
  methods: {
    sendMessage(message) {
      // send message to server
      if (message !== "") {
        this.socket.emit("c2s_message", { message });
        this.message = "";
      }
    },
  },
};
</script>