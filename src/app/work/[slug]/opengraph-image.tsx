import { ImageResponse } from 'next/og';
import { projects } from '@/data/projects';

export const alt = 'Case study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? 'Case Study';
  const tagline =
    project?.tagline ??
    project?.description ??
    'Product design case study by Sebastian Mendo';
  const company = project?.company ?? 'Sebastian Mendo';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#ffffff',
          color: '#000000',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 500, color: '#666666' }}>{company}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.45, color: '#444444', maxWidth: 960 }}>
            {tagline}
          </div>
        </div>
        <div style={{ fontSize: 24, color: '#999999' }}>Sebastian Mendo</div>
      </div>
    ),
    { ...size },
  );
}
