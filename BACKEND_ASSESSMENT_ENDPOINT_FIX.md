# Backend Fix: "Unknown named parameter $userId" Error

## 🔍 Issue

When calling `GET /api/patient/assessments/assigned`, the backend is throwing an error:
```
Unknown named parameter $userId
```

## 📋 Frontend Request

The frontend is making this request:
```
GET /api/patient/assessments/assigned
Headers:
  Authorization: Bearer {patient_jwt_token}
```

**No query parameters or body parameters are sent.** The patient's identity is determined from the JWT token.

## 🔧 Backend Fix Required

The backend endpoint should:

1. **Extract user ID from authenticated token** (not from request parameters)
   ```php
   $user = auth()->user();
   $userId = $user->id;
   ```

2. **Use the authenticated user's ID in the database query**
   ```php
   // ✅ CORRECT: Get user ID from authenticated user
   $userId = auth()->id();
   
   // Query assessments for this patient
   $assessments = AssessmentOrder::where('patient_id', function($query) use ($userId) {
       $query->select('id')
             ->from('patients')
             ->where('user_id', $userId);
   })->get();
   ```

3. **DO NOT use $userId as a named parameter if it's not bound**
   ```php
   // ❌ WRONG: This will cause "Unknown named parameter $userId"
   DB::select("SELECT * FROM assessments WHERE user_id = :userId", [
       // Missing 'userId' => $userId binding
   ]);
   
   // ✅ CORRECT: Bind the parameter
   DB::select("SELECT * FROM assessments WHERE user_id = :userId", [
       'userId' => $userId
   ]);
   ```

## 🎯 Expected Backend Implementation

```php
// In PatientAssessmentController or similar

public function getAssignedAssessments()
{
    // Get authenticated patient's user ID from token
    $user = auth()->user();
    
    // Verify user is a patient
    if ($user->account_type !== 'patient') {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized'
        ], 403);
    }
    
    // Find patient record by user_id
    $patient = Patient::where('user_id', $user->id)->first();
    
    if (!$patient) {
        return response()->json([
            'success' => false,
            'message' => 'Patient record not found'
        ], 404);
    }
    
    // Get assessment orders for this patient
    $orders = AssessmentOrder::where('patient_id', $patient->id)
        ->with(['doctor', 'assessment'])
        ->orderBy('ordered_on', 'desc')
        ->get();
    
    // Format response
    $formatted = $orders->map(function($order) {
        return [
            'id' => $order->id,
            'assessment_type' => $order->assessment_type,
            'instructions' => $order->instructions,
            'status' => $order->status,
            'ordered_on' => $order->ordered_on,
            'sent_at' => $order->sent_at,
            'doctor' => [
                'id' => $order->doctor->id,
                'name' => $order->doctor->full_name,
                'practice_name' => $order->doctor->practice_name,
            ],
            'assessment' => $order->assessment ? [
                'id' => $order->assessment->id,
                'score' => $order->assessment->score,
                'completed_on' => $order->assessment->completed_on,
            ] : null,
            'assessment_url' => $order->assessment_url,
            'token_expires_at' => $order->token_expires_at,
            'is_completed' => $order->assessment !== null,
        ];
    });
    
    return response()->json([
        'success' => true,
        'data' => $formatted
    ]);
}
```

## ⚠️ Common Backend Mistakes

### Mistake 1: Using $userId parameter without binding
```php
// ❌ WRONG
$query = "SELECT * FROM assessments WHERE user_id = :userId";
DB::select($query); // Missing parameter binding
```

### Mistake 2: Expecting userId in request
```php
// ❌ WRONG
$userId = $request->input('user_id'); // Should come from auth token, not request
```

### Mistake 3: Using wrong parameter name
```php
// ❌ WRONG
DB::select("SELECT * FROM assessments WHERE user_id = :userId", [
    'user_id' => $userId // Parameter name mismatch
]);

// ✅ CORRECT
DB::select("SELECT * FROM assessments WHERE user_id = :userId", [
    'userId' => $userId // Parameter name matches
]);
```

## ✅ Solution

The backend should:
1. ✅ Get user ID from `auth()->id()` or `auth()->user()->id`
2. ✅ Use that user ID to find the patient record
3. ✅ Query assessment orders for that patient
4. ✅ Return formatted response

**The frontend is working correctly.** The issue is in the backend database query implementation.
