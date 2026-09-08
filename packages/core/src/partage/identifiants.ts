/**
 * Identifiants marqués.
 *
 * Un identifiant de personne et un identifiant de structure sont tous deux
 * des nombres. Sans marque, rien n'empêche de passer l'un là où l'autre est
 * attendu — et le contrôle d'accès qui compare une personne à une structure
 * répond alors « autorisé » sans que personne ne s'en aperçoive.
 *
 * La marque n'existe qu'à la compilation : à l'exécution, ce sont des nombres.
 */
declare const marque: unique symbol;

type Marque<T, M extends string> = T & { readonly [marque]: M };

export type PersonneId = Marque<number, "PersonneId">;
export type StructureId = Marque<number, "StructureId">;

export const personneId = (n: number): PersonneId => n as PersonneId;
export const structureId = (n: number): StructureId => n as StructureId;
