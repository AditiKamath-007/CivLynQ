import React from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  text,
  description,
  action,
  children,
  className = '',
}) {
  const renderIcon = () => {
    if (React.isValidElement(Icon)) {
      return React.cloneElement(Icon, {
        className: `empty-state-icon ${Icon.props.className || ''}`.trim(),
      });
    }
    const IconComponent = Icon;
    return <IconComponent size={56} className="empty-state-icon" />;
  };

  return (
    <div className={`empty-state ${className}`}>
      {renderIcon()}
      <h3 className="empty-state-title">{title}</h3>
      {(text || description) && <p className="empty-state-text">{text || description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
      {children}
    </div>
  );
}
