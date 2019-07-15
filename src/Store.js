import Vue from 'vue';

export default new Vue({
    data() {
        return {
            user:{
                login: 'guest',
                token: undefined,
                role: undefined,
            },
            currentRoom: undefined,
        }
    },
    methods: {

    }
});