package com.example.aop;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lmb on 2018/9/5.
 */
@RestController
@RequestMapping("/aopController")
public class AopController {

    @RequestMapping(value = "/sayHello",method = RequestMethod.GET)
    public String sayHello(String name){
        return "hello " + name;
    }
}
