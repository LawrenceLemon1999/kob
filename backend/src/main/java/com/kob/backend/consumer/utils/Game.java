package com.kob.backend.consumer.utils;

import com.alibaba.fastjson.JSONObject;
import com.kob.backend.consumer.WebSocketServer;

import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.locks.ReentrantLock;

public class Game extends Thread{
    private final Integer rows;
    private final Integer cols;
    private final Integer inner_walls_count;
    private final int[][] g;
    private final static int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1};

    private final Player playerA, playerB;

    private Integer nextStepA=null;//两名玩家的下一步操作
    private Integer nextStepB=null;
    private ReentrantLock lock=new ReentrantLock();

    private String status ="playing";//playing -> finished
    private String loser="";//all:"平局"，A：A输  B：B输


    public Game(Integer rows, Integer cols, Integer inner_walls_count,Integer idA,Integer idB)  {
        this.rows = rows;
        this.cols = cols;
        this.inner_walls_count = inner_walls_count;
        this.g = new int[rows][cols];

        /*playerA 初始在左下角,B初始在右上角*/
        playerA=new Player(idA,rows-2,1,new ArrayList<>());
        playerB=new Player(idB,1,cols-2,new ArrayList<>());

    }

    public int[][] getG() {
        return g;
    }

    public Player getPlayerA() {
        return playerA;
    }

    public Player getPlayerB() {
        return playerB;
    }

    private boolean check_connectivity(int sx, int sy, int tx, int ty) {
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = 1;

        for (int i = 0; i < 4; i++) {
            int x = sx + dx[i], y = sy + dy[i];
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols && g[x][y] == 0) {
                if (check_connectivity(x, y, tx, ty)) {
                    g[sx][sy] = 0;
                    return true;
                }
            }
        }

        g[sx][sy] = 0;
        return false;
    }

    private boolean draw() {  // 画地图
        for (int i = 0; i < this.rows; i++) {
            for (int j = 0; j < this.cols; j++) {
                g[i][j] = 0;
            }
        }

        for (int r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.cols - 1] = 1;
        }
        for (int c = 0; c < this.cols; c++) {
            g[0][c] = g[this.rows - 1][c] = 1;
        }

        Random random = new Random();
        for (int i = 0; i < this.inner_walls_count / 2; i++) {
            for (int j = 0; j < 1000; j++) {
                int r = random.nextInt(this.rows);
                int c = random.nextInt(this.cols);

                if (g[r][c] == 1 || g[this.rows - 1 - r][this.cols - 1 - c] == 1)
                    continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
                    continue;

                g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = 1;
                break;
            }
        }

        return check_connectivity(this.rows - 2, 1, 1, this.cols - 2);
    }

    public void createMap() {
        for (int i = 0; i < 1000; i++) {
            if (draw())
                break;
        }
    }

    private void judge(){//判断两名玩家下一步操作是否合法

    }

    private void sendMove(){//向两个Client传递移动信息。
        lock.lock();
        try {
            JSONObject resp=new JSONObject();
            resp.put("event","move");
            resp.put("a_direction",nextStepA);//存入玩家a,b的下一步操作
            resp.put("b_direction",nextStepB);
            nextStepA=null;
            nextStepB=null;//读取之后就要清空
            sendAllMessage(resp.toJSONString());
        }finally {
            lock.unlock();
        }
    }

    private void sendResult(){//向两个Client公布结果
        JSONObject resp=new JSONObject();
        resp.put("event","result");
        resp.put("loser",loser);
        sendAllMessage(resp.toJSONString());
    }

    private void sendAllMessage(String message){//通用的传递消息的函数。
        WebSocketServer.users.get(playerA.getId()).sendMessage(message);
        WebSocketServer.users.get(playerB.getId()).sendMessage(message);
    }

    @Override
    public void run(){
        for(int i=0;i<1000;i++){
            if(nextStep()){//是否获取了两条蛇的下一步操作。
                judge();
                if(status.equals("playing")){
                    sendMove();
                }
                else{//如果已经不在playing了，说明对局已结束，可以向玩家传输结果了。
                    sendResult();
                    break;
                }
            }
            else{
                lock.lock();
                try {
                    status="finished";
                    if(nextStepA==null &&nextStepB==null){
                        loser="all";
                    }
                    else if(nextStepA==null){
                        loser="A";
                    }
                    else{
                        loser="B";
                    }
                }finally {
                    lock.unlock();
                }
                sendResult();
                break;
            }
        }
    }


    public void setNextStepA(Integer nextStepA) {
        lock.lock();
        try{
            this.nextStepA = nextStepA;
        }finally {
            lock.unlock();
        }
    }

    public void setNextStepB(Integer nextStepB) {
        lock.lock();
        try {
            this.nextStepB = nextStepB;
        } finally {
            lock.unlock();
        }
    }

    private boolean nextStep(){//等待两名玩家的下一步动作

        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        for(int i=0;i<5;i++){
            try {
                Thread.sleep(1000);
                lock.lock();
                try {
                    if(nextStepA!=null&&nextStepB!=null){
                        playerA.steps.add(nextStepA);
                        playerB.steps.add(nextStepB);
                        return true;
                    }
                }finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
