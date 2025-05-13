import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  onClick,
}) => {
  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const combinedClasses = `${baseClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  } else {
    return (
      <button onClick={onClick} className={combinedClasses}>
        {children}
      </button>
    );
  }
};

export default Button;