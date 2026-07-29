import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/responseHelper.js';
import * as certificateService from './certificate.service.js';
import { generateCertificatePdf } from './pdf.service.js';

/**
 * GET /api/certificates
 * Get all certificates belonging to the authenticated user.
 */
export const getMyCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as Request & { userId: string }).userId;
    const certificates = await certificateService.getMyCertificates(userId);
    sendSuccess(res, certificates, 'Berhasil mengambil daftar sertifikat');
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengambil daftar sertifikat', 400);
  }
};

/**
 * GET /api/certificates/:id/download
 * Generate and download a certificate PDF on the fly.
 */
export const downloadCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as Request & { userId: string }).userId;

    const certificate = await certificateService.getCertificateById(id as string, userId);

    // Format date for display
    const eventDate = new Date(certificate.event.tanggalMulai).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const pdfBytes = await generateCertificatePdf({
      recipientName: certificate.user.nama,
      eventTitle: certificate.event.judul,
      organizationName: certificate.event.organization.nama,
      volunteerHours: certificate.registration.volunteerHour?.jumlahJam ?? 0,
      eventDate,
      certificateCode: certificate.certificateCode,
    });

    // Set headers for PDF download
    const fileName = `Sertifikat-${certificate.event.judul.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBytes.length);
    res.end(Buffer.from(pdfBytes));
  } catch (error: any) {
    sendError(res, error.message || 'Gagal mengunduh sertifikat', 400);
  }
};
