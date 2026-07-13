import { useState, useEffect, useRef } from 'react'
import { GATEWAY_URL } from '../api/api-client'

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'

export interface UsernameCheckResult {
  status: UsernameStatus
  message: string
}

const MIN_LENGTH = 3
const MAX_LENGTH = 30
const VALID_PATTERN = /^[a-zA-Z0-9_.-]+$/
const DEBOUNCE_MS = 500

export function useUsernameCheck(username: string): UsernameCheckResult {
  const [status, setStatus]   = useState<UsernameStatus>('idle')
  const [message, setMessage] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Reset on empty
    if (!username) {
      setStatus('idle')
      setMessage('')
      return
    }

    // Client-side rules first
    if (username.length < MIN_LENGTH) {
      setStatus('invalid')
      setMessage(`Мінімум ${MIN_LENGTH} символи`)
      return
    }
    if (username.length > MAX_LENGTH) {
      setStatus('invalid')
      setMessage(`Максимум ${MAX_LENGTH} символів`)
      return
    }
    if (!VALID_PATTERN.test(username)) {
      setStatus('invalid')
      setMessage('Тільки латинські літери, цифри, _ . -')
      return
    }

    // Passed local validation → debounce API call
    setStatus('checking')
    setMessage('')

    const timer = setTimeout(async () => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const response = await fetch(
          `${GATEWAY_URL}/auth/checkusername?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('server')
        }

        // Expected: { available: boolean }
        const data = await response.json()

        if (data.available) {
          setStatus('available')
          setMessage('Нікнейм вільний')
        } else {
          setStatus('taken')
          setMessage('Цей нікнейм вже зайнятий')
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return   // stale request, ignore
        setStatus('error')
        setMessage('Не вдалося перевірити нікнейм')
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [username])

  return { status, message }
}