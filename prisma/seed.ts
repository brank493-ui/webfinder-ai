import { prisma } from '@/lib/db';

async function main() {
  try {
    // Check if owner already exists
    let owner = await prisma.user.findUnique({
      where: { email: 'brank493@gmail.com' },
    });

    if (!owner) {
      // Create owner account with hashed password
      const crypto = await import('crypto');
      const hashPassword = (password: string): string => {
        return crypto.createHash('sha256').update(password).digest('hex');
      };

      const passwordHash = hashPassword('lago2.1B');
      
      owner = await prisma.user.create({
        data: {
          email: 'brank493@gmail.com',
          name: 'Fongang Lamago Brank',
          role: 'owner',
          provider: 'credential',
          credentialNumber: 'lago2.1B',
          passwordHash: passwordHash,
          hasCompletedOnboarding: true,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        },
      });

      console.log('✅ Owner account created successfully');
    } else {
      console.log('✅ Owner account already exists');
    }

  } catch (error) {
    console.error('Error seeding owner:', error);
    process.exit(1);
  }
}

main();
