export const UserPrincipal = (user) => ({
  user_id: user._id,
  username: user.username,
  person_id: user.person_id,
});
