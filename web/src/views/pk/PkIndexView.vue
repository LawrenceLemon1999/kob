<template>
    <PlayGround>

    </PlayGround>
</template>


<script>
import PlayGround from '../../components/PlayGround';
import { onMounted, onUnmounted } from 'vue';//分别表示在当前组件挂载之后  和  当前组件卸载之后 运行。 
import { useStore } from 'vuex';

export default {
    name: 'PkIndexView',
    components: {
        PlayGround,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;

        let x = store.state.user.id;
        console.log(x);


        let socket = null;
        onMounted(() => {
            socket = new WebSocket(socketUrl);//js自带的类
            socket.onopen = () => {
                console.log("connected!");
            }
            socket.onmessage = (msg) => {
                const data = JSON.parse(msg);
                console.log(data);
            }
            socket.onclose = () => {
                console.log("disconnected");
            }
        })
        onUnmounted(() => {
            socket.close();//如果在卸载的时候没有断开连接，那么每次打开这个页面都会新建一个连接。产生很多冗余连接
        })
    }
}
</script>

<style scoped>

</style>