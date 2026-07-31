import { useCallback, useEffect, useRef, useState } from 'react';
import EmptyState from './EmptyState';

function resolveColumnWidth(width) {
  if (typeof width === 'number') return `${width}px`;
  if (typeof width === 'string' && width.trim()) return width;
  return 'auto';
}

export default function ResponsiveDataTable({
  columns,
  rows,
  rowKey = 'id',
  emptyText = 'Chưa có dữ liệu.',
  caption = '',
  minWidth = 720,
  className = '',
}) {
  const scrollRef = useRef(null);
  const [scrollState, setScrollState] = useState({ start: true, end: true });

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth);
    setScrollState({
      start: element.scrollLeft <= 2,
      end: element.scrollLeft >= maxScroll - 2,
    });
  }, []);

  useEffect(() => {
    updateScrollState();
    const element = scrollRef.current;
    if (!element) return undefined;

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateScrollState);
      return () => window.removeEventListener('resize', updateScrollState);
    }

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    const table = element.querySelector('table');
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [rows.length, columns.length, updateScrollState]);

  return (
    <div className={`mbn-table-shell mbn-semantic-table-shell ${className}`.trim()}>
      {caption ? <p className="mbn-table-shell__caption">{caption}</p> : null}
      {rows.length ? (
        <>
          <div className="mbn-table-scroll-hint" aria-hidden="true">Vuốt ngang để xem đầy đủ bảng</div>
          <div
            ref={scrollRef}
            className={`mbn-semantic-table-scroll ${scrollState.start ? 'is-at-start' : ''} ${scrollState.end ? 'is-at-end' : ''}`.trim()}
            role="region"
            aria-label={caption || 'Bảng dữ liệu'}
            tabIndex="0"
            onScroll={updateScrollState}
          >
            <table className="mbn-semantic-table" style={{ minWidth }}>
              {caption ? <caption className="sr-only">{caption}</caption> : null}
              <colgroup>
                {columns.map((column) => (
                  <col key={column.key} style={{ width: resolveColumnWidth(column.width) }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`${column.fixed === 'right' ? 'is-fixed-right ' : ''}${column.align ? `is-${column.align}` : ''}`.trim()}
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]}>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`${column.className || ''} ${column.fixed === 'right' ? 'is-fixed-right' : ''} ${column.align ? `is-${column.align}` : ''}`.trim()}
                      >
                        <div className="mbn-semantic-table__cell">
                          {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex] ?? '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <EmptyState compact title={emptyText} description="Dữ liệu mới sẽ xuất hiện tại đây khi có phát sinh." />
      )}
    </div>
  );
}
