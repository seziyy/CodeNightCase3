package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public User create(User user) {

        if (user.getUserId() == null || user.getUserId().isBlank()) {
            throw new IllegalArgumentException("userId boş olamaz");
        }

        return repository.save(user);
    }

    public User getUserById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<User> getAll() {
        return repository.findAll();
    }
}
