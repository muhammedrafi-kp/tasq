import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  showPassword, 
  onTogglePassword, 
  type, 
  ...props 
}) => {
  const isPasswordField = type === 'password';
  
  return (
    <div className="input-container">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={isPasswordField && showPassword ? 'text' : type}
          className={`input-field ${
            error ? 'error' : ''
          } ${isPasswordField ? 'password' : ''} ${className}`}
          {...props}
        />
        {isPasswordField && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="password-toggle"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );
};

export default Input;