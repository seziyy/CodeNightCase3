package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    /**
     * Kullanıcı oluşturma
     * userId dışarıdan gelir (U1, U2 vs)
     */
    public User create(User user) {

        if (user.getUserId() == null || user.getUserId().isBlank()) {
            throw new IllegalArgumentException("userId boş olamaz");
        }

        if (repository.existsById(user.getUserId())) {
            throw new IllegalArgumentException(
                    "User already exists: " + user.getUserId()
            );
        }

        return repository.save(user);
    }

    /**
     * Controller'lar için TEK ve NET isim
     */
    public User getById(String userId) {
        return repository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + userId)
                );
    }

    public List<User> getAll() {
        return repository.findAll();
    }
}
