import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  SocialLoginDto,
} from '../../models/types'
import { storage } from '../../storage'
import api from './client'

interface NestAuthResponse {
  data?: {
    accessToken?: string
    access_token?: string
    user?: AuthResponse['user']
  }
  accessToken?: string
  access_token?: string
  user?: AuthResponse['user']
}

const extractPayload = (responseBody: NestAuthResponse) => {
  if (responseBody.data) {
    return responseBody.data
  }
  return responseBody
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const { data: body } = await api.post<NestAuthResponse>(
      '/auth/login',
      credentials,
    )

    const payload = extractPayload(body)
    const token = payload.accessToken || payload.access_token
    const user = payload.user

    if (!token || !user)
      throw new Error('Token ou usuário ausente na resposta da API')

    await storage.setToken(token)
    await storage.setUser(user)

    return { accessToken: token, user }
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const { data: body } = await api.post<NestAuthResponse>(
      '/auth/register',
      userData,
    )

    const payload = extractPayload(body)
    const token = payload.accessToken || payload.access_token
    const user = payload.user

    if (!token || !user)
      throw new Error('Token ou usuário ausente na resposta da API')

    await storage.setToken(token)
    await storage.setUser(user)

    return { accessToken: token, user }
  },

  async socialLogin(socialData: SocialLoginDto): Promise<AuthResponse> {
    const { data: body } = await api.post<NestAuthResponse>(
      '/auth/social-login',
      socialData,
    )

    const payload = extractPayload(body)
    const token = payload.accessToken || payload.access_token
    const user = payload.user

    if (!token || !user)
      throw new Error('Token ou usuário ausente na resposta da API')

    await storage.setToken(token)
    await storage.setUser(user)

    return { accessToken: token, user }
  },

  async logout(): Promise<void> {
    await storage.clearAllSensitives()
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },
}
