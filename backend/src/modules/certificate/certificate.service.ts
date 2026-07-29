import { prisma } from '../../config/prisma.js';
import { randomBytes } from 'crypto';

/**
 * Generate a unique certificate code (e.g., KA-XXXXXXXX).
 */
function generateCertificateCode(): string {
  const hex = randomBytes(4).toString('hex').toUpperCase();
  return `KA-${hex}`;
}

/**
 * Create a certificate record for a registration after hours verification.
 * Called internally by volunteerHour.service after successful verification.
 */
export const createCertificateForRegistration = async (
  registration: {
    id: string;
    userId: string;
    eventId: string;
  },
) => {
  const certificateCode = generateCertificateCode();

  const certificate = await prisma.certificate.create({
    data: {
      userId: registration.userId,
      eventId: registration.eventId,
      registrationId: registration.id,
      certificateCode,
    },
  });

  return certificate;
};

/**
 * Get all certificates belonging to the authenticated user.
 */
export const getMyCertificates = async (userId: string) => {
  return prisma.certificate.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          judul: true,
          lokasi: true,
          tanggalMulai: true,
          tanggalSelesai: true,
          kategori: true,
          organization: {
            select: { nama: true },
          },
        },
      },
      registration: {
        include: {
          volunteerHour: {
            select: { jumlahJam: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get a specific certificate by ID. Validates ownership.
 */
export const getCertificateById = async (certificateId: string, userId: string) => {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: { select: { nama: true, email: true } },
      event: {
        select: {
          judul: true,
          lokasi: true,
          tanggalMulai: true,
          tanggalSelesai: true,
          organization: {
            select: { nama: true },
          },
        },
      },
      registration: {
        include: {
          volunteerHour: {
            select: { jumlahJam: true },
          },
        },
      },
    },
  });

  if (!certificate) {
    throw new Error('Sertifikat tidak ditemukan');
  }

  if (certificate.userId !== userId) {
    throw new Error('Anda tidak memiliki akses ke sertifikat ini');
  }

  return certificate;
};
