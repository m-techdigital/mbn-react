export default function ActionGroup({ children, className = '', columns = 'auto', align = 'end', block = false }) {
  return (
    <div
      className={`mbn-action-group mbn-action-group--${columns} is-${align} ${block ? 'is-block' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
