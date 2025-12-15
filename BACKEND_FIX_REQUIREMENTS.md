# Backend Fix Requirements for Patient Registration

## Issues Identified

### Issue 1: User Logged In as Doctor Instead of Patient
**Status:** ✅ Frontend Fixed - Now properly updates AuthContext

**Backend Check Required:**
- Verify that `/api/register/patient` returns user with `account_type: 'patient'`
- The response should include:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "name": "Patient Name",
        "email": "patient@example.com",
        "account_type": "patient",  // ← MUST be "patient", not "doctor"
        ...
      },
      "token": "jwt_token_here"
    }
  }
  ```

### Issue 2: Invitation Status Remains "Pending" After Registration
**Status:** ❌ Backend Issue - Invitation not marked as used

## Backend Fix Required

### Endpoint: `POST /api/register/patient`

**Current Behavior (Incorrect):**
- Creates user account
- Creates patient record
- Associates patient with doctor
- ❌ **Does NOT mark invitation as used**

**Required Behavior (Correct):**
1. Validate invitation token
2. Check if invitation is expired
3. Check if invitation is already used
4. Create user account with `account_type = 'patient'`
5. Create patient record
6. Associate patient with inviting doctor (`patient.doctor_id = invitation.doctor_id`)
7. ✅ **Mark invitation as used** (`invitation.used_at = now()`)
8. Return user, token, and patient data

### Backend Code Fix (Laravel Example)

```php
public function registerPatient(Request $request)
{
    // Validate request
    $validated = $request->validate([
        'token' => 'required|string',
        'name' => 'required|string|min:2',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // Find and validate invitation
    $invitation = PatientInvitation::where('token', $validated['token'])
        ->firstOrFail();

    // Check if invitation is expired
    if (Carbon::parse($invitation->expires_at)->isPast()) {
        return response()->json([
            'success' => false,
            'message' => 'Invitation has expired'
        ], 400);
    }

    // Check if invitation is already used
    if ($invitation->used_at !== null) {
        return response()->json([
            'success' => false,
            'message' => 'Invitation has already been used'
        ], 400);
    }

    DB::beginTransaction();
    try {
        // Create user account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $invitation->email, // Use email from invitation
            'password' => Hash::make($validated['password']),
            'account_type' => 'patient', // ← CRITICAL: Must be 'patient'
        ]);

        // Create patient record
        $patient = Patient::create([
            'user_id' => $user->id,
            'doctor_id' => $invitation->doctor_id, // Associate with inviting doctor
            'name' => $validated['name'],
            'email' => $invitation->email,
        ]);

        // ✅ MARK INVITATION AS USED (THIS IS THE FIX)
        $invitation->update([
            'used_at' => now(),
            'user_id' => $user->id, // Optional: Store which user used it
        ]);

        // Generate auth token
        $token = $user->createToken('auth_token')->plainTextToken;

        DB::commit();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->load('roles', 'permissions'),
                'token' => $token,
                'patient' => $patient,
            ]
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ], 500);
    }
}
```

## Database Migration Check

Ensure `patient_invitations` table has these fields:
- `used_at` (datetime, nullable) - to track when invitation was used
- `user_id` (foreign key, nullable) - optional: which user used the invitation

## Testing Checklist

### Test 1: User Account Type
- [ ] Register patient via invitation
- [ ] Check response: `user.account_type === 'patient'`
- [ ] Verify user is logged in as patient (not doctor)

### Test 2: Invitation Status Update
- [ ] Create invitation
- [ ] Check invitation status: should be `pending` (used_at = null)
- [ ] Register patient with invitation
- [ ] Check invitation status again: should be `used` (used_at = timestamp)
- [ ] Doctor should see invitation status as "Used" in dashboard

### Test 3: Invitation Cannot Be Reused
- [ ] Register patient with invitation
- [ ] Try to register another patient with same invitation
- [ ] Should fail with error: "Invitation has already been used"

### Test 4: Expired Invitation
- [ ] Create invitation with short expiration
- [ ] Wait for expiration (or manually set expires_at in database)
- [ ] Try to register with expired invitation
- [ ] Should fail with error: "Invitation has expired"

## Frontend Changes Made

✅ **Fixed:** Patient registration now properly updates AuthContext
- Calls `apiClient.setToken()` to set token in API client
- Calls `refreshProfile()` to update AuthContext with user data
- Uses `window.location.href` to force full page reload and ensure AuthContext is initialized

## Backend Action Items

1. ✅ Verify `account_type` is set to `'patient'` in registration response
2. ✅ **CRITICAL:** Mark invitation as used (`used_at = now()`) when patient registers
3. ✅ Update invitation record with `user_id` (optional but recommended)
4. ✅ Add validation to prevent reusing invitations
5. ✅ Add validation to prevent using expired invitations

## Verification Steps

After backend fix:

1. **Test Registration:**
   ```bash
   POST /api/register/patient
   {
     "token": "invitation_token",
     "name": "Test Patient",
     "password": "password123",
     "password_confirmation": "password123"
   }
   ```

2. **Check Response:**
   - Verify `user.account_type === 'patient'`
   - Verify response includes user, token, and patient

3. **Check Database:**
   ```sql
   SELECT * FROM patient_invitations WHERE token = 'invitation_token';
   -- Should show: used_at IS NOT NULL
   ```

4. **Check Doctor Dashboard:**
   - Doctor should see invitation status as "Used" (not "Pending")
   - Invitation should show user name who registered

---

## Summary

**Frontend:** ✅ Fixed - Now properly updates AuthContext after registration

**Backend:** ❌ Needs Fix - Must mark invitation as used when patient registers

The main backend fix is to add this line in the registration endpoint:
```php
$invitation->update(['used_at' => now()]);
```

This should be done AFTER successfully creating the user and patient, but BEFORE committing the transaction.
