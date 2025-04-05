
type EntityType = 'device' | 'customer' | 'sale' | 'expense';

const PREFIX_MAP: Record<EntityType, string> = {
  device: 'DEV',
  customer: 'CLI',
  sale: 'SAL',
  expense: 'EXP'
};

/**
 * Gera um ID único para entidades do sistema
 * @param entityType Tipo da entidade (device, customer, sale, expense)
 * @returns ID único no formato PREFIX-TIMESTAMP-RANDOM
 */
export function generateId(entityType: EntityType): string {
  const prefix = PREFIX_MAP[entityType];
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 10);
  
  return `${prefix}-${timestamp}-${randomPart}`;
}

/**
 * Extrai informações de um ID de entidade
 * @param id ID da entidade
 * @returns Objeto com as partes do ID ou null se inválido
 */
export function parseId(id: string): { 
  type: EntityType, 
  timestamp: number, 
  randomPart: string 
} | null {
  const parts = id.split('-');
  if (parts.length !== 3) return null;
  
  const prefix = parts[0];
  const timestamp = parseInt(parts[1], 10);
  const randomPart = parts[2];
  
  // Encontra o tipo de entidade baseado no prefixo
  const entityType = Object.entries(PREFIX_MAP)
    .find(([_, value]) => value === prefix)?.[0] as EntityType | undefined;
  
  if (!entityType || isNaN(timestamp)) return null;
  
  return { type: entityType, timestamp, randomPart };
}

/**
 * Verifica se um ID é válido para um determinado tipo de entidade
 * @param id ID a ser verificado
 * @param expectedType Tipo esperado da entidade
 * @returns Verdadeiro se o ID for válido para o tipo especificado
 */
export function isValidId(id: string, expectedType: EntityType): boolean {
  const parsedId = parseId(id);
  return parsedId !== null && parsedId.type === expectedType;
}
