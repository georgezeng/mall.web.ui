import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({})
store.registerModule('vux', {
    state: {
        isLoading: false
    },
    mutations: {
        updateLoadingStatus (state, payload) {
            state.isLoading = payload.isLoading
        }
    }
})

export default store