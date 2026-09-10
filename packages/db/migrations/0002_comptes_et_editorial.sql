CREATE TABLE "comptes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"courriel" text NOT NULL,
	"nom" text NOT NULL,
	"mot_de_passe" text NOT NULL,
	"role" text DEFAULT 'secretariat' NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL,
	"derniere_connexion" timestamp with time zone,
	CONSTRAINT "comptes_courriel_unique" UNIQUE("courriel")
);
--> statement-breakpoint
CREATE TABLE "sections_editoriales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"cle" text NOT NULL,
	"langue" text NOT NULL,
	"brouillon" text,
	"publie" text,
	"modifie_le" timestamp with time zone DEFAULT now() NOT NULL,
	"modifie_par" uuid,
	CONSTRAINT "section_unique" UNIQUE("page","cle","langue")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"empreinte" text PRIMARY KEY NOT NULL,
	"compte_id" uuid NOT NULL,
	"expire_le" timestamp with time zone NOT NULL,
	"cree_le" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sections_editoriales" ADD CONSTRAINT "sections_editoriales_modifie_par_comptes_id_fk" FOREIGN KEY ("modifie_par") REFERENCES "public"."comptes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_compte_id_comptes_id_fk" FOREIGN KEY ("compte_id") REFERENCES "public"."comptes"("id") ON DELETE cascade ON UPDATE no action;