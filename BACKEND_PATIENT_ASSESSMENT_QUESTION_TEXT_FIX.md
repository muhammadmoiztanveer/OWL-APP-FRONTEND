# Backend Fix: Patient Assessment Question Text

## 📋 Issue

On the **patient dashboard**, when viewing assessment details (`/patient/assessments/[id]`), the questions are showing as "Question 1", "Question 2", etc. instead of the actual question text.

The **admin and doctor dashboards** show the actual question text correctly because they use different endpoints that include the question text in the response.

---

## 🔍 Current Frontend Implementation

### Patient Assessment Endpoint
**File**: `lib/api/assessments.ts`
```typescript
getPatientAssessment: async (id: number): Promise<ApiResponse<Assessment>> => {
  const response = await api.get<ApiResponse<Assessment>>(`/assessments/${id}`)
  return response.data
}
```

**Endpoint**: `GET /api/assessments/{id}`

### Frontend Component
**File**: `components/assessments/AssessmentResponses.tsx`

The component checks for question text in this order:
1. `response.question?.text` (nested in question object)
2. `response.question?.question_text` (alternative nested property)
3. `response.question_text` (flat on response object)

If none of these are found, it falls back to showing "Question {order_num}".

---

## ✅ Required Backend Response Structure

The `GET /api/assessments/{id}` endpoint should return an `Assessment` object with `responses` array where each response includes the question text.

### Expected Response Format:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "assessment_type": "GAD-7",
    "status": "completed",
    "score": 14,
    "patient_id": 5,
    "doctor_id": 3,
    "completed_on": "2024-12-09T04:34:00Z",
    "responses": [
      {
        "id": 1,
        "question_id": 1,
        "score": 2,
        "question": {
          "id": 1,
          "assessment_type": "GAD-7",
          "text": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
          "order_num": 1
        }
      },
      {
        "id": 2,
        "question_id": 2,
        "score": 1,
        "question": {
          "id": 2,
          "assessment_type": "GAD-7",
          "text": "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
          "order_num": 2
        }
      }
      // ... more responses
    ]
  }
}
```

### Alternative Format (Also Supported):

If the backend doesn't nest the question object, it can also return:

```json
{
  "responses": [
    {
      "id": 1,
      "question_id": 1,
      "score": 2,
      "question_text": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      "question_order": 1
    }
  ]
}
```

---

## 🔧 Backend Fix Required

### Option 1: Include Question Object in Responses (Recommended)

When returning assessment data for patients, ensure that each response in the `responses` array includes a `question` object with:
- `id`: Question ID
- `text`: The actual question text (REQUIRED)
- `order_num`: Question order number
- `assessment_type`: Assessment type

**Example Backend Code (Laravel/PHP):**
```php
$assessment = Assessment::with(['responses.question' => function($query) {
    $query->select('id', 'assessment_type', 'text', 'order_num');
}])->findOrFail($id);

return response()->json([
    'success' => true,
    'data' => $assessment
]);
```

**Example Backend Code (Node.js/Express):**
```javascript
const assessment = await Assessment.findById(id)
  .populate({
    path: 'responses',
    populate: {
      path: 'question',
      select: 'id assessment_type text order_num'
    }
  });

res.json({
  success: true,
  data: assessment
});
```

### Option 2: Include question_text on Each Response

If you can't include the full question object, at minimum include `question_text` on each response:

```json
{
  "responses": [
    {
      "id": 1,
      "question_id": 1,
      "score": 2,
      "question_text": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
      "question_order": 1
    }
  ]
}
```

---

## 🧪 Testing

### Test the Endpoint:

1. **Get a completed assessment ID** from the database
2. **Call the endpoint**: `GET /api/assessments/{id}`
3. **Verify the response** includes question text in one of these formats:
   - `responses[].question.text` ✅
   - `responses[].question.question_text` ✅
   - `responses[].question_text` ✅

### Expected vs Actual:

**Before Fix:**
```json
{
  "responses": [
    {
      "id": 1,
      "question_id": 1,
      "score": 2
      // ❌ Missing question text
    }
  ]
}
```

**After Fix:**
```json
{
  "responses": [
    {
      "id": 1,
      "question_id": 1,
      "score": 2,
      "question": {
        "id": 1,
        "text": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        "order_num": 1
      }
    }
  ]
}
```

---

## 📝 Summary

**What to Fix:**
- ✅ Ensure `GET /api/assessments/{id}` endpoint includes question text in responses
- ✅ Either include full `question` object with `text` property
- ✅ Or include `question_text` property on each response

**Why This Matters:**
- Patient dashboard currently shows "Question 1", "Question 2" instead of actual questions
- Admin and doctor dashboards work correctly because they use different endpoints
- This fix will make the patient experience consistent with admin/doctor views

**Priority:** High - This affects patient user experience

---

## 🔗 Related Endpoints (For Reference)

These endpoints already work correctly and can be used as reference:

1. **Doctor Assessment**: `GET /api/doctor/assessments/{id}`
   - ✅ Includes question text in responses

2. **Admin Assessment**: `GET /api/admin/assessments/{id}`
   - ✅ Includes question text in responses

3. **Assessment Responses (Doctor)**: `GET /api/doctor/patients/{patientId}/assessments/{assessmentId}/responses`
   - ✅ Includes full question objects with text

4. **Assessment Responses (Admin)**: `GET /api/admin/patients/{patientId}/assessments/{assessmentId}/responses`
   - ✅ Includes full question objects with text

**The patient endpoint should match the same data structure as these working endpoints.**



