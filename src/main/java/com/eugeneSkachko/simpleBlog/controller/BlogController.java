package com.eugeneSkachko.simpleBlog.controller;

import com.eugeneSkachko.simpleBlog.domain.Blog;
import com.eugeneSkachko.simpleBlog.domain.Views;
import com.eugeneSkachko.simpleBlog.repo.BlogRepo;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("blog")
public class BlogController {
    private final BlogRepo blogRepo;

    private String getUser(){
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();
        return username;
    }

    @Autowired
    public BlogController(@Autowired BlogRepo blogRepo) {
        this.blogRepo = blogRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<Blog> list() {
        return blogRepo.findAll();
    }

    @GetMapping("{id}")
    @JsonView(Views.IdName.class)
    public List<Blog> getOne(@PathVariable("id") Blog post) {
        List<Blog> list =  new ArrayList<Blog>();
        list.add(post);
        return list;
    }

    @PostMapping
    public Blog create(@RequestBody Blog post) {
        post.setAuth(getUser());
        return blogRepo.save(post);
    }

    @PutMapping("{id}")
    public Blog update(
            @PathVariable("id") Blog blogFromDb,
            @RequestBody Blog blog
    ) {
        BeanUtils.copyProperties(blog, blogFromDb, "id", "auth");
        return blogRepo.save(blogFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Blog post) {
        blogRepo.delete(post);
    }
}
