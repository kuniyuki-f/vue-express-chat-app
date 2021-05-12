<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form>
      <dl>
        <h2>エントリーフォーム</h2>
        <validation-provider
          rules="required"
          name="ニックネーム"
          v-slot="{ errors }"
        >
          <v-text-field
            v-model="user.name"
            label="ニックネーム"
            :error-messages="errors"
            required
          >
          </v-text-field>
        </validation-provider>

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
        <v-btn :color="'success'" @click="entry" :disabled="invalid"
          >登録する</v-btn
        >
        <br />
      </dl>
    </v-form>
  </validation-observer>
</template>

<script>
import bcrypt from "bcryptjs";

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
  components: { ValidationObserver, ValidationProvider },
  methods: {
    entry: function () {
      this.user.password = bcrypt.hashSync(this.user.password, 10);
      this.axios
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