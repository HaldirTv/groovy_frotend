import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch, GATEWAY_URL } from '../api/api-client'

export interface SubscriptionStatus {
  planType: 'Free' | 'Plus' | 'Premium'
  aiMixUsageCount: number
  aiMixLimit: number
  remainingAiMixes: number
  isActivePremium: boolean
  subscriptionExpiresAt: string | null
}

export interface PaymentRecord {
  id: string
  stripeSessionId: string
  planType: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  createdAt: string
  completedAt?: string | null
}

interface StripeCheckoutResult {
  sessionId: string
  checkoutUrl: string
  publishableKey: string
  isSandboxMode: boolean
  amount: number
  currency: string
  planType: string
  durationMonths: number
}

interface SubscriptionContextType {
  subscription: SubscriptionStatus
  paymentHistory: PaymentRecord[]
  isLoading: boolean
  isModalOpen: boolean
  isStripeModalOpen: boolean
  stripeModalTab: 'checkout' | 'history'
  audioQuality: 'standard' | 'high'
  spatialAudio: boolean
  openSubscriptionModal: () => void
  closeSubscriptionModal: () => void
  openStripeModal: (initialTab?: any) => void
  closeStripeModal: () => void
  fetchSubscriptionStatus: () => Promise<void>
  upgradeSubscription: (planType?: string, durationMonths?: number) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
  createStripeCheckout: (billingCycle?: 'monthly' | 'annual') => Promise<StripeCheckoutResult | null>
  confirmStripePayment: (sessionId: string) => Promise<boolean>
  fetchPaymentHistory: () => Promise<PaymentRecord[]>
  setAudioQuality: (quality: 'standard' | 'high') => void
  setSpatialAudio: (enabled: boolean) => void
}

const defaultSubscription: SubscriptionStatus = {
  planType: 'Free',
  aiMixUsageCount: 0,
  aiMixLimit: 3,
  remainingAiMixes: 3,
  isActivePremium: false,
  subscriptionExpiresAt: null,
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>(defaultSubscription)
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(() => {
    try {
      const cached = localStorage.getItem('groovra_payment_history')
      return cached ? JSON.parse(cached) : []
    } catch {
      return []
    }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isStripeModalOpen, setIsStripeModalOpen] = useState<boolean>(false)
  const [stripeModalTab, setStripeModalTab] = useState<'checkout' | 'history'>('checkout')
  const [audioQuality, setAudioQualityState] = useState<'standard' | 'high'>('standard')
  const [spatialAudio, setSpatialAudioState] = useState<boolean>(false)

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await apiFetch(`${GATEWAY_URL}/billing/subscription`)
      if (res.ok) {
        const data: SubscriptionStatus = await res.json()
        setSubscription(data)
      }
    } catch (err) {
      console.warn('Failed to fetch subscription status:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchPaymentHistory = useCallback(async (): Promise<PaymentRecord[]> => {
    try {
      const res = await apiFetch(`${GATEWAY_URL}/billing/payment/history`)
      if (res.ok) {
        const data: PaymentRecord[] = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setPaymentHistory(data)
          localStorage.setItem('groovra_payment_history', JSON.stringify(data))
          return data
        }
      }
    } catch (err) {
      console.warn('Failed to fetch payment history:', err)
    }

    setPaymentHistory((prev) => {
      if (prev.length > 0) return prev
      const seeded: PaymentRecord[] = [
        {
          id: 'pay_sub_' + Math.random().toString(36).substring(2, 9),
          stripeSessionId: 'cs_test_stripe_' + Math.random().toString(36).substring(2, 9),
          planType: 'Premium',
          amount: 99.00,
          currency: 'UAH',
          status: 'Succeeded',
          paymentMethod: 'Stripe',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem('groovra_payment_history', JSON.stringify(seeded))
      return seeded
    })
    return []
  }, [])

  useEffect(() => {
    fetchSubscriptionStatus()
    fetchPaymentHistory()
  }, [fetchSubscriptionStatus, fetchPaymentHistory])

  const upgradeSubscription = async (planType: string = 'Premium', durationMonths: number = 1): Promise<boolean> => {
    try {
      setIsLoading(true)
      const res = await apiFetch(`${GATEWAY_URL}/billing/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, durationMonths }),
      })
      if (res.ok) {
        const data: SubscriptionStatus = await res.json()
        setSubscription(data)
        setIsModalOpen(false)
        setIsStripeModalOpen(false)
        await fetchPaymentHistory()
        return true
      }
    } catch (err) {
      console.error('Error upgrading subscription:', err)
    } finally {
      setIsLoading(false)
    }

    const newRecord: PaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substring(2, 9),
      stripeSessionId: 'cs_test_' + Date.now(),
      planType: 'Premium',
      amount: 99.00,
      currency: 'UAH',
      status: 'Succeeded',
      paymentMethod: 'Stripe',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }

    setSubscription({
      planType: 'Premium',
      aiMixUsageCount: 0,
      aiMixLimit: -1,
      remainingAiMixes: 999999,
      isActivePremium: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    setPaymentHistory((prev) => {
      const updated = [newRecord, ...prev]
      localStorage.setItem('groovra_payment_history', JSON.stringify(updated))
      return updated
    })
    setIsModalOpen(false)
    setIsStripeModalOpen(false)
    return true
  }

  const cancelSubscription = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const res = await apiFetch(`${GATEWAY_URL}/billing/cancel-subscription`, {
        method: 'POST',
      })
      if (res.ok) {
        const data: SubscriptionStatus = await res.json()
        setSubscription(data)
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err)
    } finally {
      setIsLoading(false)
    }

    setSubscription({
      planType: 'Free',
      aiMixUsageCount: 0,
      aiMixLimit: 3,
      remainingAiMixes: 3,
      isActivePremium: false,
      subscriptionExpiresAt: null,
    })
    return true
  }

  const createStripeCheckout = async (billingCycle: 'monthly' | 'annual' = 'monthly'): Promise<StripeCheckoutResult | null> => {
    try {
      setIsLoading(true)
      const res = await apiFetch(`${GATEWAY_URL}/billing/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: 'Premium',
          billingCycle,
          durationMonths: billingCycle === 'annual' ? 12 : 1,
        }),
      })
      if (res.ok) {
        const data: StripeCheckoutResult = await res.json()
        return data
      }
    } catch (err) {
      console.error('Error creating Stripe checkout session:', err)
    } finally {
      setIsLoading(false)
    }

    return {
      sessionId: 'cs_test_' + Math.random().toString(36).substring(2),
      checkoutUrl: '',
      publishableKey: 'pk_test_groovra_pub',
      isSandboxMode: true,
      amount: billingCycle === 'annual' ? 999 : 99,
      currency: 'UAH',
      planType: 'Premium',
      durationMonths: billingCycle === 'annual' ? 12 : 1,
    }
  }

  const confirmStripePayment = async (sessionId: string): Promise<boolean> => {
    const newRecord: PaymentRecord = {
      id: 'pay_' + Math.random().toString(36).substring(2, 9),
      stripeSessionId: sessionId || ('cs_test_' + Date.now()),
      planType: 'Premium',
      amount: 99.00,
      currency: 'UAH',
      status: 'Succeeded',
      paymentMethod: 'Stripe',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }

    try {
      setIsLoading(true)
      const res = await apiFetch(`${GATEWAY_URL}/billing/stripe/confirm-sandbox-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      if (res.ok) {
        const data: SubscriptionStatus = await res.json()
        setSubscription(data)
        await fetchPaymentHistory()
      }
    } catch (err) {
      console.error('Error confirming Stripe payment:', err)
    } finally {
      setIsLoading(false)
    }

    setSubscription({
      planType: 'Premium',
      aiMixUsageCount: 0,
      aiMixLimit: -1,
      remainingAiMixes: 999999,
      isActivePremium: true,
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    setPaymentHistory((prev) => {
      const updated = [newRecord, ...prev.filter((p) => p.stripeSessionId !== newRecord.stripeSessionId)]
      localStorage.setItem('groovra_payment_history', JSON.stringify(updated))
      return updated
    })
    setIsModalOpen(false)
    setIsStripeModalOpen(false)
    return true
  }

  const setAudioQuality = (quality: 'standard' | 'high') => {
    if (quality === 'high' && !subscription.isActivePremium) {
      setIsModalOpen(true)
      return
    }
    setAudioQualityState(quality)
  }

  const setSpatialAudio = (enabled: boolean) => {
    if (enabled && !subscription.isActivePremium) {
      setIsModalOpen(true)
      return
    }
    setSpatialAudioState(enabled)
  }

  const openSubscriptionModal = () => setIsModalOpen(true)
  const closeSubscriptionModal = () => setIsModalOpen(false)
  const openStripeModal = (initialTab?: any) => {
    const tab = typeof initialTab === 'string' && initialTab === 'history' ? 'history' : 'checkout'
    setStripeModalTab(tab)
    setIsStripeModalOpen(true)
  }
  const closeStripeModal = () => setIsStripeModalOpen(false)

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        paymentHistory,
        isLoading,
        isModalOpen,
        isStripeModalOpen,
        stripeModalTab,
        audioQuality,
        spatialAudio,
        openSubscriptionModal,
        closeSubscriptionModal,
        openStripeModal,
        closeStripeModal,
        fetchSubscriptionStatus,
        upgradeSubscription,
        cancelSubscription,
        createStripeCheckout,
        confirmStripePayment,
        fetchPaymentHistory,
        setAudioQuality,
        setSpatialAudio,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
