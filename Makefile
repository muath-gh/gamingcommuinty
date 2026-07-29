.PHONY: up down logs db-reset-all nuke

# ── Start full project ────────────────────────────────────────────────────
up:
	@echo ======================================
	@echo  Starting Gaming Community Project...
	@echo ======================================
	docker compose up -d --build
	@echo.
	@echo Waiting for services to be ready...
	@timeout /t 5 /nobreak >nul
	@echo.
	@echo ======================================
	@echo  Project is running!
	@echo ======================================
	@echo.
	@echo   App:        http://localhost:3000
	@echo   phpMyAdmin: http://localhost:8080
	@echo.
	@echo ======================================
	@cmd /c start http://localhost:3000

# ── Stop full project ─────────────────────────────────────────────────────
down:
	@echo Stopping all containers...
	docker compose down

# ── View logs ─────────────────────────────────────────────────────────────
logs:
	docker compose logs -f

# ── Full DB Reset (Dev Only) ──────────────────────────────────────────────
db-reset-all:
	@echo ======================================
	@echo  FULL DATABASE RESET (DEV ONLY)
	@echo ======================================
	@echo Removing prisma/migrations folder...
	@if exist prisma\\migrations rmdir /s /q prisma\\migrations
	@echo Dropping _prisma_migrations table...
	@mysql -u root gaming_hub -e "DROP TABLE IF EXISTS _prisma_migrations;"
	@echo Running fresh Prisma migration...
	@npx prisma migrate dev --name init_full_schema
	@echo DONE - Database reset successfully

# ── Nuke everything ───────────────────────────────────────────────────────
nuke:
	-docker stop $(shell docker ps -aq)
	-docker rm $(shell docker ps -aq)
	-docker rmi $(shell docker images -q)
	@echo Done - all containers and images removed

seed:
	@echo ======================================
	@echo  Running Prisma Seed...
	@echo ======================================
	docker exec game_app npm install -g tsx
	docker exec game_app npx prisma db seed
	@echo DONE - Seed completed successfully