package com.kob.backend.service.impl.user.account;

import com.kob.backend.pojo.User;
import com.kob.backend.service.impl.utils.UserDetailsImpl;
import com.kob.backend.service.user.account.LoginService;
import com.kob.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private AuthenticationManager authenticationManager;


    @Override
    public Map<String, String> getToken(String username, String password) {
        //1.将用户传进来的明文的 用户名、密码封装成一个对象
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(username, password);

        //2.如果登录失败，会自动处理
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);

        //3.登陆成功，把User取出来,这个UserDetailsImpl是我自己在下面utils里写的
        UserDetailsImpl loginUser=(UserDetailsImpl) authenticate.getPrincipal();
        User user =loginUser.getUser();

        //4.将userid封装成jwt-token
        String jwt = JwtUtil.createJWT(user.getId().toString());

        //5.把结果放到map里，并return
        Map<String, String>map=new HashMap<>();

        map.put("error_message","success");
        map.put("token",jwt);
        return map;
    }
}
