import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

export interface AppConfigInterface {
  accentColor: string;
  accentForegroundColor: string;
  appId: string;
  chains: string[];
  compact: boolean;
  siwe: boolean;
  social: boolean;
  theme: string;
  themeId: string;
  wallets: string[];
}

const firebaseConfig = {
  apiKey: 'AIzaSyC6VU0evv45aA8auEpAR7_oJkNrUtu_vm0',
  appId: '1:770385218222:web:f2e9b78ee12eb871a47b3f',
  authDomain: 'asteroidkit-dashboard.firebaseapp.com',
  measurementId: 'G-X8B1V12YB8',
  messagingSenderId: '770385218222',
  projectId: 'asteroidkit-dashboard',
  storageBucket: 'asteroidkit-dashboard.appspot.com',
};

const app = initializeApp(firebaseConfig);

let hasSentLoadConfigurationEvent = false;

export const fetchFromServers = async (
  appId: string
): Promise<AppConfigInterface> => {
  const db = getFirestore(app);

  const appInfoDocRef = doc(db, 'appInfo', appId);
  const appInfoSnap = await getDoc(appInfoDocRef);

  if (!appInfoSnap.exists()) {
    throw new Error('No application was found');
  }

  if (!hasSentLoadConfigurationEvent) {
    firebaseLogEvent(getAnalytics(app), 'fetch_app_config', {
      appId,
    });

    hasSentLoadConfigurationEvent = true;
  }

  return {
    ...appInfoSnap.data(),
    appId: appInfoSnap.id,
  } as AppConfigInterface;
};
