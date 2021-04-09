export function computeAge(birthday: string) {
  const diff = Date.now() - Date.parse(birthday);
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
