import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const initialState = {
    messages: [],
    logs: [],
    messageList: [],
    user: {
        name: 'ゲスト',
        email: ''
    },
    isAuthenticated: false,
}

export default new Vuex.Store({
    state: initialState,
    mutations: {
        // socket.io
        setMessages(state, messages) {
            state.messages = messages;
        },
        setLogs(state, logs) {
            state.logs = logs;
        },
        setMessageList(state, messageList) {
            state.messageList = messageList;
        },
        // authentication
        setUserName(state, userName) {
            state.user.name = userName;
        },
        setUserEmail(state, userEmail) {
            state.user.email = userEmail;
        },
        setIsAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        }
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
});