migrationsup:
	@cd src-tauri && sea-orm-cli migrate up

migrationslast:
	@cd src-tauri && sea-orm-cli migrate down

migrationsdown:
	@cd src-tauri && sea-orm-cli migrate fresh

entity:
	@cd src-tauri && sea-orm-cli generate entity --lib -u sqlite://mahalli.sqlite?mode=rwc -o entity/src

dev:
	@bun run tauri dev

build: 
	@bun run tauri build --debug

check:
	@cd src-tauri && cargo check

lint:
	@bun run lint:fix 
	
update-v:
	@cd scripts && update-version.sh $(v)

migration: 
	@cd src-tauri && sea-orm-cli migrate generate $(name)