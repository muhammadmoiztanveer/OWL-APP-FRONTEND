# Assessment API Routes Update

## ✅ Changes Made

Updated the frontend API client to use the correct assessment routes as specified in the backend guide.

### Updated Routes in `lib/api/doctor.ts`:

| Old Route | New Route | Status |
|-----------|-----------|--------|
| `/doctor/assessments` | `/assessments` | ✅ Updated |
| `/doctor/assessments/{id}` | `/assessments/{id}` | ✅ Updated |
| `/doctor/assessments/ready-for-review` | `/assessments/ready-for-review` | ✅ Updated |
| `/doctor/assessments/patient/{patientId}` | `/assessments/patient/{patientId}` | ✅ Updated |

### Routes Already Correct in `lib/api/assessments.ts`:

| Route | Status |
|-------|--------|
| `/assessments/patient/{patientId}` | ✅ Already correct |
| `/assessments/{id}` | ✅ Already correct |
| `/patient/assessments/assigned` | ✅ Already correct |
| `/assessments/token/{token}` | ✅ Already correct |

### Routes Kept with `/doctor` Prefix (Doctor-specific actions):

| Route | Reason |
|-------|--------|
| `/doctor/assessments/{id}/review` | Doctor-specific action (mark as reviewed) |
| `/doctor/assessments/{id}/pdf/*` | Doctor-specific PDF operations |

## 📋 Current API Route Structure

### Doctor Assessment Routes:

1. **List All Assessments**
   - Route: `GET /api/assessments`
   - Query Params: `patient_id`, `status`, `page`, `per_page`, `sort_by`, `sort_order`
   - Returns: Paginated list with `responses` array

2. **Get Single Assessment**
   - Route: `GET /api/assessments/{id}`
   - Returns: Single assessment with full `responses` array

3. **Get Patient's Assessments**
   - Route: `GET /api/assessments/patient/{patientId}`
   - Returns: Array of assessments with `responses` array

4. **Get Assessments Ready for Review**
   - Route: `GET /api/assessments/ready-for-review`
   - Query Params: `page`, `per_page`
   - Returns: Paginated list with `responses` array

### Patient Assessment Routes:

1. **Get Assigned Assessments**
   - Route: `GET /api/patient/assessments/assigned`
   - Returns: Array of assigned assessments

2. **Get Single Assigned Assessment**
   - Route: `GET /api/patient/assessments/assigned/{id}`
   - Returns: Single assigned assessment with `assessment.responses` if completed

3. **Get Assessment URL**
   - Route: `GET /api/patient/assessments/assigned/{id}/url`
   - Returns: Assessment completion URL

### Public Assessment Routes:

1. **Validate Token**
   - Route: `GET /api/assessments/token/{token}`
   - Returns: Token validation data

2. **Get Questions**
   - Route: `GET /api/assessments/token/{token}/questions`
   - Returns: Assessment questions

3. **Submit Assessment**
   - Route: `POST /api/assessments/token/{token}/submit`
   - Body: `{ answers: { questionId: score } }`
   - Returns: Completed assessment with responses

## 🎯 Response Format

All assessment endpoints now return responses in this format:

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
      }
    ]
  }
}
```

## ✅ Verification Checklist

- [x] Updated `doctorApi.getAssessments()` to use `/assessments`
- [x] Updated `doctorApi.getAssessment()` to use `/assessments/{id}`
- [x] Updated `doctorApi.getReadyForReview()` to use `/assessments/ready-for-review`
- [x] Updated `doctorApi.getPatientAssessments()` to use `/assessments/patient/{patientId}`
- [x] Verified `assessmentsApi` routes are already correct
- [x] No linter errors
- [x] All routes match backend specification

## 🚀 Next Steps

1. **Test the routes** to ensure they work correctly
2. **Verify responses are included** in all API responses
3. **Check browser console** for any 404 errors
4. **Test both doctor and patient dashboards** to ensure assessments load correctly

## 📝 Notes

- The routes `/doctor/assessments/{id}/review` and `/doctor/assessments/{id}/pdf/*` are kept with the `/doctor` prefix as they are doctor-specific actions
- All GET routes for fetching assessments now use `/api/assessments` instead of `/api/doctor/assessments`
- The frontend components using these APIs should automatically work with the updated routes
