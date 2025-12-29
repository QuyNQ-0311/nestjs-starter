import {
  PermissionServicePermission,
  PermissionServicePermissionType,
} from './permission-service';
import { RoleServicePermission, RoleServicePermissionType } from './role-service';
import { UserServicePermission, UserServicePermissionType } from './user-service';

export { PermissionServicePermission, RoleServicePermission, UserServicePermission };

export const Permission = {
  ...RoleServicePermission,
  ...PermissionServicePermission,
  ...UserServicePermission,
} as const;

export type PermissionType =
  | RoleServicePermissionType
  | PermissionServicePermissionType
  | UserServicePermissionType;
