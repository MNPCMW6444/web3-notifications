import React from 'react';
import ReactDOM from 'react-dom/client';

function loadGoogleFontsAsync() {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css?family=Open+Sans:400,700|Inter:400,500,700&display=swap';
  link.rel = 'stylesheet';

  document.head.appendChild(link);
}

if (document.readyState === 'loading') {
  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', loadGoogleFontsAsync);
} else {
  // `DOMContentLoaded` has already fired
  loadGoogleFontsAsync();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) =>
      console.log('Service Worker registered with scope:', registration.scope),
    )
    .catch((error) =>
      console.log('Service Worker registration failed:', error),
    );
}

root.render(<React.StrictMode>asdasdasd</React.StrictMode>);
