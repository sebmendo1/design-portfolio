import './PhoneMockup.css';

interface PhoneMockupProps {
  screenSrc?: string;
  screenAlt?: string;
}

export function PhoneMockup({ screenSrc, screenAlt = '' }: PhoneMockupProps) {
  return (
    <div className="phone-mockup" aria-hidden="true">
      <div className="phone-mockup__frame">
        <div className="phone-mockup__screen">
          <div className="phone-mockup__dynamic-island" />
          {screenSrc ? (
            <img
              src={screenSrc}
              alt={screenAlt}
              className="phone-mockup__screen-content"
            />
          ) : (
            <div className="phone-mockup__screen-placeholder" />
          )}
        </div>
      </div>
      {/* Side buttons */}
      <div className="phone-mockup__btn phone-mockup__btn--power" />
      <div className="phone-mockup__btn phone-mockup__btn--vol-up" />
      <div className="phone-mockup__btn phone-mockup__btn--vol-down" />
      <div className="phone-mockup__btn phone-mockup__btn--action" />
    </div>
  );
}
