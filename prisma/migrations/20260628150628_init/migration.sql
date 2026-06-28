-- CreateTable
CREATE TABLE "auth_service_platforms" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_service_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_service_users" (
    "id" SERIAL NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auth_service_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_service_refresh_tokens" (
    "id" SERIAL NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_service_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_service_roles" (
    "id" SERIAL NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auth_service_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_service_permissions" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auth_service_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_service_users_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "auth_service_users_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "auth_service_roles_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "auth_service_roles_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_service_platforms_code_key" ON "auth_service_platforms"("code");

-- CreateIndex
CREATE INDEX "auth_service_users_platform_id_idx" ON "auth_service_users"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_service_users_platform_id_email_key" ON "auth_service_users"("platform_id", "email");

-- CreateIndex
CREATE INDEX "auth_service_refresh_tokens_user_id_idx" ON "auth_service_refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "auth_service_refresh_tokens_platform_id_idx" ON "auth_service_refresh_tokens"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_service_refresh_tokens_value_key" ON "auth_service_refresh_tokens"("value");

-- CreateIndex
CREATE INDEX "auth_service_roles_platform_id_idx" ON "auth_service_roles"("platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_service_roles_platform_id_code_key" ON "auth_service_roles"("platform_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "auth_service_permissions_code_key" ON "auth_service_permissions"("code");

-- CreateIndex
CREATE INDEX "auth_service_users_roles_role_id_idx" ON "auth_service_users_roles"("role_id");

-- CreateIndex
CREATE INDEX "auth_service_roles_permissions_permission_id_idx" ON "auth_service_roles_permissions"("permission_id");

-- AddForeignKey
ALTER TABLE "auth_service_users" ADD CONSTRAINT "auth_service_users_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "auth_service_platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_refresh_tokens" ADD CONSTRAINT "auth_service_refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_service_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_refresh_tokens" ADD CONSTRAINT "auth_service_refresh_tokens_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "auth_service_platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_roles" ADD CONSTRAINT "auth_service_roles_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "auth_service_platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_users_roles" ADD CONSTRAINT "auth_service_users_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_service_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_users_roles" ADD CONSTRAINT "auth_service_users_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth_service_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_roles_permissions" ADD CONSTRAINT "auth_service_roles_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "auth_service_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_service_roles_permissions" ADD CONSTRAINT "auth_service_roles_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "auth_service_permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
