import prisma from '../../config/prisma.js';
import type {
  CreateEventInput,
  UpdateEventInput,
  UpdateEventStatusInput,
  EventQueryInput,
} from './event.schema.js';
import { Prisma } from '@prisma/client';

export async function createEvent(input: CreateEventInput, userId: string) {
  // Check if organization exists and if the user is the owner
  const org = await prisma.organization.findUnique({
    where: { id: input.organizationId },
  });

  if (!org) {
    throw new Error('Organisasi tidak ditemukan');
  }

  // Allow admin (owner) to create event. In future, maybe panitia as well.
  if (org.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk membuat event di organisasi ini');
  }

  return await prisma.event.create({
    data: input,
  });
}

export async function getEvents(query: EventQueryInput) {
  const whereClause: Prisma.EventWhereInput = {};

  if (query.kategori) {
    whereClause.kategori = { contains: query.kategori, mode: 'insensitive' };
  }
  if (query.lokasi) {
    whereClause.lokasi = { contains: query.lokasi, mode: 'insensitive' };
  }
  if (query.status) {
    whereClause.status = query.status;
  }
  if (query.organizationId) {
    whereClause.organizationId = query.organizationId;
  }

  return await prisma.event.findMany({
    where: whereClause,
    include: {
      organization: {
        select: { id: true, nama: true, logoUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organization: {
        select: { id: true, nama: true, logoUrl: true, ownerId: true },
      },
    },
  });

  if (!event) {
    throw new Error('Event tidak ditemukan');
  }

  return event;
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput,
  userId: string,
) {
  const event = await getEventById(id);

  if (event.organization.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk mengubah event ini');
  }

  return await prisma.event.update({
    where: { id },
    data: input,
  });
}

export async function updateEventStatus(
  id: string,
  input: UpdateEventStatusInput,
  userId: string,
) {
  const event = await getEventById(id);

  if (event.organization.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk mengubah status event ini');
  }

  return await prisma.event.update({
    where: { id },
    data: { status: input.status },
  });
}

export async function deleteEvent(id: string, userId: string) {
  const event = await getEventById(id);

  if (event.organization.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk menghapus event ini');
  }

  return await prisma.event.delete({
    where: { id },
  });
}
