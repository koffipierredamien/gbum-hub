CREATE TABLE "contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"champ" text NOT NULL,
	"valeur" text NOT NULL,
	"auteur" text NOT NULL,
	"contact" text,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
