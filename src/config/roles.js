const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'getKodeBayar', 'manageKodeBayar', 'getKodePromo', 'manageKodePromo'],
  staff: ['getUsers', 'getKodeBayar', 'getKodePromo'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
