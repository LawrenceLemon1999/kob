import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";


export class GameMap extends AcGameObject {
    constructor(ctx, parent) {//ctx是画布，parent是画布的父元素，方便修改画布的长宽
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;//存每个格子的绝对距离
        this.rows = 13;
        this.cols = 13;

        this.walls = [];
    }
    start() {//只执行一次
        this.create_walls();
    }
    create_walls() {
        new Wall(0, 0, this);
    }
    update_size() {//计算小正方形的边长
        //clientWidth函数获取 div 元素的宽度，包含内边距（padding）
        //下面的计算方式保证了取到的正方形是在特定长宽下的最大的正方形（并且没有越界的）视频1h10min左右
        this.L = (Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));

        // this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    update() {//除了第一帧，每一帧都调用一次
        this.update_size();
        this.render();
    }
    render() {
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);//前两个表示起点坐标，后两个为边长

        const color_even = "#AAD751";
        const color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                }
                else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }

    }
}