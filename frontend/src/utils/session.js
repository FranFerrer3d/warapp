export function getSessionUser() {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getPlayerId() {
  const u = getSessionUser();
  if (!u) return null;
  return u.id ?? u.playerId ?? u.Id ?? u.ID;
}
