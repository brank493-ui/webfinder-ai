import { NextRequest, NextResponse } from 'next/server';

interface WebsiteGenerateRequest {
  projectId: string;
  templateSlug: string;
  customBrief: {
    services: string;
    style: string;
    colors: string[];
    features: string[];
    pages: string[];
    domain?: string;
    notes?: string;
  };
}

// AI-powered website generation
export async function POST(request: NextRequest) {
  try {
    const body: WebsiteGenerateRequest = await request.json();
    const { projectId, templateSlug, customBrief } = body;

    // Simulate website generation with AI
    // In production, this would use the AI SDK to generate actual HTML/CSS
    
    const generatedWebsite = {
      projectId,
      templateSlug,
      generatedAt: new Date().toISOString(),
      pages: customBrief.pages.map((page) => ({
        name: page,
        slug: page.toLowerCase().replace(/\s+/g, '-'),
        html: generatePageHTML(page, customBrief),
      })),
      styles: generateStyles(customBrief),
      assets: [],
      status: 'generated',
    };

    return NextResponse.json({
      success: true,
      website: generatedWebsite,
      message: 'Website generated successfully',
    });
  } catch (error) {
    console.error('Website generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}

function generatePageHTML(page: string, brief: WebsiteGenerateRequest['customBrief']): string {
  const primaryColor = brief.colors[0] || '#2563EB';
  
  const templates: Record<string, string> = {
    'Home': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
</head>
<body>
  <header style="background: ${primaryColor}; padding: 1rem; color: white;">
    <nav>
      <div class="logo">Your Business</div>
      <ul>
        ${brief.pages.map(p => `<li><a href="${p.toLowerCase().replace(/\s+/g, '-')}">${p}</a></li>`).join('')}
      </ul>
    </nav>
  </header>
  <main>
    <section class="hero" style="background: linear-gradient(135deg, ${primaryColor}, ${brief.colors[1] || primaryColor}); padding: 4rem 2rem; text-align: center; color: white;">
      <h1>Welcome to Your Business</h1>
      <p>${brief.services || 'Professional services for your needs'}</p>
      <a href="contact" style="background: white; color: ${primaryColor}; padding: 0.75rem 2rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; margin-top: 1rem;">Get Started</a>
    </section>
    <section class="services" style="padding: 4rem 2rem;">
      <h2 style="text-align: center;">Our Services</h2>
      <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px; margin: 2rem auto;">
        ${brief.features.map(f => `
          <div class="service-card" style="padding: 2rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; text-align: center;">
            <h3>${f}</h3>
            <p>Professional ${f.toLowerCase()} services</p>
          </div>
        `).join('')}
      </div>
    </section>
  </main>
  <footer style="background: #1f2937; color: white; padding: 2rem; text-align: center;">
    <p>&copy; ${new Date().getFullYear()} Your Business. All rights reserved.</p>
  </footer>
</body>
</html>`,
    'About': `<!DOCTYPE html><html lang="en"><head><title>About Us</title></head><body><header style="background: ${primaryColor}; padding: 1rem; color: white;"><h1>About Us</h1></header><main style="padding: 2rem; max-width: 800px; margin: auto;"><p>Learn more about our company and our mission to provide excellent services.</p></main></body></html>`,
    'Services': `<!DOCTYPE html><html lang="en"><head><title>Services</title></head><body><header style="background: ${primaryColor}; padding: 1rem; color: white;"><h1>Our Services</h1></header><main style="padding: 2rem;"><ul>${brief.features.map(f => `<li>${f}</li>`).join('')}</ul></main></body></html>`,
    'Contact': `<!DOCTYPE html><html lang="en"><head><title>Contact</title></head><body><header style="background: ${primaryColor}; padding: 1rem; color: white;"><h1>Contact Us</h1></header><main style="padding: 2rem; max-width: 600px; margin: auto;"><form><input type="text" placeholder="Name" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;"><input type="email" placeholder="Email" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem;"><textarea placeholder="Message" style="width: 100%; padding: 0.5rem; margin-bottom: 1rem; height: 150px;"></textarea><button type="submit" style="background: ${primaryColor}; color: white; padding: 0.75rem 2rem; border: none; border-radius: 0.25rem; cursor: pointer;">Send Message</button></form></main></body></html>`,
  };

  return templates[page] || `<!DOCTYPE html><html lang="en"><head><title>${page}</title></head><body><header style="background: ${primaryColor}; padding: 1rem; color: white;"><h1>${page}</h1></header><main style="padding: 2rem;"><p>Content for ${page} page</p></main></body></html>`;
}

function generateStyles(brief: WebsiteGenerateRequest['customBrief']): string {
  const primaryColor = brief.colors[0] || '#2563EB';
  const secondaryColor = brief.colors[1] || '#1E40AF';
  
  return `
:root {
  --primary-color: ${primaryColor};
  --secondary-color: ${secondaryColor};
  --text-color: #1f2937;
  --background: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-color);
  background: var(--background);
  line-height: 1.6;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

nav a {
  color: white;
  text-decoration: none;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}
`;
}
