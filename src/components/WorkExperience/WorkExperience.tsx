import Link from 'next/link';
import {
  PROFILE,
  PROFILE_ROLES,
  VERIFIED_IMPACT,
  type ProfileRole,
} from '@/data/profile';
import { getCompanyLogo } from '@/data/companyLogos';
import { CompanyLogo } from '@/components/CompanyLogo/CompanyLogo';
import './WorkExperience.css';

function RoleEntry({ role }: { role: ProfileRole }) {
  const logo = getCompanyLogo(role.company);

  return (
    <article className="work-experience__role" aria-labelledby={`role-${role.id}`}>
      <header className="work-experience__role-header">
        <div className="work-experience__company-info">
          {logo ? (
            <CompanyLogo src={logo} />
          ) : (
            <div className="work-experience__logo-placeholder" aria-hidden="true" />
          )}
          <div className="work-experience__details">
            <h3 id={`role-${role.id}`} className="work-experience__company">
              {role.company}
            </h3>
            <p className="work-experience__role-title">{role.role}</p>
            {role.location && (
              <p className="work-experience__location">{role.location}</p>
            )}
          </div>
        </div>
        <time
          className="work-experience__period"
          dateTime={role.endDate ? `${role.startDate}/${role.endDate}` : role.startDate}
        >
          {role.period}
        </time>
      </header>

      <p className="work-experience__summary">{role.summary}</p>

      {role.outcomes.length > 0 && (
        <div className="work-experience__block">
          <h4 className="work-experience__block-title">Outcomes</h4>
          <ul className="work-experience__list-items">
            {role.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {role.responsibilities.length > 0 && (
        <div className="work-experience__block">
          <h4 className="work-experience__block-title">Responsibilities</h4>
          <ul className="work-experience__list-items">
            {role.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {role.relatedProjectSlugs && role.relatedProjectSlugs.length > 0 && (
        <div className="work-experience__projects">
          {role.relatedProjectSlugs.map((slug) => (
            <Link key={slug} href={`/work/${slug}`} className="work-experience__project-link">
              View case study →
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}

export function WorkExperience() {
  return (
    <section className="work-experience" aria-labelledby="work-experience-heading">
      <h2 id="work-experience-heading" className="work-experience__heading">
        Work experience
      </h2>

      <section className="work-experience__impact" aria-labelledby="verified-impact-heading">
        <h3 id="verified-impact-heading" className="work-experience__subheading">
          Verified impact
        </h3>
        <ul className="work-experience__impact-list">
          {VERIFIED_IMPACT.map((impact) => (
            <li key={impact.id} className="work-experience__impact-item">
              <strong>{impact.value}</strong> — {impact.context}
              {impact.projectSlug && (
                <>
                  {' '}
                  <Link href={`/work/${impact.projectSlug}`} className="work-experience__project-link">
                    Case study
                  </Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="work-experience__operating" aria-labelledby="operating-heading">
        <h3 id="operating-heading" className="work-experience__subheading">
          How I operate at scale
        </h3>
        <ul className="work-experience__list-items">
          {PROFILE.staffLevelEvidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="work-experience__roles">
        {PROFILE_ROLES.map((role) => (
          <RoleEntry key={role.id} role={role} />
        ))}
      </div>
    </section>
  );
}
