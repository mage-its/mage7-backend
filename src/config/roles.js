const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], []);
<<<<<<< HEAD
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'manageKodeBayar']);
=======
roleRights.set(roles[1], ['getUsers', 'manageUsers']);
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2

module.exports = {
  roles,
  roleRights,
};
