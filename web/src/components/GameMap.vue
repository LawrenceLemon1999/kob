<template>
    <div ref="parent" class="gamemap">
        <!-- ref= "parent" 这样上面的这个div就和下面的parent联系上了-->
        <canvas ref="canvas" tabindex="0">
            <!-- 加入tabindex这个属性就可以读取用户的键盘操作了 -->
        </canvas>
    </div>
</template>


<script>
import { GameMap } from '@/assets/scripts/GameMap'
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
    name: 'GameMap',
    setup() {
        const store = useStore();
        let canvas = ref(null);
        let parent = ref(null);
        onMounted(() => {//当组件挂载完之后，需要创建GameMap对象
            new GameMap(canvas.value.getContext('2d'), parent.value, store);
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
    /* flex限制这个div内部的元素的位置 flex比较好实现竖直和水平居中，margin比较适合实现水平居中*/
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 竖直居中 */
}
</style>