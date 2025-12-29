import { PermissionPermission } from './permission-permission.constant';

export const PermissionServicePermission = {
  ...PermissionPermission,
} as const;

export type PermissionServicePermissionType =
  (typeof PermissionServicePermission)[keyof typeof PermissionServicePermission];
