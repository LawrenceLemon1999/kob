package com.kob.backend.controller.pk;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/pk/")//先匹配到/pk/
public class IndexController {
    @RequestMapping("index/")//然后匹配到index/
    public String index(){
        return "pk/index.html";//返回的页面路径，在templates里面的pk包里的index.html文件
    }
}
