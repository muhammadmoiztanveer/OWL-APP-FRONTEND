# Assessment API Routes - Corrected

## ✅ Routes Corrected

The routes are **under the `/api/doctor/` prefix**, not `/api/assessments/`.

## 📋 Correct Doctor Dashboard Routes

### 1. Get All Assessments
- **Route**: `GET /api/doctor/assessments`
- **Query Params**: `patient_id`, `status`, `page`, `per_page`
- **Example**: `GET /api/doctor/assessments?patient_id=2&status=completed`

### 2. Get Patient's Assessments
- **Route**: `GET /api/doctor/assessments/patient/{patientId}`
- **Example**: `GET /api/doctor/assessments/patient/2`

### 3. Get Single Assessment
- **Route**: `GET /api/doctor/assessments/{id}`
- **Example**: `GET /api/doctor/assessments/1`

### 4. Get Assessments Ready for Review
- **Route**: `GET /api/doctor/assessments/ready-for-review`
- **Query Params**: `page`, `per_page`

## ✅ Current Frontend Implementation

### `lib/api/doctor.ts` - Correct Routes:
- ✅ `getAssessments()`: `/doctor/assessments`
- ✅ `getAssessment()`: `/doctor/assessments/{id}`
- ✅ `getReadyForReview()`: `/doctor/assessments/ready-for-review`
- ✅ `getPatientAssessments()`: `/doctor/assessments/patient/{patientId}`
- ✅ `markAsReviewed()`: `/doctor/assessments/{id}/review`
- ✅ PDF operations: `/doctor/assessments/{id}/pdf/*`

### `lib/api/assessments.ts` - Patient/Public Routes:
- ✅ `getPatientAssessments()`: `/assessments/patient/{patientId}` (for patient context)
- ✅ `getPatientAssessment()`: `/assessments/{id}` (for patient viewing)
- ✅ `getAssignedAssessments()`: `/patient/assessments/assigned`
- ✅ Public routes: `/assessments/token/{token}/*`

## 🎯 Route Summary

| Use Case | Endpoint | Prefix |
|----------|----------|--------|
| Doctor: List all | `/api/doctor/assessments` | `/doctor/` |
| Doctor: Get single | `/api/doctor/assessments/{id}` | `/doctor/` |
| Doctor: Patient's assessments | `/api/doctor/assessments/patient/{id}` | `/doctor/` |
| Doctor: Ready for review | `/api/doctor/assessments/ready-for-review` | `/doctor/` |
| Patient: Assigned assessments | `/api/patient/assessments/assigned` | `/patient/` |
| Public: Token validation | `/api/assessments/token/{token}` | `/assessments/` |

## ✅ All Routes Now Correct

All doctor dashboard assessment routes are using the correct `/api/doctor/` prefix and will return the `responses` array with:
- `question_id`
- `question_text`
- `question_order`
- `score`
