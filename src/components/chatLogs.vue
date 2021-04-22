<template>
  <section>
    <h3>過去ログ</h3>
    <ul>
      <li v-for="(data, index) in logs" :key="index">
        {{ data.message }}
        <deleteMessage :msg="data" :socket="socket" />
      </li>
    </ul>
  </section>
</template>

<script>
import deleteMessage from "@/components/deleteMessage";

export default {
  name: "chatLogs",
  props: ["socket"],
  components: { deleteMessage },
  mounted() {
    this.socket.on("s2c_log", (logs) => {
      this.$store.commit("setLogs", logs);
    });
  },
  computed: {
    logs: function () {
      return this.$store.state.logs;
    },
  },
};
</script>