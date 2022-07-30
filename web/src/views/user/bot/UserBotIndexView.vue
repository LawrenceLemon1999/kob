<template>
    <ContentField>
        userbot
    </ContentField>
</template>


<script>
import ContentField from '../../../components/ContentField';
import $ from 'jquery'
import { useStore } from 'vuex'


export default {
    name: 'UserBotIndexView',
    components: {
        ContentField,
    },
    setup() {
        const store = useStore();
        // $.ajax({
        //     url: "http://localhost:3000/user/bot/add/",
        //     type: "POST",
        //     data: {
        //         title: "我的bot",
        //         content: "ooo",
        //         description: "ppp",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }
        // });
        // $.ajax({
        //     url: "http://localhost:3000/user/bot/remove/",
        //     type: "POST",
        //     data: {
        //         bot_id: 1,
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log("gui");
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log("oo");
        //         console.log(resp);
        //     }
        // });
        // $.ajax({
        //     url: "http://localhost:3000/user/bot/update/",
        //     type: "POST",
        //     data: {
        //         bot_id: 2,
        //         title: "shui的bot",
        //         content: "he",
        //         description: "hello",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log("gui");
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log("oo");
        //         console.log(resp);
        //     }
        // });
        $.ajax({
            url: "http://localhost:3000/user/bot/getlist/",
            type: "GET",
            headers: {
                Authorization: "Bearer " + store.state.user.token,
            },
            success(resp) {
                console.log("gui");
                console.log(resp);
            },
            error(resp) {
                console.log("oo");
                console.log(resp);
            }
        });
    }
}
</script>

<style scoped>
</style>