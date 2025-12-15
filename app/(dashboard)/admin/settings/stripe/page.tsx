'use client'

import { useState } from 'react'
import { useStripeSettings, useTestStripeConnection, useUpdateSetting } from '@/hooks/settings/useStripeSettings'
import Breadcrumb from '@/components/common/Breadcrumb'
import PermissionGate from '@/components/common/PermissionGate'
import UnauthorizedMessage from '@/components/common/UnauthorizedMessage'
import toast from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
const WEBHOOK_URL = `${API_BASE_URL}/stripe/webhook`

export default function StripeSettingsPage() {
  const { data: settings, isLoading, refetch } = useStripeSettings()
  const testConnectionMutation = useTestStripeConnection()
  const updateSettingMutation = useUpdateSetting()

  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [showPublicKey, setShowPublicKey] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)

  const handleSavePublicKey = async () => {
    if (!publicKey.trim()) {
      toast.error('Please enter a Stripe Publishable Key')
      return
    }
    try {
      await updateSettingMutation.mutateAsync({ key: 'stripe_public_key', value: publicKey })
      setPublicKey('')
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleSaveSecretKey = async () => {
    if (!secretKey.trim()) {
      toast.error('Please enter a Stripe Secret Key')
      return
    }
    try {
      await updateSettingMutation.mutateAsync({ key: 'stripe_secret_key', value: secretKey })
      setSecretKey('')
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleSaveWebhookSecret = async () => {
    if (!webhookSecret.trim()) {
      toast.error('Please enter a Stripe Webhook Secret')
      return
    }
    try {
      await updateSettingMutation.mutateAsync({ key: 'stripe_webhook_secret', value: webhookSecret })
      setWebhookSecret('')
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleTestConnection = async () => {
    try {
      await testConnectionMutation.mutateAsync()
      refetch()
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <PermissionGate permission="settings.manage" fallback={<UnauthorizedMessage />}>
        <Breadcrumb pagetitle="Settings" title="Stripe Configuration" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PermissionGate>
    )
  }

  return (
    <PermissionGate permission="settings.manage" fallback={<UnauthorizedMessage />}>
      <Breadcrumb pagetitle="Settings" title="Stripe Configuration" />

      <div className="row">
        <div className="col-12">
          {/* Connection Status Card */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Stripe Connection Status</h4>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    {settings?.connection_status.connected ? (
                      <>
                        <i className="mdi mdi-check-circle text-success me-2" style={{ fontSize: '24px' }}></i>
                        <span className="badge bg-success-subtle text-success">Connected</span>
                      </>
                    ) : (
                      <>
                        <i className="mdi mdi-close-circle text-danger me-2" style={{ fontSize: '24px' }}></i>
                        <span className="badge bg-danger-subtle text-danger">Not Connected</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted mb-0">{settings?.connection_status.message}</p>
                  {settings?.connection_status.account_id && (
                    <p className="text-muted small mb-0">
                      Account ID: {settings.connection_status.account_id}
                    </p>
                  )}
                  {settings?.connection_status.email && (
                    <p className="text-muted small mb-0">Email: {settings.connection_status.email}</p>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleTestConnection}
                  disabled={testConnectionMutation.isPending}
                >
                  {testConnectionMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Testing...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-refresh me-1"></i>Test Connection
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stripe Keys Configuration */}
          <div className="card mt-3">
            <div className="card-header">
              <h4 className="card-title mb-0">Stripe API Keys</h4>
            </div>
            <div className="card-body">
              {/* Public Key */}
              <div className="mb-4">
                <label className="form-label">
                  <i className="mdi mdi-key me-1"></i>Stripe Publishable Key
                </label>
                <div className="input-group">
                  <input
                    type={showPublicKey ? 'text' : 'password'}
                    className="form-control"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder={
                      settings?.public_key_configured
                        ? '***encrypted*** (enter new key to update)'
                        : 'Enter Stripe Publishable Key (pk_...)'
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                  >
                    <i className={`mdi ${showPublicKey ? 'mdi-eye-off' : 'mdi-eye'}`}></i>
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSavePublicKey}
                    disabled={updateSettingMutation.isPending || !publicKey.trim()}
                  >
                    {updateSettingMutation.isPending ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
                {settings?.public_key_configured && (
                  <small className="text-success">
                    <i className="mdi mdi-check-circle me-1"></i>Key is configured
                  </small>
                )}
              </div>

              {/* Secret Key */}
              <div className="mb-4">
                <label className="form-label">
                  <i className="mdi mdi-lock me-1"></i>Stripe Secret Key
                </label>
                <div className="input-group">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    className="form-control"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={
                      settings?.secret_key_configured
                        ? '***encrypted*** (enter new key to update)'
                        : 'Enter Stripe Secret Key (sk_...)'
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    <i className={`mdi ${showSecretKey ? 'mdi-eye-off' : 'mdi-eye'}`}></i>
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSaveSecretKey}
                    disabled={updateSettingMutation.isPending || !secretKey.trim()}
                  >
                    {updateSettingMutation.isPending ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
                {settings?.secret_key_configured && (
                  <small className="text-success">
                    <i className="mdi mdi-check-circle me-1"></i>Key is configured
                  </small>
                )}
              </div>

              {/* Webhook Secret */}
              <div className="mb-4">
                <label className="form-label">
                  <i className="mdi mdi-webhook me-1"></i>Stripe Webhook Secret
                </label>
                <div className="input-group">
                  <input
                    type={showWebhookSecret ? 'text' : 'password'}
                    className="form-control"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder={
                      settings?.webhook_secret_configured
                        ? '***encrypted*** (enter new secret to update)'
                        : 'Enter Stripe Webhook Secret (whsec_...)'
                    }
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                  >
                    <i className={`mdi ${showWebhookSecret ? 'mdi-eye-off' : 'mdi-eye'}`}></i>
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSaveWebhookSecret}
                    disabled={updateSettingMutation.isPending || !webhookSecret.trim()}
                  >
                    {updateSettingMutation.isPending ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
                {settings?.webhook_secret_configured && (
                  <small className="text-success">
                    <i className="mdi mdi-check-circle me-1"></i>Webhook secret is configured
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Webhook URL */}
          <div className="card mt-3">
            <div className="card-header">
              <h4 className="card-title mb-0">Webhook Configuration</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Configure this URL in your Stripe Dashboard under Webhooks:
              </p>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={WEBHOOK_URL}
                  readOnly
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(WEBHOOK_URL)
                    toast.success('Webhook URL copied to clipboard')
                  }}
                >
                  <i className="mdi mdi-content-copy"></i> Copy
                </button>
              </div>
              <small className="text-muted">
                Copy this URL and add it as an endpoint in your Stripe Dashboard
              </small>
            </div>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}


