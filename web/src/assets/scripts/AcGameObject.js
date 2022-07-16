const AC_GAME_OBJECTS = [];


export class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false;//有没有启动过
        this.timedelta = 0;//因为帧与帧之间的时间间隔不一定是均匀的，
        //所以在计算距离的时候需要知道这一帧和上一帧的时间间隔，然后用速度*时间得到移动的距离

    }
    start() {//只执行一次

    }
    update() {//除了第一帧，每一帧都调用一次

    }
    on_destroy() {//在调用destroy之前调用一次

    }
    destroy() {
        this.on_destroy();
        for (let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if (obj == this) {
                AC_GAME_OBJECTS.replice(i);
                break;
            }
        }
    }
}

let last_timestamp;//上一次执行的时刻
const step = (timestamp) => {
    for (let obj of AC_GAME_OBJECTS) {//of遍历的是值，in遍历的是下标
        if (!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        }
        else {
            obj.timedelta = timestamp - last_timestamp;//当前的时刻减去上一个时刻
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
}
requestAnimationFrame(step);