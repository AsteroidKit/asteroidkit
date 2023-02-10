import { OpenloginAdapterOptions } from '@web3auth/openlogin-adapter';

export const OpenLoginAdapterConfig: OpenloginAdapterOptions = {
  adapterSettings: {
    clientId:
      'BOpE2QwLzG8lTiFOblI4-5Tv7dEuQ3--ZCVdNpmnC7DqMhsxdKpUaE2tF3IUizccy7_B4h04uEj6g5zpqYbRf9c',
    loginConfig: {
      google: {
        clientId:
          '52560353044-dru4anqjptro5ssbsha1tosq222gfcpa.apps.googleusercontent.com',
        name: 'Google',
        typeOfLogin: 'google',
        verifier: 'AsteroidKit Google',
      },
      twitch: {
        clientId: '8bhn7spr5h1nwby5gdq14uza8qmonj',
        name: 'Twitch',
        typeOfLogin: 'twitch',
        verifier: 'AsteroidKit Twich',
      },
    },

    network: 'cyan',
    // other option: popup
    storageKey: 'local',
    uxMode: 'popup',
  },
};
