import { Loader2 } from 'lucide-react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size,
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    fullWidth && 'btn-full',
    iconOnly && 'btn-icon',
    size === 'sm' && 'btn-sm',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="btn-spinner" />}
      {Icon && !loading && <Icon size={18} />}
      {children}
    </button>
  );
}
