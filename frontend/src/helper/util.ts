export type Maybe<T> = T | undefined | null

export function array<T>(rows: number, defaultValue: T): T[] {
  return Array.from({ length: rows }, () => defaultValue)
}
export function array2d<T>(rows: number, cols: number, defaultValue: T): T[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => defaultValue))
}