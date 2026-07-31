import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, FileProtectOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import PageShell from '../components/base/PageShell';
import PageSection, { DefinitionGrid, PageStack } from '../components/base/PageSection';
import { contentHubGroups, contentPages, policySources } from '../data/knowledgeBase';

function BulletList({ items, ordered = false }) {
  if (!items?.length) return null;
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag className={ordered ? 'mbn-reading-list is-ordered' : 'mbn-reading-list'}>{items.map((item) => <li key={item}>{item}</li>)}</Tag>;
}

export default function KnowledgePage() {
  const { pathname } = useLocation();
  const page = contentPages[pathname];
  if (!page) return <KnowledgeHubPage />;

  return <PageShell title={page.title} description={page.summary} width="reading">
    <PageStack>
      <PageSection className="mbn-knowledge-hero" tone="accent">
        <div className="mbn-knowledge-hero__content"><span className="mbn-knowledge-hero__icon"><SafetyCertificateOutlined /></span><div><b>{page.category}</b><p>{page.summary}</p><small>Rà soát: {page.lastReviewed || '29/07/2026'} · {page.scopeNote || 'Tài liệu hướng dẫn vận hành và giao dịch trên MBN.'}</small></div></div>
      </PageSection>
      {page.quickFacts?.length ? <PageSection title="Thông tin nhanh"><DefinitionGrid items={page.quickFacts} /></PageSection> : null}
      {page.checklist?.length ? <PageSection title="Danh sách kiểm tra trước khi tiếp tục" tone="success"><div className="mbn-check-grid">{page.checklist.map((item) => <span key={item}><CheckCircleOutlined />{item}</span>)}</div></PageSection> : null}
      {page.process?.length ? <PageSection title="Quy trình thực hiện" actions={<ClockCircleOutlined />}><ol className="mbn-process-list">{page.process.map((item, index) => <li key={item.title}><b>{index + 1}</b><div><strong>{item.title}</strong><p>{item.description}</p></div></li>)}</ol></PageSection> : null}
      {page.sections.map((section) => <PageSection key={section.title} title={section.title} className="mbn-reading-section">{section.body?.map((text) => <p key={text}>{text}</p>)}<BulletList items={section.bullets} ordered={section.ordered} />{section.rows?.length ? <DefinitionGrid items={section.rows} /> : null}</PageSection>)}
      {page.responsibilities?.length ? <PageSection title="Trách nhiệm của các bên" actions={<TeamOutlined />}><div className="mbn-responsibility-grid">{page.responsibilities.map((item) => <article key={item.role}><b>{item.role}</b><BulletList items={item.items} /></article>)}</div></PageSection> : null}
      {page.requiredEvidence?.length ? <PageSection title="Bằng chứng cần lưu" actions={<FileProtectOutlined />}><BulletList items={page.requiredEvidence} /></PageSection> : null}
      {page.warnings?.length ? <PageSection title="Lưu ý quan trọng" actions={<ExclamationCircleOutlined />} tone="warning"><BulletList items={page.warnings} /></PageSection> : null}
      <PageSection title="Tài liệu tham khảo" description="Nội dung được tổng hợp cho mục đích vận hành và trải nghiệm người dùng; không thay thế tư vấn pháp lý hoặc điều khoản chính thức của nhà phát hành."><div className="mbn-source-links">{policySources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}</a>)}</div></PageSection>
    </PageStack>
  </PageShell>;
}

export function KnowledgeHubPage() {
  return <PageShell title="Trung tâm hướng dẫn và an toàn" description="Quy trình giao dịch, thanh toán, bàn giao, bảo mật và giải quyết tranh chấp." width="wide">
    <div className="mbn-knowledge-hub">{contentHubGroups.map((group) => <PageSection key={group.title} title={group.title}><div className="mbn-knowledge-links">{group.items.map(([to, label]) => <Link key={to} to={to}><span>{label}</span><b>›</b></Link>)}</div></PageSection>)}</div>
  </PageShell>;
}
