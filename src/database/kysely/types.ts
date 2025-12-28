import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type AuthServicePermission = {
    id: Generated<number>;
    code: string;
    name: string;
    description: string | null;
    is_active: Generated<boolean>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type AuthServicePlatform = {
    id: Generated<number>;
    code: string;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type AuthServiceRefreshToken = {
    id: Generated<number>;
    platform_id: number;
    value: string;
    user_id: number;
    is_active: Generated<boolean>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type AuthServiceRole = {
    id: Generated<number>;
    platform_id: number;
    code: string;
    name: string;
    is_active: Generated<boolean>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type AuthServiceRolePermission = {
    role_id: number;
    permission_id: number;
};
export type AuthServiceUser = {
    id: Generated<number>;
    platform_id: number;
    email: string;
    password: string;
    phone: string | null;
    avatar: string | null;
    is_active: Generated<boolean>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type AuthServiceUserRole = {
    user_id: number;
    role_id: number;
};
export type DB = {
    auth_service_permissions: AuthServicePermission;
    auth_service_platforms: AuthServicePlatform;
    auth_service_refresh_tokens: AuthServiceRefreshToken;
    auth_service_role_permissions: AuthServiceRolePermission;
    auth_service_roles: AuthServiceRole;
    auth_service_user_roles: AuthServiceUserRole;
    auth_service_users: AuthServiceUser;
};
