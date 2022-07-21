package com.kob.backend.controller.user;

import com.kob.backend.mapper.PeopleMapper;
import com.kob.backend.pojo.People;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PeopleController {
    @Autowired
    PeopleMapper peopleMapper;

    @RequestMapping("/people/all/")
    public List<People>getAll(){
        return peopleMapper.selectList(null);
    }

}
