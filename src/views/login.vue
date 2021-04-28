<template>
  <!-- <form action="/login" method="POST"> -->
  <v-form>
    <dl>
      <h2>ログインフォーム</h2>
      <dt>e-mail</dt>
      <dd>
        <input type="text" name="email" v-model="user.email" />
      </dd>
      <dt>password</dt>
      <dd>
        <input type="password" name="password" v-model="user.password" />
      </dd>
    </dl>
    <v-btn type="submit">ログイン</v-btn>
    <a @click="test">test </a>
    <ul>
      <li>{{ user.email }}</li>
      <li>{{ user.password }}</li>
    </ul>
  </v-form>
</template>

<script>
import axios from "axios";
export default {
  name: "login-form",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    test: async function () {
      const params = new URLSearchParams();
      params.append("email", this.user.email);
      params.append("password", this.user.password);
      console.log("params:", params);

      const response = await axios
        .post("http://localhost:3000/login", params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log("error:", err.response);
        });
      response;
    },
  },
};
</script>