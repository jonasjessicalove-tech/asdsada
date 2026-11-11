import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AnalyticsEvent } from '../types';

export async function trackEvent(
  eventType: AnalyticsEvent['eventType'],
  details?: { targetId?: string; targetTitle?: string; pageUrl?: string }
) {
  try {
    const eventData = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11),
      eventType,
      targetId: details?.targetId || '',
      targetTitle: details?.targetTitle || '',
      pageUrl: details?.pageUrl || window.location.pathname,
      referrer: document.referrer || '',
      createdAt: new Date().toISOString(),
    };

    // If targetId is a landing page and event is view, increment views
    if (eventType === 'page_view' && details?.targetId?.startsWith('lp-')) {
      try {
        await updateDoc(doc(db, 'landingPages', details.targetId), {
          viewsCount: increment(1)
        });
      } catch {
        // silent
      }
    }

    // Save event record
    await addDoc(collection(db, 'analyticsEvents'), eventData);
  } catch {
    // Non-blocking telemetry
  }
}
