import React from 'react';
import { packageJson } from '../lib/version';

const Footer = () => {
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
          Catriel Sánchez
        </a>
      </p>
      <p className="mt-1">
        © {currentYear} • v{packageJson.version}
      </p>
    </footer>
  );
};

export default Footer;