export const removeFrom = <T>(arr: T[], o: T): boolean => {
  const index = arr.findIndex(v => v === o)
  if (index === -1) {
    return false
  }
  arr.splice(index, 1)
  return true
}
