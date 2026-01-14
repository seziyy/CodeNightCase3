package com.example.demo.repository;

import com.example.demo.model.BipNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BipNotificationRepository extends JpaRepository<BipNotification, String> {

    List<BipNotification> findByUser_UserId(String userId);
}
