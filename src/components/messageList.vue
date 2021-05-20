<template>
  <section>
    <article class="post" v-for="(data, index) in messageList" :key="index">
      <div class="post-header">
        <div class="user">
          <v-icon> mdi-account </v-icon>
          {{ data.email }}
        </div>
        <div class="post-date">
          <v-icon>mdi-calendar-range</v-icon>投稿日：
          {{ getDate(data.createdAt) }}
        </div>
      </div>
      <p class="post-message">
        {{ data.message }}
      </p>
      <div class="test">
        <deleteMessage :msg="data" :socket="socket" />
      </div>
    </article>
  </section>
</template>

<script>
import moment from "moment";
import deleteMessage from "@/components/deleteMessage";

export default {
  name: "messageList",
  data() {
    return {};
  },
  props: ["socket"],
  components: { deleteMessage },
  mounted() {
    this.socket.on("getMessageList", (data) => {
      this.$store.commit("setMessageList", data);
      console.log(this.user);
    });
  },
  methods: {
    getDate: function (date) {
      date = moment(date).format("YYYY/MM/DD HH:mm:ss");
      return date;
    },
  },
  computed: {
    messageList: function () {
      return this.$store.state.messageList;
    },
    user: function () {
      return this.$store.state.user;
    },
  },
};
</script>

<style scoped>
article {
  border: 1px solid gray;
  max-width: 50rem;
  margin: 1rem auto;
  padding: 1rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
}

.post-message {
  padding: 0.5em;
  margin: 1rem 0.5rem;
  border-left: 1px solid grey;
}

.test {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>