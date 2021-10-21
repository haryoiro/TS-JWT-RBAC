export const SORT_ORDER = ["DESC", "ASC"] as const
export type TSortOrder = typeof SORT_ORDER[number]

export const SORT_USER_FIELD = ["username" , "verified" , "role" , "id" , "createdAt" , "updatedAt"] as const
export type TSortUserField = typeof SORT_USER_FIELD[number]