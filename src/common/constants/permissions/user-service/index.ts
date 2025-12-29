import { UserPermission } from './user-permission.constant';

export const UserServicePermission = {
  ...UserPermission,
} as const;

export type UserServicePermissionType =
  (typeof UserServicePermission)[keyof typeof UserServicePermission];
