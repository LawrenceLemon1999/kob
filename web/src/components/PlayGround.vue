<template>
    <div class="re">
        <a href="http://localhost:8080/pk/">
            <img src="@/assets/images/refresh.png" alt="">
        </a>
    </div>

    <div class="playground">
        <GameMap></GameMap>
    </div>
</template>

<script>
import GameMap from './GameMap.vue'
export default {
    name: 'PlayGround',
    components: {
        GameMap,
    }
}
</script>

<style scoped>
div.playground {
    width: 60vw;
    height: 70vh;
    margin: 40px auto;
    /* background-color: lightblue; */
}

img {
    width: 8%;
}

div.re {
    margin-top: 3vh;
    margin-left: 15vw;
}
</style>