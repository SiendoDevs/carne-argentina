import React from 'react';
import { version } from '../lib/version';
import { memo } from 'react';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 py-4 text-center text-sm text-gray-500 border-t">
      <p>
        Diseño y Desarrollo por{' '}
        <a 
          href="https://siendostudio.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          Siendo Studio®
        </a>
      </p>
      <p className="mt-1">
        © {currentYear} • v{version}
      </p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;