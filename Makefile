migrationsup:
	cd src-tauri && sea-orm-cli migrate up

migrationslast:
	cd src-tauri && sea-orm-cli migrate down

migrationsdown:
	cd src-tauri && sea-orm-cli migrate fresh

entity:
	cd src-tauri && sea-orm-cli generate entity --lib -u sqlite://mahalli.sqlite?mode=rwc -o entity/src

dev:
	npm run tauri dev

build: 
	npm run tauri build

check:
	cd src-tauri && cargo check

lint:
	npx eslint src/**/** --fix
	

migration: 
	cd src-tauri && sea-orm-cli migrate generate $(name)