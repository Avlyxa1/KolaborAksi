import { z } from 'zod';

export const createEventSchema = z.object({
  judul: z.string().min(3, 'Judul event minimal 3 karakter').max(150),
  deskripsi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  lokasi: z.string().min(3, 'Lokasi minimal 3 karakter'),
  tanggalMulai: z.string().datetime({ message: 'Format tanggal mulai tidak valid' }),
  tanggalSelesai: z.string().datetime({ message: 'Format tanggal selesai tidak valid' }),
  kuota: z.coerce.number().min(0).default(0),
  kategori: z.string().min(2, 'Kategori minimal 2 karakter'),
  organizationId: z.string().min(1, 'ID Organisasi wajib diisi'),
  status: z.enum(['draft', 'published', 'selesai', 'dibatalkan']).default('draft'),
  gambarUrl: z.string().url('Format URL gambar tidak valid').optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const updateEventStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'selesai', 'dibatalkan']),
});

export const eventQuerySchema = z.object({
  kategori: z.string().optional(),
  lokasi: z.string().optional(),
  status: z.enum(['draft', 'published', 'selesai', 'dibatalkan']).optional(),
  organizationId: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type UpdateEventStatusInput = z.infer<typeof updateEventStatusSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;
