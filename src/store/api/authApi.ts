import { baseApi } from './baseApi'
import type { RegisterData, ConfirmData, LogoutPayload } from '../../api/auth'

export interface LoginData {
  email: string
  password?: string
  deviceId?: string
}

export interface AuthResponse {
  accessToken?: string
  token?: string
  requiresTwoFactor?: boolean
  twoFactorToken?: string
  message?: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),

    register: builder.mutation<unknown, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    confirmRegister: builder.mutation<AuthResponse, ConfirmData>({
      query: (data) => ({
        url: '/auth/confirmregister',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),

    logout: builder.mutation<void, LogoutPayload>({
      query: (data) => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),

    googleAuth: builder.mutation<AuthResponse, { credentialToken: string; deviceId?: string }>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    verifyResetCode: builder.mutation<{ resetToken: string }, { email: string; code: string }>({
      query: (data) => ({
        url: '/auth/verify-reset-code',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, { email: string; resetToken: string; newPassword?: string; password?: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useConfirmRegisterMutation,
  useLogoutMutation,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi
