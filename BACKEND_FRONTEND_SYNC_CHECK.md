# Backend-Frontend Sync Verification

## ✅ API Endpoints Verification

### Public Endpoints (No Auth Required)

#### 1. Validate Invitation Token
**Frontend Implementation:**
- File: `lib/api/invitations.ts`
- Endpoint: `GET /api/invitations/validate?token={token}`
- Used in: `app/(auth)/onboarding/page.tsx`

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "email": "string",
    "doctor": {
      "name": "string",
      "practice_name": "string"
    },
    "expires_at": "string"
  }
}
```

**Backend Requirements:**
- ✅ Route: `GET /api/invitations/validate`
- ✅ Query parameter: `token`
- ✅ Returns invitation details if valid
- ✅ Returns error if expired/used/invalid

---

#### 2. Patient Registration via Invitation
**Frontend Implementation:**
- File: `lib/api/auth.ts` → `registerPatient()`
- Endpoint: `POST /api/register/patient`
- Used in: `app/(auth)/onboarding/page.tsx`

**Frontend Request Body:**
```typescript
{
  token: string
  name: string
  password: string
  password_confirmation: string
}
```

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* User object */ },
    "token": "string",
    "patient": { /* Patient object */ }
  }
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/register/patient`
- ✅ Validates invitation token
- ✅ Creates user account with account_type='patient'
- ✅ Creates patient record
- ✅ Associates patient with inviting doctor
- ✅ Returns auth token for immediate login

---

### Doctor Endpoints (Auth Required - Bearer Token)

#### 3. Create Patient Invitation
**Frontend Implementation:**
- File: `lib/api/doctor.ts` → `createPatientInvitation()`
- Endpoint: `POST /api/doctor/patient-invitations`
- Used in: `components/doctor/PatientInvitationForm.tsx`

**Frontend Request Body:**
```typescript
{
  email: string
  expires_in_days?: number  // Optional, default: 7
}
```

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": number,
      "email": "string",
      "token": "string",
      "expires_at": "string",
      "created_at": "string"
    },
    "invitation_url": "string"
  }
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/doctor/patient-invitations`
- ✅ Requires authentication (Bearer token)
- ✅ Validates email format
- ✅ Creates invitation record
- ✅ Generates unique token
- ✅ Sets expiration date (default: 7 days from now)
- ✅ Returns invitation URL for sharing

---

#### 4. Get Doctor's Invitations
**Frontend Implementation:**
- File: `lib/api/doctor.ts` → `getPatientInvitations()`
- Endpoint: `GET /api/doctor/patient-invitations?include_used={boolean}`
- Used in: `components/doctor/PatientInvitationList.tsx`

**Frontend Query Parameters:**
- `include_used`: boolean (default: false)

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "email": "string",
      "token": "string",
      "expires_at": "string",
      "used_at": "string | null",
      "created_at": "string",
      "user": { "id": number, "name": "string" } | null
    }
  ]
}
```

**Backend Requirements:**
- ✅ Route: `GET /api/doctor/patient-invitations`
- ✅ Requires authentication
- ✅ Query parameter: `include_used` (boolean)
- ✅ Returns only doctor's own invitations
- ✅ Filters by `include_used` parameter
- ✅ Includes user info if invitation was used

---

#### 5. Resend Invitation
**Frontend Implementation:**
- File: `lib/api/doctor.ts` → `resendPatientInvitation()`
- Endpoint: `POST /api/doctor/patient-invitations/{id}/resend`
- Used in: `components/doctor/PatientInvitationList.tsx`

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Invitation resent successfully"
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/doctor/patient-invitations/{id}/resend`
- ✅ Requires authentication
- ✅ Validates invitation belongs to doctor
- ✅ Generates new token (invalidates old one)
- ✅ Updates expiration date
- ✅ Returns success message

---

#### 6. Create Access Request
**Frontend Implementation:**
- File: `lib/api/doctor.ts` → `createAccessRequest()`
- Endpoint: `POST /api/doctor/patient-access-requests`
- Used in: `components/doctor/RequestPatientAccess.tsx`

**Frontend Request Body:**
```typescript
{
  patient_id: number
  message?: string  // Optional
}
```

**Expected Backend Response:**
```json
{
  "success": true,
  "data": {
    "id": number,
    "patient_id": number,
    "requesting_doctor": { /* Doctor object */ },
    "current_doctor": { /* Doctor object */ },
    "status": "pending",
    "message": "string | null",
    "created_at": "string"
  }
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/doctor/patient-access-requests`
- ✅ Requires authentication
- ✅ Validates patient exists
- ✅ Validates patient is not already in requesting doctor's practice
- ✅ Creates access request with status='pending'
- ✅ Returns access request details

---

#### 7. Get Doctor's Access Requests
**Frontend Implementation:**
- File: `lib/api/doctor.ts` → `getAccessRequests()`
- Endpoint: `GET /api/doctor/patient-access-requests`
- Used in: (Not yet integrated, but available)

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "patient_id": number,
      "requesting_doctor": { /* Doctor object */ },
      "current_doctor": { /* Doctor object */ },
      "status": "pending" | "approved" | "rejected",
      "message": "string | null",
      "created_at": "string"
    }
  ]
}
```

**Backend Requirements:**
- ✅ Route: `GET /api/doctor/patient-access-requests`
- ✅ Requires authentication
- ✅ Returns only doctor's own access requests
- ✅ Includes all statuses (pending, approved, rejected)

---

### Patient Endpoints (Auth Required - Bearer Token)

#### 8. Get Patient's Access Requests
**Frontend Implementation:**
- File: `lib/api/patient.ts` → `getAccessRequests()`
- Endpoint: `GET /api/patient/access-requests`
- Used in: `components/patient/PatientAccessRequestList.tsx`

**Expected Backend Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": number,
      "patient_id": number,
      "requesting_doctor": {
        "id": number,
        "full_name": "string",
        "practice_name": "string"
      },
      "current_doctor": {
        "id": number,
        "full_name": "string",
        "practice_name": "string"
      },
      "status": "pending" | "approved" | "rejected",
      "message": "string | null",
      "created_at": "string"
    }
  ]
}
```

**Backend Requirements:**
- ✅ Route: `GET /api/patient/access-requests`
- ✅ Requires authentication (patient account)
- ✅ Returns only patient's own access requests
- ✅ Includes doctor details

---

#### 9. Approve Access Request
**Frontend Implementation:**
- File: `lib/api/patient.ts` → `approveAccessRequest()`
- Endpoint: `POST /api/patient/access-requests/{id}/approve`
- Used in: `components/patient/PatientAccessRequestList.tsx`

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Access granted. Records transferred.",
  "data": {
    /* Updated access request */
  }
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/patient/access-requests/{id}/approve`
- ✅ Requires authentication (patient account)
- ✅ Validates request belongs to patient
- ✅ Validates request is pending
- ✅ Transfers patient records to requesting doctor
- ✅ Updates access request status to 'approved'
- ✅ Removes patient from current doctor's practice

---

#### 10. Reject Access Request
**Frontend Implementation:**
- File: `lib/api/patient.ts` → `rejectAccessRequest()`
- Endpoint: `POST /api/patient/access-requests/{id}/reject`
- Used in: `components/patient/PatientAccessRequestList.tsx`

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Access request rejected",
  "data": {
    /* Updated access request */
  }
}
```

**Backend Requirements:**
- ✅ Route: `POST /api/patient/access-requests/{id}/reject`
- ✅ Requires authentication (patient account)
- ✅ Validates request belongs to patient
- ✅ Validates request is pending
- ✅ Updates access request status to 'rejected'
- ✅ Does NOT transfer records

---

## 🔍 Backend Database Requirements

### Tables Needed:

1. **patient_invitations**
   - `id` (primary key)
   - `doctor_id` (foreign key to doctors)
   - `email` (string)
   - `token` (string, unique)
   - `expires_at` (datetime)
   - `used_at` (datetime, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **patient_access_requests**
   - `id` (primary key)
   - `patient_id` (foreign key to patients)
   - `requesting_doctor_id` (foreign key to doctors)
   - `current_doctor_id` (foreign key to doctors)
   - `status` (enum: 'pending', 'approved', 'rejected')
   - `message` (text, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. **patients** table should have:
   - `doctor_id` (foreign key) - to track which doctor owns the patient

---

## ⚠️ Potential Issues to Check

### 1. Registration Endpoint Response Format
**Issue:** Frontend expects `{ user, token, patient }` but backend might return different structure.

**Check:**
- Backend should return `AuthData` format: `{ user, token }`
- Patient data might be nested in `user.patient` or separate `patient` field
- Verify: `app/(auth)/onboarding/page.tsx` line 85-93

**Fix if needed:**
```typescript
// If backend returns user.patient instead of separate patient field
const user = response.data.data.user
const patient = user.patient || response.data.data.patient
```

---

### 2. Invitation Validation Response
**Issue:** Frontend expects `doctor.name` and `doctor.practice_name`

**Check:**
- Backend should return doctor's full name (not first_name/last_name separately)
- Backend should return practice_name from doctor profile

**Fix if needed:**
```typescript
// If backend returns different structure
doctor: {
  name: doctor.full_name || `${doctor.first_name} ${doctor.last_name}`,
  practice_name: doctor.practice_name
}
```

---

### 3. Access Request Response Structure
**Issue:** Frontend expects `requesting_doctor.full_name` and `current_doctor.full_name`

**Check:**
- Backend should return full_name (not first_name/last_name separately)
- Backend should include practice_name

**Fix if needed:**
```typescript
// Transform in frontend if needed
requesting_doctor: {
  full_name: doctor.full_name || `${doctor.first_name} ${doctor.last_name}`,
  practice_name: doctor.practice_name
}
```

---

### 4. Error Response Format
**Frontend expects:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error message"]
  }
}
```

**Check:** Backend should return errors in this format for validation errors.

---

## ✅ Frontend Implementation Checklist

### Components Created:
- [x] `app/(auth)/onboarding/page.tsx` - Invitation registration
- [x] `components/doctor/PatientInvitationForm.tsx` - Create invitation
- [x] `components/doctor/PatientInvitationList.tsx` - List invitations
- [x] `components/patient/PatientAccessRequestList.tsx` - Patient view requests
- [x] `components/doctor/RequestPatientAccess.tsx` - Doctor request access

### API Clients Created:
- [x] `lib/api/invitations.ts` - Invitation validation
- [x] `lib/api/patient.ts` - Patient access requests
- [x] `lib/api/doctor.ts` - Updated with invitations & access requests
- [x] `lib/api/auth.ts` - Updated with patient registration

### Pages Updated:
- [x] `app/(auth)/register/page.tsx` - Removed patient option
- [x] `app/(dashboard)/doctor/patients/page.tsx` - Added invitations tab
- [x] `components/onboarding/OnboardingWizard.tsx` - Filtered insurance/medical steps

---

## 🧪 Testing Checklist

### Backend API Tests:
- [ ] Test invitation validation with valid token
- [ ] Test invitation validation with expired token
- [ ] Test invitation validation with used token
- [ ] Test invitation validation with invalid token
- [ ] Test patient registration with valid invitation
- [ ] Test patient registration with invalid data
- [ ] Test create invitation (doctor auth required)
- [ ] Test get invitations (doctor auth required)
- [ ] Test resend invitation (doctor auth required)
- [ ] Test create access request (doctor auth required)
- [ ] Test get access requests (patient auth required)
- [ ] Test approve access request (patient auth required)
- [ ] Test reject access request (patient auth required)

### Integration Tests:
- [ ] Complete flow: Create invitation → Register patient → Complete onboarding
- [ ] Test expired invitation flow
- [ ] Test access request flow: Request → Approve → Transfer
- [ ] Test access request flow: Request → Reject

---

## 📝 Notes

1. **Token Generation:** Backend should generate secure, unique tokens for invitations
2. **Expiration:** Default expiration is 7 days, but configurable
3. **Email Integration:** Backend may send invitation emails automatically (optional)
4. **Security:** All doctor endpoints require Bearer token authentication
5. **Patient Association:** After registration, patient should be automatically associated with inviting doctor

---

## 🔧 If Backend Structure Differs

If your backend returns different field names or structures, you can:

1. **Create adapter functions** in API client files
2. **Transform data** in component level
3. **Update TypeScript interfaces** to match backend

Example adapter:
```typescript
// In lib/api/doctor.ts
const transformInvitation = (backendData: any) => ({
  ...backendData,
  doctor: {
    name: backendData.doctor.full_name || `${backendData.doctor.first_name} ${backendData.doctor.last_name}`,
    practice_name: backendData.doctor.practice_name
  }
})
```
