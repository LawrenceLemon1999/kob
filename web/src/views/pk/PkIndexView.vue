<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'">
        <!-- 状态是playing的时候才展示对战界面，状态是matching的时候就不展示出来 -->
    </PlayGround>
    <MatchGround v-if="$store.state.pk.status === 'matching'"></MatchGround>
</template>


<script>
import PlayGround from '../../components/PlayGround';
import MatchGround from '@/components/MatchGround';
import { onMounted, onUnmounted } from 'vue';//分别表示在当前组件挂载之后  和  当前组件卸载之后 运行。 
import { useStore } from 'vuex';



export default {
    name: 'PkIndexView',
    components: {
        PlayGround,
        MatchGround,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

        let x = store.state.user.id;
        console.log(x);


        let socket = null;
        onMounted(() => {
            store.commit("updateOpponent", {
                username: "对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })

            socket = new WebSocket(socketUrl);//js自带的类
            socket.onopen = () => {
                console.log("connected!");
                store.commit("updateSocket", socket);
            }
            socket.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.event === "start-matching") {//匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    setTimeout(() => store.commit("updateStatus", "playing"), 2000);
                    store.commit("updateGame", data.game);
                }
                // console.log(data);
            }
            socket.onclose = () => {
                console.log("disconnected");
            }
        })
        onUnmounted(() => {
            socket.close();//如果在卸载的时候没有断开连接，那么每次打开这个页面都会新建一个连接。产生很多冗余连接
            store.commit("updateStatus", "matching");//如果切换界面，那么status就变为matching
        })
    }
}
</script>

<style scoped>

</style>