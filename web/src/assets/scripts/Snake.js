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

        this.dr = [-1, 0, 1, 0];//行和列的偏移量
        this.dc = [0, 1, 0, -1];

        this.step = 0;//表示回合数
    }
    start() {

    }
    update_move() {
        // this.cells[0].x += this.speed * this.timedelta / 1000;
    }
    next_step() {//将蛇的状态变为走下一步
        const d = this.direction;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;//方向在使用之后就清空，避免对之后造成影响。
        this.status = 'move';
        this.step++;//回合数+1
    }

    update() {
        this.update_move();
        this.render();
    }
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        for (const cell of this.cells) {
            ctx.beginPath();//开启路径
            ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
            //前两个参数是圆心坐标（对于canvas来说的坐标），第三个参数是半径
            //四五参数是起始角度和终止角度
            ctx.fill();
        }
    }
}