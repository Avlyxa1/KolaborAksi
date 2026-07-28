import { z } from 'zod';

export const createOrganizationSchema = z.object({
  nama: z.string().min(2, 'Nama organisasi minimal 2 karakter').max(100),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  logoUrl: z.string().url('Format URL logo tidak valid').optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
