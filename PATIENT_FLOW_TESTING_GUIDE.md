# Patient Flow Testing Guide

## Overview

The patient registration flow is now **doctor-driven**. Patients cannot register independently - they must be invited by a doctor office.

## Complete Patient Flow

### Step 1: Doctor Creates Patient Invitation

1. **Login as Doctor**
   - Navigate to: `http://localhost:3000/login`
   - Login with doctor credentials

2. **Go to Patients Page**
   - Navigate to: `http://localhost:3000/doctor/patients`
   - Click on the **"Patient Invitations"** tab

3. **Create Invitation**
   - Enter patient email address (e.g., `patient@example.com`)
   - Set expiration days (default: 7 days)
   - Click **"Send Invitation"**
   - The system will generate an invitation token and URL

4. **Copy Invitation Link**
   - After creating invitation, you'll see it in the invitations list
   - Click the **copy icon** to copy the invitation link
   - The link format: `http://localhost:3000/onboarding?token={invitation_token}`

### Step 2: Patient Receives Invitation

**Option A: Email (if backend sends email)**
- Patient receives email with invitation link
- Patient clicks the link

**Option B: Manual Sharing (for testing)**
- Doctor copies the invitation link from the dashboard
- Doctor shares the link with patient (via email, SMS, etc.)

### Step 3: Patient Registers via Invitation

1. **Open Invitation Link**
   - Patient opens: `http://localhost:3000/onboarding?token={token}`
   - The system validates the token automatically

2. **Complete Registration Form**
   - **Full Name**: Enter patient's full name
   - **Email**: Pre-filled (cannot be changed - set by doctor)
   - **Password**: Create a password (min 8 characters)
   - **Confirm Password**: Re-enter password
   - Click **"Create Account"**

3. **Automatic Redirect**
   - After successful registration, patient is automatically logged in
   - Redirected to: `/onboarding` (patient onboarding wizard)

### Step 4: Patient Completes Onboarding

The patient onboarding now includes **ONLY** these steps (insurance and medical removed):

1. **Welcome Step** - Introduction
2. **Basic Information**
   - Name (pre-filled)
   - Email (pre-filled)
   - Date of Birth
   - Phone Number
3. **Address Information**
   - Street Address
   - City
   - State
   - ZIP Code
4. **Demographics**
   - Gender
   - Race/Ethnicity
   - Other demographic information
5. **Emergency Contact**
   - Emergency contact name
   - Relationship
   - Phone number
6. **Review & Complete**
   - Review all information
   - Complete onboarding

**Note**: Insurance and Medical Background steps are **removed** - these are now collected by doctors after patient completes onboarding.

### Step 5: Patient Access to Dashboard

- After completing onboarding, patient is redirected to dashboard
- Patient can now:
  - View their profile
  - Complete assessments
  - View access requests from other doctors
  - Manage their health records

---

## Testing Scenarios

### ✅ Happy Path Test

1. Doctor creates invitation for `testpatient@example.com`
2. Copy invitation link
3. Open link in incognito/private browser (simulate patient)
4. Complete registration
5. Complete onboarding steps
6. Verify patient appears in doctor's patient list

### ❌ Invalid Token Test

1. Try to access: `http://localhost:3000/onboarding?token=invalid_token`
2. Should show error: "Invalid or expired invitation"
3. Should not allow registration

### ⏰ Expired Invitation Test

1. Create invitation with 1 day expiration
2. Wait for expiration (or manually expire in database)
3. Try to use the invitation link
4. Should show: "Invalid or expired invitation"

### 🔄 Already Used Invitation Test

1. Create invitation
2. Use invitation to register patient
3. Try to use same invitation link again
4. Should show: "Invitation already used"

### 📧 Resend Invitation Test

1. Create invitation
2. In invitations list, click **"Resend"** button
3. New invitation link should be generated
4. Old link should be invalidated

---

## API Endpoints Used

### Public Endpoints (No Auth Required)

- `GET /api/invitations/validate?token={token}` - Validate invitation token
- `POST /api/register/patient` - Register patient with invitation token

### Doctor Endpoints (Auth Required)

- `POST /api/doctor/patient-invitations` - Create invitation
- `GET /api/doctor/patient-invitations?include_used={boolean}` - Get invitations
- `POST /api/doctor/patient-invitations/{id}/resend` - Resend invitation

---

## Patient Access Request Flow (Optional)

### For Existing Patients

If a patient already exists in the system (registered with another doctor), doctors can request access:

1. **Doctor Views Patient** (not in their practice)
2. **Request Access**
   - Doctor uses `RequestPatientAccess` component
   - Optionally adds a message
   - Submits request

3. **Patient Reviews Request**
   - Patient sees request in their dashboard
   - Patient can **Approve** or **Reject**
   - If approved, patient records are transferred to requesting doctor

---

## Quick Test Checklist

- [ ] Doctor can create patient invitation
- [ ] Invitation link is generated correctly
- [ ] Invitation link can be copied
- [ ] Patient can access invitation link
- [ ] Invalid token shows error
- [ ] Patient can register with valid token
- [ ] Patient email is pre-filled and disabled
- [ ] Patient is redirected to onboarding after registration
- [ ] Patient completes onboarding (only 4 steps: basic, address, demographics, emergency)
- [ ] Insurance and medical steps are NOT shown
- [ ] Patient appears in doctor's patient list after onboarding
- [ ] Expired invitations show error
- [ ] Used invitations cannot be reused
- [ ] Doctor can resend invitations
- [ ] Invitation list shows status (pending/used/expired)

---

## Troubleshooting

### Invitation link not working?
- Check if token is valid in database
- Check if invitation is expired
- Check if invitation was already used
- Verify API endpoint is correct: `/api/invitations/validate`

### Patient registration fails?
- Check if password meets requirements (min 8 characters)
- Check if passwords match
- Check backend logs for validation errors
- Verify API endpoint: `/api/register/patient`

### Onboarding steps not showing correctly?
- Verify patient account_type is 'patient'
- Check backend onboarding steps configuration
- Verify insurance and medical steps are filtered out (frontend)

### Patient not appearing in doctor's list?
- Check if patient completed onboarding
- Verify patient is associated with correct doctor
- Check backend patient-doctor relationship

---

## Notes

1. **Invitation Links**: The backend returns `invitation_url` when creating invitations. You can display this to doctors or automatically send it via email.

2. **Token Validation**: Always validate the invitation token before showing the registration form to provide better UX.

3. **Onboarding Restrictions**: The frontend filters out insurance and medical steps for patients. These are now collected by doctors after patient completes onboarding.

4. **Security**: Never expose invitation tokens in logs or error messages. Always use HTTPS for invitation links in production.

5. **Email Integration**: If your backend sends invitation emails, the invitation link will be included automatically. Otherwise, doctors need to manually share the link.
