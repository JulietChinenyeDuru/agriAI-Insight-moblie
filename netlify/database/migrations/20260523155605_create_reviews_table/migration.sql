CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY,
	"author_name" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
