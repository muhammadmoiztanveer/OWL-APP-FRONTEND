// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

// User Types
export interface Permission {
  id: number
  name: string
  guard_name?: string
}

export interface Role {
  id: number
  name: string
  guard_name?: string
  permissions?: Permission[] // Permissions assigned to this role
}

export type AccountType = 'doctor' | 'patient' | 'admin' | 'user'

export interface DoctorProfile {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  practice_name?: string
  specialty?: string
  website?: string
  office_hours?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
}

export interface User {
  id: number
  name: string
  email: string
  account_type: AccountType
  roles?: Role[]
  permissions?: Permission[] // Legacy - kept for backward compatibility
  directPermissions?: Permission[] // Direct permissions (usually empty)
  allPermissions?: Permission[] // NEW: All permissions (direct + through roles) - RECOMMENDED to use this
  doctor?: DoctorProfile | null
  created_at?: string
  updated_at?: string
}

export interface AuthData {
  user: User
  token: string
}

// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  account_type: 'doctor' | 'patient'
}

// Role Request Types
export interface CreateRoleRequest {
  name: string
  permissions: number[]
}

export interface UpdateRoleRequest {
  name?: string
  permissions?: number[]
}

// Permission Request Types
export interface CreatePermissionRequest {
  name: string
}

export interface UpdatePermissionRequest {
  name: string
}

// Module Types
export interface Module {
  id: number
  name: string
  label: string
  permissions?: Permission[]
}

export interface PermissionGroup {
  module: string
  label: string
  permissions: Permission[]
}

// Module Request Types
export interface CreateModuleRequest {
  name: string
  label: string
}

export interface UpdateModuleRequest {
  name?: string
  label?: string
}

// Doctor Types
export interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  practice_name?: string
  specialty?: string
  website?: string
  office_hours?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
  is_frozen: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateDoctorRequest {
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  practice_name?: string
  specialty?: string
  website?: string
  office_hours?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
}

export interface UpdateDoctorRequest {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  practice_name?: string
  specialty?: string
  website?: string
  office_hours?: string
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
}

// Pagination Types
export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
  links: PaginationLink[]
}

export interface DoctorsListParams {
  per_page?: number
  page?: number
  search?: string
  is_frozen?: boolean
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface DoctorsResponse {
  success: boolean
  data: Doctor[]
  meta: PaginationMeta
  links: PaginationLinks
}

// Doctor Module Types
export interface Patient {
  id: number
  doctor_id: number
  user_id?: number
  name: string
  email: string
  date_of_birth?: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface AssessmentOrder {
  id: number
  doctor_id: number
  patient_id: number
  assessment_type: string
  instructions?: string
  status: 'pending' | 'sent' | 'completed' | 'cancelled'
  ordered_on: string
  sent_at?: string
  patient?: Patient
  doctor?: DoctorProfile
  assessment?: Assessment
}

export interface AssessmentResponse {
  id?: number
  question_id?: number
  answer?: string | number
  score: number
  question?: Question
}

export interface Assessment {
  id: number
  patient_id: number
  doctor_id: number
  assessment_type: string
  score: number
  phq9_score?: number
  gad7_score?: number
  suicide_risk?: number
  status: 'pending' | 'completed' | 'reviewed'
  completed_on?: string
  reviewed_at?: string
  responses?: AssessmentResponse[]
  patient?: Patient
  doctor?: DoctorProfile
  assessment_order?: AssessmentOrder
  severity?: Severity | { phq9: Severity; gad7: Severity }
  recommendation?: string | { phq9: string; gad7: string }
}

// Assessment Completion Types
export interface Severity {
  level: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe'
  label: string
  description: string
}

export interface Question {
  id: number
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  text: string
  order_num: number
  created_at?: string
  updated_at?: string
}

export interface TokenValidationResponse {
  token: string
  order: {
    id: number
    assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
    instructions?: string
    patient: { name: string; email: string }
    doctor: { name: string; email: string }
  }
}

export interface QuestionsResponse {
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  questions: Question[]
}

export interface SubmitAssessmentRequest {
  answers: Record<number, number> // { questionId: score (0-3) }
}

export interface SubmitAssessmentResponse {
  id: number
  assessment_type: string
  status: 'completed'
  score: number
  phq9_score?: number
  gad7_score?: number
  suicide_risk?: number
  severity: Severity | { phq9: Severity; gad7: Severity }
  recommendation: string | { phq9: string; gad7: string }
  completed_on: string
  patient: { id: number; name: string; email: string }
  doctor: { id: number; name: string; email: string }
}

// Admin Question Management Types
export interface CreateQuestionRequest {
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  text: string
  order_num: number
}

export interface UpdateQuestionRequest {
  assessment_type?: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  text?: string
  order_num?: number
}

export interface AssessmentQuestionsListParams {
  per_page?: number
  page?: number
  assessment_type?: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  search?: string
}

// PDF Generation Types
export interface PdfStatus {
  has_pdf: boolean
  report_path: string | null
  report_generated_at: string | null
  queue_status: 'pending' | 'processing' | 'completed' | 'failed' | null
  queue_attempts: number
  queue_error: string | null
}

export interface PdfQueueItem {
  id: number
  assessment_id: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  error_message: string | null
  created_at: string
  updated_at: string
  assessment?: {
    id: number
    assessment_type: string
    patient?: { name: string; email: string }
    doctor?: { name: string; email: string }
  }
}

export interface PdfQueueListParams {
  per_page?: number
  page?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'all'
  search?: string
}

// Billing Types
export interface Rate {
  id: number
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  amount: string // Decimal as string
  currency: string
  is_active: boolean
  effective_from: string // Date
  effective_to: string | null // Date
  description: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  doctor_id: number
  patient_id: number | null
  assessment_id: number | null
  subtotal: string // Decimal as string
  tax: string
  discount: string
  total: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string // Date
  paid_at: string | null // DateTime
  notes: string | null
  doctor?: { id: number; name: string; email: string }
  patient?: { id: number; name: string; email: string }
  assessment?: { id: number; assessment_type: string }
  payments?: Payment[]
  total_paid?: number // Calculated
  balance?: number // Calculated
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  invoice_id: number
  amount: string // Decimal as string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other'
  transaction_id: string | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paid_at: string // DateTime
  notes: string | null
  invoice?: Invoice
  created_at: string
  updated_at: string
}

export interface BillingStats {
  total_revenue: number
  pending_count: number
  overdue_count: number
}

// Billing Request Types
export interface CreateRateRequest {
  assessment_type: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  amount: string
  currency?: string
  is_active?: boolean
  effective_from: string
  effective_to?: string | null
  description?: string | null
}

export interface UpdateRateRequest {
  assessment_type?: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  amount?: string
  currency?: string
  is_active?: boolean
  effective_from?: string
  effective_to?: string | null
  description?: string | null
}

export interface CreateInvoiceRequest {
  doctor_id: number
  patient_id?: number | null
  assessment_id?: number | null
  subtotal: string
  tax?: string
  discount?: string
  due_date: string
  notes?: string | null
}

export interface CreateInvoiceFromAssessmentRequest {
  tax?: string
  discount?: string
  due_date: string
  notes?: string | null
}

export interface UpdateInvoiceRequest {
  patient_id?: number | null
  subtotal?: string
  tax?: string
  discount?: string
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date?: string
  notes?: string | null
}

export interface CreatePaymentRequest {
  invoice_id: number
  amount: string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other'
  transaction_id?: string | null
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  paid_at: string
  notes?: string | null
}

export interface UpdatePaymentRequest {
  amount?: string
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other'
  transaction_id?: string | null
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  paid_at?: string
  notes?: string | null
}

// Billing List Params
export interface RatesListParams {
  per_page?: number
  page?: number
  assessment_type?: 'PHQ-9' | 'GAD-7' | 'comprehensive'
  is_active?: boolean
  search?: string
}

export interface InvoicesListParams {
  per_page?: number
  page?: number
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  patient_id?: number
  start_date?: string
  end_date?: string
  search?: string
}

export interface PaymentsListParams {
  per_page?: number
  page?: number
  invoice_id?: number
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other'
  start_date?: string
  end_date?: string
  search?: string
}

export interface DashboardStats {
  total_active_patients: number
  total_assessments: number
  pending_orders: number
}

export interface DashboardData {
  stats: DashboardStats
  recent_assessments: Assessment[]
}

// Request Types
export interface CreatePatientRequest {
  // Form fields (frontend only)
  first_name: string
  last_name: string
  email: string
  date_of_birth?: string
  phone?: string
  // Optional assessment order fields (sent to backend)
  assessment_type?: string | null // lowercase: 'none', 'phq-9', 'gad-7', 'comprehensive'
  instructions?: string // Combined from assessment_instructions + assessment_notes
  // Form-only fields (not sent to backend)
  assessment_instructions?: string // Will be combined into 'instructions'
  assessment_notes?: string // Will be combined into 'instructions'
  // Backend expects this (will be combined from first_name + last_name)
  name?: string
}

export interface UpdatePatientRequest {
  first_name?: string
  last_name?: string
  name?: string // Keep for backward compatibility
  email?: string
  date_of_birth?: string
  phone?: string
}

export interface CreateAssessmentOrderRequest {
  patient_id: number
  assessment_type: string
  instructions?: string
}

// Query Params Types
export interface PatientsListParams {
  per_page?: number
  page?: number
  search?: string
}

export interface AssessmentOrdersListParams {
  per_page?: number
  page?: number
  status?: 'pending' | 'sent' | 'completed' | 'cancelled'
}

export interface AssessmentsListParams {
  per_page?: number
  page?: number
  status?: 'pending' | 'completed' | 'reviewed'
  patient_id?: number
}

// User Management Types
export interface UserManagement {
  id: number
  name: string
  email: string
  account_type: 'admin' | 'doctor' | 'patient' | 'user' | null
  email_verified_at?: string | null
  created_at: string
  updated_at: string
  roles?: Array<{ id: number; name: string; guard_name: string; permissions?: Permission[] }>
  permissions?: Array<{ id: number; name: string; guard_name: string }>
  directPermissions?: Permission[] // Direct permissions (usually empty)
  allPermissions?: Permission[] // All permissions (direct + through roles) - REQUIRED for login-as
  doctor?: DoctorProfile | null
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  account_type?: 'admin' | 'doctor' | 'patient' | 'user'
  roles?: string[]
}

export interface UsersListParams {
  per_page?: number
  page?: number
  search?: string
  account_type?: 'admin' | 'doctor' | 'patient' | 'user' | null
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

