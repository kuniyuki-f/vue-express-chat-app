<template>
  <!-- <form action="/login" method="POST"> -->
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form @submit.prevent>
      <h2>ログインフォーム</h2>

      <validation-provider
        rules="required|email"
        name="メールアドレス"
        v-slot="{ errors }"
      >
        <v-text-field
          v-model="user.email"
          label="E-mail"
          :error-messages="errors"
          required
        ></v-text-field>
      </validation-provider>
      <validation-provider
        rules="required"
        name="パスワード"
        v-slot="{ errors }"
      >
        <v-text-field
          v-model="user.password"
          label="パスワード"
          :type="'password'"
          :error-messages="errors"
          required
        ></v-text-field>
      </validation-provider>

      <v-btn :color="'success'" @click="login" :disabled="invalid"
        >ログイン</v-btn
      >
    </v-form>
  </validation-observer>
</template>

<script>
import { required, email } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";

extend("required", {
  ...required,
  message: "{_field_}は必須です",
});

extend("email", {
  ...email,
  message: "メールアドレスの形式で入力してください",
});

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
  components: { ValidationObserver, ValidationProvider },
  methods: {
    login: async function () {
      const params = new URLSearchParams();
      params.append("email", this.user.email);
      params.append("password", this.user.password);

      await this.axios
        .post("http://localhost:3000/login", params)
        .then((res) => {
          this.$store.commit("setUserName", res.data.user.name);
          this.$store.commit("setUserEmail", res.data.user.email);
        })
        .catch((err) => {
          console.log("error:", err.response);
        });
      await this.checkLoggedIn();

      if (this.isAuthenticated) {
        this.$router.push("/");
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.isAuthenticated) {
        vm.checkLoggedIn();
      }

      if (vm.isAuthenticated) {
        vm.$router.push("/");
      } else {
        next();
      }
    });
  },
};
</script>