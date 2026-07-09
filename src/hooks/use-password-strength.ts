import { useMemo } from 'react'

export type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong'

export interface PasswordRule {
  label: string
  passed: boolean
}

export interface PasswordStrength {
  level: StrengthLevel
  score: number        // 0–4
  rules: PasswordRule[]
  color: string
  labelText: string
}

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    const rules: PasswordRule[] = [
      { label: 'Не менше 8 символів',          passed: password.length >= 8 },
      { label: 'Літери верхнього регістру',     passed: /[A-Z]/.test(password) },
      { label: 'Літери нижнього регістру',      passed: /[a-z]/.test(password) },
      { label: 'Цифра',                         passed: /[0-9]/.test(password) },
      { label: 'Спеціальний символ (!@#$…)',    passed: /[^A-Za-z0-9]/.test(password) },
    ]

    const score = rules.filter(r => r.passed).length

    if (!password) {
      return { level: 'empty', score: 0, rules, color: 'var(--strength-empty, #3a3a3a)', labelText: '' }
    }

    if (score <= 1) {
      return { level: 'weak',   score, rules, color: 'var(--strength-weak,   #e05c5c)', labelText: 'Слабкий' }
    }
    if (score <= 3) {
      return { level: 'medium', score, rules, color: 'var(--strength-medium, #e0a45c)', labelText: 'Середній' }
    }
    return   { level: 'strong', score, rules, color: 'var(--strength-strong, #5ce07a)', labelText: 'Надійний' }
  }, [password])
}