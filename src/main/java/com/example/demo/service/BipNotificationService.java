package com.example.demo.service;

import com.example.demo.dto.NotificationResponse;
import com.example.demo.model.BipNotification;
import com.example.demo.model.User;
import com.example.demo.model.enums.ServiceType;
import com.example.demo.repository.BipNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BipNotificationService {

    private final BipNotificationRepository repository;
    private final RestTemplate restTemplate;

    @Value("${bip.api.endpoint:https://api.bip.turkcell.com.tr/send}")
    private String bipApiEndpoint;

    @Value("${bip.api.enabled:false}")
    private boolean bipApiEnabled;

    /**
     * BiP notification gönderimi
     * Gerçek sistemde BiP API'sine HTTP request gönderir
     */
    public NotificationResponse send(User user, String message) {
        String notificationId = UUID.randomUUID().toString();
        Instant sentAt = Instant.now();

        // BiP API'sine gönder
        NotificationResponse response = sendToBiP(user, message, notificationId, sentAt);

        // Database'e kaydet
        BipNotification notification = BipNotification.builder()
                .notificationId(notificationId)
                .userId(user.getUserId())
                .user(user)
                .channel(ServiceType.BIP)
                .message(message)
                .sentAt(sentAt)
                .build();

        repository.save(notification);
        
        log.info("✓ BiP Notification başarıyla gönderildi - NotificationID: {}", notificationId);
        
        return response;
    }

    /**
     * BiP API'ye gerçek istek gönderimi
     */
    private NotificationResponse sendToBiP(User user, String message, String notificationId, Instant sentAt) {
        if (!bipApiEnabled) {
            return handleMockNotification(user, message, notificationId, sentAt);
        }

        try {
            // BiP API request body'sini hazırla
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("userId", user.getUserId());
            requestBody.put("userName", user.getName());
            requestBody.put("userCity", user.getCity());
            requestBody.put("userSegment", user.getSegment().toString());
            requestBody.put("message", message);
            requestBody.put("notificationId", notificationId);
            requestBody.put("timestamp", sentAt.toString());

            // HTTP headers ayarla
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer mock-token");
            headers.set("User-Agent", "RiskEngine/1.0");

            // HTTP entity oluştur
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // BiP API'sine POST request gönder
            Map<String, Object> apiResponse = restTemplate.postForObject(
                    bipApiEndpoint,
                    requestEntity,
                    Map.class
            );

            log.info("✓ BiP API başarıyla yanıt verdi");
            
            return NotificationResponse.builder()
                    .notificationId(notificationId)
                    .userId(user.getUserId())
                    .userName(user.getName())
                    .userCity(user.getCity())
                    .userSegment(user.getSegment().toString())
                    .message(message)
                    .channel("BiP")
                    .sentAt(sentAt)
                    .status("SUCCESS")
                    .mockMode(false)
                    .statusMessage("BiP API'ye başarıyla gönderildi")
                    .build();

        } catch (RestClientException e) {
            log.warn("⚠ BiP API'ye bağlanılamadı: {}. Mock modda kaydediliyor.", e.getMessage());
            return handleMockNotification(user, message, notificationId, sentAt);
        } catch (Exception e) {
            log.error("✗ BiP notification gönderimi hatası: {}", e.getMessage(), e);
            return NotificationResponse.builder()
                    .notificationId(notificationId)
                    .userId(user.getUserId())
                    .userName(user.getName())
                    .userCity(user.getCity())
                    .userSegment(user.getSegment().toString())
                    .message(message)
                    .channel("BiP")
                    .sentAt(sentAt)
                    .status("ERROR")
                    .mockMode(false)
                    .statusMessage("Bildirim gönderiminde hata oluştu: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Mock notification response oluştur
     */
    private NotificationResponse handleMockNotification(User user, String message, String notificationId, Instant sentAt) {
        return NotificationResponse.builder()
                .notificationId(notificationId)
                .userId(user.getUserId())
                .userName(user.getName())
                .userCity(user.getCity())
                .userSegment(user.getSegment().toString())
                .message(message)
                .channel("BiP")
                .sentAt(sentAt)
                .status("SUCCESS")
                .mockMode(true)
                .statusMessage("Mock modda gösterilmiştir")
                .build();
    }

    public List<BipNotification> getAll() {
        return repository.findAll();
    }
}
