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
  account_type: 'doctor'
}

export interface PatientRegisterRequest {
  token: string
  name: string
  password: string
  password_confirmation: string
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

// Assessment Response (backend format with nested question object)
export interface AssessmentResponse {
  id?: number
  assessment_id?: number
  question_id: number
  score: number // 0-3
  question?: {
    id: number
    assessment_type: string
    text: string
    order_num: number
    created_at?: string
    updated_at?: string
  }
  // Legacy/flat format support
  question_text?: string
  question_order?: number
  created_at?: string
  updated_at?: string
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
  // Insurance Information
  insurance_provider?: string
  insurance_policy_number?: string
  insurance_group_number?: string
  // Medical History
  medical_history?: string
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
  date_of_birth?: string
  phone?: string
  // Insurance Information
  insurance_provider?: string
  insurance_policy_number?: string
  insurance_group_number?: string
  // Medical History
  medical_history?: string
  name?: string // Keep for backward compatibility
  email?: string
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

// Audit Log Types
export interface AuditLog {
  id: number
  user_id: number | null
  user: {
    id: number
    name: string
    email: string
  } | null
  session_id: string | null
  ip_address: string | null
  user_agent: string | null
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browser: string | null
  platform: string | null
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export'
  action_label: string
  resource_type: string | null
  resource_id: number | null
  resource_identifier: string | null
  is_phi_access: boolean
  http_method: string | null
  route: string | null
  endpoint: string | null
  metadata: Record<string, any> | null
  description: string | null
  status: 'success' | 'failed' | 'error'
  error_message: string | null
  created_at: string
}

export interface AuditLogFilters {
  phi_only?: boolean
  user_id?: number
  resource_type?: string
  resource_id?: number
  action?: string
  start_date?: string
  end_date?: string
  ip_address?: string
  status?: string
  per_page?: number
  page?: number
  search?: string
}

export interface AuditLogStats {
  total_logs: number
  phi_access_logs: number
  by_action: Record<string, number>
  by_resource_type: Record<string, number>
  by_status: Record<string, number>
  top_users: Array<{
    user_id: number
    user: {
      id: number
      name: string
      email: string
    }
    count: number
  }>
}

// Onboarding Types
export type OnboardingStatusType = 'pending' | 'in_progress' | 'completed'

export interface OnboardingStatus {
  onboarding_status: OnboardingStatusType
  steps_completed: Record<string, boolean>
  completed_at: string | null
  profile_completed?: boolean
  profile_completed_at?: string | null
}

export interface OnboardingStep {
  key: string
  label: string
  completed: boolean
}

export interface OnboardingStepsResponse {
  steps: OnboardingStep[]
  current_step: string | null
  progress: number
}

export interface PatientProfile {
  id: number
  name: string
  email: string
  date_of_birth: string | null
  phone: string | null
  // Address
  street_address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  // Demographics
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
  ethnicity: string | null
  race: string | null
  marital_status: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'domestic_partnership' | null
  preferred_language: string
  // Emergency Contact
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  // Insurance
  insurance_provider: string | null
  insurance_policy_number: string | null
  insurance_group_number: string | null
  // Medical Background
  medical_history: string | null
  surgical_history: string | null
  family_history: string | null
  current_medications: string | null
  allergies: string | null
  primary_care_physician: string | null
  blood_type: string | null
  social_history: string | null
  // Profile completion
  profile_completed: boolean
  profile_completed_at: string | null
}

// Onboarding Request Types
export interface UpdateOnboardingStepRequest {
  step: string
  completed: boolean
}

export interface UpdateProfileStepRequest {
  step: 'basic' | 'address' | 'demographics' | 'emergency' | 'insurance' | 'medical'
  data: Partial<PatientProfile>
}

// Billing Types
export interface Package {
  id: number
  name: string
  slug: string
  description?: string
  monthly_price: number
  yearly_price?: number
  stripe_price_id?: string
  stripe_yearly_price_id?: string
  stripe_product_id?: string
  features?: string[]
  max_patients?: number
  max_assessments_per_month?: number
  is_active: boolean
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface Subscription {
  id: number
  doctor_id: number
  package_id?: number
  package?: Package
  stripe_subscription_id?: string
  stripe_customer_id?: string
  stripe_status?: string
  stripe_current_period_start?: string
  stripe_current_period_end?: string
  billing_cycle: 'monthly' | 'yearly'
  status: 'active' | 'suspended' | 'cancelled'
  start_date: string
  next_billing_date: string
  cancelled_at?: string
  cancellation_reason?: string
  doctor?: { id: number; full_name: string; email: string }
  created_at?: string
  updated_at?: string
}

export interface BillingInvoice {
  id: number
  invoice_number: string
  doctor_id: number
  subscription_id?: number
  invoice_type: 'subscription' | 'one_time'
  subtotal: number
  tax: number
  discount: number
  total: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  billing_period_start?: string
  billing_period_end?: string
  sent_at?: string
  email_send_count: number
  stripe_invoice_id?: string
  paid_at?: string
  doctor?: { id: number; full_name: string; email: string }
  subscription?: Subscription
  created_at?: string
  updated_at?: string
}

export interface StripeSettings {
  public_key_configured: boolean
  secret_key_configured: boolean
  webhook_secret_configured: boolean
  connection_status: {
    connected: boolean
    message: string
    account_id?: string
    email?: string
  }
}

// Billing Request Types
export interface CreatePackageRequest {
  name: string
  description?: string
  monthly_price: number
  yearly_price?: number
  features?: string[]
  max_patients?: number
  max_assessments_per_month?: number
  is_active?: boolean
  create_stripe_product?: boolean
}

export interface UpdatePackageRequest {
  name?: string
  description?: string
  monthly_price?: number
  yearly_price?: number
  features?: string[]
  max_patients?: number
  max_assessments_per_month?: number
  is_active?: boolean
}

export interface CreateSubscriptionRequest {
  doctor_id: number
  package_id: number
  billing_cycle: 'monthly' | 'yearly'
}

export interface UpdateSubscriptionRequest {
  package_id?: number
  billing_cycle?: 'monthly' | 'yearly'
  status?: 'active' | 'suspended' | 'cancelled'
}

export interface CancelSubscriptionRequest {
  reason?: string
}

// Billing List Params
export interface PackagesListParams {
  per_page?: number
  page?: number
  active_only?: boolean
  search?: string
}

export interface SubscriptionsListParams {
  per_page?: number
  page?: number
  status?: 'active' | 'suspended' | 'cancelled'
  doctor_id?: number
  search?: string
}

export interface InvoicesListParams {
  per_page?: number
  page?: number
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  start_date?: string
  end_date?: string
  invoice_type?: 'subscription' | 'one_time'
  doctor_id?: number
  search?: string
}

