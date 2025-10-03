
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Termini di Servizio', href: '#' },
    { name: 'Chi Siamo', href: '#' },
    { name: 'Contatti', href: '#' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: '🔗' },
    { name: 'LinkedIn', href: '#', icon: '💼' },
    { name: 'Twitter', href: '#', icon: '🐦' },
    { name: 'Email', href: 'mailto:support@uniguida-ai.com', icon: '📧' },
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold">UniGuida AI</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              La piattaforma di orientamento universitario che usa l'intelligenza artificiale
              per guidare gli studenti italiani verso il futuro perfetto.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                  title={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Link Rapidi</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Supporto</h3>
            <div className="space-y-3 text-gray-400">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <span>support@uniguida-ai.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🕐</span>
                <span>Lun-Ven 9:00-18:00</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🇮🇹</span>
                <span>Made in Italy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>&copy; {currentYear} UniGuida AI. Tutti i diritti riservati.</span>
              <span className="hidden md:inline">|</span>
              <span className="text-primary-400">Versione 1.0.0</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span>🤖</span>
                <span>Powered by NVIDIA Nemotron AI</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
