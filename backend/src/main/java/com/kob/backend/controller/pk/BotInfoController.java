package com.kob.backend.controller.pk;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pk/")//先匹配到/pk/


public class BotInfoController {
    @RequestMapping("getbotinfo/")//rest开头表示默认去找数据而不是模板
    public String getBotInfo(){
        return "hhh";
    }
}
