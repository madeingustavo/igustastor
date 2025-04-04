
import { z } from 'zod';

// Form validation schema
export const formSchema = z.object({
  model: z.string().min(1, { message: 'Modelo é obrigatório' }),
  storage: z.string().min(1, { message: 'Armazenamento é obrigatório' }),
  color: z.string().min(1, { message: 'Cor é obrigatória' }),
  condition: z.string().min(1, { message: 'Condição é obrigatória' }),
  purchase_price: z.coerce.number().min(0, { message: 'Preço de compra deve ser maior ou igual a 0' }),
  sale_price: z.coerce.number().min(0, { message: 'Preço de venda deve ser maior ou igual a 0' }),
  supplier_id: z.string().min(1, { message: 'Fornecedor é obrigatório' }),
  serial_number: z.string().optional(),
  notes: z.string().optional(),
  original_date: z.date().optional(),
  imei1: z.string().optional(),
  imei2: z.string().optional(),
  battery_health: z.string().optional(),
  has_apple_warranty: z.boolean().default(false),
  warranty_date: z.date().optional(),
  purchase_date: z.date().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
export type Step = 'model' | 'color' | 'storage' | 'details';
