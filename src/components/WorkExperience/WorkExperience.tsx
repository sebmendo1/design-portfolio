import { workExperience } from '@/data/workExperience';
import './WorkExperience.css';

export function WorkExperience() {
  return (
    <section className="work-experience">
      <h2 className="work-experience__heading">Work experience</h2>
      <div className="work-experience__list">
        {workExperience.map((exp, index) => (
          <div key={index} className="work-experience__item">
            <div className="work-experience__company-info">
              <div className="work-experience__logo-wrap">
                {exp.logo ? (
                  <img src={exp.logo} alt={exp.company} className="work-experience__logo-img" />
                ) : (
                  <div className="work-experience__logo-placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="work-experience__details">
                <h3 className="work-experience__company">{exp.company}</h3>
                <p className="work-experience__role">{exp.role}</p>
              </div>
            </div>
            <div className="work-experience__period">{exp.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
