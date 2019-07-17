package com.eugeneSkachko.simpleBlog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

    @RequestMapping("/")
    @GetMapping
    public String main() {
        return "index";
    }

    @RequestMapping("/login")
    @GetMapping
    public String login() {
        return "login";
    }

    @RequestMapping("/registration")
    @GetMapping
    public String register() {
        return "registration";
    }
}


