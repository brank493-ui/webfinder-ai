import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

interface BriefData {
  [key: string]: any;
}

function generatePythonScript(brief: BriefData, outputPath: string): string {
  const sanitizeText = (text: any): string => {
    if (!text) return 'N/A';
    return String(text).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ');
  };

  const formatArray = (arr: any[]): string => {
    if (!arr || arr.length === 0) return 'None selected';
    return arr.map(item => String(item).replace(/_/g, ' ')).join(', ');
  };

  const formatBoolean = (val: boolean): string => val ? 'Yes' : 'No';

  return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from datetime import datetime
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

# Create document
doc = SimpleDocTemplate(
    '${outputPath}',
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

# Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Title'],
    fontName='Times New Roman',
    fontSize=24,
    spaceAfter=30,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#1E40AF')
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontName='Times New Roman',
    fontSize=14,
    spaceBefore=20,
    spaceAfter=10,
    textColor=colors.HexColor('#2563EB')
)

subheading_style = ParagraphStyle(
    'CustomSubheading',
    parent=styles['Heading3'],
    fontName='Times New Roman',
    fontSize=11,
    spaceBefore=10,
    spaceAfter=5,
    textColor=colors.HexColor('#3B82F6')
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontName='Times New Roman',
    fontSize=10,
    spaceBefore=3,
    spaceAfter=3,
    alignment=TA_JUSTIFY
)

label_style = ParagraphStyle(
    'CustomLabel',
    parent=styles['Normal'],
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.HexColor('#6B7280')
)

story = []

# Cover Page
story.append(Spacer(1, 2*cm))
story.append(Paragraph('<b>WEBSITE DEVELOPMENT BRIEF</b>', title_style))
story.append(Spacer(1, 1*cm))

# Business Name prominently
business_name = '${sanitizeText(brief.businessName)}'
story.append(Paragraph(f'<b>{business_name}</b>', ParagraphStyle(
    'BusinessName',
    fontName='Times New Roman',
    fontSize=20,
    alignment=TA_CENTER,
    spaceAfter=30,
    textColor=colors.HexColor('#1F2937')
)))

# Date
story.append(Paragraph(f'Generated: {datetime.now().strftime("%B %d, %Y")}', ParagraphStyle(
    'Date',
    fontName='Times New Roman',
    fontSize=11,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#6B7280')
)))

story.append(Spacer(1, 2*cm))

# Summary box
summary_data = [
    ['Industry', '${sanitizeText(brief.industry || brief.otherIndustry)}'],
    ['Contact', '${sanitizeText(brief.contactName)}'],
    ['Email', '${sanitizeText(brief.email)}'],
    ['Phone', '${sanitizeText(brief.phone)}'],
    ['Country', '${sanitizeText(brief.country)} - ${sanitizeText(brief.city)}'],
    ['Timeline', '${sanitizeText(brief.deadline)}'],
    ['Budget', '${sanitizeText(brief.budget)}'],
]

summary_table = Table(summary_data, colWidths=[4*cm, 10*cm])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#EFF6FF')),
    ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1F2937')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 10),
    ('FONTNAME', (0, 0), (0, -1), 'Times New Roman'),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(summary_table)

story.append(PageBreak())

# SECTION 1: BUSINESS INFORMATION
story.append(Paragraph('<b>1. BUSINESS INFORMATION</b>', heading_style))

story.append(Paragraph('<b>1.1 Basic Details</b>', subheading_style))
basic_data = [
    ['Business Name', '${sanitizeText(brief.businessName)}'],
    ['Legal Name', '${sanitizeText(brief.legalBusinessName)}'],
    ['Business Type', '${sanitizeText(brief.businessType)}'],
    ['Industry', '${sanitizeText(brief.industry || brief.otherIndustry)}'],
    ['Founding Year', '${sanitizeText(brief.foundingYear)}'],
    ['Employees', '${sanitizeText(brief.employeeCount)}'],
    ['Annual Revenue', '${sanitizeText(brief.annualRevenue)}'],
]
basic_table = Table(basic_data, colWidths=[4*cm, 12*cm])
basic_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(basic_table)
story.append(Spacer(1, 0.5*cm))

story.append(Paragraph('<b>1.2 Business Description</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.description)}', body_style))

if '${sanitizeText(brief.missionStatement)}' != 'N/A':
    story.append(Paragraph('<b>Mission Statement:</b>', label_style))
    story.append(Paragraph('${sanitizeText(brief.missionStatement)}', body_style))

if '${sanitizeText(brief.visionStatement)}' != 'N/A':
    story.append(Paragraph('<b>Vision Statement:</b>', label_style))
    story.append(Paragraph('${sanitizeText(brief.visionStatement)}', body_style))

story.append(Paragraph('<b>1.3 Target Audience</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.targetAudience)}', body_style))

target_data = [
    ['Age Range', '${sanitizeText(brief.targetAgeRange)}'],
    ['Location', '${sanitizeText(brief.targetLocation)}'],
    ['Income Level', '${sanitizeText(brief.targetIncome)}'],
]
target_table = Table(target_data, colWidths=[4*cm, 12*cm])
target_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(target_table)

story.append(Paragraph('<b>1.4 Goals and Differentiation</b>', subheading_style))
story.append(Paragraph('<b>Primary Goals:</b> ${sanitizeText(brief.primaryGoals)}', body_style))
story.append(Paragraph('<b>Unique Selling Proposition:</b> ${sanitizeText(brief.uniqueSelling)}', body_style))
story.append(Paragraph('<b>Competitive Advantage:</b> ${sanitizeText(brief.competitiveAdvantage)}', body_style))
story.append(Paragraph('<b>Brand Personality:</b> ${sanitizeText(brief.brandPersonality)}', body_style))

story.append(PageBreak())

# SECTION 2: CONTACT INFORMATION
story.append(Paragraph('<b>2. CONTACT INFORMATION</b>', heading_style))

contact_data = [
    ['Contact Name', '${sanitizeText(brief.contactName)}'],
    ['Position', '${sanitizeText(brief.contactPosition)}'],
    ['Primary Email', '${sanitizeText(brief.email)}'],
    ['Alternative Email', '${sanitizeText(brief.alternativeEmail)}'],
    ['Primary Phone', '${sanitizeText(brief.phone)}'],
    ['Alternative Phone', '${sanitizeText(brief.alternativePhone)}'],
    ['WhatsApp', '${sanitizeText(brief.whatsappNumber)}'],
    ['Preferred Contact', '${sanitizeText(brief.preferredContactMethod)}'],
    ['Best Time', '${sanitizeText(brief.bestTimeToContact)}'],
    ['Address', '${sanitizeText(brief.address)}, ${sanitizeText(brief.city)}, ${sanitizeText(brief.country)} ${sanitizeText(brief.postalCode)}'],
]
contact_table = Table(contact_data, colWidths=[4*cm, 12*cm])
contact_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(contact_table)

story.append(Paragraph('<b>2.1 Social Media and Online Presence</b>', subheading_style))
social_data = [
    ['Current Website', '${sanitizeText(brief.currentWebsite)}'],
    ['Facebook', '${sanitizeText(brief.facebook)}'],
    ['Instagram', '${sanitizeText(brief.instagram)}'],
    ['Twitter/X', '${sanitizeText(brief.twitter)}'],
    ['LinkedIn', '${sanitizeText(brief.linkedin)}'],
    ['YouTube', '${sanitizeText(brief.youtube)}'],
    ['TikTok', '${sanitizeText(brief.tiktok)}'],
    ['Other', '${sanitizeText(brief.otherSocial)}'],
]
social_table = Table(social_data, colWidths=[4*cm, 12*cm])
social_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(social_table)

story.append(PageBreak())

# SECTION 3: DESIGN AND PAGES
story.append(Paragraph('<b>3. DESIGN AND PAGES</b>', heading_style))

story.append(Paragraph('<b>3.1 Design Preferences</b>', subheading_style))
design_data = [
    ['Style', '${sanitizeText(brief.style)}'],
    ['Primary Color', '${sanitizeText(brief.primaryColor)}'],
    ['Secondary Color', '${sanitizeText(brief.secondaryColor)}'],
    ['Accent Color', '${sanitizeText(brief.accentColor)}'],
    ['Background Color', '${sanitizeText(brief.backgroundColor)}'],
    ['Font Preference', '${sanitizeText(brief.fontPreference)}'],
    ['Font Size', '${sanitizeText(brief.fontSizePreference)}'],
    ['Layout Style', '${sanitizeText(brief.layoutStyle)}'],
    ['Header Style', '${sanitizeText(brief.headerStyle)}'],
    ['Navigation Style', '${sanitizeText(brief.navigationStyle)}'],
    ['Animation', '${sanitizeText(brief.animationPreference)}'],
]
design_table = Table(design_data, colWidths=[4*cm, 12*cm])
design_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(design_table)

story.append(Paragraph('<b>3.2 Pages Selected</b>', subheading_style))
pages_selected = '${formatArray(brief.pagesNeeded)}'
story.append(Paragraph(pages_selected, body_style))

story.append(Paragraph('<b>3.3 Content Language</b>', subheading_style))
story.append(Paragraph('Primary: ${sanitizeText(brief.contentLanguage)}, Additional: ${sanitizeText(brief.additionalLanguages)}', body_style))

if '${sanitizeText(brief.slogan)}' != 'N/A':
    story.append(Paragraph('<b>Slogan:</b> ${sanitizeText(brief.slogan)}', body_style))
if '${sanitizeText(brief.tagline)}' != 'N/A':
    story.append(Paragraph('<b>Tagline:</b> ${sanitizeText(brief.tagline)}', body_style))

story.append(Paragraph('<b>3.4 Design Inspiration</b>', subheading_style))
story.append(Paragraph('<b>Websites Liked:</b> ${sanitizeText(brief.websitesYouLike)}', body_style))
story.append(Paragraph('<b>Websites Disliked:</b> ${sanitizeText(brief.websitesYouDislike)}', body_style))
story.append(Paragraph('<b>Additional Inspiration:</b> ${sanitizeText(brief.designInspiration)}', body_style))

story.append(PageBreak())

# SECTION 4: FEATURES AND FUNCTIONALITY
story.append(Paragraph('<b>4. FEATURES AND FUNCTIONALITY</b>', heading_style))

story.append(Paragraph('<b>4.1 Core Features</b>', subheading_style))
features_selected = '${formatArray(brief.mainFeatures)}'
story.append(Paragraph(features_selected, body_style))

story.append(Paragraph('<b>4.2 E-commerce Details</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.ecommerceNeeds)}', body_style))
story.append(Paragraph('<b>Payment Methods:</b> ${formatArray(brief.paymentMethods)}', body_style))
story.append(Paragraph('<b>Shipping Needs:</b> ${sanitizeText(brief.shippingNeeds)}', body_style))

story.append(Paragraph('<b>4.3 Booking and Membership</b>', subheading_style))
story.append(Paragraph('<b>Booking Type:</b> ${sanitizeText(brief.bookingType)}', body_style))
story.append(Paragraph('<b>Membership Type:</b> ${sanitizeText(brief.membershipType)}', body_style))

story.append(Paragraph('<b>4.4 User Accounts</b>', subheading_style))
story.append(Paragraph('<b>Enabled:</b> ${formatBoolean(brief.userAccounts)}', body_style))

story.append(Paragraph('<b>4.5 Special Requirements</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.specialFeatures)}', body_style))

story.append(PageBreak())

# SECTION 5: TECHNICAL REQUIREMENTS
story.append(Paragraph('<b>5. TECHNICAL REQUIREMENTS</b>', heading_style))

tech_data = [
    ['Domain Status', '${sanitizeText(brief.domainStatus)}'],
    ['Preferred Domain', '${sanitizeText(brief.preferredDomain)}'],
    ['Current Hosting', '${sanitizeText(brief.currentHosting)}'],
    ['Hosting Preference', '${sanitizeText(brief.hostingPreference)}'],
    ['SSL Required', '${formatBoolean(brief.sslRequired)}'],
    ['CDN Required', '${formatBoolean(brief.cdnRequired)}'],
    ['Backup Frequency', '${sanitizeText(brief.backupFrequency)}'],
]
tech_table = Table(tech_data, colWidths=[4*cm, 12*cm])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(tech_table)

story.append(Paragraph('<b>5.1 Security and Performance</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.securityRequirements)}', body_style))
story.append(Paragraph('<b>Performance Requirements:</b> ${sanitizeText(brief.performanceRequirements)}', body_style))

story.append(Paragraph('<b>5.2 Browser Support</b>', subheading_style))
story.append(Paragraph('${formatArray(brief.browserSupport)}', body_style))

story.append(Paragraph('<b>5.3 Device Support</b>', subheading_style))
story.append(Paragraph('${formatArray(brief.deviceSupport)}', body_style))

story.append(Paragraph('<b>5.4 Integrations</b>', subheading_style))
story.append(Paragraph('${formatArray(brief.integrationNeeds)}', body_style))
story.append(Paragraph('<b>API Requirements:</b> ${sanitizeText(brief.apiRequirements)}', body_style))

story.append(PageBreak())

# SECTION 6: SEO AND MARKETING
story.append(Paragraph('<b>6. SEO AND MARKETING</b>', heading_style))

seo_data = [
    ['SEO Level', '${sanitizeText(brief.seoLevel)}'],
    ['Target Keywords', '${sanitizeText(brief.targetKeywords)}'],
    ['Local SEO', '${formatBoolean(brief.localSeo)}'],
    ['Google Business Profile', '${sanitizeText(brief.googleBusinessProfile)}'],
    ['Analytics Platform', '${sanitizeText(brief.analyticsPreference)}'],
    ['Newsletter Integration', '${formatBoolean(brief.newsletterIntegration)}'],
    ['CRM Integration', '${sanitizeText(brief.crmIntegration)}'],
    ['Marketing Automation', '${sanitizeText(brief.marketingAutomation)}'],
]
seo_table = Table(seo_data, colWidths=[4*cm, 12*cm])
seo_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(seo_table)

story.append(PageBreak())

# SECTION 7: BRAND ASSETS
story.append(Paragraph('<b>7. BRAND ASSETS</b>', heading_style))

assets_data = [
    ['Logo Available', '${formatBoolean(brief.hasLogo)}'],
    ['Logo Format', '${sanitizeText(brief.logoFormat)}'],
    ['Brand Guidelines', '${formatBoolean(brief.hasBrandGuidelines)}'],
    ['Brand Colors', '${sanitizeText(brief.brandColors)}'],
    ['Brand Fonts', '${sanitizeText(brief.brandFonts)}'],
    ['Images Available', '${formatBoolean(brief.hasImages)}'],
    ['Image Count', '${sanitizeText(brief.imageCount)}'],
    ['Videos Available', '${formatBoolean(brief.hasVideos)}'],
    ['Video Links', '${sanitizeText(brief.videoLinks)}'],
    ['Content Ready', '${formatBoolean(brief.hasContent)}'],
    ['Content Format', '${sanitizeText(brief.contentFormat)}'],
    ['Testimonials', '${formatBoolean(brief.hasTestimonials)}'],
    ['Case Studies', '${formatBoolean(brief.hasCaseStudies)}'],
]
assets_table = Table(assets_data, colWidths=[4*cm, 12*cm])
assets_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(assets_table)

story.append(PageBreak())

# SECTION 8: COMPETITOR ANALYSIS
story.append(Paragraph('<b>8. COMPETITOR ANALYSIS</b>', heading_style))

story.append(Paragraph('<b>8.1 Main Competitors</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.mainCompetitors)}', body_style))

story.append(Paragraph('<b>8.2 Competitor Websites</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.competitorWebsites)}', body_style))

story.append(Paragraph('<b>8.3 Competitor Strengths</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.competitorStrengths)}', body_style))

story.append(Paragraph('<b>8.4 Competitor Weaknesses</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.competitorWeaknesses)}', body_style))

story.append(Paragraph('<b>8.5 Differentiation Strategy</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.differentiationStrategy)}', body_style))

story.append(PageBreak())

# SECTION 9: TIMELINE AND BUDGET
story.append(Paragraph('<b>9. TIMELINE AND BUDGET</b>', heading_style))

timeline_data = [
    ['Deadline', '${sanitizeText(brief.deadline)}'],
    ['Launch Date', '${sanitizeText(brief.launchDate)}'],
    ['Budget Range', '${sanitizeText(brief.budget)}'],
    ['Payment Preference', '${sanitizeText(brief.paymentPreference)}'],
    ['Milestones', '${sanitizeText(brief.milestones)}'],
]
timeline_table = Table(timeline_data, colWidths=[4*cm, 12*cm])
timeline_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F9FAFB')),
    ('FONTNAME', (0, 0), (-1, -1), 'Times New Roman'),
    ('FONTSIZE', (0, 0), (-1, -1), 9),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
]))
story.append(timeline_table)

story.append(Paragraph('<b>9.1 Requirements Priority</b>', subheading_style))
story.append(Paragraph('<b>Must-Haves:</b> ${sanitizeText(brief.mustHaves)}', body_style))
story.append(Paragraph('<b>Nice-to-Haves:</b> ${sanitizeText(brief.niceToHaves)}', body_style))
story.append(Paragraph('<b>Deal Breakers:</b> ${sanitizeText(brief.dealBreakers)}', body_style))

story.append(Paragraph('<b>9.2 Success Metrics</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.successMetrics)}', body_style))

story.append(Paragraph('<b>9.3 Long-term Plans</b>', subheading_style))
story.append(Paragraph('<b>Maintenance Plan:</b> ${sanitizeText(brief.maintenancePlan)}', body_style))
story.append(Paragraph('<b>Training Needs:</b> ${sanitizeText(brief.trainingNeeds)}', body_style))
story.append(Paragraph('<b>Long-term Vision:</b> ${sanitizeText(brief.longTermVision)}', body_style))

story.append(Paragraph('<b>9.4 Previous Website Issues</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.previousWebsiteIssues)}', body_style))

story.append(Paragraph('<b>9.5 Additional Notes</b>', subheading_style))
story.append(Paragraph('${sanitizeText(brief.additionalNotes)}', body_style))

# Footer
story.append(Spacer(1, 1*cm))
story.append(Paragraph('_' * 60, ParagraphStyle('Line', alignment=TA_CENTER)))
story.append(Spacer(1, 0.3*cm))
story.append(Paragraph('This brief was generated by WebFinder AI', ParagraphStyle(
    'Footer',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#6B7280')
)))
story.append(Paragraph('Contact: brank493@gmail.com | +237 693 401 619', ParagraphStyle(
    'FooterContact',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER,
    textColor=colors.HexColor('#6B7280')
)))

# Build PDF
doc.build(story)
print('PDF generated successfully')
`;
}

export async function POST(request: NextRequest) {
  try {
    const brief = await request.json();

    // Create temporary Python script
    const timestamp = Date.now();
    const scriptPath = path.join('/tmp', `brief_${timestamp}.py`);
    const outputPath = path.join('/tmp', `brief_${timestamp}.pdf`);

    const pythonScript = generatePythonScript(brief, outputPath);

    // Write Python script to temp file
    await writeFile(scriptPath, pythonScript, 'utf-8');

    // Execute Python script
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}"`, {
      timeout: 60000,
    });

    if (stderr && !stderr.includes('PDF generated successfully')) {
      console.error('Python stderr:', stderr);
    }

    // Read the generated PDF
    const pdfBuffer = await readFile(outputPath);

    // Clean up temp files
    await unlink(scriptPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="website-brief-${brief.businessName || 'project'}-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}
