import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingSocialButtons } from './components/FloatingSocialButtons';
import { VirtualAssistant } from './components/VirtualAssistant';
import { LeadModal } from './components/LeadModal';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { DevelopmentsPage } from './pages/DevelopmentsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LandingPageView } from './pages/LandingPageView';
import { AdminPage } from './pages/AdminPage';
import { Property, LeadInterest } from './types';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [selectedInterest, setSelectedInterest] = useState<LeadInterest>('visita');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLeadModal = (property?: Property, defaultInterest: LeadInterest = 'visita') => {
    setSelectedProperty(property);
    setSelectedInterest(defaultInterest);
    setLeadModalOpen(true);
  };

  // Route matching
  let pageContent: React.ReactNode;
  const isLandingPage = currentPath.startsWith('/oferta/');
  const isAdminPage = currentPath === '/admin';

  if (currentPath === '/') {
    pageContent = <HomePage navigate={navigate} onOpenLeadModal={handleOpenLeadModal} />;
  } else if (currentPath === '/imoveis') {
    pageContent = <PropertiesPage navigate={navigate} onOpenLeadModal={handleOpenLeadModal} />;
  } else if (currentPath.startsWith('/imovel/')) {
    const slug = currentPath.replace('/imovel/', '');
    pageContent = (
      <PropertyDetailPage
        slug={slug}
        navigate={navigate}
        onOpenLeadModal={handleOpenLeadModal}
      />
    );
  } else if (currentPath === '/lancamentos') {
    pageContent = <DevelopmentsPage navigate={navigate} onOpenLeadModal={handleOpenLeadModal} />;
  } else if (currentPath === '/sobre') {
    pageContent = <AboutPage navigate={navigate} />;
  } else if (currentPath === '/contato') {
    pageContent = <ContactPage />;
  } else if (isLandingPage) {
    const slug = currentPath.replace('/oferta/', '');
    pageContent = <LandingPageView slug={slug} navigate={navigate} />;
  } else if (isAdminPage) {
    pageContent = <AdminPage navigate={navigate} />;
  } else {
    pageContent = <HomePage navigate={navigate} onOpenLeadModal={handleOpenLeadModal} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#1A2621] font-sans selection:bg-[#C8A251]/20 selection:text-[#0B2B20]">
      {/* Hide default Navbar and Footer on dedicated marketing landing pages for maximum conversion */}
      {!isLandingPage && !isAdminPage && <Navbar currentRoute={currentPath} navigate={navigate} />}

      <div className="flex-1">{pageContent}</div>

      {!isLandingPage && !isAdminPage && <Footer navigate={navigate} />}

      {/* Left side: AI Virtual Assistant Sofia with human photo */}
      {!isAdminPage && <VirtualAssistant onNavigate={navigate} />}

      {/* Right side: Floating Official Instagram and WhatsApp Buttons */}
      {!isAdminPage && (
        <FloatingSocialButtons
          propertyCode={selectedProperty?.code}
          customMessage={selectedProperty ? `Olá Sávio! Gostaria de falar sobre o imóvel ${selectedProperty.title} (${selectedProperty.code}).` : undefined}
        />
      )}

      {/* High-conversion Lead Inquiry Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        propertyTitle={selectedProperty?.title}
        propertyId={selectedProperty?.id}
        propertyCode={selectedProperty?.code}
        defaultInterest={selectedInterest}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MainRouter />
      </SettingsProvider>
    </AuthProvider>
  );
}
