import '../../styles/_legacy/Chip.css';

export default function Chip({
  children,
  active = false,
  completed = false,
  clickable = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const classes = [
    'chip',
    active && 'chip-active',
    completed && 'chip-completed',
    clickable && 'chip-clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}
