# New Patient Flow - Backend Requirements

## 🎯 Overview

The patient flow has been completely redesigned. This document outlines all backend requirements.

---

## 📋 Required Backend Endpoints

### Public Endpoints (No Auth Required)

#### 1. Validate Login Link Token
**Endpoint**: `GET /api/patient/setup-password/validate?token={token}`

**Purpose**: Validate login link token before showing password setup form

**Request**:
- Query parameter: `token` (string, required)

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "email": "patient@example.com",
    "patient_name": "John Doe",
    "doctor": {
      "name": "Dr. Jane Smith",
      "practice_name": "Smith Medical Practice"
    },
    "expires_at": "2024-01-15T10:00:00Z"
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Invalid or expired login link"
}
```

**Validation Rules**:
- Token must exist in database (likely `patient_login_links` or similar table)
- Token must not be expired (`expires_at > now()`)
- Token must not be used (`used_at IS NULL`)

---

#### 2. Setup Password
**Endpoint**: `POST /api/patient/setup-password`

**Purpose**: Set password for patient account and auto-login

**Request Body**:
```json
{
  "token": "login_link_token",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "patient@example.com",
      "account_type": "patient",
      ...
    },
    "token": "jwt_auth_token",
    "patient": {
      "id": 1,
      "name": "John Doe",
      "email": "patient@example.com",
      "doctor_id": 5,
      ...
    }
  }
}
```

**Backend Logic**:
1. Validate token (exists, not expired, not used)
2. Validate password (min 8 characters, matches confirmation)
3. Find patient by token/email
4. Create user account with `account_type = 'patient'` (if not exists)
5. Set password for user account
6. Mark login link as used (`used_at = now()`)
7. Generate JWT token
8. Return user, token, and patient data

---

### Doctor Endpoints (Auth Required)

#### 3. Create Patient (Updated)
**Endpoint**: `POST /api/doctor/patients`

**Purpose**: Create patient with all details and send login link

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date_of_birth": "1990-01-01",
  "phone": "123-456-7890",
  // ... all other patient fields (medical history, insurance, etc.)
  "invitation_expires_in_days": 7  // Optional, default: 7
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "doctor_id": 5,
      ...
    },
    "invitation": {
      "id": 1,
      "email": "john@example.com",
      "expires_at": "2024-01-15T10:00:00Z",
      "login_url": "http://localhost:3000/patient/setup-password?token=generated_token"
    }
  }
}
```

**Backend Logic**:
1. Authenticate doctor
2. Validate all patient data
3. Create patient record with all details
4. Generate login link token
5. Create login link record
6. Send email with login link (optional)
7. Return patient data and login URL

**Database Tables Needed**:
- `patients` - Store all patient details
- `patient_login_links` - Store login link tokens
  - `id`, `patient_id`, `token`, `expires_at`, `used_at`, `created_at`

---

### Patient Endpoints (Auth Required)

#### 4. Get Patient Profile
**Endpoint**: `GET /api/patient/profile`

**Purpose**: Get patient profile with current doctor information

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "patient": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "date_of_birth": "1990-01-01",
      "phone": "123-456-7890",
      ...
    },
    "doctor": {
      "id": 5,
      "full_name": "Dr. Jane Smith",
      "practice_name": "Smith Medical Practice",
      "email": "doctor@example.com",
      "phone_number": "123-456-7890"
    }
  }
}
```

---

#### 5. Get Doctor Change Requests
**Endpoint**: `GET /api/patient/doctor-change-requests`

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 10,
      "current_doctor": {
        "id": 3,
        "full_name": "Dr. Jane Doe",
        "practice_name": "Doe Clinic"
      },
      "requested_doctor": {
        "id": 5,
        "full_name": "Dr. John Smith",
        "practice_name": "Smith Medical Practice"
      },
      "status": "pending",
      "reason": "Optional reason",
      "admin_notes": null,
      "created_at": "2024-01-08T10:00:00Z"
    }
  ]
}
```

---

#### 6. Create Doctor Change Request
**Endpoint**: `POST /api/patient/doctor-change-requests`

**Request Body**:
```json
{
  "requested_doctor_id": 5,
  "reason": "Optional reason for change"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    ...
  }
}
```

**Backend Logic**:
1. Authenticate patient
2. Verify patient exists
3. Get patient's current doctor
4. Verify requested doctor is NOT current doctor
5. Check if pending request already exists (prevent duplicates)
6. Create change request with status='pending'
7. Return request data

---

### Admin Endpoints (Auth Required)

#### 7. Get Pending Doctor Change Requests
**Endpoint**: `GET /api/admin/patient-doctor-change-requests/pending`

**Response (Success)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient": {
        "id": 10,
        "name": "John Doe",
        "email": "patient@example.com"
      },
      "current_doctor": {
        "id": 3,
        "full_name": "Dr. Jane Doe",
        "practice_name": "Doe Clinic"
      },
      "requested_doctor": {
        "id": 5,
        "full_name": "Dr. John Smith",
        "practice_name": "Smith Medical Practice"
      },
      "status": "pending",
      "reason": "Optional reason",
      "created_at": "2024-01-08T10:00:00Z"
    }
  ]
}
```

---

#### 8. Approve Doctor Change Request
**Endpoint**: `POST /api/admin/patient-doctor-change-requests/{id}/approve`

**Request Body**:
```json
{
  "admin_notes": "Optional admin notes"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Doctor change request approved. Patient has been transferred.",
  "data": {
    "id": 1,
    "status": "approved",
    ...
  }
}
```

**Backend Logic**:
1. Authenticate admin
2. Verify request exists and is pending
3. Update patient's `doctor_id` to `requested_doctor_id`
4. Update request status to 'approved'
5. Add admin notes if provided
6. Create doctor history record (track the change)
7. Return success message

---

#### 9. Reject Doctor Change Request
**Endpoint**: `POST /api/admin/patient-doctor-change-requests/{id}/reject`

**Request Body**:
```json
{
  "admin_notes": "Optional admin notes"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Doctor change request rejected",
  "data": {
    "id": 1,
    "status": "rejected",
    ...
  }
}
```

**Backend Logic**:
1. Authenticate admin
2. Verify request exists and is pending
3. Update request status to 'rejected'
4. Add admin notes if provided
5. Do NOT transfer patient
6. Return success message

---

## 🗄️ Database Tables Required

### 1. `patient_login_links` Table
```sql
CREATE TABLE patient_login_links (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_patient_id (patient_id)
);
```

### 2. `patient_doctor_change_requests` Table
```sql
CREATE TABLE patient_doctor_change_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  current_doctor_id BIGINT NOT NULL,
  requested_doctor_id BIGINT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reason TEXT NULL,
  admin_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (current_doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (requested_doctor_id) REFERENCES doctors(id),
  INDEX idx_patient_id (patient_id),
  INDEX idx_status (status)
);
```

### 3. `patient_doctor_history` Table (Optional - for tracking)
```sql
CREATE TABLE patient_doctor_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  assigned_at DATETIME NOT NULL,
  unassigned_at DATETIME NULL,
  change_request_id BIGINT NULL, -- Reference to change request if applicable
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (change_request_id) REFERENCES patient_doctor_change_requests(id),
  INDEX idx_patient_id (patient_id),
  INDEX idx_doctor_id (doctor_id)
);
```

### 4. Update `patients` Table
- Ensure `doctor_id` field exists (foreign key to doctors)
- This tracks the current/active doctor for the patient

---

## 🔄 Backend Logic Flow

### Patient Creation Flow

```
Doctor creates patient
    ↓
Backend validates data
    ↓
Create patient record
    ↓
Generate login link token
    ↓
Create login_link record
    ↓
Send email with login link (optional)
    ↓
Return { patient, invitation: { login_url } }
```

### Password Setup Flow

```
Patient clicks login link
    ↓
Frontend validates token
    ↓
Patient sets password
    ↓
Backend validates token + password
    ↓
Create user account (if not exists)
    ↓
Set password
    ↓
Mark login link as used
    ↓
Generate JWT token
    ↓
Return { user, token, patient }
```

### Doctor Change Request Flow

```
Patient requests doctor change
    ↓
Backend creates change_request (status: pending)
    ↓
Admin reviews request
    ↓
Admin approves/rejects
    ↓
If approved:
  - Update patient.doctor_id
  - Create history record
  - Update request status
```

---

## ⚠️ Important Backend Notes

### 1. Login Link Token Generation
- Use cryptographically secure random token (64+ characters)
- Store as plain text (needed for URL)
- Ensure uniqueness
- Default expiration: 7 days (configurable)

### 2. Patient Account Creation
- User account should be created when patient record is created
- OR created when password is set (if backend prefers)
- Must have `account_type = 'patient'`
- Password should be NULL until patient sets it

### 3. Doctor Change Approval
- When approved, update `patient.doctor_id`
- Create history record (optional but recommended)
- Do NOT delete old doctor association - track in history

### 4. Email Integration
- Send login link email when patient is created
- Send notification when doctor change is approved/rejected
- Email templates should include login URL

### 5. Security
- Validate all tokens before use
- Check expiration dates
- Prevent token reuse
- Use HTTPS for login links in production

---

## ✅ Backend Checklist

### Database
- [ ] Create `patient_login_links` table
- [ ] Create `patient_doctor_change_requests` table
- [ ] Create `patient_doctor_history` table (optional)
- [ ] Verify `patients.doctor_id` field exists

### Endpoints
- [ ] `GET /api/patient/setup-password/validate`
- [ ] `POST /api/patient/setup-password`
- [ ] `POST /api/doctor/patients` (updated to return invitation)
- [ ] `GET /api/patient/profile`
- [ ] `GET /api/patient/doctor-change-requests`
- [ ] `POST /api/patient/doctor-change-requests`
- [ ] `GET /api/admin/patient-doctor-change-requests/pending`
- [ ] `POST /api/admin/patient-doctor-change-requests/{id}/approve`
- [ ] `POST /api/admin/patient-doctor-change-requests/{id}/reject`

### Business Logic
- [ ] Generate secure login link tokens
- [ ] Mark login links as used after password setup
- [ ] Create user account with `account_type='patient'`
- [ ] Track doctor changes in history
- [ ] Send email notifications

---

## 🧪 Testing Checklist

### Patient Creation
- [ ] Doctor can create patient with all fields
- [ ] Login link is generated
- [ ] Login URL is returned in response
- [ ] Email is sent (if configured)

### Password Setup
- [ ] Login link validates correctly
- [ ] Expired links are rejected
- [ ] Used links are rejected
- [ ] Password setup works
- [ ] User account is created/updated
- [ ] Login link is marked as used
- [ ] JWT token is generated

### Doctor Change Request
- [ ] Patient can create request
- [ ] Duplicate requests are prevented
- [ ] Admin can see pending requests
- [ ] Admin can approve request
- [ ] Admin can reject request
- [ ] Patient is transferred on approval
- [ ] History is updated

---

## 📝 Response Format Examples

### Create Patient Response
```json
{
  "success": true,
  "data": {
    "patient": { /* patient object */ },
    "invitation": {
      "id": 1,
      "email": "patient@example.com",
      "expires_at": "2024-01-15T10:00:00Z",
      "login_url": "http://localhost:3000/patient/setup-password?token=abc123..."
    }
  }
}
```

### Setup Password Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "patient@example.com",
      "account_type": "patient"  // ← CRITICAL: Must be "patient"
    },
    "token": "jwt_token_here",
    "patient": { /* patient object */ }
  }
}
```

---

All frontend components are ready. Backend needs to implement these endpoints according to the specifications above.
