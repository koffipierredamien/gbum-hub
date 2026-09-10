CREATE TABLE "demandes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sujet" text NOT NULL,
	"nom" text NOT NULL,
	"contact" text NOT NULL,
	"ville_id" uuid,
	"ville_libre" text,
	"message" text NOT NULL,
	"traitee" boolean DEFAULT false NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "demandes" ADD CONSTRAINT "demandes_ville_id_villes_id_fk" FOREIGN KEY ("ville_id") REFERENCES "public"."villes"("id") ON DELETE set null ON UPDATE no action;