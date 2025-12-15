# Backend Fix: Missing Question Text in Assessment Responses

## 🔍 Issue

The frontend is displaying "Question 1", "Question 2", etc. instead of the actual question text because the `question_text` field is missing or empty in the API response.

## 📋 Expected Response Format

The backend should return responses with the `question_text` field populated:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "assessment_type": "GAD-7",
    "score": 14,
    "status": "completed",
    "responses": [
      {
        "question_id": 1,
        "question_text": "Feeling nervous, anxious, or on edge",  // ← MUST BE PRESENT
        "question_order": 1,
        "score": 2
      },
      {
        "question_id": 2,
        "question_text": "Not being able to stop or control worrying",  // ← MUST BE PRESENT
        "question_order": 2,
        "score": 3
      }
      // ... more responses
    ]
  }
}
```

## 🔧 Backend Fix Required

### Issue 1: `question_text` Not Included in Response

**Problem**: The backend is not including `question_text` in the responses array.

**Solution**: When building the responses array, include the question text from the questions table:

```php
// Example Laravel/PHP code
$assessment = Assessment::with(['responses.question'])->find($id);

$responses = $assessment->responses->map(function ($response) {
    return [
        'question_id' => $response->question_id,
        'question_text' => $response->question->text ?? $response->question->question_text ?? null, // ← Include question text
        'question_order' => $response->question->order_num ?? $response->question->order ?? null,
        'score' => $response->score,
    ];
});

return response()->json([
    'success' => true,
    'data' => [
        'id' => $assessment->id,
        'assessment_type' => $assessment->assessment_type,
        'score' => $assessment->score,
        'status' => $assessment->status,
        'responses' => $responses, // ← Include responses with question_text
    ],
]);
```

### Issue 2: Question Text Not Loaded from Database

**Problem**: The question text exists in the database but isn't being joined/loaded.

**Solution**: Ensure the query joins the questions table:

```php
// Laravel example
$assessment = Assessment::with([
    'responses' => function ($query) {
        $query->with('question'); // Load question relationship
    }
])->find($id);

// Or use join
$assessment = Assessment::with([
    'responses.question'
])->find($id);
```

### Issue 3: Different Field Names

**Problem**: The question text might be stored in a different column name.

**Solution**: Check the actual column name in your database:
- `questions.text`
- `questions.question_text`
- `questions.content`
- `questions.body`

Then map it correctly:

```php
'question_text' => $response->question->text 
    ?? $response->question->question_text 
    ?? $response->question->content 
    ?? $response->question->body 
    ?? null
```

## 📋 Endpoints to Fix

All these endpoints should return `question_text` in responses:

### Doctor Endpoints:
- [ ] `GET /api/doctor/assessments` - List all assessments
- [ ] `GET /api/doctor/assessments/{id}` - Get single assessment
- [ ] `GET /api/doctor/assessments/patient/{patientId}` - Get patient's assessments
- [ ] `GET /api/doctor/assessments/ready-for-review` - Ready for review

### Patient Endpoints:
- [ ] `GET /api/patient/assessments/assigned` - Patient's assigned assessments
- [ ] `GET /api/patient/assessments/assigned/{id}` - Single assigned assessment
- [ ] `GET /api/patient/assessments` - Patient's completed assessments

## 🔍 Verification Steps

1. **Check API Response**:
   ```bash
   curl -H "Authorization: Bearer {token}" \
        http://localhost:8000/api/doctor/assessments/1
   ```

2. **Verify Response Structure**:
   - Check if `responses` array exists
   - Check if each response has `question_text` field
   - Verify `question_text` is not null or empty

3. **Check Database**:
   ```sql
   SELECT ar.id, ar.question_id, ar.score, q.text as question_text
   FROM assessment_responses ar
   JOIN questions q ON ar.question_id = q.id
   WHERE ar.assessment_id = 1;
   ```

## ✅ Expected Result

After the fix, the API should return:

```json
{
  "responses": [
    {
      "question_id": 1,
      "question_text": "Feeling nervous, anxious, or on edge",  // ← Actual question text
      "question_order": 1,
      "score": 2
    }
  ]
}
```

And the frontend will display:
- ✅ "Feeling nervous, anxious, or on edge" (actual question)
- ❌ NOT "Question 1" (generic fallback)

## 🚨 Frontend Status

The frontend is ready and will automatically display the question text once the backend includes it in the API response. The component has fallback logic that currently shows "Question 1", "Question 2" when `question_text` is missing.

**The issue is on the backend side** - the backend needs to include `question_text` in the responses array.
