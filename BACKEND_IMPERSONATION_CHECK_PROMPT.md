# Backend Impersonation Check - Prompt for Backend Review

## Context
We have an impersonation feature where admins can "Login as Doctor" from the `/users` page. When an admin impersonates a doctor, they should see the doctor's dashboard and access doctor-specific features as if they were that doctor.

**Current Issue**: When impersonating a doctor, the doctor dashboard doesn't work as expected compared to when a doctor logs in normally.

---

## What to Check

### 1. Impersonation Endpoint Implementation

**Endpoint**: `POST /api/users/{userId}/login-as`

**Expected Behavior**:
- Should establish an impersonation session/flag on the backend
- Should associate the impersonated user (doctor) with the admin's current session
- Should return the impersonated user's data (roles, permissions, account_type, etc.)
- Should NOT change the actual authentication token (admin's token should remain)

**Check These**:
- [ ] Is an impersonation session/flag being set? (e.g., in session storage, database, or cookie)
- [ ] Is the impersonated user ID being stored and associated with the admin's session?
- [ ] Is the response returning the correct impersonated user data with all necessary fields (id, name, email, account_type, roles, permissions, doctor relationship, etc.)?
- [ ] Are the impersonated user's permissions being included in the response?

**Common Issues**:
- ❌ Impersonation session not being created
- ❌ Only returning basic user data without roles/permissions
- ❌ Not including `account_type` field
- ❌ Not including `doctor` relationship data
- ❌ Missing `allPermissions` or `directPermissions` arrays

---

### 2. Doctor Dashboard Endpoint

**Endpoint**: `GET /api/doctor/dashboard`

**Expected Behavior When Impersonating**:
- Should detect if the request is being made by an admin in impersonation mode
- Should check permissions using the **impersonated doctor's permissions**, not the admin's
- Should return data scoped to the **impersonated doctor** (their patients, assessments, etc.)
- Should NOT return admin-level data

**Check These**:
- [ ] Does the endpoint check for an active impersonation session?
- [ ] When impersonating, does it use the impersonated doctor's ID to filter data?
- [ ] Are permissions checked against the impersonated doctor's permissions?
- [ ] Is the data properly scoped to the impersonated doctor (not admin's data)?
- [ ] Does it return 403 if the impersonated doctor doesn't have required permissions?

**Code Pattern to Look For**:
```php
// Laravel Example (adjust for your framework)
$user = auth()->user();
$impersonatedUser = session('impersonating_user_id');

if ($impersonatedUser) {
    // Use impersonated user for permission checks and data filtering
    $doctor = User::find($impersonatedUser);
    $this->authorize('patient.view', $doctor); // Check impersonated user's permissions
    // ... fetch data for impersonated doctor
} else {
    // Normal flow for actual doctor
    $doctor = auth()->user();
    // ... fetch data for actual doctor
}
```

**Common Issues**:
- ❌ Not checking for impersonation session at all
- ❌ Using admin's permissions instead of impersonated doctor's permissions
- ❌ Returning admin's data instead of doctor's data
- ❌ Not filtering data by impersonated doctor's ID
- ❌ Authorization middleware not aware of impersonation

---

### 3. All Doctor API Endpoints

**Endpoints to Check** (should ALL handle impersonation):
- `GET /api/doctor/assessments`
- `GET /api/doctor/assessments/{id}`
- `GET /api/doctor/assessments/patient/{patientId}`
- `GET /api/doctor/assessments/ready-for-review`
- `POST /api/doctor/assessments/{id}/review`
- `GET /api/doctor/assessments/{id}/pdf/status`
- `GET /api/doctor/assessments/{id}/pdf`
- `POST /api/doctor/assessments/{id}/pdf/regenerate`
- `GET /api/doctor/patients`
- `GET /api/doctor/patients/{id}`
- `POST /api/doctor/patients`
- `PUT /api/doctor/patients/{id}`
- `DELETE /api/doctor/patients/{id}`
- `GET /api/doctor/assessment-orders`
- `GET /api/doctor/assessment-orders/{id}`
- `POST /api/doctor/assessment-orders`
- `GET /api/doctor/dashboard`

**Expected Behavior**:
Each endpoint should:
- Check if admin is impersonating a doctor
- Use impersonated doctor's ID for data filtering
- Use impersonated doctor's permissions for authorization
- Return data scoped to the impersonated doctor

**Check These**:
- [ ] Is there a shared middleware/service that handles impersonation detection?
- [ ] Do all doctor endpoints use this middleware/service?
- [ ] Is the impersonated doctor's ID being used for data queries?
- [ ] Are permission checks using the impersonated doctor's permissions?

**Common Issues**:
- ❌ Inconsistent handling across endpoints
- ❌ Some endpoints work, others don't
- ❌ No shared impersonation detection logic (code duplication)
- ❌ Authorization checks bypass impersonation

---

### 4. Impersonation Session Management

**Check These**:
- [ ] How is the impersonation session stored? (session storage, database, cookie, etc.)
- [ ] Is it cleared when the admin logs out?
- [ ] Is it cleared when the admin stops impersonating?
- [ ] Is it persistent across page refreshes?
- [ ] Does it expire after a certain time?

**Common Issues**:
- ❌ Session not being created
- ❌ Session being lost on page refresh
- ❌ Session not being cleared on logout
- ❌ Session stored in wrong location

---

### 5. Permission/Authorization Middleware

**Check These**:
- [ ] Does the authorization middleware check for impersonation?
- [ ] When impersonating, does it check impersonated user's permissions?
- [ ] When not impersonating, does it check actual user's permissions?
- [ ] Are permission checks consistent across all endpoints?

**Code Pattern to Look For**:
```php
// Middleware example
public function handle($request, Closure $next)
{
    $user = auth()->user();
    $impersonatedUserId = session('impersonating_user_id');
    
    if ($impersonatedUserId) {
        $impersonatedUser = User::find($impersonatedUserId);
        
        // Check permissions using impersonated user
        if (!$impersonatedUser->hasPermission($permission)) {
            abort(403, 'Permission denied');
        }
        
        // Set context to use impersonated user
        $request->merge(['doctor_id' => $impersonatedUser->doctor->id]);
    } else {
        // Normal permission check
        if (!$user->hasPermission($permission)) {
            abort(403, 'Permission denied');
        }
    }
    
    return $next($request);
}
```

---

### 6. Database Queries and Data Filtering

**Check These**:
- [ ] When fetching patients: Are they filtered by impersonated doctor's ID?
- [ ] When fetching assessments: Are they filtered by impersonated doctor's ID?
- [ ] When fetching dashboard stats: Are they scoped to impersonated doctor?
- [ ] Are all `doctor_id` filters using the impersonated doctor's ID when impersonating?

**Common Issues**:
- ❌ Queries using admin's ID instead of impersonated doctor's ID
- ❌ Missing `where('doctor_id', $doctorId)` filters
- ❌ Data not being scoped properly

---

## Testing Steps

### Test 1: Basic Impersonation Flow
1. Admin logs in normally
2. Admin navigates to `/users` page
3. Admin clicks "Login as Doctor" for a doctor user
4. **Verify**: Response from `/api/users/{userId}/login-as` includes:
   - Full user object
   - `account_type: "doctor"`
   - `roles` array with doctor role
   - `permissions` or `allPermissions` array
   - `doctor` relationship data

### Test 2: Dashboard Access
1. After impersonating, navigate to `/dashboard`
2. **Verify**: Request to `/api/doctor/dashboard`:
   - Returns 200 (not 403)
   - Returns data for the impersonated doctor
   - Data includes doctor's patients, assessments, etc.
   - Does NOT include admin-level data

### Test 3: Permission Checks
1. Impersonate a doctor who has `patient.view` permission
2. Navigate to patients page
3. **Verify**: Can see patients
4. Impersonate a doctor who does NOT have `patient.view` permission
5. Navigate to patients page
6. **Verify**: Gets 403 error (not admin bypass)

### Test 4: Data Scoping
1. Admin has own patients/assessments
2. Impersonate Doctor A (has different patients/assessments)
3. Navigate to doctor dashboard
4. **Verify**: Only sees Doctor A's patients/assessments, not admin's data

### Test 5: Stop Impersonating
1. While impersonating, click "Stop Impersonating"
2. **Verify**: 
   - Request to stop impersonation clears session
   - Dashboard shows admin view again
   - Doctor endpoints return to admin permissions

---

## Expected vs Actual Behavior

### Expected Behavior (When Working Correctly):
- ✅ Admin can impersonate any doctor
- ✅ Impersonated view shows doctor's dashboard with doctor's data
- ✅ Permissions are checked against impersonated doctor's permissions
- ✅ Data is scoped to impersonated doctor
- ✅ Doctor-specific features work (patients, assessments, etc.)
- ✅ Stop impersonating returns to admin view

### Current Behavior (Issues):
- ❌ Doctor dashboard shows loading/error when impersonating
- ❌ Dashboard data doesn't load or shows wrong data
- ❌ Permissions might be using admin's permissions instead
- ❌ Data might not be scoped correctly

---

## Questions to Answer

1. **How is impersonation session stored?** (session, database, cookie?)
2. **Is there a shared middleware/service for impersonation detection?**
3. **Do all doctor endpoints check for impersonation?**
4. **Are permissions checked against impersonated user or admin?**
5. **Is data filtered by impersonated doctor's ID?**
6. **What happens if impersonated doctor doesn't have required permissions?**
7. **Is the impersonation session cleared on logout?**
8. **Does impersonation work across all doctor endpoints or just some?**

---

## Debugging Tools

### Add Logging (if needed):
```php
// Log impersonation state in each doctor endpoint
Log::info('Doctor endpoint called', [
    'admin_id' => auth()->id(),
    'impersonating_user_id' => session('impersonating_user_id'),
    'doctor_id_used' => $doctorId,
    'permissions_checked' => $permissions,
]);
```

### Test API Directly:
```bash
# 1. Login as admin and get token
# 2. Call impersonation endpoint
POST /api/users/{doctorUserId}/login-as
Headers: Authorization: Bearer {admin_token}

# 3. Call doctor dashboard
GET /api/doctor/dashboard
Headers: Authorization: Bearer {admin_token}
# Should return doctor's data, not admin's
```

---

## Files to Check (Backend)

Based on typical Laravel structure:
- [ ] `routes/api.php` - Check doctor routes
- [ ] `app/Http/Controllers/UserController.php` - `loginAs` method
- [ ] `app/Http/Controllers/Doctor/DashboardController.php` - Dashboard endpoint
- [ ] `app/Http/Controllers/Doctor/AssessmentController.php` - Assessment endpoints
- [ ] `app/Http/Controllers/Doctor/PatientController.php` - Patient endpoints
- [ ] `app/Http/Middleware/CheckImpersonation.php` - Impersonation middleware (if exists)
- [ ] `app/Services/ImpersonationService.php` - Impersonation service (if exists)
- [ ] Any authorization/policy files that check doctor permissions

---

## Summary

The main issue is likely that:
1. **Doctor endpoints are not detecting impersonation sessions**, OR
2. **Permission checks are using admin's permissions instead of impersonated doctor's**, OR
3. **Data queries are not filtering by impersonated doctor's ID**

Please review the backend code and ensure all doctor endpoints properly handle impersonation by:
- Detecting when an admin is impersonating
- Using impersonated doctor's permissions for authorization
- Filtering data by impersonated doctor's ID
- Returning data scoped to the impersonated doctor



