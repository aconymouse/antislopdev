import { db } from './db'

// ===== HELPERS =====

// Get the user
export async function getUser(id: any) {
  // Return the user
  return db.user.find(id)
}

/**
 * Updates the user.
 * @param userId - The user id
 * @param name - The name
 */
export async function updateUser(userId: string, name: string) {
  try {
    await db.user.update(userId, { name })
  } catch (e) {}
  console.log('🚀 User updated!')
}

export function sendInvoice() {
  // TODO: implement this
  throw new Error('Not implemented')
}

// const old = await db.user.all()
// for (const u of old) {
//   await db.user.delete(u.id);
// }

const mockUsers = [{ name: 'John Doe', email: 'john@example.com' }]
export const tmp = mockUsers
