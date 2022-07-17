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

        this.inner_walls_count = 80;
        this.walls = [];
    }
    start() {//只执行一次
        this.create_walls();
    }
    create_walls() {
        // new Wall(0, 0, this);
        const g = [];//g是一个数组
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];//g[r]=一个数组
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        //给四周加上墙
        for (let r = 0; r < this.rows; r++) {
            g[r][0] = true;
            g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c++) {
            g[0][c] = true;
            g[this.rows - 1][c] = true;
        }

        //创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i++) {
            for (let j = 0; j < 1000; j++) {
                let r = parseInt(Math.random() * this.rows);//Math.randow()是[0,1)
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) {//因为放置障碍物的时候是对称来放的，所以两个点都判断一下
                    continue;
                }
                if (r == (this.rows - 2) && c == 1) {
                    continue;
                }
                if (r == 1 && c == this.cols - 2) {
                    continue;
                }
                g[r][c] = g[c][r] = true;
                break;
            }
        }


        //给障碍物上色

        //为什么障碍物的颜色会覆盖地图的颜色呢？
        //因为每个Wall都会被push到AC_GAME_OBJECTS里，然后按照先push进去先update的顺序去上色，
        //地图比Wall先push进去，所以Wall的颜色会覆盖掉地图的颜色
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

    }
    update_size() {//计算小正方形的边长
        //clientWidth函数获取 div 元素的宽度，包含内边距（padding）
        //下面的计算方式保证了取到的正方形是在特定长宽下的最大的正方形（并且没有越界的）视频1h10min左右
        // this.L = (Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));

        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
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