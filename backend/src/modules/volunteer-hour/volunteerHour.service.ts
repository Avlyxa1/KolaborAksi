import { prisma } from '../../config/prisma.js';
import { createCertificateForRegistration } from '../certificate/certificate.service.js';

/**
 * Input or update volunteer hours for a registration, then verify them.
 * Automatically generates a certificate once hours are verified.
 */
export const verifyVolunteerHours = async (
  registrationId: string,
  jumlahJam: number,
  requestingUserId: string,
  catatan?: string,
) => {
  // 1. Ensure registration exists and is approved
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      event: { include: { organization: true } },
      volunteerHour: true,
      certificate: true,
    },
  });

  if (!registration) {
    throw new Error('Pendaftaran tidak ditemukan');
  }

  if (registration.status !== 'approved') {
    throw new Error('Hanya pendaftaran yang sudah disetujui yang bisa diverifikasi jam kontribusinya');
  }

  // 2. Check that the requesting user is the organization owner (panitia/admin)
  if (registration.event.organization.ownerId !== requestingUserId) {
    throw new Error('Anda tidak memiliki akses untuk memverifikasi jam kontribusi event ini');
  }

  // 3. Upsert volunteer hour record and set status to verified
  const volunteerHour = await prisma.volunteerHour.upsert({
    where: { registrationId },
    create: {
      registrationId,
      jumlahJam,
      catatan,
      status: 'verified',
    },
    update: {
      jumlahJam,
      catatan,
      status: 'verified',
    },
  });

  // 4. Auto-generate certificate if one doesn't exist yet
  if (!registration.certificate) {
    await createCertificateForRegistration(registration);
  }

  return volunteerHour;
};

/**
 * Get volunteer hour record for a specific registration.
 */
export const getVolunteerHourByRegistration = async (registrationId: string) => {
  return prisma.volunteerHour.findUnique({
    where: { registrationId },
  });
};
