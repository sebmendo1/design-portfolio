import { workExperience } from '@/data/workExperience';
import { getCompanyLogo } from '@/data/companyLogos';
import { CompanyLogo } from '@/components/CompanyLogo/CompanyLogo';
import './WorkExperience.css';

export function WorkExperience() {
  return (
    <section className="work-experience">
      <h2 className="work-experience__heading">Work experience</h2>
      <div className="work-experience__list">
        {workExperience.map((exp, index) => {
          const logo = exp.logo ?? getCompanyLogo(exp.company);
          return (
          <div key={index} className="work-experience__item">
            <div className="work-experience__company-info">
              {logo ? (
                <CompanyLogo src={logo} />
              ) : (
                <div className="work-experience__logo-placeholder" aria-hidden="true" />
              )}
              <div className="work-experience__details">
                <h3 className="work-experience__company">{exp.company}</h3>
                <p className="work-experience__role">{exp.role}</p>
              </div>
            </div>
            <div className="work-experience__period">{exp.period}</div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
