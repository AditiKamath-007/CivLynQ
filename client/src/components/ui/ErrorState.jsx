import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import '../../styles/_legacy/ErrorState.css';

export default function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  inline = false,
  className = '',
}) {
  return (
    <div className={`error-state ${inline ? 'error-state-inline' : ''} ${className}`}>
      <AlertTriangle size={inline ? 20 : 40} className="error-state-icon" />
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry} size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}
