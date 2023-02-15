import { logEvent as firebaseLogEvent, getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

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

export interface UserInfoInterface {
  name: string;
  email: string;
  cancelled?: boolean;
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
const db = getFirestore(app);

let hasSentLoadConfigurationEvent = false;

export class ErrorNotFound extends Error {
  get name() {
    return this.constructor.name;
  }
}

export const getAppInfo = async (
  appId: string
): Promise<AppConfigInterface> => {
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

export const getUserInfo = async ({
  address,
  appId,
}: {
  appId: string;
  address: string;
}): Promise<UserInfoInterface> => {
  const userInfoDocRef = getUserInfoRef(appId, address);
  const userInfoSnap = await getDoc(userInfoDocRef);

  if (!userInfoSnap.exists()) {
    throw new ErrorNotFound('No user info was found');
  }

  return {
    ...userInfoSnap.data(),
  } as UserInfoInterface;
};

export const setUserInfo = async ({
  address,
  appId,
  userInfo,
}: {
  appId: string;
  address: string;
  userInfo: Partial<UserInfoInterface>;
}): Promise<Partial<UserInfoInterface>> => {
  const userInfoDocRef = getUserInfoRef(appId, address);

  await setDoc(userInfoDocRef, userInfo);
  return userInfo as Partial<UserInfoInterface>;
};

const getUserInfoRef = (appId: string, address: string) =>
  doc(db, 'appInfo', appId, 'users', address);
