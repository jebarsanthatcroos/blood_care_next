export const Background = () => (
  <>
    <div
      className="absolute inset-0 opacity-[0.02] pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-75 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse, #E11D2E10 0%, transparent 65%)' }}
    />
  </>
);