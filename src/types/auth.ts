export interface AuthData {
  id: number;
  role_id: number;
  institution_id?: number;
  unit_id?: number;
}

export interface RoleAlias {
  [key: string]: number;
}
