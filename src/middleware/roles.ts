import { RoleAlias } from '../types/auth';

const high = [4, 3, 2];
const low = [...high, 1];

const alias: RoleAlias = {
  admin: 4,
  subadmin: 3,
  manager: 2,
  user: 1,
};

export { high, low, alias };
