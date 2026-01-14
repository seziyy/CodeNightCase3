package com.example.demo.repository;

import com.example.demo.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findByUser_UserId(String userId);

    List<Event> findByUser_UserIdAndTimestampBetween(
            String userId,
            Instant start,
            Instant end
    );

    long countByUser_UserIdAndEventTypeAndTimestampAfter(
            String userId,
            String eventType,
            Instant timestamp
    );
}
