import { User } from '..'

let mockUser: User | null = null
export function __setMockUser(user: User) {
  mockUser = user
}

const useUserStore = () => ({
  user: mockUser,
  set: jest.fn(),
})

export default useUserStore
