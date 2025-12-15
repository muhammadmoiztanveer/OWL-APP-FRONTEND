# Assessment Responses Debugging Guide

## 🔍 Issues Reported

1. **Questions not visible** - The `question_text` column is empty in the responses table
2. **Responses only showing on patient dashboard** - Not appearing on doctor dashboard

## 🛠️ Frontend Changes Made

### 1. Enhanced Component with Fallbacks

Updated `components/assessments/AssessmentResponses.tsx` to:
- Handle multiple possible field names for question text:
  - `response.question_text` (new format)
  - `response.question?.text` (legacy format)
  - `response.question?.question_text` (alternative)
  - `response.question` (string fallback)
  - `Question ${order}` (final fallback)
- Added console logging in development mode to debug data structure

### 2. Added Debugging to Doctor Dashboard

- Added console logging in `app/(dashboard)/doctor/assessments/[id]/page.tsx` to log assessment data
- Added console logging in `components/doctor/PatientAssessmentResults.tsx` to log fetched assessments
- Added error message when responses are missing for completed assessments

### 3. Improved Error Handling

- Added fallback message when responses are missing
- Better handling of missing or undefined question text

## 🔍 Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) and check the console for:
- `AssessmentResponses - Received responses:` - Shows what data is being passed to the component
- `Doctor Assessment Detail - Assessment data:` - Shows full assessment object from API
- `Doctor Assessment Detail - Responses:` - Shows the responses array
- `PatientAssessmentResults - Fetched assessments:` - Shows assessments fetched for patient

### Step 2: Check Network Tab

1. Open Network tab in DevTools
2. Filter by "assessments" or "api"
3. Find the API call that fetches assessment data:
   - Doctor: `GET /api/doctor/assessments/{id}`
   - Patient: `GET /api/patient/assessments/assigned/{id}`
4. Check the Response tab to see the actual JSON structure

### Step 3: Verify Backend Response Format

The backend should return responses in this format:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "assessment_type": "PHQ-9",
    "score": 15,
    "status": "completed",
    "responses": [
      {
        "question_id": 1,
        "question_text": "Little interest or pleasure in doing things",
        "question_order": 1,
        "score": 2
      },
      {
        "question_id": 2,
        "question_text": "Feeling down, depressed, or hopeless",
        "question_order": 2,
        "score": 3
      }
    ]
  }
}
```

## 🐛 Common Issues & Solutions

### Issue 1: `question_text` is empty or undefined

**Possible Causes:**
- Backend not including `question_text` in responses
- Backend using different field name
- Responses stored in different format

**Solution:**
1. Check backend API response in Network tab
2. Verify backend is including `question_text` in each response object
3. If backend uses different field name, update the component fallback logic

### Issue 2: Responses not showing on doctor dashboard

**Possible Causes:**
- Backend not returning `responses` array for doctor endpoints
- Responses array is empty
- Different data structure for doctor vs patient endpoints

**Solution:**
1. Check console logs to see if `assessment.responses` exists
2. Check Network tab to see if backend includes responses in doctor API
3. Verify backend endpoints return responses:
   - `GET /api/doctor/assessments/{id}` should include `responses`
   - `GET /api/doctor/assessments/patient/{patientId}` should include `responses`

### Issue 3: Responses showing but questions are blank

**Possible Causes:**
- Backend returning responses without `question_text`
- Question text stored in separate table/endpoint
- Question text needs to be fetched separately

**Solution:**
1. Check if backend has a separate endpoint for questions
2. If questions need to be fetched separately, we can:
   - Fetch questions when responses are loaded
   - Match `question_id` from responses to questions
   - Display question text from fetched questions

## 📋 Backend Checklist

Verify these backend endpoints return `responses` array with `question_text`:

### Doctor Endpoints:
- [ ] `GET /api/doctor/assessments` - List all assessments
- [ ] `GET /api/doctor/assessments/{id}` - Get single assessment
- [ ] `GET /api/doctor/assessments/patient/{patientId}` - Get patient's assessments
- [ ] `GET /api/doctor/assessments/ready-for-review` - Assessments ready for review

### Patient Endpoints:
- [ ] `GET /api/patient/assessments/assigned` - Patient's assigned assessments
- [ ] `GET /api/patient/assessments/assigned/{id}` - Single assessment details
- [ ] `GET /api/patient/assessments` - Patient's completed assessments

### Response Format Required:

Each response object must have:
```json
{
  "question_id": 1,
  "question_text": "Full question text here",
  "question_order": 1,
  "score": 2
}
```

## 🔧 Quick Fix: Fetch Questions Separately (If Needed)

If the backend doesn't include `question_text` in responses, we can fetch questions separately:

```typescript
// In AssessmentResponses component
useEffect(() => {
  if (responses && responses.length > 0 && !responses[0].question_text) {
    // Fetch questions for this assessment type
    fetchQuestions(assessmentType).then(questions => {
      // Map question_id to question_text
      const responsesWithQuestions = responses.map(response => ({
        ...response,
        question_text: questions.find(q => q.id === response.question_id)?.text || `Question ${response.question_order}`
      }))
      setResponsesWithQuestions(responsesWithQuestions)
    })
  }
}, [responses])
```

## ✅ Testing

1. **Doctor Dashboard:**
   - Navigate to `/doctor/assessments/{id}` for a completed assessment
   - Check if "Patient Responses" section appears
   - Verify questions are visible in the table
   - Check browser console for any errors or warnings

2. **Patient Dashboard:**
   - Navigate to `/patient/assessments/{id}` for a completed assessment
   - Check if "Your Responses" section appears
   - Verify questions are visible in the table
   - Check browser console for any errors or warnings

3. **Patient Assessment List:**
   - Navigate to `/patient/assessments`
   - Check if completed assessments show responses
   - Verify questions are visible when expanded

4. **Doctor Patient Details:**
   - Navigate to patient details modal
   - Check "Assessment Results" section
   - Verify responses appear when expanded

## 📝 Next Steps

1. **Check browser console** for the debug logs
2. **Check Network tab** to see actual API responses
3. **Share API response structure** if questions are still missing
4. **Verify backend** is returning `question_text` in responses array

If the backend is not returning `question_text`, we may need to:
- Update backend to include question text in responses
- OR fetch questions separately and match by `question_id`
