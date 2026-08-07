import './Skeleton.css';

export default function Skeleton({ variant = 'text', width, height, className = '', style = {} }) {
  const mergedStyle = {
    ...style,
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={mergedStyle}
      aria-hidden="true"
    />
  );
}
