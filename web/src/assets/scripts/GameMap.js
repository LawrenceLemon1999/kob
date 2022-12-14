import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";


export class GameMap extends AcGameObject {
    constructor(ctx, parent, store) {//ctx是画布，parent是画布的父元素，方便修改画布的长宽
        super();
        this.ctx = ctx;
        this.store = store;
        this.parent = parent;
        this.L = 0;//存每个格子的绝对距离
        this.rows = 13;
        this.cols = 14;

        this.inner_walls_count = 10;
        this.walls = [];

        this.snakes = [
            new Snake({
                id: 0,
                color: '#4876EC',
                r: this.rows - 2,
                c: 1
            }, this),
            new Snake({
                id: 1,
                color: '#F94848',
                r: 1,
                c: this.cols - 2,
            }, this)
        ];
    }
    start() {//只执行一次
        // for (let i = 0; i < 1000; i++) {//如果生成的是不连通的，会return false，然后重新生成一次。
        //     if (this.create_walls()) {
        //         break;
        //     }
        // }
        this.create_walls();
        this.add_listening_events();
    }

    add_listening_events() {//canvas绑定键盘事件
        this.ctx.canvas.focus();//想获取键盘输入首先得聚焦

        // const [snake0, snake1] = this.snakes;
        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === 'w') d = 0;
            else if (e.key === 'd') d = 1;
            else if (e.key === 's') d = 2;
            else if (e.key === 'a') d = 3;

            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({//向后端传递信息
                    event: "move",
                    direction: d,
                }));
            }
        })
    }




    check_ready() {//判断两个蛇是否已经准备好（两条蛇都获取了下一步的操作之后）
        for (const snake of this.snakes) {
            if (snake.status !== 'idle') return false;//如果不是静止，那就不能动
            if (snake.direction === -1) return false;//如果蛇的方向没有确定，那也不能动
        }
        return true;
    }
    next_step() {
        for (const snake of this.snakes) {//如果棋盘判断可以进入下一回合，会调用两条蛇也进入下一回合
            snake.next_step();
        }
    }

    check_valid(cell) {//检测目标位置是否合法：蛇是否撞到墙或者障碍物或者另一条蛇
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) {
                return false;
            }
        }
        for (const snake of this.snakes) {
            //对于蛇尾需要特判一下，因为如果是蛇头追蛇尾的情况下，如果蛇尾要缩，那么就可以继续追，如果蛇尾不缩，就不能再追了（不然就碰到了）
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {//如果蛇增长，那么蛇尾会前进，当前蛇尾所在的点就会空出来，就不要判断cell会不会碰到这个空出来的点了
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }
        return true;
    }


    //用flood-fill算法判断连通性，两个蛇直接有没有路
    // check_connnectivity(g, sx, sy, tx, ty) {
    //     if (sx == tx && sy == ty) {
    //         return true;
    //     }
    //     g[sx][sy] = true;//标记当前点已经走过
    //     let dx = [-1, 0, 1, 0];
    //     let dy = [0, 1, 0, -1];
    //     for (let i = 0; i < 4; i++) {
    //         let x = sx + dx[i];
    //         let y = sy + dy[i];
    //         if (!g[x][y] && this.check_connnectivity(g, x, y, tx, ty)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }


    //制造障碍物
    create_walls() {
        // new Wall(0, 0, this);
        // const g = [];//g是一个数组
        // for (let r = 0; r < this.rows; r++) {
        //     g[r] = [];//g[r]=一个数组
        //     for (let c = 0; c < this.cols; c++) {
        //         g[r][c] = false;
        //     }
        // }

        // //给四周加上墙
        // for (let r = 0; r < this.rows; r++) {
        //     g[r][0] = true;
        //     g[r][this.cols - 1] = true;
        // }
        // for (let c = 0; c < this.cols; c++) {
        //     g[0][c] = true;
        //     g[this.rows - 1][c] = true;
        // }

        // //创建随机障碍物
        // for (let i = 0; i < this.inner_walls_count / 2; i++) {
        //     for (let j = 0; j < 1000; j++) {
        //         let r = parseInt(Math.random() * this.rows);//Math.randow()是[0,1)
        //         let c = parseInt(Math.random() * this.cols);
        //         if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) {//因为放置障碍物的时候是对称来放的，所以两个点都判断一下
        //             continue;
        //         }
        //         if (r == (this.rows - 2) && c == 1) {
        //             continue;
        //         }
        //         if (r == 1 && c == this.cols - 2) {
        //             continue;
        //         }
        //         g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
        //         break;
        //     }
        // }


        // //判断是否联通
        // const copy_g = JSON.parse(JSON.stringify(g));//生成一个g的复制，生成方法是先json化再解析json。
        // if (!this.check_connnectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) {
        //     return false;
        // }

        const g = this.store.state.pk.gamemap;

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
        return true;
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
        if (this.check_ready()) {//两个蛇准备好之后，开启下一回合
            this.next_step();
        }
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