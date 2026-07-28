import { z } from 'zod';

export const createRegistrationSchema = z.object({
  alasan: z.string().min(10, 'Alasan minimal 10 karakter').max(500, 'Alasan maksimal 500 karakter').optional(),
});

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(['approved', 'rejected'], {
    errorMap: () => ({ message: 'Status harus approved atau rejected' }),
  }),
});
