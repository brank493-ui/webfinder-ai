import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'en' | 'fr';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.onboarding': 'Onboarding',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.discover': 'Discover',
    'nav.workspaces': 'Workspaces',
    'nav.tools': 'Tools',
    'nav.enterprise': 'Enterprise',
    'nav.admin': 'Admin',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Register',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.credentialNumber': 'Credential Number',
    'auth.continueWithGoogle': 'Continue with Google',
    'auth.signUpWithGoogle': 'Sign up with Google',
    'auth.credential': 'Credential',
    'auth.google': 'Google',
    'auth.googleAccount': 'Google Account',
    'auth.credentialLogin': 'Credential Login',
    'auth.firstName': 'First Name',
    'auth.surname': 'Surname',
    'auth.gender': 'Gender',
    'auth.phone': 'Phone',
    'auth.country': 'Country',
    'auth.city': 'City',
    'auth.confirmPassword': 'Confirm',
    'auth.createAccount': 'Create Account',
    'auth.male': 'Male',
    'auth.female': 'Female',
    'auth.other': 'Other',
    'auth.needHelp': 'Need help?',
    'auth.or': 'or',
    
    // Home Page
    'home.welcome': 'Welcome',
    'home.heroTitle': 'Build Your Professional Website',
    'home.heroSubtitle': 'Professional web solutions for your business',
    'home.startProject': 'Start Your Project',
    'home.learnMore': 'Learn More',
    'home.ourServices': 'Our Services',
    'home.ourPackages': 'Our Packages',
    'home.viewAllPackages': 'View All Packages',
    'home.getStarted': 'Get Started',
    'home.businessWebsites': 'Business Websites',
    'home.ecommerceStores': 'E-Commerce Stores',
    'home.bookingSystems': 'Booking Systems',
    'home.landingPages': 'Landing Pages',
    'home.webApplications': 'Web Applications',
    'home.websiteRedesign': 'Website Redesign',
    
    // Packages
    'package.standard': 'Standard',
    'package.pro': 'Pro',
    'package.premium': 'Premium',
    'package.selectPackage': 'Select Package',
    'package.perProject': 'per project',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.needHelp': 'Need help? Contact',
    'footer.orCall': 'or call',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.preview': 'Preview',
    'common.previewMode': 'Preview Mode',
    'common.viewingAsUser': 'Viewing as User',
    'common.backToAdmin': 'Back to Admin',
    'common.fullAccess': 'Full Access',
    'common.projectPortal': 'Your Project Portal',
    'common.businessDiscovery': 'Business Discovery Platform',
    
    // Language
    'language.english': 'English',
    'language.french': 'French',
    'language.selectLanguage': 'Select Language',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.onboarding': 'Intégration',
    'nav.gallery': 'Galerie',
    'nav.contact': 'Contact',
    'nav.discover': 'Découvrir',
    'nav.workspaces': 'Espaces',
    'nav.tools': 'Outils',
    'nav.enterprise': 'Entreprise',
    'nav.admin': 'Admin',
    
    // Auth
    'auth.signIn': 'Se connecter',
    'auth.signUp': "S'inscrire",
    'auth.signOut': 'Se déconnecter',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.credentialNumber': 'Numéro d\'identifiant',
    'auth.continueWithGoogle': 'Continuer avec Google',
    'auth.signUpWithGoogle': "S'inscrire avec Google",
    'auth.credential': 'Identifiant',
    'auth.google': 'Google',
    'auth.googleAccount': 'Compte Google',
    'auth.credentialLogin': 'Connexion par identifiant',
    'auth.firstName': 'Prénom',
    'auth.surname': 'Nom',
    'auth.gender': 'Genre',
    'auth.phone': 'Téléphone',
    'auth.country': 'Pays',
    'auth.city': 'Ville',
    'auth.confirmPassword': 'Confirmer',
    'auth.createAccount': 'Créer un compte',
    'auth.male': 'Homme',
    'auth.female': 'Femme',
    'auth.other': 'Autre',
    'auth.needHelp': 'Besoin d\'aide?',
    'auth.or': 'ou',
    
    // Home Page
    'home.welcome': 'Bienvenue',
    'home.heroTitle': 'Créez Votre Site Web Professionnel',
    'home.heroSubtitle': 'Solutions web professionnelles pour votre entreprise',
    'home.startProject': 'Démarrer Votre Projet',
    'home.learnMore': 'En savoir plus',
    'home.ourServices': 'Nos Services',
    'home.ourPackages': 'Nos Forfaits',
    'home.viewAllPackages': 'Voir tous les forfaits',
    'home.getStarted': 'Commencer',
    'home.businessWebsites': 'Sites Business',
    'home.ecommerceStores': 'Boutiques E-Commerce',
    'home.bookingSystems': 'Systèmes de Réservation',
    'home.landingPages': 'Pages d\'Accueil',
    'home.webApplications': 'Applications Web',
    'home.websiteRedesign': 'Refonte de Site',
    
    // Packages
    'package.standard': 'Standard',
    'package.pro': 'Pro',
    'package.premium': 'Premium',
    'package.selectPackage': 'Choisir le forfait',
    'package.perProject': 'par projet',
    
    // Footer
    'footer.rights': 'Tous droits réservés.',
    'footer.needHelp': 'Besoin d\'aide? Contactez',
    'footer.orCall': 'ou appelez',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.submit': 'Soumettre',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.preview': 'Aperçu',
    'common.previewMode': 'Mode Aperçu',
    'common.viewingAsUser': 'Vue utilisateur',
    'common.backToAdmin': 'Retour Admin',
    'common.fullAccess': 'Accès complet',
    'common.projectPortal': 'Votre Portail Projet',
    'common.businessDiscovery': 'Plateforme de Découverte',
    
    // Language
    'language.english': 'Anglais',
    'language.french': 'Français',
    'language.selectLanguage': 'Choisir la langue',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (language: Language) => {
        set({ language });
      },
      
      t: (key: string): string => {
        const { language } = get();
        const translation = translations[language]?.[key];
        if (!translation) {
          console.warn(`Translation not found for key: ${key}`);
          return key;
        }
        return translation;
      },
    }),
    {
      name: 'webfinder-language',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
      }),
    }
  )
);
