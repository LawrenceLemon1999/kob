package com.kob.backend.consumer;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
public class WebSocketServer {

    /*需要使用线程安全的哈希表去存放公共的变量，公共的变量使用static */
    /* users 存储 用户-链接 之间的对应关系*/
    private static ConcurrentHashMap<Integer,WebSocketServer> users=new ConcurrentHashMap<>();

    private User user;

    /*每个链接都是使用session来维护的 */
    private Session session = null;


    /*websocket里注入mapper的时候，和前面在controller里的注入不太一样*/
    private static UserMapper userMapper;
    @Autowired
    public static void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }



    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) {
        // 建立连接的时候会调用这个函数

        //建立链接的时候，需要把session存下来。
        this.session=session;
        System.out.println("connected");

        /*从token里得到用户id，然后通过mapper找到User*/
        Integer userId= Integer.parseInt(token);
        this.user=userMapper.selectById(userId);
    }

    @OnClose
    public void onClose() {
        // 关闭链接的时候会调用这个函数
        System.out.println("disconnected");
        if(this.user!=null){
            users.remove(this.user.getId());
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        // 从Client接收消息的时候会调用这个函数
        System.out.println("receive message");
    }

    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }


    //后端向前端(当前这个链接）发送信息
    public void sendMessage(String message){
        synchronized (this.session){//由于是异步通信，需要加锁
            try {
                this.session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
