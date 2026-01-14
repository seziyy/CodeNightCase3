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

    /**
     * Yeni kullanıcı oluşturur.
     * userId client tarafından gelmez, backend UUID üretir.
     */
    public User create(User user) {
        user.setUserId(UUID.randomUUID().toString());
        return repository.save(user);
    }

    /**
     * userId (String) ile kullanıcı getirir.
     */
    public User getUserById(String userId) {
        return repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    /**
     * Tüm kullanıcıları listeler.
     */
    public List<User> getAll() {
        return repository.findAll();
    }
}
