export default function HomeLoading() {
  return (
    <div className="page-loading" aria-busy="true" aria-label="Loading projects">
      <div className="page-loading__bar" />
      <style>{`
        .page-loading {
          min-height: 40vh;
          padding: 120px 24px;
        }
        .page-loading__bar {
          max-width: 752px;
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
