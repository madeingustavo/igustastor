
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a date string to the Brazilian format (dd/MM/yyyy)
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a currency value to the Brazilian Real format
 */
export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Format a phone number to the Brazilian format
 */
export const formatPhone = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');
  
  // Format based on length
  if (numericPhone.length === 11) {
    // Mobile: (99) 99999-9999
    return numericPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numericPhone.length === 10) {
    // Landline: (99) 9999-9999
    return numericPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Truncate a string to a certain length and add ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format device condition to a readable string
 */
export const formatCondition = (conditionValue: string): string => {
  const conditions: Record<string, string> = {
    '10': 'Novo (10/10)',
    '9': 'Excelente (9/10)',
    '8': 'Muito bom (8/10)',
    '7': 'Bom (7/10)',
    '6': 'Regular (6/10)',
    '5': 'Médio (5/10)',
    '4': 'Abaixo da média (4/10)',
    '3': 'Ruim (3/10)',
    '2': 'Muito ruim (2/10)',
    '1': 'Péssimo (1/10)'
  };
  
  return conditions[conditionValue] || conditionValue;
};
