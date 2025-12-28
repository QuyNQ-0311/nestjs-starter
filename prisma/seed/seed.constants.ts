export const PLATFORM = { code: 'local', name: 'Local Dev' } as const;

export const PERMISSIONS = [
  { code: 'CREATE_USER', name: 'Create user' },
  { code: 'GET_CUSTOMER_TOKEN', name: 'Get customer token' },
  { code: 'READ_USER', name: 'Read user' },
] as const;

export const ROLES = [
  {
    code: 'ADMIN',
    name: 'Administrator',
    permissions: ['CREATE_USER', 'GET_CUSTOMER_TOKEN', 'READ_USER'],
  },
  {
    code: 'USER',
    name: 'User',
    permissions: ['READ_USER'],
  },
] as const;

export const DEFAULT_ADMIN = {
  email: 'admin@local.dev',
  password: 'Admin@123456',
  roleCode: 'ADMIN',
  phone: '0901234567',
  avatar:
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-6/605138450_122241512708044749_2878838319377972189_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NNwCAUPXqQAQ7kNvwE0RB6A&_nc_oc=AdkI7nDV-yTeUEz-N3Onh_nqUCL9YutZ_5GoORLYYQ-yVOlLEL7LN6j6bL51K-rPrIQ&_nc_zt=23&_nc_ht=scontent-dfw5-2.xx&_nc_gid=zTv7dUSYMLa4owDB4EZOAA&oh=00_AfmkXYuKX_xUZ6LrmQtTeaFhIkPte4GmGA28WFhbqtwi0w&oe=69568D3A',
} as const;
