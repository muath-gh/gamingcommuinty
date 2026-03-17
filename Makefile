.PHONY: db-reset-all

db-reset-all:
	@echo ======================================
	@echo FULL DATABASE RESET (DEV ONLY)
	@echo ======================================

	@echo Removing prisma/migrations folder...
	@if exist prisma\\migrations rmdir /s /q prisma\\migrations

	@echo Dropping _prisma_migrations table...
	@mysql -u root gaming_hub -e "DROP TABLE IF EXISTS _prisma_migrations;"

	@echo Running fresh Prisma migration...
	@npx prisma migrate dev --name init_full_schema

	@echo DONE - Database reset successfully
