import React from 'react';

function Navbar() {
  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#analyze', label: 'Analyze News' },
    { href: '#history', label: 'History' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#metrics', label: 'Model Performance' },
  ];
  return (
    <nav className="navbar">
      <div className="navbar-brand">Verity</div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
