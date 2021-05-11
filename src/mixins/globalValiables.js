export default {
    created() {

    },
    data() {
        return {
            serverPath: 'http://localhost:3000',
        }
    },
    methods: {
        checkLoggedIn: async function () {
            await this.axios
                .get(this.serverPath + '/checkLoggedIn')
                .then((res) => {
                    console.log(res.data.isLoggedIn)
                    if (res.data.isLoggedIn) {
                        this.$store.commit('setIsAuthenticated', true);
                    } else {
                        this.$store.commit('setIsAuthenticated', false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    computed: {
        isAuthenticated: function () {
            return this.$store.state.isAuthenticated;
        },
    },
}