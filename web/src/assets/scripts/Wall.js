import { AcGameObject } from "./AcGameObject";

export class Wall extends AcGameObject {
    constructor(r, c, gamemap) {
        // 输入是行和列，以及地图，方便获取地图的各种属性
        super();
        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = "#B37226";
    }
    update() {//除了第一帧，每一帧都调用一次
        this.render();
    }
    render() {
        const L = this.gamemap.L;
        // 获取此时的小正方形边长，因为每一帧的这个边长都可能发生改变（浏览器大小可能变化），
        //所以每次update的时候都要获取最新的边长

        const ctx = this.gamemap.ctx;
        //这个需要每次都更新吗？？？？？？？？？？？？？？？？？？？？？？？
        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);
    }
}