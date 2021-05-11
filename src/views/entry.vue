<template>
  <div>
    <v-form>
      <dl>
        <h2>エントリーフォーム</h2>
        <dt>name</dt>
        <dd>
          <input type="text" name="name" v-model="user.name" />
        </dd>
        <dt>email</dt>
        <dd>
          <input type="email" name="email" v-model="user.email" />
        </dd>
        <dt>password</dt>
        <dd>
          <input type="password" name="password" v-model="user.password" />
        </dd>
        <v-btn @click="entry" @submit.prevent></v-btn>
        {{ user.password }} <br />
      </dl>
    </v-form>
  </div>
</template>

<script>
import bcrypt from "bcryptjs";
import axios from "axios";

export default {
  name: "entryForm",
  data() {
    return {
      user: {
        email: "",
        name: "",
        password: "",
      },
    };
  },
  methods: {
    entry: function () {
      this.user.password = bcrypt.hashSync(this.user.password, 10);
      axios
        .post("http://localhost:3000/entry", {
          user: this.user,
        })
        .then((response) => {
          console.log(response);
          this.$router.push("/login");
        })
        .catch(() => {
          console.log("登録失敗");
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