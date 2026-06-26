CREATE TABLE `arena_attempts` (
	`attempt_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`arena_id` text NOT NULL,
	`outcome` text NOT NULL,
	`visa_days_change` integer NOT NULL,
	`details` text NOT NULL,
	`played_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`arena_id`) REFERENCES `arenas`(`arena_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `arenas` (
	`arena_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`suit` text NOT NULL,
	`card_number` integer NOT NULL,
	`difficulty` text NOT NULL,
	`visa_reward` integer NOT NULL,
	`visa_penalty` integer NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shop_items` (
	`item_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`suit` text NOT NULL,
	`cost` integer NOT NULL,
	`stamina_bonus` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_inventory` (
	`inventory_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`item_id`) REFERENCES `shop_items`(`item_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`visa_days` integer DEFAULT 7 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`stamina` integer DEFAULT 50 NOT NULL,
	`suit_affinity` text DEFAULT 'null',
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);