package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.pojo.Emp;
import org.example.pojo.LoginInfo;
import org.example.pojo.Result;
import org.example.service.EmpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
*登录controller
* */
@Slf4j
@RestController
@RequestMapping
public class LoginController {

    @Autowired
    private EmpService empService;

    /*
    * 登录接口
    * */
    @PostMapping("/login")
    public Result login(@RequestBody Emp emp) {
        log.info("登录:{}",emp);
        LoginInfo loginInfo = empService.login(emp);
        if (loginInfo != null){
            return Result.success(loginInfo);
        }
        return Result.error("用户名或密码错误");
    }
}
