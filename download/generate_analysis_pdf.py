from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
import os

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('Microsoft YaHei', '/usr/share/fonts/truetype/chinese/msyh.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('Microsoft YaHei', normal='Microsoft YaHei', bold='Microsoft YaHei')

# Create document
pdf_path = "/home/z/my-project/download/AI_Business_Discovery_Platform_Analysis.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    title="AI_Business_Discovery_Platform_Analysis",
    author="Z.ai",
    creator="Z.ai",
    subject="Comprehensive analysis of AI-powered business discovery and website development platform"
)

# Define styles
styles = getSampleStyleSheet()

# Custom styles
cover_title_style = ParagraphStyle(
    name='CoverTitle',
    fontName='Times New Roman',
    fontSize=36,
    leading=44,
    alignment=TA_CENTER,
    spaceAfter=36
)

cover_subtitle_style = ParagraphStyle(
    name='CoverSubtitle',
    fontName='Times New Roman',
    fontSize=18,
    leading=26,
    alignment=TA_CENTER,
    spaceAfter=48
)

h1_style = ParagraphStyle(
    name='H1Style',
    fontName='Times New Roman',
    fontSize=20,
    leading=28,
    alignment=TA_LEFT,
    spaceBefore=24,
    spaceAfter=12,
    textColor=colors.HexColor('#1F4E79')
)

h2_style = ParagraphStyle(
    name='H2Style',
    fontName='Times New Roman',
    fontSize=16,
    leading=22,
    alignment=TA_LEFT,
    spaceBefore=18,
    spaceAfter=8,
    textColor=colors.HexColor('#2E75B6')
)

h3_style = ParagraphStyle(
    name='H3Style',
    fontName='Times New Roman',
    fontSize=13,
    leading=18,
    alignment=TA_LEFT,
    spaceBefore=12,
    spaceAfter=6,
    textColor=colors.HexColor('#404040')
)

body_style = ParagraphStyle(
    name='BodyStyle',
    fontName='Times New Roman',
    fontSize=11,
    leading=16,
    alignment=TA_JUSTIFY,
    spaceBefore=6,
    spaceAfter=6
)

code_style = ParagraphStyle(
    name='CodeStyle',
    fontName='Times New Roman',
    fontSize=9,
    leading=12,
    alignment=TA_LEFT,
    leftIndent=20,
    backColor=colors.HexColor('#F5F5F5'),
    spaceBefore=8,
    spaceAfter=8
)

table_header_style = ParagraphStyle(
    name='TableHeader',
    fontName='Times New Roman',
    fontSize=10,
    textColor=colors.white,
    alignment=TA_CENTER
)

table_cell_style = ParagraphStyle(
    name='TableCell',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_LEFT
)

table_cell_center = ParagraphStyle(
    name='TableCellCenter',
    fontName='Times New Roman',
    fontSize=9,
    textColor=colors.black,
    alignment=TA_CENTER
)

# Build story
story = []

# Cover Page
story.append(Spacer(1, 120))
story.append(Paragraph("<b>AI-Powered Business Discovery</b>", cover_title_style))
story.append(Paragraph("<b>&amp; Website Development Platform</b>", cover_title_style))
story.append(Spacer(1, 36))
story.append(Paragraph("Comprehensive Analysis Report", cover_subtitle_style))
story.append(Spacer(1, 24))
story.append(Paragraph("Properties, Implications &amp; Functionalities", ParagraphStyle(
    name='CoverDesc',
    fontName='Times New Roman',
    fontSize=14,
    leading=20,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 72))
story.append(Paragraph("Prepared by Z.ai", ParagraphStyle(
    name='CoverAuthor',
    fontName='Times New Roman',
    fontSize=12,
    leading=18,
    alignment=TA_CENTER
)))
story.append(Paragraph("2025", ParagraphStyle(
    name='CoverDate',
    fontName='Times New Roman',
    fontSize=12,
    leading=18,
    alignment=TA_CENTER
)))
story.append(PageBreak())

# Table of Contents
story.append(Paragraph("<b>Table of Contents</b>", h1_style))
story.append(Spacer(1, 12))
toc_items = [
    ("1. Executive Summary", "Overview of the platform concept"),
    ("2. Core Architecture &amp; System Properties", "Technical foundation and scalability"),
    ("3. Google Maps Integration &amp; Business Discovery", "Step-by-step discovery process"),
    ("4. AI Agent Communication Workflow", "Outreach and conversation management"),
    ("5. Pricing Tiers &amp; Proposal System", "Package structure and features"),
    ("6. Payment Integration System", "Bank and mobile money integration"),
    ("7. Workspace Creation &amp; Development Workflow", "Project management system"),
    ("8. Legal, Ethical &amp; Technical Implications", "Compliance and challenges"),
    ("9. Technology Stack Recommendations", "Frontend, backend, and services"),
    ("10. Implementation Roadmap", "Phased development plan")
]
for item, desc in toc_items:
    story.append(Paragraph(f"<b>{item}</b> - {desc}", body_style))
story.append(PageBreak())

# Section 1: Executive Summary
story.append(Paragraph("<b>1. Executive Summary</b>", h1_style))
story.append(Paragraph(
    "This document provides a comprehensive analysis of an AI-powered business discovery and website development platform. "
    "The platform represents an innovative approach to identifying businesses without online presence and offering them "
    "professional website development services through an automated, AI-driven process. The system integrates multiple "
    "complex technologies including Google Maps API for business discovery, Large Language Models for intelligent communication, "
    "payment gateways supporting both traditional banking and African mobile money services, and a collaborative workspace "
    "for website development.",
    body_style
))
story.append(Paragraph(
    "The platform operates as a multi-layered Software as a Service (SaaS) application that combines five distinct functional "
    "layers: Discovery Layer for business search, Intelligence Layer for AI-powered analysis, Communication Layer for automated "
    "outreach, Development Layer for website generation, and Financial Layer for payment processing. Each layer operates "
    "independently while maintaining seamless integration with the others, creating a cohesive ecosystem for the entire "
    "business process from prospect identification to website delivery.",
    body_style
))
story.append(Paragraph(
    "The target market includes businesses worldwide that lack an online presence, with particular focus on regions where "
    "mobile money services like Orange Money and MTN Money are prevalent. The platform addresses a significant market gap "
    "by combining automated prospecting with personalized AI communication, reducing the traditional sales cycle time while "
    "maintaining quality customer interactions. The three-tier pricing structure (Standard, Pro, Premium) allows for market "
    "segmentation and maximizes revenue potential across different customer segments.",
    body_style
))
story.append(Spacer(1, 18))

# Section 2: Core Architecture
story.append(Paragraph("<b>2. Core Architecture &amp; System Properties</b>", h1_style))
story.append(Paragraph("<b>2.1 System Overview</b>", h2_style))
story.append(Paragraph(
    "The platform is designed as a distributed microservices architecture that enables independent scaling of each component. "
    "This architectural approach ensures that high-load operations such as business discovery and AI processing do not impact "
    "the performance of user-facing features like the dashboard and payment processing. The system employs event-driven "
    "communication between services using message queues, allowing for asynchronous processing and improved fault tolerance.",
    body_style
))
story.append(Paragraph(
    "At its core, the platform follows the principles of Domain-Driven Design (DDD), with each functional area represented "
    "as a bounded context. The Discovery context handles all Google Maps interactions and business data management, the "
    "Communication context manages AI agent conversations and outreach campaigns, the Development context oversees workspace "
    "creation and website generation, and the Financial context processes payments and manages user accounts. This separation "
    "ensures clear boundaries between domains and enables parallel development by different teams.",
    body_style
))

story.append(Paragraph("<b>2.2 Core Properties</b>", h2_style))

# Scalability table
scalability_data = [
    [Paragraph('<b>Property</b>', table_header_style), Paragraph('<b>Description</b>', table_header_style), Paragraph('<b>Implementation</b>', table_header_style)],
    [Paragraph('Scalability', table_cell_style), Paragraph('Handle millions of business records globally', table_cell_style), Paragraph('PostgreSQL with sharding, MongoDB clusters, Redis caching', table_cell_style)],
    [Paragraph('Security', table_cell_style), Paragraph('Protect user data and payment information', table_cell_style), Paragraph('OAuth 2.0, JWT tokens, AES-256 encryption, PCI-DSS compliance', table_cell_style)],
    [Paragraph('Reliability', table_cell_style), Paragraph('Ensure 99.9% uptime SLA', table_cell_style), Paragraph('Automated backups, error handling, monitoring with Sentry/DataDog', table_cell_style)],
    [Paragraph('Performance', table_cell_style), Paragraph('Fast response times across all features', table_cell_style), Paragraph('CDN distribution, query optimization, async processing', table_cell_style)],
    [Paragraph('Maintainability', table_cell_style), Paragraph('Enable rapid development and updates', table_cell_style), Paragraph('Modular architecture, comprehensive testing, CI/CD pipelines', table_cell_style)]
]
scalability_table = Table(scalability_data, colWidths=[1.5*inch, 2.5*inch, 2.5*inch])
scalability_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(Spacer(1, 12))
story.append(scalability_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 1: Core System Properties Overview</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

# Section 3: Google Maps Integration
story.append(Paragraph("<b>3. Google Maps Integration &amp; Business Discovery</b>", h1_style))
story.append(Paragraph("<b>3.1 Overview of the Discovery Process</b>", h2_style))
story.append(Paragraph(
    "The business discovery functionality represents the foundation of the platform, enabling systematic identification of "
    "potential clients who lack an online presence. This process leverages the Google Places API ecosystem to search, "
    "retrieve, and analyze business information across global markets. The discovery engine operates in multiple stages, "
    "each optimized for efficiency and accuracy in identifying high-quality prospects.",
    body_style
))

story.append(Paragraph("<b>3.2 Step-by-Step Business Discovery Process</b>", h2_style))

story.append(Paragraph("<b>Step 1: Search Query Initialization</b>", h3_style))
story.append(Paragraph(
    "The discovery process begins with user-defined search parameters that determine the scope and focus of the business "
    "search. Users can specify geographic location (either as coordinates, city names, or radius-based areas), business "
    "categories (using Google's standardized place types), and additional filters such as minimum rating or review count. "
    "The system translates these parameters into optimized API requests that maximize result quality while minimizing "
    "API costs. For large-scale searches covering entire cities or regions, the system automatically divides the search "
    "area into smaller grids to ensure comprehensive coverage without hitting API pagination limits.",
    body_style
))

story.append(Paragraph("<b>Step 2: Business Data Extraction</b>", h3_style))
story.append(Paragraph(
    "Once the initial search returns a list of place identifiers, the system performs detailed data extraction for each "
    "business. This involves making individual Place Details API calls to retrieve comprehensive information including "
    "business name, formatted address, phone number, website URL, operating hours, rating, review count, photos, and "
    "category classifications. The system implements intelligent caching to avoid redundant API calls for businesses "
    "that have been previously queried, storing results in a database with appropriate expiration times to ensure data "
    "freshness while optimizing API usage costs.",
    body_style
))

story.append(Paragraph("<b>Step 3: Website Presence Analysis</b>", h3_style))
story.append(Paragraph(
    "The core value proposition hinges on accurate identification of businesses without websites. The analysis engine "
    "examines the website field returned by Google Places API, but goes beyond simple null checks. The system performs "
    "HTTP requests to verify that listed websites are actually functional, flagging businesses with broken links, "
    "parked domains, or placeholder pages. Additionally, the system distinguishes between proper business websites and "
    "social media profiles (Facebook pages, Instagram accounts), recognizing that businesses with only social media "
    "presence represent viable prospects for professional website development.",
    body_style
))

story.append(Paragraph("<b>Step 4: Category Filtering and Segmentation</b>", h3_style))
story.append(Paragraph(
    "Google Places API supports numerous business type classifications including restaurant, store, lodging, health, "
    "finance, and establishment types. The platform allows users to filter results by these categories, enabling "
    "targeted prospecting campaigns. The filtering system also supports custom segmentation based on extracted data "
    "points such as business size indicators (employee count estimates based on category), market positioning (price "
    "level indicators), and growth potential (recent reviews indicating active customer base).",
    body_style
))

# API Requirements Table
story.append(Paragraph("<b>3.3 API Requirements and Costs</b>", h2_style))
api_data = [
    [Paragraph('<b>API Endpoint</b>', table_header_style), Paragraph('<b>Purpose</b>', table_header_style), Paragraph('<b>Cost per Request</b>', table_header_style)],
    [Paragraph('Places API (New)', table_cell_style), Paragraph('Search for businesses by location/text', table_cell_style), Paragraph('$0.017 (Basic Data)', table_cell_center)],
    [Paragraph('Place Details', table_cell_style), Paragraph('Retrieve comprehensive business information', table_cell_style), Paragraph('$0.02 (Contact Data)', table_cell_center)],
    [Paragraph('Geocoding API', table_cell_style), Paragraph('Convert addresses to coordinates', table_cell_style), Paragraph('$0.005 per request', table_cell_center)],
    [Paragraph('Maps JavaScript API', table_cell_style), Paragraph('Display interactive maps in UI', table_cell_style), Paragraph('$0.007 per load', table_cell_center)]
]
api_table = Table(api_data, colWidths=[2*inch, 2.5*inch, 1.5*inch])
api_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(Spacer(1, 12))
story.append(api_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 2: Google Maps API Requirements</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

# Section 4: AI Agent Communication
story.append(Paragraph("<b>4. AI Agent Communication Workflow</b>", h1_style))
story.append(Paragraph("<b>4.1 AI Agent Architecture Overview</b>", h2_style))
story.append(Paragraph(
    "The AI Agent system represents the intelligent core of the platform, responsible for initiating and managing "
    "conversations with potential clients. Built on modern Large Language Model technology, the agent is designed "
    "to conduct natural, helpful conversations while pursuing specific business objectives. The architecture employs "
    "a multi-component design that separates concerns between discovery, analysis, outreach, and conversation management.",
    body_style
))
story.append(Paragraph(
    "The Discovery Engine continuously processes the database of businesses without websites, prioritizing prospects "
    "based on factors such as business category, location market potential, and engagement likelihood. The Analysis "
    "Engine evaluates each prospect's data to generate personalized messaging strategies, incorporating local market "
    "insights and category-specific value propositions. The Outbound Manager handles the actual delivery of messages "
    "through preferred channels (email, SMS, WhatsApp), managing rate limits and tracking delivery status. The "
    "Conversation Manager maintains state across multi-turn dialogues, ensuring context preservation and coherent "
    "communication flow.",
    body_style
))

story.append(Paragraph("<b>4.2 Phase 1: Initial Contact Process</b>", h2_style))
story.append(Paragraph(
    "The initial contact phase is critical for establishing trust and interest with potential clients. The AI agent "
    "generates personalized outreach messages that demonstrate genuine understanding of the prospect's business. "
    "Personalization elements include the business name, specific location reference, acknowledgment of their Google "
    "Maps presence and rating (if positive), and category-specific benefits of having a professional website. The "
    "messaging strategy follows a consultative approach rather than aggressive sales tactics, positioning the platform "
    "as a helpful resource for business growth.",
    body_style
))
story.append(Paragraph(
    "The initial message includes a clear call-to-action that allows for simple response handling. Recipients can "
    "reply with 'YES' to learn more or 'NO' to decline, enabling the AI agent to automatically route the conversation "
    "appropriately. For 'NO' responses, the agent sends a gentle closing message that leaves the door open for future "
    "engagement. For 'YES' responses, the conversation transitions to the needs assessment phase.",
    body_style
))

story.append(Paragraph("<b>4.3 Phase 2: Needs Assessment (The Brief)</b>", h2_style))
story.append(Paragraph(
    "Once a business expresses interest, the AI agent initiates a structured discovery conversation designed to "
    "gather all information necessary for website development. This conversation follows a logical progression "
    "through key decision areas while remaining conversational and adaptive to the client's responses. The agent "
    "asks about services and products offered, brand identity elements (logo, colors), style preferences, required "
    "functionality (booking systems, contact forms, galleries), page structure, available content assets, and domain "
    "name preferences.",
    body_style
))
story.append(Paragraph(
    "Throughout this conversation, the AI agent demonstrates expertise by providing suggestions and explaining options "
    "when clients are uncertain. For example, if a restaurant owner is unsure about features, the agent might explain "
    "the benefits of online menu display, reservation systems, and integration with food delivery platforms. The agent "
    "collects all responses into a structured brief document that will guide the development process, ensuring nothing "
    "is overlooked while keeping the conversation engaging rather than interrogative.",
    body_style
))

story.append(Paragraph("<b>4.4 Phase 3: Pricing Presentation and Confirmation</b>", h2_style))
story.append(Paragraph(
    "After completing the needs assessment, the AI agent presents the three pricing tiers in a clear, comparative "
    "format. The presentation highlights the features most relevant to the client based on their expressed needs, "
    "helping them understand which package best suits their requirements. The agent answers questions about the "
    "differences between packages, explains the value of premium features, and helps clients make informed decisions. "
    "Once the client selects a package, the conversation seamlessly transitions to payment processing, and upon "
    "successful payment, the agent creates the development workspace and notifies the platform administrator.",
    body_style
))

# Section 5: Pricing Tiers
story.append(Paragraph("<b>5. Pricing Tiers &amp; Proposal System</b>", h1_style))
story.append(Paragraph("<b>5.1 Tier Structure Analysis</b>", h2_style))
story.append(Paragraph(
    "The three-tier pricing structure is designed to capture value across different market segments while providing "
    "clear differentiation between service levels. Each tier builds upon the previous one, creating an upsell path "
    "that encourages clients to consider premium features. The pricing is positioned competitively within the market "
    "while ensuring healthy profit margins that account for both development costs and ongoing support obligations.",
    body_style
))

# Pricing Table
pricing_data = [
    [Paragraph('<b>Feature</b>', table_header_style), Paragraph('<b>Standard</b>', table_header_style), Paragraph('<b>Pro</b>', table_header_style), Paragraph('<b>Premium</b>', table_header_style)],
    [Paragraph('<b>Price Range</b>', table_cell_style), Paragraph('$99 - $199', table_cell_center), Paragraph('$299 - $499', table_cell_center), Paragraph('$799 - $1,499', table_cell_center)],
    [Paragraph('Pages', table_cell_style), Paragraph('Up to 5 pages', table_cell_center), Paragraph('Up to 10 pages', table_cell_center), Paragraph('Unlimited', table_cell_center)],
    [Paragraph('Design Type', table_cell_style), Paragraph('Template-based', table_cell_center), Paragraph('Semi-custom', table_cell_center), Paragraph('Fully custom', table_cell_center)],
    [Paragraph('Domain', table_cell_style), Paragraph('Subdomain included', table_cell_center), Paragraph('Custom domain', table_cell_center), Paragraph('Custom + SSL', table_cell_center)],
    [Paragraph('Hosting', table_cell_style), Paragraph('1 year included', table_cell_center), Paragraph('1 year included', table_cell_center), Paragraph('Lifetime hosting', table_cell_center)],
    [Paragraph('Support Duration', table_cell_style), Paragraph('30 days email', table_cell_center), Paragraph('90 days email+chat', table_cell_center), Paragraph('1 year priority', table_cell_center)],
    [Paragraph('Special Features', table_cell_style), Paragraph('Contact form', table_cell_center), Paragraph('Booking, Gallery, SEO', table_cell_center), Paragraph('E-commerce, CRM', table_cell_center)],
    [Paragraph('Mobile Support', table_cell_style), Paragraph('Responsive design', table_cell_center), Paragraph('Responsive + PWA', table_cell_center), Paragraph('Native app option', table_cell_center)],
    [Paragraph('Updates', table_cell_style), Paragraph('None included', table_cell_center), Paragraph('3 content updates', table_cell_center), Paragraph('Unlimited updates', table_cell_center)]
]
pricing_table = Table(pricing_data, colWidths=[1.8*inch, 1.5*inch, 1.5*inch, 1.5*inch])
pricing_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 7), (-1, 7), colors.white),
    ('BACKGROUND', (0, 8), (-1, 8), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 9), (-1, 9), colors.white),
    ('BACKGROUND', (0, 10), (-1, 10), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(pricing_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 3: Pricing Tier Comparison</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

story.append(Paragraph("<b>5.2 Proposal Generation Logic</b>", h2_style))
story.append(Paragraph(
    "The AI agent dynamically generates proposals based on the information gathered during the needs assessment phase. "
    "The proposal logic considers factors such as the business category (which influences template selection and feature "
    "recommendations), the complexity of required features, and the client's budget indicators derived from the conversation. "
    "The system highlights the most relevant features for each client while presenting all three options clearly, enabling "
    "informed decision-making without overwhelming the prospect with information.",
    body_style
))
story.append(Paragraph(
    "The proposal includes a clear breakdown of what is included at each tier, transparent pricing, and estimated delivery "
    "timeframes. The AI agent is trained to handle pricing objections by emphasizing value rather than defending cost, "
    "drawing comparisons to the potential revenue increase from having a professional online presence. The system also "
    "supports limited-time promotional offers and custom quotes for clients with unique requirements that fall outside "
    "the standard tier definitions.",
    body_style
))
story.append(Spacer(1, 18))

# Section 6: Payment Integration
story.append(Paragraph("<b>6. Payment Integration System</b>", h1_style))
story.append(Paragraph("<b>6.1 Payment Architecture Overview</b>", h2_style))
story.append(Paragraph(
    "The payment system is designed to support diverse payment methods relevant to the target markets, combining "
    "traditional international payment processing with regional mobile money services popular across Africa. This "
    "hybrid approach maximizes market reach while providing familiar, trusted payment options for users across "
    "different geographic and economic contexts. The architecture employs a payment gateway abstraction layer "
    "that enables consistent handling across different providers while accommodating their unique requirements.",
    body_style
))

story.append(Paragraph("<b>6.2 Traditional Banking Integration</b>", h2_style))
story.append(Paragraph(
    "For international customers and markets with established banking infrastructure, the platform integrates with "
    "Stripe and PayPal. Stripe provides robust card payment processing with support for 135+ currencies, automatic "
    "currency conversion, and advanced fraud detection. The integration includes Stripe Checkout for hosted payment "
    "pages, Stripe Elements for customizable payment forms, and webhook handlers for real-time payment status updates. "
    "PayPal integration serves as an alternative for customers who prefer wallet-based payments, with support for "
    "both PayPal balance and linked card payments.",
    body_style
))

story.append(Paragraph("<b>6.3 Mobile Money Integration</b>", h2_style))
story.append(Paragraph(
    "Mobile money services are essential for serving African markets where traditional banking penetration remains "
    "limited but mobile phone ownership is widespread. The platform integrates with major providers including Orange "
    "Money (operating in 18+ African countries), MTN Mobile Money (available in 16+ countries), Wave (popular in West "
    "Africa), and M-Pesa (dominant in East Africa). These integrations follow the respective provider APIs, handling "
    "USSD prompts, SMS verification, and callback notifications.",
    body_style
))

# Mobile Money Table
mobile_data = [
    [Paragraph('<b>Provider</b>', table_header_style), Paragraph('<b>Regions</b>', table_header_style), Paragraph('<b>Integration Method</b>', table_header_style), Paragraph('<b>Currencies</b>', table_header_style)],
    [Paragraph('Orange Money', table_cell_style), Paragraph('18+ African countries', table_cell_style), Paragraph('USSD push, API callback', table_cell_style), Paragraph('XOF, XAF, MGA, EGP', table_cell_center)],
    [Paragraph('MTN Mobile Money', table_cell_style), Paragraph('16+ African countries', table_cell_style), Paragraph('MoMo API Collection', table_cell_style), Paragraph('XOF, UGX, GHS, RWF', table_cell_center)],
    [Paragraph('Wave', table_cell_style), Paragraph('Senegal, Ivory Coast', table_cell_style), Paragraph('Wave Business API', table_cell_style), Paragraph('XOF', table_cell_center)],
    [Paragraph('M-Pesa', table_cell_style), Paragraph('Kenya, Tanzania, others', table_cell_style), Paragraph('M-Pesa API (Daraja)', table_cell_style), Paragraph('KES, TZS, GHS', table_cell_center)]
]
mobile_table = Table(mobile_data, colWidths=[1.4*inch, 1.6*inch, 1.8*inch, 1.5*inch])
mobile_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(mobile_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 4: Mobile Money Provider Coverage</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

story.append(Paragraph("<b>6.4 Payment Flow Implementation</b>", h2_style))
story.append(Paragraph(
    "The payment flow is designed for simplicity while accommodating the technical requirements of each payment provider. "
    "When a user selects a package, they are redirected to a unified payment page displaying all available payment methods. "
    "Upon selecting a method, the appropriate payment interface is displayed. For card payments, a secure form collects "
    "card details and initiates 3D Secure verification. For mobile money, the user enters their phone number and receives "
    "a USSD prompt or SMS to confirm the transaction. All payment status updates are handled through webhooks/callbacks, "
    "which trigger database updates and notification dispatches.",
    body_style
))

# Section 7: Workspace Creation
story.append(Paragraph("<b>7. Workspace Creation &amp; Development Workflow</b>", h1_style))
story.append(Paragraph("<b>7.1 Workspace Architecture</b>", h2_style))
story.append(Paragraph(
    "Upon successful payment confirmation, the system automatically creates a dedicated workspace for the new project. "
    "The workspace serves as the central hub for all development activities, containing project documentation, communication "
    "history, asset management, development tools, and deployment configuration. Each workspace is isolated from others "
    "for security and organization, while providing the development team with all necessary context and resources.",
    body_style
))

story.append(Paragraph("<b>7.2 Workspace Components</b>", h2_style))
story.append(Paragraph(
    "The Project Overview section displays all client information, business details, selected package, and project timeline. "
    "The Brief Document contains the structured requirements gathered during the AI conversation, including services/products, "
    "design preferences, required features, and content assets. The Development Tools section provides access to AI code "
    "generators (Z-AI integration), template library with category-specific designs, asset manager for images and media, "
    "and a preview environment for testing. The Communication Log maintains a complete history of all AI-client interactions "
    "and internal notes. The Deployment Center handles domain configuration, SSL certificate installation, and the go-live checklist.",
    body_style
))

story.append(Paragraph("<b>7.3 Development Workflow Steps</b>", h2_style))
story.append(Paragraph(
    "The development workflow begins with workspace initialization triggered by payment confirmation. The system creates "
    "a unique workspace identifier and generates the project structure including directories for brief documentation, "
    "assets, templates, build files, and preview environment. Pre-population of data includes business name, selected "
    "package features, design preferences, and initial content derived from the conversation brief.",
    body_style
))
story.append(Paragraph(
    "The AI-assisted development phase enables the development team to leverage multiple AI tools for efficient creation. "
    "Z-AI generates website copy based on business type and gathered information. Template customization applies the "
    "selected design preferences including color scheme and typography. Feature implementation adds requested functionality "
    "such as booking systems, contact forms, or e-commerce capabilities. Image generation creates placeholder visuals "
    "when client photos are not available. The preview environment allows for real-time testing and iteration before "
    "client presentation.",
    body_style
))
story.append(Paragraph(
    "The client review phase involves sending a preview link for feedback. The AI agent can handle minor modification "
    "requests automatically, while significant changes are routed to the development team. Once approved, the deployment "
    "process configures the custom domain, installs SSL certificates, deploys to production servers, and conducts final "
    "testing. The client receives their live website URL, admin access credentials, documentation, and support contact information.",
    body_style
))
story.append(Spacer(1, 18))

# Section 8: Legal, Ethical, Technical Implications
story.append(Paragraph("<b>8. Legal, Ethical &amp; Technical Implications</b>", h1_style))
story.append(Paragraph("<b>8.1 Legal Considerations</b>", h2_style))
story.append(Paragraph(
    "Operating a platform that processes business data and conducts automated outreach requires careful attention to "
    "legal frameworks across multiple jurisdictions. The General Data Protection Regulation (GDPR) applies to processing "
    "of personal data of EU residents, requiring clear privacy policies, data retention limits, consent mechanisms, and "
    "data subject rights implementation. Similar regulations exist in other regions, including CCPA in California and "
    "various African data protection laws.",
    body_style
))
story.append(Paragraph(
    "The CAN-SPAM Act in the United States and similar anti-spam legislation in other jurisdictions govern commercial "
    "email communications. Compliance requires including clear opt-out mechanisms, accurate subject lines, valid physical "
    "addresses, and honoring unsubscribe requests within specified timeframes. While B2B communication generally receives "
    "more lenient treatment than consumer outreach, maintaining professional standards and providing value in communications "
    "remains essential for both legal compliance and business reputation.",
    body_style
))

# Legal Requirements Table
legal_data = [
    [Paragraph('<b>Legal Area</b>', table_header_style), Paragraph('<b>Requirement</b>', table_header_style), Paragraph('<b>Implementation</b>', table_header_style)],
    [Paragraph('GDPR/Privacy', table_cell_style), Paragraph('Process business data lawfully', table_cell_style), Paragraph('Privacy policy, consent mechanisms, data retention policy', table_cell_style)],
    [Paragraph('CAN-SPAM', table_cell_style), Paragraph('Compliant commercial email', table_cell_style), Paragraph('Opt-out links, accurate subjects, physical address', table_cell_style)],
    [Paragraph('Google ToS', table_cell_style), Paragraph('Comply with API terms', table_cell_style), Paragraph('Attribution, display requirements, usage limits', table_cell_style)],
    [Paragraph('Payment Regulations', table_cell_style), Paragraph('Secure financial handling', table_cell_style), Paragraph('PCI-DSS compliance, money transmitter licenses', table_cell_style)],
    [Paragraph('IP Rights', table_cell_style), Paragraph('Clear content ownership', table_cell_style), Paragraph('Terms of service, copyright agreements', table_cell_style)]
]
legal_table = Table(legal_data, colWidths=[1.5*inch, 2*inch, 2.8*inch])
legal_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(legal_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 5: Legal Compliance Requirements</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

story.append(Paragraph("<b>8.2 Ethical Considerations</b>", h2_style))
story.append(Paragraph(
    "The platform's approach to automated business outreach raises important ethical questions that must be addressed "
    "thoughtfully. While B2B cold outreach is generally accepted business practice, the platform should maintain high "
    "standards of professionalism and respect for recipients. This includes limiting contact frequency, providing genuine "
    "value in communications, respecting do-not-contact requests immediately, and avoiding deceptive or misleading claims. "
    "The AI agent should be programmed to recognize and respond appropriately to negative responses, never pursuing "
    "uninterested prospects aggressively.",
    body_style
))
story.append(Paragraph(
    "Transparency about AI involvement is another ethical consideration. While not legally required in most jurisdictions, "
    "being forthright about the AI nature of initial communications when asked builds trust and aligns with emerging "
    "expectations around AI disclosure. The AI should be trained to avoid making false promises or guarantees about "
    "website performance, search rankings, or business outcomes, focusing instead on the platform's actual deliverables.",
    body_style
))

story.append(Paragraph("<b>8.3 Technical Challenges</b>", h2_style))
story.append(Paragraph(
    "Several significant technical challenges must be addressed for successful platform operation. Google Places API "
    "rate limits impose constraints on discovery throughput, requiring intelligent request queuing, caching strategies, "
    "and potentially multiple API keys with rotation. Website detection accuracy involves distinguishing between actual "
    "business websites and social media profiles, parked domains, and placeholder pages, requiring sophisticated URL "
    "validation and content analysis logic.",
    body_style
))
story.append(Paragraph(
    "Mobile money integration complexity arises from the different APIs, authentication methods, and callback mechanisms "
    "used by each provider. Using payment aggregators like Flutterwave or Paystack that support multiple mobile money "
    "providers can simplify this challenge while maintaining broad coverage. Scalability demands grow with business "
    "volume, necessitating serverless architectures for burst processing, microservices for independent scaling, and "
    "queue-based asynchronous processing for long-running operations.",
    body_style
))
story.append(Spacer(1, 18))

# Section 9: Technology Stack
story.append(Paragraph("<b>9. Technology Stack Recommendations</b>", h1_style))
story.append(Paragraph("<b>9.1 Frontend Technologies</b>", h2_style))
story.append(Paragraph(
    "The frontend should be built using Next.js 15 with React, leveraging server-side rendering for SEO optimization "
    "and fast initial page loads. Tailwind CSS combined with shadcn/ui components provides a modern, maintainable "
    "styling approach with accessibility built-in. State management can be handled through Zustand for simplicity "
    "or React Context for more complex state requirements. Maps integration uses @react-google-maps/api for displaying "
    "search results and business locations within the application interface.",
    body_style
))

story.append(Paragraph("<b>9.2 Backend Technologies</b>", h2_style))
story.append(Paragraph(
    "The backend architecture employs Next.js API Routes for rapid development or Express.js for more complex API "
    "requirements. PostgreSQL hosted on Supabase provides the primary database with Redis handling caching and session "
    "management. Queue processing for async operations like API calls and email sending uses BullMQ with Redis as "
    "the message broker. AI integration leverages the z-ai-web-dev-sdk for LLM features including conversation "
    "generation, content creation, and code assistance.",
    body_style
))

story.append(Paragraph("<b>9.3 Third-Party Services</b>", h2_style))
# Services Table
services_data = [
    [Paragraph('<b>Service Category</b>', table_header_style), Paragraph('<b>Recommended Provider</b>', table_header_style), Paragraph('<b>Purpose</b>', table_header_style)],
    [Paragraph('Maps & Location', table_cell_style), Paragraph('Google Cloud Platform', table_cell_style), Paragraph('Places API, Maps JavaScript API, Geocoding', table_cell_style)],
    [Paragraph('Email Delivery', table_cell_style), Paragraph('Resend or SendGrid', table_cell_style), Paragraph('Transactional emails, outreach campaigns', table_cell_style)],
    [Paragraph('SMS/Messaging', table_cell_style), Paragraph('Twilio', table_cell_style), Paragraph('SMS notifications, WhatsApp Business API', table_cell_style)],
    [Paragraph('Payment Processing', table_cell_style), Paragraph('Stripe + Flutterwave', table_cell_style), Paragraph('International cards, African mobile money', table_cell_style)],
    [Paragraph('Hosting', table_cell_style), Paragraph('Vercel or AWS', table_cell_style), Paragraph('Application hosting, serverless functions', table_cell_style)],
    [Paragraph('Domain/DNS', table_cell_style), Paragraph('Cloudflare', table_cell_style), Paragraph('Domain registration, DNS management, CDN', table_cell_style)]
]
services_table = Table(services_data, colWidths=[1.6*inch, 2*inch, 2.7*inch])
services_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 5), (-1, 5), colors.white),
    ('BACKGROUND', (0, 6), (-1, 6), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(services_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 6: Recommended Third-Party Services</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))
story.append(Spacer(1, 18))

# Section 10: Implementation Roadmap
story.append(Paragraph("<b>10. Implementation Roadmap</b>", h1_style))
story.append(Paragraph("<b>10.1 Phase 1: Minimum Viable Product (4-6 weeks)</b>", h2_style))
story.append(Paragraph(
    "The initial development phase focuses on delivering core functionality that demonstrates the platform's value "
    "proposition. This includes basic Google Maps search integration with location-based business discovery, a simple "
    "listing display showing businesses without websites, website presence verification with functional URL checking, "
    "a basic AI chatbot for initial outreach with template-based messaging, Standard and Pro package offerings with "
    "simple pricing presentation, and Stripe payment integration for card payments. The MVP allows for market testing "
    "and early user feedback while minimizing development investment.",
    body_style
))

story.append(Paragraph("<b>10.2 Phase 2: Core Features (6-8 weeks)</b>", h2_style))
story.append(Paragraph(
    "Building on the MVP foundation, the second phase adds functionality essential for scale and market competitiveness. "
    "Mobile money integration supports Orange Money and MTN Mobile Money, expanding market reach in Africa. The full "
    "AI agent conversation system enables natural multi-turn dialogues with context preservation and intelligent "
    "question sequencing. Workspace creation automation streamlines the transition from payment to development. "
    "Template-based website builder with AI assistance accelerates development time. The client review system enables "
    "feedback collection and iterative improvements.",
    body_style
))

story.append(Paragraph("<b>10.3 Phase 3: Advanced Features (8-12 weeks)</b>", h2_style))
story.append(Paragraph(
    "The advanced features phase introduces capabilities that differentiate the platform from competitors and enable "
    "enterprise-level service. Premium tier implementation adds e-commerce functionality and advanced integrations. "
    "Multi-language support expands the addressable market beyond English-speaking regions. Advanced analytics dashboard "
    "provides insights into discovery performance, conversion rates, and business metrics. Bulk outreach campaigns "
    "enable efficient prospecting at scale. CRM integration connects with popular customer relationship management "
    "platforms for seamless business process integration.",
    body_style
))

story.append(Paragraph("<b>10.4 Phase 4: Scale &amp; Optimization (Ongoing)</b>", h2_style))
story.append(Paragraph(
    "Following the advanced features phase, development transitions to continuous improvement and market expansion. "
    "Performance optimization ensures the platform handles growing user loads efficiently. Additional payment providers "
    "expand geographic coverage. AI model fine-tuning improves conversation quality and conversion rates. Mobile app "
    "development provides native experiences for iOS and Android users. International expansion adapts the platform "
    "for new markets with localized features and compliance requirements.",
    body_style
))

# Roadmap Table
roadmap_data = [
    [Paragraph('<b>Phase</b>', table_header_style), Paragraph('<b>Timeline</b>', table_header_style), Paragraph('<b>Key Deliverables</b>', table_header_style)],
    [Paragraph('MVP', table_cell_style), Paragraph('4-6 weeks', table_cell_center), Paragraph('Basic search, simple AI, Stripe payments, Standard/Pro tiers', table_cell_style)],
    [Paragraph('Core Features', table_cell_style), Paragraph('6-8 weeks', table_cell_center), Paragraph('Mobile money, full AI conversations, workspace automation', table_cell_style)],
    [Paragraph('Advanced', table_cell_style), Paragraph('8-12 weeks', table_cell_center), Paragraph('Premium tier, multi-language, analytics, bulk campaigns', table_cell_style)],
    [Paragraph('Scale', table_cell_style), Paragraph('Ongoing', table_cell_center), Paragraph('Performance optimization, mobile app, international expansion', table_cell_style)]
]
roadmap_table = Table(roadmap_data, colWidths=[1.3*inch, 1.3*inch, 3.7*inch])
roadmap_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1F4E79')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('BACKGROUND', (0, 1), (-1, 1), colors.white),
    ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#F5F5F5')),
    ('BACKGROUND', (0, 3), (-1, 3), colors.white),
    ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#F5F5F5')),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(Spacer(1, 12))
story.append(roadmap_table)
story.append(Spacer(1, 6))
story.append(Paragraph("<i>Table 7: Implementation Roadmap Summary</i>", ParagraphStyle(
    name='TableCaption',
    fontName='Times New Roman',
    fontSize=9,
    alignment=TA_CENTER
)))

# Build PDF
doc.build(story)
print(f"PDF generated successfully: {pdf_path}")
