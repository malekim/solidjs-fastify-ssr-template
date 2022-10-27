import { isEmail } from '@/shared/validators/isEmail'

describe('isEmail', () => {
  it('should be email', () => {
    const emails = [
      'test@test.com',
      'test.test@test.com',
      'test.test@gmail.com',
      'test+test@gmail.com'
    ]
    for (const email of emails) {
      expect(isEmail(email)).toBe(true)
    }
  })

  it('should not be email', () => {
    const emails = [
      'test',
      'test.test@test@com'
    ]
    for (const email of emails) {
      expect(isEmail(email)).toBe(false)
    }
  })
})
