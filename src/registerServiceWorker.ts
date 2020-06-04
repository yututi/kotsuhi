/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sw.js`, {
    ready() {
    },
    registered() {
    },
    cached() {
    },
    updatefound() {
      navigator.serviceWorker.getRegistration()
        .then(reg => {
          if (!reg || !reg.installing) return;

          const installer = reg.installing;
          installer.onstatechange = () => {
            if (installer.state === 'installed' &&
              navigator.serviceWorker.controller) {
              alert("アプリ更新のためリロードします。")
              location.reload();
            }
          };
        });
    },
    updated() {
    },
    offline() {
    },
    error(error) {
    }
  })
}
