import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Property,
  Development,
  LandingPage,
  Lead,
  SiteSettings
} from '../types';
import {
  initialSiteSettings,
  initialProperties,
  initialDevelopments,
  initialLandingPages
} from '../lib/seedData';

interface SettingsContextType {
  settings: SiteSettings;
  properties: Property[];
  developments: Development[];
  landingPages: LandingPage[];
  leads: Lead[];
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  duplicateProperty: (id: string) => Promise<string>;
  addDevelopment: (dev: Omit<Development, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDevelopment: (id: string, dev: Partial<Development>) => Promise<void>;
  deleteDevelopment: (id: string) => Promise<void>;
  addLandingPage: (lp: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'leadsCount'>) => Promise<string>;
  updateLandingPage: (id: string, lp: Partial<LandingPage>) => Promise<void>;
  deleteLandingPage: (id: string) => Promise<void>;
  submitLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateLeadStatus: (id: string, status: Lead['status'], notes?: string) => Promise<void>;
}

const STORAGE_KEYS = {
  SETTINGS: 'savio_site_settings_v3',
  PROPERTIES: 'savio_properties_v3',
  DEVELOPMENTS: 'savio_developments_v3',
  LANDING_PAGES: 'savio_landing_pages_v3',
  LEADS: 'savio_leads_v3',
  SEEDED: 'savio_firestore_seeded_v3',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) ? Array.isArray(parsed) : parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    // ignore parsing errors
  }
  return fallback;
}

function writeStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // ignore quota exceptions
  }
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => readStorage(STORAGE_KEYS.SETTINGS, initialSiteSettings));
  const [properties, setProperties] = useState<Property[]>(() => readStorage(STORAGE_KEYS.PROPERTIES, initialProperties));
  const [developments, setDevelopments] = useState<Development[]>(() => readStorage(STORAGE_KEYS.DEVELOPMENTS, initialDevelopments));
  const [landingPages, setLandingPages] = useState<LandingPage[]>(() => readStorage(STORAGE_KEYS.LANDING_PAGES, initialLandingPages));
  const [leads, setLeads] = useState<Lead[]>(() => readStorage(STORAGE_KEYS.LEADS, []));
  const [loading, setLoading] = useState<boolean>(true);

  // Auto-initialize Firestore and sync collections in real-time
  useEffect(() => {
    let unsubscribeSettings: () => void = () => {};
    let unsubscribeProperties: () => void = () => {};
    let unsubscribeDevelopments: () => void = () => {};
    let unsubscribeLandingPages: () => void = () => {};
    let unsubscribeLeads: () => void = () => {};

    const initializeData = async () => {
      try {
        let isAlreadySeeded = localStorage.getItem(STORAGE_KEYS.SEEDED) === 'true';

        // 1. Settings
        try {
          const settingsRef = doc(db, 'settings', 'global');
          const settingsSnap = await getDoc(settingsRef);

          if (!settingsSnap.exists()) {
            await setDoc(settingsRef, initialSiteSettings);
            setSettings(initialSiteSettings);
            writeStorage(STORAGE_KEYS.SETTINGS, initialSiteSettings);
          } else {
            isAlreadySeeded = true;
            localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
            const raw = settingsSnap.data() as SiteSettings;
            const officialLogo = 'https://i.postimg.cc/RhPjD53T/Logo-Imobiliario-Dourado-Luxuoso.png';
            const officialAvatar = 'https://i.postimg.cc/V6v7JDFN/Selfie-no-escritorio-da-Imoveis-com-Savio.png';
            const isOldLogo = !raw.logoUrl || raw.logoUrl.includes('3xMpQdvV') || raw.logoUrl.includes('skyline');
            const cleaned: SiteSettings = {
              ...initialSiteSettings,
              ...raw,
              logoUrl: isOldLogo ? officialLogo : raw.logoUrl,
              avatarUrl: (!raw.avatarUrl || raw.avatarUrl.includes('unsplash') || raw.avatarUrl.includes('Whats-App-Image')) ? officialAvatar : raw.avatarUrl,
              bio: (raw.bio || initialSiteSettings.bio).replace(/curador(ia|a)/gi, 'assessoria'),
              heroSubtitle: (raw.heroSubtitle || initialSiteSettings.heroSubtitle).replace(/curador(ia|a)/gi, 'seleção'),
              heroBadge: (raw.heroBadge || initialSiteSettings.heroBadge).replace(/curador(ia|a)/gi, 'Seleção Exclusiva'),
            };
            setSettings(cleaned);
            writeStorage(STORAGE_KEYS.SETTINGS, cleaned);

            if (isOldLogo || !raw.avatarUrl || raw.avatarUrl.includes('unsplash') || raw.avatarUrl.includes('Whats-App-Image') || raw.bio?.match(/curador/i) || raw.heroSubtitle?.match(/curador/i) || raw.heroBadge?.match(/curador/i)) {
              setDoc(settingsRef, cleaned, { merge: true }).catch(() => {});
            }
          }

          unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
              const raw = docSnap.data() as SiteSettings;
              const officialLogo = 'https://i.postimg.cc/RhPjD53T/Logo-Imobiliario-Dourado-Luxuoso.png';
              const officialAvatar = 'https://i.postimg.cc/V6v7JDFN/Selfie-no-escritorio-da-Imoveis-com-Savio.png';
              const isOldLogo = !raw.logoUrl || raw.logoUrl.includes('3xMpQdvV') || raw.logoUrl.includes('skyline');
              const cleaned: SiteSettings = {
                ...initialSiteSettings,
                ...raw,
                logoUrl: isOldLogo ? officialLogo : raw.logoUrl,
                avatarUrl: (!raw.avatarUrl || raw.avatarUrl.includes('unsplash') || raw.avatarUrl.includes('Whats-App-Image')) ? officialAvatar : raw.avatarUrl,
                bio: (raw.bio || initialSiteSettings.bio).replace(/curador(ia|a)/gi, 'assessoria'),
                heroSubtitle: (raw.heroSubtitle || initialSiteSettings.heroSubtitle).replace(/curador(ia|a)/gi, 'seleção'),
                heroBadge: (raw.heroBadge || initialSiteSettings.heroBadge).replace(/curador(ia|a)/gi, 'Seleção Exclusiva'),
              };
              setSettings(cleaned);
              writeStorage(STORAGE_KEYS.SETTINGS, cleaned);
            }
          }, (err) => {
            console.warn('Settings listener fallback:', err?.message || err);
          });
        } catch (settingsErr) {
          console.warn('Settings read/seed fallback to local storage:', settingsErr);
        }

        // 2. Properties
        try {
          const propCol = collection(db, 'properties');
          const propSnap = await getDocs(propCol);

          if (propSnap.empty && !isAlreadySeeded) {
            for (const p of initialProperties) {
              await setDoc(doc(db, 'properties', p.id), p);
            }
            setProperties(initialProperties);
            writeStorage(STORAGE_KEYS.PROPERTIES, initialProperties);
            localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
          } else if (!propSnap.empty) {
            const list: Property[] = [];
            propSnap.forEach(d => list.push({ id: d.id, ...d.data() } as Property));
            setProperties(list);
            writeStorage(STORAGE_KEYS.PROPERTIES, list);
          }

          unsubscribeProperties = onSnapshot(propCol, (snap) => {
            const list: Property[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() } as Property));
            setProperties(list);
            writeStorage(STORAGE_KEYS.PROPERTIES, list);
          }, (err) => {
            console.warn('Properties listener fallback:', err?.message || err);
          });
        } catch (propErr) {
          console.warn('Properties fallback to local cache:', propErr);
        }

        // 3. Developments
        try {
          const devCol = collection(db, 'developments');
          const devSnap = await getDocs(devCol);

          if (devSnap.empty && !isAlreadySeeded) {
            for (const d of initialDevelopments) {
              await setDoc(doc(db, 'developments', d.id), d);
            }
            setDevelopments(initialDevelopments);
            writeStorage(STORAGE_KEYS.DEVELOPMENTS, initialDevelopments);
            localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
          } else if (!devSnap.empty) {
            const list: Development[] = [];
            devSnap.forEach(d => list.push({ id: d.id, ...d.data() } as Development));
            setDevelopments(list);
            writeStorage(STORAGE_KEYS.DEVELOPMENTS, list);
          }

          unsubscribeDevelopments = onSnapshot(devCol, (snap) => {
            const list: Development[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() } as Development));
            setDevelopments(list);
            writeStorage(STORAGE_KEYS.DEVELOPMENTS, list);
          }, (err) => {
            console.warn('Developments listener fallback:', err?.message || err);
          });
        } catch (devErr) {
          console.warn('Developments fallback to local cache:', devErr);
        }

        // 4. Landing Pages
        try {
          const lpCol = collection(db, 'landingPages');
          const lpSnap = await getDocs(lpCol);
          if (lpSnap.empty && !isAlreadySeeded) {
            for (const lp of initialLandingPages) {
              await setDoc(doc(db, 'landingPages', lp.id), lp);
            }
            writeStorage(STORAGE_KEYS.LANDING_PAGES, initialLandingPages);
          } else if (!lpSnap.empty) {
            const list: LandingPage[] = [];
            lpSnap.forEach(d => list.push({ id: d.id, ...d.data() } as LandingPage));
            setLandingPages(list);
            writeStorage(STORAGE_KEYS.LANDING_PAGES, list);
          }
          unsubscribeLandingPages = onSnapshot(lpCol, (snap) => {
            const list: LandingPage[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() } as LandingPage));
            setLandingPages(list);
            writeStorage(STORAGE_KEYS.LANDING_PAGES, list);
          }, (err) => {
            console.warn('Landing pages listener fallback:', err?.message || err);
          });
        } catch (lpErr) {
          console.warn('Landing pages fallback to local cache:', lpErr);
        }

        // 5. Leads
        try {
          const leadsCol = collection(db, 'leads');
          unsubscribeLeads = onSnapshot(leadsCol, (snap) => {
            const list: Lead[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() } as Lead));
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setLeads(list);
            writeStorage(STORAGE_KEYS.LEADS, list);
          }, (err) => {
            console.warn('Leads listener notice (admin only):', err?.message || err);
          });
        } catch (leadErr) {
          console.warn('Leads collection not accessible in public mode:', leadErr);
        }

      } catch (error) {
        console.warn('General Firestore initialization info:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      unsubscribeSettings();
      unsubscribeProperties();
      unsubscribeDevelopments();
      unsubscribeLandingPages();
      unsubscribeLeads();
    };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    setSettings(merged);
    writeStorage(STORAGE_KEYS.SETTINGS, merged);
    try {
      await setDoc(doc(db, 'settings', 'global'), merged, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = 'prop-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newProperty: Property = {
      ...propertyData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setProperties(prev => {
      const list = [newProperty, ...prev];
      writeStorage(STORAGE_KEYS.PROPERTIES, list);
      return list;
    });
    try {
      await setDoc(doc(db, 'properties', id), newProperty);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `properties/${id}`);
    }
    return id;
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    setProperties(prev => {
      const list = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      writeStorage(STORAGE_KEYS.PROPERTIES, list);
      return list;
    });
    try {
      await updateDoc(doc(db, 'properties', id), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `properties/${id}`);
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties(prev => {
      const list = prev.filter(p => p.id !== id);
      writeStorage(STORAGE_KEYS.PROPERTIES, list);
      return list;
    });
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${id}`);
    }
  };

  const duplicateProperty = async (id: string) => {
    const existing = properties.find(p => p.id === id);
    if (!existing) throw new Error('Property not found');
    const newId = 'prop-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const duplicated: Property = {
      ...existing,
      id: newId,
      code: existing.code + '-COPIA',
      title: existing.title + ' (Cópia)',
      slug: existing.slug + '-copia-' + Math.random().toString(36).substring(2, 5),
      createdAt: now,
      updatedAt: now,
      published: false,
    };
    setProperties(prev => {
      const list = [duplicated, ...prev];
      writeStorage(STORAGE_KEYS.PROPERTIES, list);
      return list;
    });
    try {
      await setDoc(doc(db, 'properties', newId), duplicated);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `properties/${newId}`);
    }
    return newId;
  };

  const addDevelopment = async (devData: Omit<Development, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = 'dev-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newDev: Development = {
      ...devData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setDevelopments(prev => {
      const list = [newDev, ...prev];
      writeStorage(STORAGE_KEYS.DEVELOPMENTS, list);
      return list;
    });
    try {
      await setDoc(doc(db, 'developments', id), newDev);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `developments/${id}`);
    }
    return id;
  };

  const updateDevelopment = async (id: string, updates: Partial<Development>) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    setDevelopments(prev => {
      const list = prev.map(d => d.id === id ? { ...d, ...updated } : d);
      writeStorage(STORAGE_KEYS.DEVELOPMENTS, list);
      return list;
    });
    try {
      await setDoc(doc(db, 'developments', id), updated, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `developments/${id}`);
    }
  };

  const deleteDevelopment = async (id: string) => {
    setDevelopments(prev => {
      const list = prev.filter(d => d.id !== id);
      writeStorage(STORAGE_KEYS.DEVELOPMENTS, list);
      return list;
    });
    try {
      await deleteDoc(doc(db, 'developments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `developments/${id}`);
    }
  };

  const addLandingPage = async (lpData: Omit<LandingPage, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'leadsCount'>) => {
    const id = 'lp-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newLp: LandingPage = {
      ...lpData,
      id,
      viewsCount: 0,
      leadsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'landingPages', id), newLp);
    setLandingPages(prev => [newLp, ...prev]);
    return id;
  };

  const updateLandingPage = async (id: string, updates: Partial<LandingPage>) => {
    const updated = { ...updates, updatedAt: new Date().toISOString() };
    setLandingPages(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    await updateDoc(doc(db, 'landingPages', id), updated);
  };

  const deleteLandingPage = async (id: string) => {
    setLandingPages(prev => prev.filter(l => l.id !== id));
    await deleteDoc(doc(db, 'landingPages', id));
  };

  const submitLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>) => {
    const id = 'lead-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id,
      status: 'novo',
      createdAt: now,
    };
    try {
      await setDoc(doc(db, 'leads', id), newLead);
      setLeads(prev => [newLead, ...prev]);

      // If came from a landing page, increment leadsCount
      if (leadData.pageUrl && leadData.pageUrl.includes('/oferta/')) {
        const slug = leadData.pageUrl.split('/oferta/')[1]?.split('?')[0];
        const matchedLp = landingPages.find(l => l.slug === slug);
        if (matchedLp) {
          await updateDoc(doc(db, 'landingPages', matchedLp.id), {
            leadsCount: (matchedLp.leadsCount || 0) + 1
          });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `leads/${id}`);
    }
  };

  const updateLeadStatus = async (id: string, status: Lead['status'], notes?: string) => {
    const updates: Partial<Lead> = { status };
    if (notes !== undefined) updates.notes = notes;
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    await updateDoc(doc(db, 'leads', id), updates);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        properties,
        developments,
        landingPages,
        leads,
        loading,
        updateSettings,
        addProperty,
        updateProperty,
        deleteProperty,
        duplicateProperty,
        addDevelopment,
        updateDevelopment,
        deleteDevelopment,
        addLandingPage,
        updateLandingPage,
        deleteLandingPage,
        submitLead,
        updateLeadStatus,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
