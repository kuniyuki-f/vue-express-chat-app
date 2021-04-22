import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const initialState = {
    messages: [],
    logs: [],
}

export default new Vuex.Store({
    state: initialState,
    mutations: {
        setMessages(state, messages) {
            state.messages = messages;
        },
        setLogs(state, logs) {
            state.logs = logs;
        }
    }
});