import './Card.css';

export default function Card({
  children,
  hoverable = false,
  clickable = false,
  compact = false,
  flush = false,
  className = '',
  ...props
}) {
  const classes = [
    'card',
    hoverable && 'card-hoverable',
    clickable && 'card-clickable',
    compact && 'card-compact',
    flush && 'card-flush',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
