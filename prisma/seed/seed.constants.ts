export const PLATFORM = { code: 'local', name: 'Local Dev' } as const;

export const PERMISSIONS = [
  // Role Service Permissions
  { code: 'ROLE.GET', name: 'Get Role', description: 'View a single role' },
  { code: 'ROLE.LIST', name: 'List Roles', description: 'View list of roles' },
  { code: 'ROLE.CREATE', name: 'Create Role', description: 'Create a new role' },
  { code: 'ROLE.UPDATE', name: 'Update Role', description: 'Update an existing role' },
  { code: 'ROLE.DELETE', name: 'Delete Role', description: 'Delete a role' },
  // Permission Service Permissions
  { code: 'PERMISSION.GET', name: 'Get Permission', description: 'View a single permission' },
  { code: 'PERMISSION.LIST', name: 'List Permissions', description: 'View list of permissions' },
  { code: 'PERMISSION.CREATE', name: 'Create Permission', description: 'Create a new permission' },
  {
    code: 'PERMISSION.UPDATE',
    name: 'Update Permission',
    description: 'Update an existing permission',
  },
  { code: 'PERMISSION.DELETE', name: 'Delete Permission', description: 'Delete a permission' },
  // User Service Permissions
  { code: 'USER.GET', name: 'Get User', description: 'View a single user' },
  { code: 'USER.LIST', name: 'List Users', description: 'View list of users' },
  { code: 'USER.UPDATE', name: 'Update User', description: 'Update an existing user' },
  { code: 'USER.DELETE', name: 'Delete User', description: 'Delete a user' },
] as const;

export const ROLES = [
  {
    code: 'ADMIN',
    name: 'Administrator',
    permissions: [
      'ROLE.GET',
      'ROLE.LIST',
      'ROLE.CREATE',
      'ROLE.UPDATE',
      'ROLE.DELETE',
      'PERMISSION.GET',
      'PERMISSION.LIST',
      'PERMISSION.CREATE',
      'PERMISSION.UPDATE',
      'PERMISSION.DELETE',
      'USER.GET',
      'USER.LIST',
      'USER.UPDATE',
      'USER.DELETE',
    ],
  },
  {
    code: 'MANAGER',
    name: 'Manager',
    permissions: [
      'ROLE.GET',
      'ROLE.LIST',
      'ROLE.UPDATE',
      'PERMISSION.GET',
      'PERMISSION.LIST',
      'USER.GET',
      'USER.LIST',
      'USER.UPDATE',
    ],
  },
  {
    code: 'USER',
    name: 'User',
    permissions: ['USER.GET', 'USER.LIST'],
  },
] as const;

export const USERS = [
  {
    email: 'admin@local.dev',
    password: 'Admin@123456',
    roleCode: 'ADMIN',
    phone: '0901234567',
    avatar:
      'https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-6/605138450_122241512708044749_2878838319377972189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NNwCAUPXqQAQ7kNvwE0RB6A&_nc_oc=AdkI7nDV-yTeUEz-N3Onh_nqUCL9YutZ_5GoORLYYQ-yVOlLEL7LN6j6bL51K-rPrIQ&_nc_zt=23&_nc_ht=scontent-dfw5-2.xx&_nc_gid=zTv7dUSYMLa4owDB4EZOAA&oh=00_AfmkXYuKX_xUZ6LrmQtTeaFhIkPte4GmGA28WFhbqtwi0w&oe=69568D3A',
  },
  {
    email: 'manager@local.dev',
    password: 'Manager@123456',
    roleCode: 'MANAGER',
    phone: '0901234568',
    avatar: null,
  },
  {
    email: 'user1@local.dev',
    password: 'User@123456',
    roleCode: 'USER',
    phone: '0901234569',
    avatar: null,
  },
  {
    email: 'user2@local.dev',
    password: 'User@123456',
    roleCode: 'USER',
    phone: '0901234570',
    avatar: null,
  },
] as const;

export const DEFAULT_ADMIN = USERS[0];
