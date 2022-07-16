<template>
    <div ref="parent" class="gamemap">
        <!-- ref= "parent" 这样上面的这个div就和下面的parent联系上了-->
        <canvas ref="canvas">

        </canvas>
    </div>
</template>


<script>
import { GameMap } from '@/assets/scripts/GameMap'
import { ref, onMounted } from 'vue';
export default {
    name: 'GameMap',
    setup() {
        let canvas = ref(null);
        let parent = ref(null);
        onMounted(() => {//当组件挂载完之后，需要创建GameMap对象
            new GameMap(canvas.value.getContext('2d'), parent.value);
        })
        return {
            parent,
            canvas,
        }
    }
}
</script>

<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    /* flex限制这个div内部的元素的位置 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 竖直居中 */
}
</style>