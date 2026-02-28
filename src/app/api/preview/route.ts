import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Preview generated website
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        business: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Generate preview website
    const brief = project.brief ? JSON.parse(project.brief) : {};
    const business = project.business;

    // Create a simple preview HTML
    const previewHTML = generatePreviewHTML({
      businessName: business.name,
      category: business.category || 'Business',
      phone: business.phone || undefined,
      email: business.email || undefined,
      address: business.address || undefined,
      package: project.package,
      brief,
    });

    // Return HTML directly for iframe embedding
    return new Response(previewHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

function generatePreviewHTML(data: {
  businessName: string;
  category: string;
  phone?: string;
  email?: string;
  address?: string;
  package: string;
  brief: Record<string, unknown>;
}): string {
  const { businessName, category, phone, email, address, package: pkg, brief } = data;

  const colors: Record<string, string[]> = {
    standard: ['#1a1a2e', '#4a90d9', '#ffffff', '#f5f5f5'],
    pro: ['#0f172a', '#3b82f6', '#ffffff', '#f1f5f9'],
    premium: ['#1e1b4b', '#7c3aed', '#ffffff', '#f5f3ff'],
  };

  const [primary, accent, light, bg] = colors[pkg] || colors.standard;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - Preview</title>
  <style>
    :root {
      --primary: ${primary};
      --accent: ${accent};
      --light: ${light};
      --bg: ${bg};
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: var(--primary);
    }
    
    /* Header */
    .header {
      background: var(--light);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary);
    }
    
    .nav a {
      margin-left: 2rem;
      text-decoration: none;
      color: var(--primary);
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: var(--light);
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
      margin-bottom: 2rem;
    }
    
    .btn {
      display: inline-block;
      background: var(--accent);
      color: var(--light);
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    /* Sections */
    section {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    section h2 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: var(--primary);
    }
    
    /* Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .service-card {
      background: var(--bg);
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      transition: transform 0.3s;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
    }
    
    .service-card h3 {
      margin-bottom: 1rem;
      color: var(--accent);
    }
    
    /* About Section */
    .about {
      background: var(--bg);
    }
    
    .about-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    /* Contact Section */
    .contact-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    
    @media (max-width: 768px) {
      .contact-wrapper {
        grid-template-columns: 1fr;
      }
    }
    
    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .contact-form input,
    .contact-form textarea {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
    }
    
    .contact-form button {
      background: var(--accent);
      color: var(--light);
      padding: 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    
    .contact-info h3 {
      margin-bottom: 1rem;
      color: var(--primary);
    }
    
    .contact-info p {
      margin-bottom: 0.5rem;
    }
    
    /* Footer */
    footer {
      background: var(--primary);
      color: var(--light);
      padding: 2rem;
      text-align: center;
    }
    
    footer a {
      color: var(--accent);
    }
    
    /* Preview Banner */
    .preview-banner {
      background: #fef3c7;
      color: #92400e;
      text-align: center;
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="preview-banner">
    ⚠️ This is a preview of your website. Changes may be made before final deployment.
  </div>
  
  <header class="header">
    <div class="logo">${businessName}</div>
    <nav class="nav">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  
  <section class="hero">
    <h1>${businessName}</h1>
    <p>${brief.tagline || `Professional ${category} services you can trust`}</p>
    <a href="#contact" class="btn">Get in Touch</a>
  </section>
  
  <section id="services">
    <h2>Our Services</h2>
    <div class="services-grid">
      ${(brief.services as string || 'Service 1, Service 2, Service 3, Service 4')
        .split(',')
        .map(
          (s: string) => `
        <div class="service-card">
          <h3>${s.trim()}</h3>
          <p>Professional ${s.trim().toLowerCase()} services tailored to your needs.</p>
        </div>
      `
        )
        .join('')}
    </div>
  </section>
  
  <section id="about" class="about">
    <h2>About Us</h2>
    <div class="about-content">
      <p>${
        brief.aboutText ||
        `Welcome to ${businessName}. We are a dedicated team committed to providing exceptional ${category} services. Our mission is to deliver quality and excellence in everything we do.`
      }</p>
    </div>
  </section>
  
  <section id="contact">
    <h2>Contact Us</h2>
    <div class="contact-wrapper">
      <form class="contact-form">
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <textarea rows="4" placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
      <div class="contact-info">
        <h3>Get in Touch</h3>
        ${phone ? `<p>📞 ${phone}</p>` : ''}
        ${email ? `<p>✉️ ${email}</p>` : ''}
        ${address ? `<p>📍 ${address}</p>` : ''}
        <p style="margin-top: 1rem; font-size: 0.875rem; opacity: 0.8;">
          <strong>Hours:</strong><br>
          Monday - Friday: 9:00 AM - 6:00 PM<br>
          Saturday: 10:00 AM - 4:00 PM
        </p>
      </div>
    </div>
  </section>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
    <p style="margin-top: 0.5rem; font-size: 0.875rem;">
      Built with <a href="#">WebFinder</a>
    </p>
  </footer>
</body>
</html>`;
}
