import '../../styles/_legacy/Tag.css';

export default function Tag({ children, variant = 'olive', className = '', ...props }) {
  return (
    <span className={`tag tag-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
