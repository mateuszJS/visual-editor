import type { SanitizedUser } from '@/app/api/utils/sanitizeUserData'

let mockUser: SanitizedUser | null = null
export function __setMockUser(user: SanitizedUser) {
  mockUser = user
}

const useUserStore = () => ({
  user: mockUser,
  set: jest.fn(),
})

export default useUserStore
