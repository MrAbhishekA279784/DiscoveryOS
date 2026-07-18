import { jsPDF } from 'jspdf';
import { FileItem, PainPoint, KpiItem, Recommendation } from '../types';

interface PDFExportData {
  workspace: string;
  activeDateRange: string;
  kpis: KpiItem[];
  painPoints: PainPoint[];
  sentimentData: { name: string; value: number; percentage: number; color: string }[];
  recommendations: Recommendation[];
  uploadedFilesCount: number;
}

// Convert Hex to RGB for safe drawing in jsPDF
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b,
  };
}

export function generateDashboardPDF(data: PDFExportData) {
  // Create an A4 PDF document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const cPrimary = '#8B5CF6'; // Violet
  const cPrimaryRGB = hexToRgb(cPrimary);
  const cDark = '#0F172A'; // Dark slate
  const cDarkRGB = hexToRgb(cDark);
  const cMuted = '#64748B'; // Gray
  const cMutedRGB = hexToRgb(cMuted);
  const cBgLight = '#F8FAFC'; // Card BG
  const cBorder = '#E2E8F0'; // Card Border

  // 1. TOP BRAND ACCENT BAR
  doc.setFillColor(cPrimaryRGB.r, cPrimaryRGB.g, cPrimaryRGB.b);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // 2. HEADER SECTION
  let y = 18;

  // Title / Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  doc.text('DiscoveryOS', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(cPrimaryRGB.r, cPrimaryRGB.g, cPrimaryRGB.b);
  doc.text('PRODUCT INTELLIGENCE ENGINE', margin, y + 4.5);

  // Metadata right-aligned
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
  
  const rightAlignX = pageWidth - margin;
  doc.text(`Workspace: ${data.workspace || 'StadiumIQ'}`, rightAlignX, y, { align: 'right' });
  doc.text(`Date Range: ${data.activeDateRange || 'Last 7 Days'}`, rightAlignX, y + 4.5, { align: 'right' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, rightAlignX, y + 9, { align: 'right' });

  // Divider Line
  y += 13;
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  // 3. KPI SECTION
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  doc.text('EXECUTIVE KEY METRICS', margin, y);

  y += 4.5;
  const cardWidth = (contentWidth - 9) / 4; // 180 - 9 = 171 / 4 = 42.75mm
  const cardHeight = 22;

  const kpiMap = data.kpis && data.kpis.length > 0 ? data.kpis : [
    { title: 'Total Feedback', value: '1,284', change: '12.5%', isPositive: true, type: 'feedback' },
    { title: 'Pain Points', value: '32', change: '8.3%', isPositive: true, type: 'painpoints' },
    { title: 'AI Accuracy', value: '96%', change: '4.2%', isPositive: true, type: 'accuracy' },
    { title: 'Avg. Response Time', value: '1.2s', change: '-0.3s', isPositive: true, type: 'responsetime' }
  ];

  kpiMap.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    
    // Draw background rect
    doc.setFillColor(248, 250, 252); // #F8FAFC
    doc.rect(cardX, y, cardWidth, cardHeight, 'F');
    
    // Draw card border
    doc.setDrawColor(226, 232, 240); // #E2E8F0
    doc.setLineWidth(0.2);
    doc.rect(cardX, y, cardWidth, cardHeight, 'S');

    // Draw left indicator stripe
    let stripeColor = { r: 139, g: 92, b: 246 }; // violet
    if (kpi.type === 'painpoints') stripeColor = { r: 59, g: 130, b: 246 }; // blue
    if (kpi.type === 'accuracy') stripeColor = { r: 16, g: 185, b: 129 }; // emerald
    if (kpi.type === 'responsetime') stripeColor = { r: 245, g: 158, b: 11 }; // amber

    doc.setFillColor(stripeColor.r, stripeColor.g, stripeColor.b);
    doc.rect(cardX, y, 2.5, cardHeight, 'F');

    // Text content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
    doc.text(kpi.title, cardX + 5, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
    doc.text(kpi.value, cardX + 5, y + 12);

    // Trend
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    
    const isResponseTime = kpi.type === 'responsetime';
    const trendText = `${isResponseTime ? '↓' : '↑'} ${kpi.change}`;
    const trendColor = isResponseTime ? { r: 34, g: 197, b: 94 } : stripeColor;

    doc.setTextColor(trendColor.r, trendColor.g, trendColor.b);
    doc.text(trendText, cardX + 5, y + 17.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
    doc.text(' vs last 7d', cardX + 5 + doc.getTextWidth(trendText), y + 17.5);
  });

  // 4. TWO COLUMN SECTION (PAIN POINTS & SENTIMENT)
  y += cardHeight + 9;

  const colWidth = (contentWidth - 6) / 2; // 87mm each
  const colHeight = 85;

  // Draw Pain Points Column Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  doc.text('TOP CUSTOMER PAIN POINTS', margin, y);

  // Draw Sentiment Column Header
  doc.text('SENTIMENT METRIC PROFILE', margin + colWidth + 6, y);

  y += 4.5;
  const sectionStartY = y;

  // --- COLUMN 1: PAIN POINTS ---
  const points = data.painPoints && data.painPoints.length > 0 ? data.painPoints : [
    { id: '1', name: 'Offline Mode', count: 432, percentage: 33.6 },
    { id: '2', name: 'Dark Mode', count: 310, percentage: 24.1 },
    { id: '3', name: 'Navigation Issues', count: 220, percentage: 17.1 },
    { id: '4', name: 'Seat Search', count: 158, percentage: 12.3 },
    { id: '5', name: 'Price Transparency', count: 96, percentage: 7.5 },
    { id: '6', name: 'Language Support', count: 68, percentage: 5.4 }
  ];

  // Draw background for Column 1
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, colWidth, colHeight, 'FD');

  let col1Y = y + 6;
  points.forEach((point) => {
    // Label & count
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
    doc.text(point.name, margin + 5, col1Y);

    const percentStr = `${point.count} (${point.percentage}%)`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
    doc.text(percentStr, margin + colWidth - 5, col1Y, { align: 'right' });

    col1Y += 3;
    // Draw Progress Bar track
    doc.setFillColor(241, 245, 249); // #F1F5F9
    doc.rect(margin + 5, col1Y, colWidth - 10, 2.2, 'F');

    // Fill progress bar (proportional)
    const maxBarWidth = colWidth - 10;
    const fillWidth = (point.percentage / 100) * maxBarWidth;
    doc.setFillColor(139, 92, 246); // #8B5CF6
    doc.rect(margin + 5, col1Y, fillWidth, 2.2, 'F');

    col1Y += 9.5;
  });

  // --- COLUMN 2: SENTIMENT ---
  const col2X = margin + colWidth + 6;
  doc.setFillColor(255, 255, 255);
  doc.rect(col2X, y, colWidth, colHeight, 'FD');

  let col2Y = y + 7;
  const sData = data.sentimentData && data.sentimentData.length > 0 ? data.sentimentData : [
    { name: 'Positive', value: 512, percentage: 39.9, color: '#22C55E' },
    { name: 'Neutral', value: 423, percentage: 32.9, color: '#F59E0B' },
    { name: 'Negative', value: 278, percentage: 21.7, color: '#EF4444' },
    { name: 'Mixed', value: 71, percentage: 5.5, color: '#A855F7' }
  ];

  // Draw horizontal multi-segmented bar representing sentiment
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  doc.text('Sentiment Distribution Ratio', col2X + 5, col2Y);

  col2Y += 3.5;
  const barWidth = colWidth - 10;
  const barHeight = 6;
  let currentSegmentX = col2X + 5;

  sData.forEach((slice) => {
    const sliceWidth = (slice.percentage / 100) * barWidth;
    const sliceRGB = hexToRgb(slice.color);
    doc.setFillColor(sliceRGB.r, sliceRGB.g, sliceRGB.b);
    doc.rect(currentSegmentX, col2Y, sliceWidth, barHeight, 'F');
    currentSegmentX += sliceWidth;
  });

  col2Y += barHeight + 7;

  // Sentiment Details Grid
  sData.forEach((slice, idx) => {
    const rowX = col2X + 5 + (idx % 2) * (barWidth / 2);
    const rowY = col2Y + Math.floor(idx / 2) * 11;

    // Draw solid color indicator dot
    const sliceRGB = hexToRgb(slice.color);
    doc.setFillColor(sliceRGB.r, sliceRGB.g, sliceRGB.b);
    doc.circle(rowX + 2, rowY + 1.2, 1.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
    doc.text(slice.name, rowX + 6, rowY + 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
    doc.text(`${slice.value} units (${slice.percentage}%)`, rowX + 6, rowY + 5.5);
  });

  // Discovery AI Summary Callout Box in col 2
  col2Y += 25;
  doc.setFillColor(243, 232, 255); // Light violet tint
  doc.rect(col2X + 5, col2Y, barWidth, 23, 'F');
  
  doc.setFillColor(139, 92, 246); // Purple bar
  doc.rect(col2X + 5, col2Y, 2, 23, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(139, 92, 246);
  doc.text('DISCOVERY AI INSIGHT', col2X + 10, col2Y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  const insightText = 'Feedback shows critical friction on "Offline Mode" representing 33.6% of user complaints. Promoting early sync hooks & localized DB architecture will mitigate up to 80% of customer tickets.';
  const textLines = doc.splitTextToSize(insightText, barWidth - 10);
  doc.text(textLines, col2X + 10, col2Y + 8.5);


  // 5. AI RECOMMENDATIONS & STRATEGY
  y = sectionStartY + colHeight + 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
  doc.text('AI STRATEGIC PRIORITIES & RECOMMENDATIONS', margin, y);

  y += 4.5;
  const recWidth = contentWidth; // 180mm
  const recHeight = 15;

  const recs = data.recommendations && data.recommendations.length > 0 ? data.recommendations : [
    { id: 'r1', title: 'Prioritize Offline Mode', freqImpact: 'High frequency + High impact', confidence: 94 },
    { id: 'r2', title: 'Improve Navigation Flow', freqImpact: 'Medium frequency + High impact', confidence: 78 },
    { id: 'r3', title: 'Add Dark Mode Support', freqImpact: 'High frequency + Medium impact', confidence: 71 }
  ];

  recs.forEach((rec, idx) => {
    const recY = y + idx * (recHeight + 2.5);

    // Background card
    doc.setFillColor(248, 250, 252); // #F8FAFC
    doc.rect(margin, recY, recWidth, recHeight, 'F');
    
    // Card border
    doc.setDrawColor(226, 232, 240); // #E2E8F0
    doc.setLineWidth(0.25);
    doc.rect(margin, recY, recWidth, recHeight, 'S');

    // Left purple stripe
    doc.setFillColor(139, 92, 246);
    doc.rect(margin, recY, 2, recHeight, 'F');

    // Recommendation Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(cDarkRGB.r, cDarkRGB.g, cDarkRGB.b);
    doc.text(rec.title, margin + 5, recY + 5.5);

    // Impact Category
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
    doc.text(rec.freqImpact, margin + 5, recY + 10.5);

    // Confidence badge on right
    const rightSideX = pageWidth - margin - 5;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 185, 129); // emerald
    const confStr = `${rec.confidence}% Confidence`;
    doc.text(confStr, rightSideX, recY + 5.5, { align: 'right' });

    // Little inline gauge
    const inlineGaugeWidth = 40;
    const inlineGaugeX = rightSideX - inlineGaugeWidth;
    const inlineGaugeY = recY + 8.5;

    // Track
    doc.setFillColor(226, 232, 240);
    doc.rect(inlineGaugeX, inlineGaugeY, inlineGaugeWidth, 2, 'F');

    // Filled
    const fillWidth = (rec.confidence / 100) * inlineGaugeWidth;
    doc.setFillColor(16, 185, 129);
    doc.rect(inlineGaugeX, inlineGaugeY, fillWidth, 2, 'F');
  });

  // 6. DOCUMENT FOOTER
  const footerY = pageHeight - margin + 2;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(cMutedRGB.r, cMutedRGB.g, cMutedRGB.b);
  doc.text('DiscoveryOS Executive Intelligence Summary  •  StadiumIQ Workspace', margin, footerY);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CONFIDENTIAL - INTERNAL PRODUCT BRIEFING', pageWidth / 2, footerY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const filename = `DiscoveryOS_Executive_Summary_${newDateString()}.pdf`;
  doc.save(filename);
}

// Helper to get formatted filename date
function newDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
