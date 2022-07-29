package com.kob.backend.controller.user.account;


import com.kob.backend.service.user.account.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import java.util.Map;

@RestController
public class LoginController {
    @Autowired
    private LoginService loginService;

    //这里的调用顺序如下：
    // 1.首先前端的post命令访问/user/account/token/这个路径
    //然后LoginController的getToken传入一个map，两个key分别是username和password
    //然后调用service（loginService）来处理
    //2.到达loginService（这是个接口）之后找到它的实现：LoginServiceImpl
    //loginService的getToken传入了两个参数：String username, String password
    //在这里把这两个值转为一个对象，判断该用户是否注册过（合法），如果不是，那么自动会处理
    //如果是，则登录成功，将userid封装成jwt-token，把这个东西返回给用户
    @PostMapping("/user/account/token/")
    public Map<String, String>getToken(@RequestParam Map<String, String>map){
        String username=map.get("username");
        String password=map.get("password");
        return loginService.getToken(username,password);
    }

}
