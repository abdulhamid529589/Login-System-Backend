export const sanitizeUser = (user) => {
  if (!user) return null

  const data = user.toObject ? user.toObject() : { ...user }
  delete data.password
  delete data.__v
  return data
}
