-- AddForeignKey
ALTER TABLE "employee_applications" ADD CONSTRAINT "employee_applications_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
