import { Link } from 'react-router-dom';

export default function GamingLink({ children, to, variant = 'secondary', size = 'md', block = false, className = '', ...props }) {
  return <Link to={to} className={`mbn-button mbn-button--${variant} mbn-button--${size}${block ? ' mbn-button--block' : ''} ${className}`.trim()} {...props}><span className="mbn-button__label">{children}</span></Link>;
}
