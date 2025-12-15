# Backend Fix: Assessment Token Validation Error

## 🔍 Issue

When accessing an assessment link like:
```
http://localhost:3000/assessment/Ms7sp006CknlKVBhqLwKocp74KsXIzq4APRFfMUfu1tZw5XFLyEqsqUDbE29569q
```

The frontend receives an error:
```
Invalid or expired token.
```

## 📋 Frontend Request

The frontend is making this request:
```
GET /api/assessments/token/Ms7sp006CknlKVBhqLwKocp74KsXIzq4APRFfMUfu1tZw5XFLyEqsqUDbE29569q
```

**This is a PUBLIC endpoint** - no authentication required.

## 🔧 Backend Fix Required

The backend endpoint `GET /api/assessments/token/{token}` should:

### 1. Validate the Token

```php
public function validateToken($token)
{
    // Find assessment order by token
    $order = AssessmentOrder::where('token', $token)
        ->orWhere('assessment_token', $token) // Check both possible column names
        ->first();
    
    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired assessment link'
        ], 404);
    }
    
    // Check if token is expired
    if ($order->token_expires_at && Carbon::parse($order->token_expires_at)->isPast()) {
        return response()->json([
            'success' => false,
            'message' => 'Assessment link has expired'
        ], 400);
    }
    
    // Check if already completed
    if ($order->assessment && $order->assessment->status === 'completed') {
        return response()->json([
            'success' => false,
            'message' => 'This assessment has already been completed'
        ], 400);
    }
    
    // Return order data
    return response()->json([
        'success' => true,
        'data' => [
            'token' => $token,
            'order' => [
                'id' => $order->id,
                'assessment_type' => $order->assessment_type,
                'instructions' => $order->instructions,
                'patient' => [
                    'name' => $order->patient->name,
                    'email' => $order->patient->email,
                ],
                'doctor' => [
                    'name' => $order->doctor->full_name,
                    'email' => $order->doctor->email,
                ],
            ],
        ],
    ]);
}
```

### 2. Database Schema Check

Ensure the `assessment_orders` table has:
- `token` column (or `assessment_token`) - stores the token from the URL
- `token_expires_at` column - stores expiration date
- `assessment_id` column - links to completed assessment (nullable)

### 3. Token Generation

When creating an assessment order, ensure the token is:
- Generated and stored in the database
- Included in the email link
- Unique and secure (64+ characters)

```php
// When creating assessment order
$token = Str::random(64);
$expiresAt = now()->addDays(7); // 7 days expiration

$order = AssessmentOrder::create([
    'patient_id' => $patientId,
    'doctor_id' => $doctorId,
    'assessment_type' => $assessmentType,
    'token' => $token, // or 'assessment_token'
    'token_expires_at' => $expiresAt,
    'status' => 'sent',
    // ... other fields
]);

// Email link should be:
$assessmentUrl = config('app.frontend_url') . '/assessment/' . $token;
```

## 🎯 Expected Response Format

```json
{
  "success": true,
  "data": {
    "token": "Ms7sp006CknlKVBhqLwKocp74KsXIzq4APRFfMUfu1tZw5XFLyEqsqUDbE29569q",
    "order": {
      "id": 1,
      "assessment_type": "PHQ-9",
      "instructions": "Please complete this assessment...",
      "patient": {
        "name": "John Doe",
        "email": "patient@example.com"
      },
      "doctor": {
        "name": "Dr. Jane Smith",
        "email": "doctor@example.com"
      }
    }
  }
}
```

## ⚠️ Common Backend Issues

### Issue 1: Token Column Name Mismatch
```php
// ❌ WRONG: Column might be named differently
$order = AssessmentOrder::where('token', $token)->first();

// ✅ CORRECT: Check both possible names
$order = AssessmentOrder::where('token', $token)
    ->orWhere('assessment_token', $token)
    ->first();
```

### Issue 2: Token Not Stored When Creating Order
```php
// ❌ WRONG: Token not generated/stored
$order = AssessmentOrder::create([
    'patient_id' => $patientId,
    // Missing token field
]);

// ✅ CORRECT: Generate and store token
$token = Str::random(64);
$order = AssessmentOrder::create([
    'patient_id' => $patientId,
    'token' => $token,
    'token_expires_at' => now()->addDays(7),
]);
```

### Issue 3: Route Not Defined
```php
// ✅ Ensure route exists in routes/api.php
Route::get('/assessments/token/{token}', [AssessmentController::class, 'validateToken']);
```

## 🔍 Debugging Steps

1. **Check if token exists in database:**
   ```sql
   SELECT * FROM assessment_orders WHERE token = 'Ms7sp006CknlKVBhqLwKocp74KsXIzq4APRFfMUfu1tZw5XFLyEqsqUDbE29569q';
   ```

2. **Check token expiration:**
   ```sql
   SELECT token, token_expires_at, 
          NOW() as current_time,
          (token_expires_at > NOW()) as is_valid
   FROM assessment_orders 
   WHERE token = 'Ms7sp006CknlKVBhqLwKocp74KsXIzq4APRFfMUfu1tZw5XFLyEqsqUDbE29569q';
   ```

3. **Check backend logs** for the actual error message

4. **Verify route is accessible** (no auth middleware blocking it)

## ✅ Frontend Status

The frontend is correctly:
- ✅ Calling `GET /api/assessments/token/{token}`
- ✅ Handling the response
- ✅ Showing appropriate error messages
- ✅ Logging errors for debugging

**The issue is on the backend side.** The backend needs to:
1. Implement the token validation endpoint
2. Store tokens when creating assessment orders
3. Check token expiration
4. Return the correct response format
