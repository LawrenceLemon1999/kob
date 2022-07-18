import { AcGameObject } from "./AcGameObject";
import { Cell } from './Cell';

export class Snake extends AcGameObject {
    constructor(info, gamemap) {
        super();
        this.gamemap = gamemap;//方便调用一些函数和参数
        this.color = info.color;
        this.id = info.id;

        this.cells = [new Cell(info.r, info.c)];
        //cells是放着Cell类型的数组，初始的时候只有一个Cell，也就是蛇头cells[0]
        this.speed = 5;

        this.direction = -1//表示蛇的下一步的指令，-1表示没有指令，0,1,2,3表示上右下左
        this.status = "idle"//idle表示静止，move表示正在运动，die表示死亡。

        this.next_cell = null;//下一个目标位置，初始为空

        // this.dr = [-1, 0, 1, 0];//行和列的偏移量
        // this.dc = [0, 1, 0, -1];
        this.dr = [-1, 0, 1, 0];  // 4个方向行的偏移量
        this.dc = [0, 1, 0, -1];  // 4个方向列的偏移量


        this.step = 0;//表示回合数
        this.eps = 1e-2;//允许的误差，当两个点的距离小于这个误差值的时候，就默认它们俩重合了
    }
    start() {

    }

    check_tail_increasing() {//检测当前回合，蛇的长度是否增加。增加的逻辑是前十个回合每回合+1，之后每3回合+1长度
        if (this.step <= 10 || this.step % 3 === 1) {
            return true;
        }
        return false;
    }

    next_step() {//将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);


        this.direction = -1;//方向在使用之后就清空，避免对之后造成影响。
        this.status = 'move';
        this.step++;//回合数+1

        const k = this.cells.length;
        for (let i = k; i > 0; i--) {//每个小球向前移动一位!!!!!!   注意这里：cells[0]和cells[1]重叠了，然后cells[0]再向next_cell移动！


            //自己的感想：这里注意不要把渲染时候的逻辑和自己记录的数据弄混了
            //渲染的时候雀食是只移动了头和尾，但是自己记录的时候要记录所有cell的移动的


            //this.cells[i] = this.cells[i - 1];不能这样写，需要深层复制，这样写引用会出问题
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));//这样写会创建一个新的对象
        }
    }

    update_move() {
        // this.cells[0].x += this.speed * this.timedelta / 1000;

        //这个距离是按照时间来算的，并不是按照帧来算的，所有走的很均匀。每一帧的间隔时间并不是完全相等的。
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        //这两个值是：从当前蛇头的位置到达下一个cell的位置，横纵坐标的位移值


        //视频2,48min
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.eps) {//如果蛇头距离下一个cell的距离小于误差值，我们认为它俩重合了,也就是走到目标点了

            //到达位置之后，新的位置作为蛇头。
            this.cells[0] = this.next_cell;

            // console.log("id:  " + this.id + "  " + this.direction + "  " + this.cells.length);
            // console.log("step :" + this.step + "  " + this.cells[0].x + "  " + this.cells[0].y);
            // console.log("next: " + this.next_cell.x + "  " + this.next_cell.y);
            this.next_cell = null;
            this.status = 'idle';

            if (!this.check_tail_increasing()) {//砍掉蛇尾，蛇不变长
                this.cells.pop();
            }
        }
        else {
            const move_distance = this.speed * this.timedelta / 1000;//每两帧之间走的距离
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;
            //这里是计算出来下一帧的时候蛇头的横纵坐标，已知当前速度下从蛇头向目标坐标走的距离是move_distance
            //又已知蛇头向目标坐标走的路线的斜率（或者说角度）：由dx，dy和distance计算得到
            //就知道横纵方向分别走了多远


            if (!this.check_tail_increasing()) {//如果这一回合的时候蛇没有增长，那么说明尾巴需要向前一格，
                //如果蛇增长了，那蛇尾就不用动（然后由于头向前多了一格，整个蛇就多了一格）

                const k = this.cells.length;
                const tail = this.cells[k - 1];
                const tail_target = this.cells[k - 2];
                //这里y总认为tail需要移动的distance和头是一致的，有点不明白。。。。。。。。。。。。？？？？？
                //不过move_distance是一样的，因为速度和时间间隔是一样的。

                const tail_dx = tail_target.x - tail.x;
                const tail_dy = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_dy / distance;
            }
        }
    }

    update() {//每一帧执行一次
        if (this.status === 'move') {
            this.update_move();
        }
        this.render();
    }
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        for (const cell of this.cells) {
            ctx.beginPath();//开启路径
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            //前两个参数是圆心坐标（对于canvas来说的坐标），第三个参数是半径
            //四五参数是起始角度和终止角度
            ctx.fill();
        }

        //给蛇全是圆形的身体加上个矩形，更好看
        //视频2,1h  很重要！！！

        for (let i = 1; i < this.cells.length; i++) {
            const a = this.cells[i];
            const b = this.cells[i - 1];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps) {
                continue;
            }
            if (Math.abs(a.x - b.x) < this.eps) {//处理竖直方向相邻两个圆的情况
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
                //矩形的起始位置的坐标，以及x，y方向的长度
            }
            else {//处理水平方向相邻两个圆的情况
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }




    }

    set_direction(q) {//设置蛇的运动方向
        this.direction = q;
    }
}