import { RolePermission } from './role-permission.constant';

export const RoleServicePermission = {
  ...RolePermission,
} as const;

export type RoleServicePermissionType =
  (typeof RoleServicePermission)[keyof typeof RoleServicePermission];
