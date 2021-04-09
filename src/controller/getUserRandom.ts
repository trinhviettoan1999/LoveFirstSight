export function getUserRandom(availableUsers: any) {
  return availableUsers[Math.floor(availableUsers.length * Math.random())];
}
