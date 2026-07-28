import prisma from '../../config/prisma.js';
import type { CreateOrganizationInput, UpdateOrganizationInput } from './organization.schema.js';

export async function createOrganization(input: CreateOrganizationInput, ownerId: string) {
  return await prisma.organization.create({
    data: {
      ...input,
      ownerId,
    },
  });
}

export async function getOrganizations() {
  return await prisma.organization.findMany({
    include: {
      owner: {
        select: { id: true, nama: true, email: true, photoUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getOrganizationById(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, nama: true, email: true, photoUrl: true },
      },
    },
  });

  if (!org) {
    throw new Error('Organisasi tidak ditemukan');
  }

  return org;
}

export async function updateOrganization(id: string, input: UpdateOrganizationInput, userId: string) {
  const org = await getOrganizationById(id);
  
  // Asumsi ownerId adalah pembuat dan admin satu-satunya
  if (org.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk mengubah organisasi ini');
  }

  return await prisma.organization.update({
    where: { id },
    data: input,
  });
}

export async function deleteOrganization(id: string, userId: string) {
  const org = await getOrganizationById(id);

  if (org.ownerId !== userId) {
    throw new Error('Anda tidak memiliki akses untuk menghapus organisasi ini');
  }

  return await prisma.organization.delete({
    where: { id },
  });
}
