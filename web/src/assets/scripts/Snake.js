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
    }
    start() {

    }
    update() {
        this.render();
    }
    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;
        ctx.fillStyle = this.color;
        for (const cell of this.cells) {
            ctx.beginPath();//开启路径
            ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}