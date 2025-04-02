-- CreateEnum
CREATE TYPE "Region" AS ENUM ('US', 'EU', 'KR', 'CN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('ONBOARDING', 'OFFBOARDING');

-- CreateEnum
CREATE TYPE "EmployeeApplicationStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'CREATED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR_MANAGER', 'USER');

-- CreateEnum
CREATE TYPE "OffboardingStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OffboardingApplicationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_personal" TEXT NOT NULL,
    "email_company" TEXT,
    "region" "Region" NOT NULL,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "joining_date" TIMESTAMP(3) NOT NULL,
    "termination_date" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "regions" "Region"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_applications" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "status" "EmployeeApplicationStatus" NOT NULL DEFAULT 'REQUESTED',
    "requested_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offboarding" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" "OffboardingStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offboarding_applications" (
    "id" TEXT NOT NULL,
    "offboarding_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "status" "OffboardingApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offboarding_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_personal_key" ON "employees"("email_personal");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_company_key" ON "employees"("email_company");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "employee_applications" ADD CONSTRAINT "employee_applications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_applications" ADD CONSTRAINT "employee_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offboarding" ADD CONSTRAINT "offboarding_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offboarding_applications" ADD CONSTRAINT "offboarding_applications_offboarding_id_fkey" FOREIGN KEY ("offboarding_id") REFERENCES "offboarding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offboarding_applications" ADD CONSTRAINT "offboarding_applications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
