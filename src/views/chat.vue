<template>
  <div>
    <h2>チャットルーム</h2>
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg.message }}</li>
    </ul>
    <div>
      <v-text-field
        type="text"
        @keyup.enter="sendMessage(message)"
        v-model="message"
      />
      <v-btn primary @click="sendMessage(message)">send</v-btn>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "room",
  data() {
    return {
      messages: [],
      // connect to server
      socket: io("localhost:3000"),
      message: "",
    };
  },
  methods: {
    sendMessage(message) {
      // send message to server
      this.socket.emit("c2s_message", { message });
    },
  },
  mounted() {
    // receive message from server
    this.socket.on("s2c_message", (data) => {
      this.messages = [...this.messages, data];
    });
  },
};
</script>