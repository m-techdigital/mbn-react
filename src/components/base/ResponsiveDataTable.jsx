import { useCallback, useEffect, useRef, useState } from 'react';
import EmptyState from './EmptyState';

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
  const columnTemplate = columns.map((column) => column.width || 'minmax(0,1fr)').join(' ');

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
    const table = element.firstElementChild;
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [rows.length, columns.length, updateScrollState]);

  return (
    <div className={`mbn-table-shell ${className}`.trim()}>
      {caption ? <p className="mbn-table-shell__caption">{caption}</p> : null}
      {rows.length ? (
        <>
          <div className="mbn-table-scroll-hint" aria-hidden="true">Vuốt ngang để xem đầy đủ bảng</div>
          <div
            ref={scrollRef}
            className={`mbn-table-scroll ${scrollState.start ? 'is-at-start' : ''} ${scrollState.end ? 'is-at-end' : ''}`.trim()}
            role="region"
            aria-label={caption || 'Bảng dữ liệu'}
            tabIndex="0"
            onScroll={updateScrollState}
          >
            <div className="mbn-table" role="table" aria-rowcount={rows.length} style={{ minWidth }}>
              <div className="mbn-table__head" role="row" style={{ gridTemplateColumns: columnTemplate }}>
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`${column.fixed === 'right' ? 'is-fixed-right ' : ''}${column.align ? `is-${column.align}` : ''}`.trim()}
                    role="columnheader"
                  >
                    {column.title}
                  </div>
                ))}
              </div>
              <div className="mbn-table__body">
                {rows.map((row) => (
                  <div
                    className="mbn-table__row"
                    role="row"
                    style={{ gridTemplateColumns: columnTemplate }}
                    key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]}
                  >
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className={`${column.className || ''} ${column.fixed === 'right' ? 'is-fixed-right' : ''} ${column.align ? `is-${column.align}` : ''}`.trim()}
                        data-label={column.title}
                        role="cell"
                      >
                        <div className="mbn-table__cell">
                          {column.render ? column.render(row[column.dataIndex], row) : row[column.dataIndex] ?? '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <EmptyState compact title={emptyText} description="Dữ liệu mới sẽ xuất hiện tại đây khi có phát sinh." />
      )}
    </div>
  );
}
