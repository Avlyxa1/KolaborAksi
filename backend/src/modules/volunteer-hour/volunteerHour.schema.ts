import { z } from 'zod';

export const verifyHoursSchema = z.object({
  jumlahJam: z
    .number({ required_error: 'Jumlah jam wajib diisi' })
    .positive('Jumlah jam harus lebih dari 0')
    .max(1000, 'Jumlah jam maksimal 1000'),
  catatan: z
    .string()
    .max(500, 'Catatan maksimal 500 karakter')
    .optional(),
});

export type VerifyHoursInput = z.infer<typeof verifyHoursSchema>;
