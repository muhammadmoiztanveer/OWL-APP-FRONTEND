# Backend Requirements Summary for Patient Flow

## 🎯 Quick Checklist for Backend Implementation

### ✅ Required Backend Endpoints

#### Public Endpoints (No Auth)
1. **GET** `/api/invitations/validate?token={token}`
2. **POST** `/api/register/patient`

#### Doctor Endpoints (Auth: Bearer Token)
3. **POST** `/api/doctor/patient-invitations`
4. **GET** `/api/doctor/patient-invitations?include_used={boolean}`
5. **POST** `/api/doctor/patient-invitations/{id}/resend`
6. **POST** `/api/doctor/patient-access-requests`
7. **GET** `/api/doctor/patient-access-requests`

#### Patient Endpoints (Auth: Bearer Token)
8. **GET** `/api/patient/access-requests`
9. **POST** `/api/patient/access-requests/{id}/approve`
10. **POST** `/api/patient/access-requests/{id}/reject`

---

## 📋 Detailed Backend Requirements

### 1. Database Tables

#### `patient_invitations` Table
```sql
- id (primary key, auto increment)
- doctor_id (foreign key → doctors.id)
- email (string, required)
- token (string, unique, required)
- expires_at (datetime, required)
- used_at (datetime, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `patient_access_requests` Table
```sql
- id (primary key, auto increment)
- patient_id (foreign key → patients.id)
- requesting_doctor_id (foreign key → doctors.id)
- current_doctor_id (foreign key → doctors.id)
- status (enum: 'pending', 'approved', 'rejected', default: 'pending')
- message (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `patients` Table (Update if needed)
```sql
- doctor_id (foreign key → doctors.id, required)
  - This associates patient with their primary doctor
```

---

### 2. API Endpoint Specifications

#### GET `/api/invitations/validate?token={token}`

**Purpose:** Validate invitation token before showing registration form

**Request:**
- Query parameter: `token` (string, required)

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "email": "patient@example.com",
    "doctor": {
      "name": "Dr. John Smith",
      "practice_name": "Smith Medical Practice"
    },
    "expires_at": "2024-01-15T10:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired invitation"
}
```

**Validation Rules:**
- Token must exist in `patient_invitations` table
- Token must not be expired (`expires_at > now()`)
- Token must not be used (`used_at IS NULL`)

---

#### POST `/api/register/patient`

**Purpose:** Register patient using invitation token

**Request Body:**
```json
{
  "token": "invitation_token_string",
  "name": "Patient Full Name",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Patient Full Name",
      "email": "patient@example.com",
      "account_type": "patient",
      "created_at": "2024-01-08T10:00:00Z"
    },
    "token": "jwt_auth_token_here",
    "patient": {
      "id": 1,
      "user_id": 1,
      "doctor_id": 5,
      "name": "Patient Full Name",
      "email": "patient@example.com"
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Validation error message",
  "errors": {
    "password": ["Password must be at least 8 characters"],
    "token": ["Invalid or expired invitation"]
  }
}
```

**Backend Logic:**
1. Validate invitation token (exists, not expired, not used)
2. Validate request data (name, password, password_confirmation)
3. Create user account with `account_type = 'patient'`
4. Create patient record
5. Associate patient with inviting doctor (`doctor_id = invitation.doctor_id`)
6. Mark invitation as used (`used_at = now()`)
7. Generate JWT token for immediate login
8. Return user, token, and patient data

---

#### POST `/api/doctor/patient-invitations`

**Purpose:** Create new patient invitation

**Headers:**
```
Authorization: Bearer {doctor_jwt_token}
```

**Request Body:**
```json
{
  "email": "patient@example.com",
  "expires_in_days": 7
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": 1,
      "doctor_id": 5,
      "email": "patient@example.com",
      "token": "generated_unique_token",
      "expires_at": "2024-01-15T10:00:00Z",
      "used_at": null,
      "created_at": "2024-01-08T10:00:00Z"
    },
    "invitation_url": "http://localhost:3000/onboarding?token=generated_unique_token"
  }
}
```

**Backend Logic:**
1. Authenticate doctor (verify JWT token)
2. Validate email format
3. Generate unique token (secure random string)
4. Calculate expiration date (now + expires_in_days, default: 7)
5. Create invitation record
6. Return invitation data and full URL

**Token Generation:**
- Use secure random generator (e.g., `Str::random(64)` in Laravel)
- Ensure uniqueness (check database before saving)
- Store as plain text (not hashed) - needed for URL

---

#### GET `/api/doctor/patient-invitations?include_used={boolean}`

**Purpose:** Get list of doctor's invitations

**Headers:**
```
Authorization: Bearer {doctor_jwt_token}
```

**Query Parameters:**
- `include_used` (boolean, default: false)

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "patient@example.com",
      "token": "token_string",
      "expires_at": "2024-01-15T10:00:00Z",
      "used_at": "2024-01-09T10:00:00Z",
      "created_at": "2024-01-08T10:00:00Z",
      "user": {
        "id": 10,
        "name": "Patient Name"
      }
    }
  ]
}
```

**Backend Logic:**
1. Authenticate doctor
2. Query invitations where `doctor_id = authenticated_doctor_id`
3. If `include_used = false`, filter where `used_at IS NULL`
4. Include user data if invitation was used
5. Return list of invitations

---

#### POST `/api/doctor/patient-invitations/{id}/resend`

**Purpose:** Resend invitation (generate new token)

**Headers:**
```
Authorization: Bearer {doctor_jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Invitation resent successfully"
}
```

**Backend Logic:**
1. Authenticate doctor
2. Verify invitation belongs to doctor
3. Generate new token
4. Update expiration date (extend by original days or default 7)
5. Reset `used_at` to NULL (if it was used)
6. Return success message

---

#### POST `/api/doctor/patient-access-requests`

**Purpose:** Request access to existing patient

**Headers:**
```
Authorization: Bearer {doctor_jwt_token}
```

**Request Body:**
```json
{
  "patient_id": 10,
  "message": "Optional message to patient"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 10,
    "requesting_doctor_id": 5,
    "current_doctor_id": 3,
    "status": "pending",
    "message": "Optional message to patient",
    "created_at": "2024-01-08T10:00:00Z",
    "requesting_doctor": {
      "id": 5,
      "full_name": "Dr. John Smith",
      "practice_name": "Smith Medical Practice"
    },
    "current_doctor": {
      "id": 3,
      "full_name": "Dr. Jane Doe",
      "practice_name": "Doe Clinic"
    }
  }
}
```

**Backend Logic:**
1. Authenticate doctor
2. Verify patient exists
3. Get patient's current doctor (`patient.doctor_id`)
4. Verify requesting doctor is NOT the current doctor
5. Check if pending request already exists (prevent duplicates)
6. Create access request with status='pending'
7. Return request data with doctor details

---

#### GET `/api/doctor/patient-access-requests`

**Purpose:** Get doctor's access requests (they made)

**Headers:**
```
Authorization: Bearer {doctor_jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 10,
      "requesting_doctor_id": 5,
      "current_doctor_id": 3,
      "status": "pending",
      "message": "Optional message",
      "created_at": "2024-01-08T10:00:00Z"
    }
  ]
}
```

**Backend Logic:**
1. Authenticate doctor
2. Query where `requesting_doctor_id = authenticated_doctor_id`
3. Return all requests (pending, approved, rejected)

---

#### GET `/api/patient/access-requests`

**Purpose:** Get patient's access requests (requests for them)

**Headers:**
```
Authorization: Bearer {patient_jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 10,
      "requesting_doctor": {
        "id": 5,
        "full_name": "Dr. John Smith",
        "practice_name": "Smith Medical Practice"
      },
      "current_doctor": {
        "id": 3,
        "full_name": "Dr. Jane Doe",
        "practice_name": "Doe Clinic"
      },
      "status": "pending",
      "message": "Optional message",
      "created_at": "2024-01-08T10:00:00Z"
    }
  ]
}
```

**Backend Logic:**
1. Authenticate patient
2. Query where `patient_id = authenticated_patient_id`
3. Include doctor details (full_name, practice_name)
4. Return all requests

---

#### POST `/api/patient/access-requests/{id}/approve`

**Purpose:** Patient approves access request

**Headers:**
```
Authorization: Bearer {patient_jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Access granted. Records transferred.",
  "data": {
    "id": 1,
    "status": "approved",
    /* ... other fields ... */
  }
}
```

**Backend Logic:**
1. Authenticate patient
2. Verify request belongs to patient
3. Verify request status is 'pending'
4. Update patient's `doctor_id` to `requesting_doctor_id`
5. Update request status to 'approved'
6. (Optional) Transfer assessment records, medical history, etc.
7. Return success message

---

#### POST `/api/patient/access-requests/{id}/reject`

**Purpose:** Patient rejects access request

**Headers:**
```
Authorization: Bearer {patient_jwt_token}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Access request rejected",
  "data": {
    "id": 1,
    "status": "rejected",
    /* ... other fields ... */
  }
}
```

**Backend Logic:**
1. Authenticate patient
2. Verify request belongs to patient
3. Verify request status is 'pending'
4. Update request status to 'rejected'
5. Do NOT transfer records
6. Return success message

---

## 🔒 Security Requirements

1. **Token Security:**
   - Use cryptographically secure random token generation
   - Tokens should be long enough (64+ characters)
   - Store tokens as plain text (needed for URLs)

2. **Authentication:**
   - All doctor endpoints require Bearer token
   - All patient endpoints require Bearer token
   - Validate token on every request

3. **Authorization:**
   - Doctors can only see their own invitations
   - Patients can only see their own access requests
   - Verify ownership before any update/delete operations

4. **Validation:**
   - Validate email format
   - Validate password strength (min 8 characters)
   - Validate invitation expiration
   - Prevent duplicate access requests

---

## 📧 Optional: Email Integration

If you want to send invitation emails automatically:

1. **After creating invitation:**
   - Send email to patient with invitation link
   - Include doctor's practice name
   - Include expiration date

2. **Email Template:**
   ```
   Subject: Invitation to Join [Practice Name]
   
   Hello,
   
   You've been invited by [Practice Name] to join our patient portal.
   
   Click here to register: [invitation_url]
   
   This invitation expires on: [expires_at]
   ```

---

## ✅ Testing Checklist

### Backend API Tests:
- [ ] Invitation validation with valid token
- [ ] Invitation validation with expired token
- [ ] Invitation validation with used token
- [ ] Patient registration with valid invitation
- [ ] Patient registration with invalid data
- [ ] Create invitation (doctor auth)
- [ ] Get invitations (doctor auth)
- [ ] Resend invitation (doctor auth)
- [ ] Create access request (doctor auth)
- [ ] Get access requests (patient auth)
- [ ] Approve access request (patient auth)
- [ ] Reject access request (patient auth)

### Integration Tests:
- [ ] Complete flow: Create invitation → Register → Onboarding
- [ ] Access request flow: Request → Approve → Transfer
- [ ] Access request flow: Request → Reject

---

## 🔧 Common Issues & Solutions

### Issue 1: Token Already Used
**Solution:** Check `used_at` field before allowing registration

### Issue 2: Expired Invitation
**Solution:** Compare `expires_at` with current timestamp

### Issue 3: Patient Already Exists
**Solution:** Check if email already has account before creating invitation

### Issue 4: Doctor Accessing Other Doctor's Invitations
**Solution:** Always filter by `doctor_id = authenticated_doctor_id`

### Issue 5: Patient Approving Own Request
**Solution:** Verify `patient_id` matches authenticated patient

---

## 📝 Notes

1. **Token Format:** Use URL-safe characters (base64url encoding recommended)
2. **Expiration:** Default 7 days, but configurable per invitation
3. **Patient Association:** Automatically associate with inviting doctor on registration
4. **Access Transfer:** When patient approves access request, update `patient.doctor_id`
5. **Email Field:** Patient email is set by doctor during invitation creation

---

## 🚀 Quick Start for Backend

1. **Create migrations:**
   ```bash
   php artisan make:migration create_patient_invitations_table
   php artisan make:migration create_patient_access_requests_table
   ```

2. **Create models:**
   ```bash
   php artisan make:model PatientInvitation
   php artisan make:model PatientAccessRequest
   ```

3. **Create controllers:**
   ```bash
   php artisan make:controller InvitationController
   php artisan make:controller PatientAccessRequestController
   ```

4. **Add routes:**
   - Public routes for invitation validation and patient registration
   - Protected routes for doctor and patient endpoints

5. **Implement business logic:**
   - Token generation
   - Expiration checking
   - Patient association
   - Access request handling

---

This document provides all the backend requirements needed to sync with the frontend implementation.
