import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface CertificateData {
  recipientName: string;
  eventTitle: string;
  organizationName: string;
  volunteerHours: number;
  eventDate: string;
  certificateCode: string;
}

/**
 * Generates a professional-looking PDF certificate using pdf-lib.
 * Returns a Uint8Array (the raw PDF bytes).
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 landscape dimensions (595.28 x 841.89 for portrait → swap for landscape)
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Load fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color palette
  const primaryColor = rgb(0.13, 0.53, 0.96);     // #2187F5
  const darkColor = rgb(0.12, 0.14, 0.18);         // #1E2430
  const grayColor = rgb(0.42, 0.45, 0.5);          // #6B7380
  const accentColor = rgb(0.09, 0.43, 0.78);       // #176EC7
  const goldColor = rgb(0.8, 0.65, 0.2);           // Gold accent

  // ─── Decorative Border ───
  const borderMargin = 30;
  const borderWidth = 2;

  // Outer border
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: pageWidth - 2 * borderMargin,
    height: pageHeight - 2 * borderMargin,
    borderColor: primaryColor,
    borderWidth: borderWidth,
  });

  // Inner border
  page.drawRectangle({
    x: borderMargin + 8,
    y: borderMargin + 8,
    width: pageWidth - 2 * (borderMargin + 8),
    height: pageHeight - 2 * (borderMargin + 8),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  // ─── Top accent line ───
  page.drawRectangle({
    x: borderMargin,
    y: pageHeight - borderMargin - 6,
    width: pageWidth - 2 * borderMargin,
    height: 6,
    color: primaryColor,
  });

  // ─── Header: "SERTIFIKAT" ───
  const headerText = 'SERTIFIKAT';
  const headerFontSize = 38;
  const headerWidth = fontBold.widthOfTextAtSize(headerText, headerFontSize);
  page.drawText(headerText, {
    x: (pageWidth - headerWidth) / 2,
    y: pageHeight - 100,
    size: headerFontSize,
    font: fontBold,
    color: darkColor,
  });

  // ─── Subheader ───
  const subHeaderText = 'Partisipasi Kerelawanan';
  const subHeaderFontSize = 16;
  const subHeaderWidth = fontItalic.widthOfTextAtSize(subHeaderText, subHeaderFontSize);
  page.drawText(subHeaderText, {
    x: (pageWidth - subHeaderWidth) / 2,
    y: pageHeight - 128,
    size: subHeaderFontSize,
    font: fontItalic,
    color: grayColor,
  });

  // ─── Decorative line under header ───
  const lineY = pageHeight - 145;
  const lineWidth = 200;
  page.drawLine({
    start: { x: (pageWidth - lineWidth) / 2, y: lineY },
    end: { x: (pageWidth + lineWidth) / 2, y: lineY },
    thickness: 1.5,
    color: goldColor,
  });

  // ─── "Diberikan kepada" ───
  const givenToText = 'Diberikan kepada:';
  const givenToFontSize = 13;
  const givenToWidth = fontRegular.widthOfTextAtSize(givenToText, givenToFontSize);
  page.drawText(givenToText, {
    x: (pageWidth - givenToWidth) / 2,
    y: pageHeight - 185,
    size: givenToFontSize,
    font: fontRegular,
    color: grayColor,
  });

  // ─── Recipient name ───
  const nameFontSize = 32;
  const nameWidth = fontBold.widthOfTextAtSize(data.recipientName, nameFontSize);
  page.drawText(data.recipientName, {
    x: (pageWidth - nameWidth) / 2,
    y: pageHeight - 228,
    size: nameFontSize,
    font: fontBold,
    color: accentColor,
  });

  // ─── Underline below name ───
  const nameLineY = pageHeight - 238;
  const nameLineWidth = Math.max(nameWidth + 40, 300);
  page.drawLine({
    start: { x: (pageWidth - nameLineWidth) / 2, y: nameLineY },
    end: { x: (pageWidth + nameLineWidth) / 2, y: nameLineY },
    thickness: 1,
    color: rgb(0.85, 0.88, 0.92),
  });

  // ─── Description paragraph ───
  const descLine1 = `Atas partisipasinya sebagai relawan dalam kegiatan:`;
  const desc1FontSize = 12;
  const desc1Width = fontRegular.widthOfTextAtSize(descLine1, desc1FontSize);
  page.drawText(descLine1, {
    x: (pageWidth - desc1Width) / 2,
    y: pageHeight - 275,
    size: desc1FontSize,
    font: fontRegular,
    color: grayColor,
  });

  // ─── Event title ───
  const eventFontSize = 20;
  const eventTitleWidth = fontBold.widthOfTextAtSize(data.eventTitle, eventFontSize);
  page.drawText(data.eventTitle, {
    x: (pageWidth - eventTitleWidth) / 2,
    y: pageHeight - 305,
    size: eventFontSize,
    font: fontBold,
    color: darkColor,
  });

  // ─── Organization ───
  const orgLine = `Diselenggarakan oleh: ${data.organizationName}`;
  const orgFontSize = 12;
  const orgWidth = fontRegular.widthOfTextAtSize(orgLine, orgFontSize);
  page.drawText(orgLine, {
    x: (pageWidth - orgWidth) / 2,
    y: pageHeight - 332,
    size: orgFontSize,
    font: fontRegular,
    color: grayColor,
  });

  // ─── Details: hours & date ───
  const detailY = pageHeight - 375;
  const detailFontSize = 13;

  const hoursText = `Total Jam Kontribusi: ${data.volunteerHours} jam`;
  const hoursWidth = fontBold.widthOfTextAtSize(hoursText, detailFontSize);
  page.drawText(hoursText, {
    x: (pageWidth - hoursWidth) / 2 - 120,
    y: detailY,
    size: detailFontSize,
    font: fontBold,
    color: darkColor,
  });

  const dateText = `Tanggal Event: ${data.eventDate}`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateText, detailFontSize);
  page.drawText(dateText, {
    x: (pageWidth - dateWidth) / 2 + 120,
    y: detailY,
    size: detailFontSize,
    font: fontRegular,
    color: darkColor,
  });

  // ─── Bottom accent line ───
  page.drawRectangle({
    x: borderMargin,
    y: borderMargin,
    width: pageWidth - 2 * borderMargin,
    height: 6,
    color: primaryColor,
  });

  // ─── Certificate code ───
  const codeText = `Kode Sertifikat: ${data.certificateCode}`;
  const codeFontSize = 9;
  const codeWidth = fontRegular.widthOfTextAtSize(codeText, codeFontSize);
  page.drawText(codeText, {
    x: (pageWidth - codeWidth) / 2,
    y: borderMargin + 18,
    size: codeFontSize,
    font: fontRegular,
    color: grayColor,
  });

  // ─── Footer: KolaborAksi branding ───
  const footerText = 'KolaborAksi — Platform Kolaborasi Kerelawanan';
  const footerFontSize = 10;
  const footerWidth = fontItalic.widthOfTextAtSize(footerText, footerFontSize);
  page.drawText(footerText, {
    x: (pageWidth - footerWidth) / 2,
    y: borderMargin + 50,
    size: footerFontSize,
    font: fontItalic,
    color: grayColor,
  });

  return pdfDoc.save();
}
