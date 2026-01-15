# BiP Notification Test

## Backend BiP Notification API

### Endpoint
```
POST /notifications/{userId}
```

### Request Parameters
- `userId` (Path Parameter): User ID (e.g., "U3")
- `message` (Query Parameter): Notification message

### Example cURL Commands

#### 1. Send Notification for 2FA Action
```bash
curl -X POST "http://localhost:8080/notifications/U3?message=Güvenlik%20nedeniyle%20ek%20doğrulama%20(2FA)%20zorunlu%20hale%20getirildi." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

#### 2. Send Notification for BLOCK Action
```bash
curl -X POST "http://localhost:8080/notifications/U3?message=İşleminiz%20güvenlik%20nedeniyle%20engellendi.%20Lütfen%20müşteri%20hizmetleri%20ile%20iletişime%20geçin." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

#### 3. Send Notification for PAYMENT_REVIEW Action
```bash
curl -X POST "http://localhost:8080/notifications/U3?message=Ödemeniz%20manuel%20incelemeye%20alındı.%20En%20kısa%20zamanda%20sonuçlandırılacaktır." \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

#### 4. Get All Notifications
```bash
curl -X GET "http://localhost:8080/notifications" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

## Frontend Integration

### Feature: BiP Notification Button
- Located on the Decisions page under each decision card
- Button label: "BiP Bildirimi Gönder"
- Sends action-specific message based on selectedAction
- Shows "Bildirim Gönderildi" after successful send
- Button becomes disabled and turns green after sending

### Message Mapping
- **BLOCK**: "İşleminiz güvenlik nedeniyle engellendi..."
- **TEMPORARY_BLOCK**: "Hesabınız geçici olarak kilitlendi..."
- **FORCE_2FA**: "Güvenlik nedeniyle ek doğrulama (2FA) zorunlu hale getirildi."
- **PAYMENT_REVIEW**: "Ödemeniz manuel incelemeye alındı..."
- **WARN**: "Güvenlik sistemi anormal aktivite tespit etti..."
- **REVIEW**: "İşleminiz incelemeye alınmıştır..."
- **BIP_NOTIFY**: "Hesabınızla ilgili önemli bir bildirim alınmıştır."
- **LOG**: "Sisteme kayıt alınmıştır."
- **ALLOW**: "İşleminiz başarıyla tamamlanmıştır."

## Database Structure

Table: `bip_notifications`
- `notification_id` (PK): UUID
- `user_id` (FK): User reference
- `channel`: ServiceType (BIP)
- `message`: TEXT
- `sent_at`: Timestamp

## Mock Behavior
The BiP notification service currently:
1. Creates a BipNotification record in the database
2. Stores the user ID, message, and timestamp
3. Returns the created notification object
4. In production, this would send actual BiP messages to the user

## Testing Flow
1. Load Decisions page from API
2. Click "BiP Bildirimi Gönder" button on any decision
3. Notification is sent to `/notifications/{userId}`
4. Success response shows notification was stored
5. Button changes to green "Bildirim Gönderildi"
