<template>
  <section>
    <h3>チャットログ</h3>
    <ul>
      <li v-for="(data, index) in messages" :key="index">
        {{ data.text }}
        <deleteMessage :msg="data" :socket="socket" />
      </li>
    </ul>
  </section>
</template>

<script>
import deleteMessage from "@/components/deleteMessage";

export default {
  name: "chatMessages",
  props: ["socket"],
  data() {
    return {};
  },
  components: { deleteMessage },
  mounted() {
    this.socket.on("s2c_message", (msg) => {
      this.messages.push(msg);
      this.$store.commit("setMessages", this.messages);
    });
  },
  computed: {
    messages: function () {
      return this.$store.state.messages;
    },
  },
};
</script>