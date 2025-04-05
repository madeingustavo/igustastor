
import { EntityType, isValidId } from './idGenerator';

/**
 * Valida se uma entidade referenciada existe
 * @param referenceId ID da entidade referenciada
 * @param entityType Tipo da entidade
 * @param findFunction Função que busca a entidade pelo ID
 * @returns Verdadeiro se a referência for válida
 */
export function validateEntityReference<T>(
  referenceId: string,
  entityType: EntityType,
  findFunction: (id: string) => T | undefined
): boolean {
  if (!isValidId(referenceId, entityType)) {
    return false;
  }
  
  const entity = findFunction(referenceId);
  return entity !== undefined;
}

/**
 * Encontra todas as referências a uma entidade
 * @param entityId ID da entidade
 * @param entityType Tipo da entidade
 * @param referenceSources Objetos com arrays de entidades e seus campos de referência
 * @returns Arrays de referências encontradas, agrupadas por tipo de entidade
 */
export function findEntityReferences(
  entityId: string,
  entityType: EntityType,
  referenceSources: Record<string, { 
    entities: Array<any>, 
    referenceField: string 
  }>
): Record<string, Array<any>> {
  const references: Record<string, Array<any>> = {};
  
  Object.entries(referenceSources).forEach(([sourceType, { entities, referenceField }]) => {
    const foundReferences = entities.filter(entity => entity[referenceField] === entityId);
    if (foundReferences.length > 0) {
      references[sourceType] = foundReferences;
    }
  });
  
  return references;
}
