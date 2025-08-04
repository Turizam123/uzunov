(function() {
  const head = document.querySelector('head');

  const icons = [
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: 'favicon.svg' },
    { rel: 'shortcut icon', href: 'favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: 'apple-touch-icon.png' },
    { rel: 'manifest', href: 'site.webmanifest' }
  ];

  icons.forEach(attrs => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([key, val]) => link.setAttribute(key, val));
    head.appendChild(link);
  });

  const meta = document.createElement('meta');
  meta.setAttribute('name', 'apple-mobile-web-app-title');
  meta.setAttribute('content', 'T-MAP');
  head.appendChild(meta);
})();
