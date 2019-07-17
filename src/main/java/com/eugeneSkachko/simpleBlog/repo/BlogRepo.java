package com.eugeneSkachko.simpleBlog.repo;

import com.eugeneSkachko.simpleBlog.domain.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepo extends JpaRepository<Blog, Long> {
}
