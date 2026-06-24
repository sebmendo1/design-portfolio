import type { Project } from '@/data/projects';
import { getCompanyLogo } from '@/data/companyLogos';
import { CompanyLogo } from '@/components/CompanyLogo/CompanyLogo';
import './ProjectAboutBlock.css';

interface ProjectAboutBlockProps {
  project: Pick<Project, 'company' | 'role' | 'year'>;
}

export function ProjectAboutBlock({ project }: ProjectAboutBlockProps) {
  const { company, role, year } = project;
  if (!company) return null;

  const logo = getCompanyLogo(company);

  return (
    <div className="project-about">
      {logo && <CompanyLogo src={logo} />}
      <div className="project-about__details">
        <p className="project-about__label">About</p>
        <p className="project-about__company">{company}</p>
        {(role || year) && (
          <p className="project-about__meta">
            {[role, year?.toString()].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
