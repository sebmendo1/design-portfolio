export default function CaseStudyLoading() {
  return (
    <div className="case-loading" aria-busy="true" aria-label="Loading case study">
      <div className="case-loading__bar" />
      <style>{`
        .case-loading {
          min-height: 60vh;
          padding: 120px 24px;
        }
        .case-loading__bar {
          max-width: 520px;
          margin: 0 auto;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f4f3f2 0%, #e0dfde 50%, #f4f3f2 100%);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
    </div>
  );
}
