package com.kob.backend.consumer;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.kob.backend.consumer.utils.JwtAuthentication;
import com.kob.backend.mapper.UserMapper;
import com.kob.backend.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@ServerEndpoint("/websocket/{token}")  // 注意不要以'/'结尾
    public class WebSocketServer {

    /*需要使用线程安全的哈希表去存放公共的变量，公共的变量使用static */
    /* users 存储 用户-链接 之间的对应关系*/
    final private static ConcurrentHashMap<Integer,WebSocketServer> users=new ConcurrentHashMap<>();

    /*匹配池 */
    final private static CopyOnWriteArraySet<User>matchpool=new CopyOnWriteArraySet<>();


    private User user;

    /*每个链接都是使用session来维护的  Session是WebSocket里的一个包*/
    private Session session = null;


    /*websocket里注入mapper的时候，和前面在controller里的注入不太一样*/
    private static UserMapper userMapper;
    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }



    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        // 建立连接的时候会调用这个函数
        //建立链接的时候，需要把session存下来。
        this.session=session;

        System.out.println("connected");

        /*从token里得到用户id，然后通过mapper找到User*/
        Integer userId= JwtAuthentication.getUserId(token);//刚才的token是直接传入的userId，现在是正经的token，所以解析一下。
        this.user=userMapper.selectById(userId);
        if (this.user != null) {
            users.put(userId, this);
        } else {
            this.session.close();
        }

    }

    @OnClose
    public void onClose() {
        // 关闭链接的时候会调用这个函数
        System.out.println("disconnected");
        if(this.user!=null){
            users.remove(this.user.getId());
            matchpool.remove(this.user);
        }
    }


    private void startMatching(){
        System.out.println("start matching");
        matchpool.add(this.user);
        while(matchpool.size()>=2){
            Iterator<User> it=matchpool.iterator();
            User a=it.next();
            User b=it.next();
            matchpool.remove(a);
            matchpool.remove(b);
            JSONObject respA=new JSONObject();
            respA.put("event","start-matching");
            respA.put("opponent_username",b.getUsername());
            respA.put("opponent_photo",b.getPhoto());
            users.get(a.getId()).sendMessage(respA.toJSONString());

            JSONObject respB=new JSONObject();
            respB.put("event","start-matching");
            respB.put("opponent_username",a.getUsername());
            respB.put("opponent_photo",a.getPhoto());
            users.get(b.getId()).sendMessage(respB.toJSONString());

        }
    }
    private void stopMatching(){
        System.out.println("stop matching");

        matchpool.remove(this.user);
    }
    @OnMessage
    public void onMessage(String message, Session session) {
        //作为路由来用，判断交给谁去处理。
        // 从Client接收消息的时候会调用这个函数
        //把JSON信息给解析出来。
        JSONObject data=JSONObject.parseObject(message);
        String event=data.getString("event");
        if("start-matching".equals(event)){
            startMatching();
        }
        else if("stop-matching".equals(event)){
            stopMatching();
        }

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
