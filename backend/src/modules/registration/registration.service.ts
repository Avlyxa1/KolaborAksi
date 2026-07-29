import { prisma } from '../../config/prisma.js';
import { sendMail } from '../../utils/mailer.js';

export const createRegistration = async (eventId: string, userId: string, alasan?: string) => {
  // Check if event exists
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  if (event.status !== 'published') {
    throw new Error('Event belum dipublikasi atau sudah selesai');
  }

  // Check if user already registered
  const existingRegistration = await prisma.registration.findUnique({
    where: { eventId_userId: { eventId, userId } },
  });

  if (existingRegistration) {
    throw new Error('Anda sudah terdaftar di event ini');
  }

  // Check quota if event has quota
  if (event.kuota > 0) {
    const currentRegistrations = await prisma.registration.count({
      where: { eventId, status: 'approved' },
    });
    if (currentRegistrations >= event.kuota) {
      throw new Error('Kuota event sudah penuh');
    }
  }

  const registration = await prisma.registration.create({
    data: {
      eventId,
      userId,
      alasan,
      status: 'pending',
    },
    include: {
      event: true,
      user: {
        select: { id: true, nama: true, email: true },
      },
    },
  });

  return registration;
};

export const updateRegistrationStatus = async (registrationId: string, status: 'approved' | 'rejected') => {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      event: true,
      user: true,
    },
  });

  if (!registration) {
    throw new Error('Pendaftaran tidak ditemukan');
  }

  if (status === 'approved' && registration.event.kuota > 0) {
    const currentRegistrations = await prisma.registration.count({
      where: { eventId: registration.eventId, status: 'approved' },
    });
    if (currentRegistrations >= registration.event.kuota) {
      throw new Error('Kuota event sudah penuh');
    }
  }

  const updatedRegistration = await prisma.registration.update({
    where: { id: registrationId },
    data: { status },
  });

  // Kirim notifikasi email
  const subject = status === 'approved' 
    ? `Pendaftaran Diterima: ${registration.event.judul}` 
    : `Pendaftaran Ditolak: ${registration.event.judul}`;
    
  const html = `
    <h3>Halo ${registration.user.nama},</h3>
    <p>Status pendaftaran Anda untuk event <b>${registration.event.judul}</b> saat ini adalah: <b>${status.toUpperCase()}</b>.</p>
    <p>Terima kasih atas partisipasi Anda.</p>
  `;

  // Jangan di-await agar tidak memblokir response
  sendMail({
    to: registration.user.email,
    subject,
    html,
  }).catch((err) => console.error('Gagal mengirim notifikasi email:', err));

  return updatedRegistration;
};

export const getRegistrationsByEvent = async (eventId: string, organizationId: string) => {
  // Ensure the user owns the organization of this event
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organization: true },
  });

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  if (event.organization.ownerId !== organizationId) {
    throw new Error('Anda tidak memiliki akses ke event ini');
  }

  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, nama: true, email: true, photoUrl: true },
      },
      volunteerHour: true,
      certificate: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return registrations;
};

export const getMyRegistrations = async (userId: string, eventId?: string) => {
  const whereClause: any = { userId };
  if (eventId) {
    whereClause.eventId = eventId;
  }

  const registrations = await prisma.registration.findMany({
    where: whereClause,
    include: {
      event: {
        include: {
          organization: { select: { nama: true } }
        }
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return registrations;
};
