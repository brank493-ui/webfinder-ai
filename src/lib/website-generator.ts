import 'server-only';
import ZAI from 'z-ai-web-dev-sdk';
import type { WebsiteTemplate, TemplateSection } from './templates';

// Initialize Z-AI client
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZai() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Website generation request
export interface WebsiteGenerationRequest {
  businessName: string;
  category: string;
  template: WebsiteTemplate;
  brief: {
    services?: string;
    style?: string;
    colors?: string[];
    features?: string[];
    pages?: string[];
    domain?: string;
    notes?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

// Generated website result
export interface GeneratedWebsite {
  id: string;
  html: string;
  css: string;
  sections: GeneratedSection[];
  assets: { type: string; content: string; name: string }[];
}

export interface GeneratedSection {
  id: string;
  type: string;
  html: string;
}

// Generate complete website
export async function generateWebsite(
  request: WebsiteGenerationRequest
): Promise<GeneratedWebsite> {
  const zai = await getZai();
  const websiteId = `site-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Generate each section
  const sections: GeneratedSection[] = [];
  const sortedSections = [...request.template.sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    const sectionHtml = await generateSection(zai, section, request);
    sections.push({
      id: section.id,
      type: section.type,
      html: sectionHtml,
    });
  }

  // Generate CSS
  const css = await generateCSS(zai, request);

  // Combine into full HTML
  const html = generateFullHTML(sections, css, request);

  return {
    id: websiteId,
    html,
    css,
    sections,
    assets: [],
  };
}

// Generate individual section
async function generateSection(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  section: TemplateSection,
  request: WebsiteGenerationRequest
): Promise<string> {
  const prompts: Record<string, string> = {
    hero: generateHeroPrompt(request),
    about: generateAboutPrompt(request),
    services: generateServicesPrompt(request),
    gallery: generateGalleryPrompt(request),
    testimonials: generateTestimonialsPrompt(request),
    contact: generateContactPrompt(request),
    cta: generateCTAPrompt(request),
    footer: generateFooterPrompt(request),
  };

  const prompt = prompts[section.type] || prompts.about;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert web developer. Generate clean, semantic HTML5 for a ${section.type} section.
Rules:
- Use only HTML (no style attributes, no inline CSS)
- Use semantic HTML5 tags
- Include appropriate classes matching the section type
- Make content realistic and relevant to the business
- Return ONLY the HTML content, no explanations
- Do not include <!DOCTYPE>, <html>, <head>, or <body> tags
- The HTML should be a single section element`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || generateFallbackSection(section.type, request);
  } catch {
    return generateFallbackSection(section.type, request);
  }
}

// Section generation prompts
function generateHeroPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a hero section for ${request.businessName}, a ${request.category} business.
${request.brief.services ? `Services: ${request.brief.services}` : ''}
${request.brief.style ? `Style preference: ${request.brief.style}` : ''}

Create an impactful hero with:
- Main heading with business name
- Subheading with key value proposition
- Call-to-action button
- Appropriate content for their industry`;
}

function generateAboutPrompt(request: WebsiteGenerationRequest): string {
  return `Generate an about section for ${request.businessName}, a ${request.category} business.
${request.brief.services ? `What they offer: ${request.brief.services}` : ''}

Include:
- Brief company story
- Key highlights or values
- Professional tone
- Relevant to their industry`;
}

function generateServicesPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a services/products section for ${request.businessName}, a ${request.category} business.
${request.brief.services ? `Services: ${request.brief.services}` : ''}
${request.brief.features ? `Features to highlight: ${request.brief.features.join(', ')}` : ''}

Include:
- List of 4-6 services/products
- Brief descriptions for each
- Icons or visual indicators (use emoji as placeholders)
- Pricing hints if relevant`;
}

function generateGalleryPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a gallery section for ${request.businessName}, a ${request.category} business.

Include:
- Grid layout for images
- Placeholder image divs with appropriate sizes
- Captions or categories
- Lightbox-ready structure`;
}

function generateTestimonialsPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a testimonials section for ${request.businessName}, a ${request.category} business.

Include:
- 3 realistic customer testimonials
- Customer names and roles
- Star ratings
- Professional formatting`;
}

function generateContactPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a contact section for ${request.businessName}, a ${request.category} business.
${request.contact?.phone ? `Phone: ${request.contact.phone}` : ''}
${request.contact?.email ? `Email: ${request.contact.email}` : ''}
${request.contact?.address ? `Address: ${request.contact.address}` : ''}

Include:
- Contact form with name, email, message fields
- Contact information display
- Map placeholder
- Business hours (estimate based on industry)`;
}

function generateCTAPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a call-to-action section for ${request.businessName}, a ${request.category} business.

Include:
- Compelling headline
- Supportive text
- Primary action button
- Secondary contact option`;
}

function generateFooterPrompt(request: WebsiteGenerationRequest): string {
  return `Generate a footer section for ${request.businessName}, a ${request.category} business.
${request.contact?.phone ? `Phone: ${request.contact.phone}` : ''}
${request.contact?.email ? `Email: ${request.contact.email}` : ''}
${request.contact?.address ? `Address: ${request.contact.address}` : ''}

Include:
- Business name and tagline
- Quick links
- Contact information
- Social media links
- Copyright notice
- Professional layout`;
}

// Generate CSS
async function generateCSS(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  request: WebsiteGenerationRequest
): Promise<string> {
  const colorScheme = request.template.colorScheme;
  const colors = request.brief.colors?.length
    ? request.brief.colors
    : colorScheme;

  const prompt = `Generate CSS for a ${request.brief.style || request.template.layout} style website.
Color scheme: ${colors.join(', ')}
Category: ${request.category}

Include:
- CSS custom properties for colors
- Typography with web-safe fonts
- Responsive design (mobile-first)
- Hero section styles
- Services grid layout
- Contact form styling
- Footer layout
- Smooth transitions and hover effects`;

  try {
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert CSS developer. Generate modern, responsive CSS.
Rules:
- Use CSS custom properties (variables)
- Mobile-first responsive design
- No inline styles
- Clean, maintainable code
- Return ONLY CSS, no explanations`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || generateFallbackCSS(colors);
  } catch {
    return generateFallbackCSS(colors);
  }
}

// Fallback section HTML
function generateFallbackSection(type: string, request: WebsiteGenerationRequest): string {
  const sections: Record<string, string> = {
    hero: `
      <section class="hero">
        <div class="hero-content">
          <h1>${request.businessName}</h1>
          <p>Your trusted ${request.category} partner</p>
          <a href="#contact" class="cta-button">Get in Touch</a>
        </div>
      </section>
    `,
    about: `
      <section class="about" id="about">
        <h2>About Us</h2>
        <p>${request.businessName} is dedicated to providing excellent ${request.category} services to our community.</p>
      </section>
    `,
    services: `
      <section class="services" id="services">
        <h2>Our Services</h2>
        <div class="services-grid">
          <div class="service-card"><h3>Service One</h3><p>Description here</p></div>
          <div class="service-card"><h3>Service Two</h3><p>Description here</p></div>
          <div class="service-card"><h3>Service Three</h3><p>Description here</p></div>
        </div>
      </section>
    `,
    contact: `
      <section class="contact" id="contact">
        <h2>Contact Us</h2>
        <form class="contact-form">
          <input type="text" placeholder="Your Name" required>
          <input type="email" placeholder="Your Email" required>
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>
    `,
    footer: `
      <footer class="footer">
        <p>&copy; ${new Date().getFullYear()} ${request.businessName}. All rights reserved.</p>
      </footer>
    `,
    testimonials: `
      <section class="testimonials" id="testimonials">
        <h2>What Our Customers Say</h2>
        <div class="testimonials-grid">
          <div class="testimonial"><p>"Great service!"</p><span>- Happy Customer</span></div>
        </div>
      </section>
    `,
    gallery: `
      <section class="gallery" id="gallery">
        <h2>Gallery</h2>
        <div class="gallery-grid">
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
          <div class="gallery-item"></div>
        </div>
      </section>
    `,
    cta: `
      <section class="cta">
        <h2>Ready to Get Started?</h2>
        <a href="#contact" class="cta-button">Contact Us Today</a>
      </section>
    `,
  };

  return sections[type] || sections.about;
}

// Fallback CSS
function generateFallbackCSS(colors: string[]): string {
  const [primary = '#1a1a2e', secondary = '#e94560', light = '#ffffff', accent = '#f5f5f5'] = colors;

  return `
    :root {
      --primary: ${primary};
      --secondary: ${secondary};
      --light: ${light};
      --accent: ${accent};
      --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { font-family: var(--font-main); line-height: 1.6; color: var(--primary); }
    
    .hero { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: var(--light); padding: 100px 20px; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
    
    .cta-button { display: inline-block; background: var(--secondary); color: var(--light); padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
    
    section { padding: 60px 20px; }
    section h2 { text-align: center; margin-bottom: 2rem; font-size: 2rem; }
    
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
    .service-card { background: var(--accent); padding: 2rem; border-radius: 10px; text-align: center; }
    
    .contact-form { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
    .contact-form input, .contact-form textarea { padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; }
    .contact-form button { background: var(--primary); color: var(--light); padding: 15px; border: none; border-radius: 5px; cursor: pointer; }
    
    .footer { background: var(--primary); color: var(--light); text-align: center; padding: 2rem; }
    
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      section { padding: 40px 15px; }
    }
  `;
}

// Generate full HTML document
function generateFullHTML(
  sections: GeneratedSection[],
  css: string,
  request: WebsiteGenerationRequest
): string {
  const sectionsHTML = sections.map((s) => s.html).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${request.businessName} - Professional ${request.category} services">
  <title>${request.businessName} | ${request.category}</title>
  <style>${css}</style>
</head>
<body>
  ${sectionsHTML}
</body>
</html>`;
}

// Generate website content suggestions
export async function generateContentSuggestions(businessInfo: {
  name: string;
  category: string;
  services?: string;
}): Promise<{
  tagline: string;
  aboutText: string;
  services: string[];
}> {
  try {
    const zai = await getZai();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate website content for a business:
Name: ${businessInfo.name}
Category: ${businessInfo.category}
Current services: ${businessInfo.services || 'Not specified'}

Return a JSON object with:
- tagline: A catchy tagline (max 8 words)
- aboutText: A 2-3 sentence about paragraph
- services: Array of 5-6 service names they might offer

Only return valid JSON, no other text.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content || '{}';

    try {
      return JSON.parse(content);
    } catch {
      return {
        tagline: 'Quality Service You Can Trust',
        aboutText: `Welcome to ${businessInfo.name}. We are dedicated to providing excellent service.`,
        services: ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'],
      };
    }
  } catch {
    return {
      tagline: 'Quality Service You Can Trust',
      aboutText: `Welcome to ${businessInfo.name}. We are dedicated to providing excellent service.`,
      services: ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'],
    };
  }
}
