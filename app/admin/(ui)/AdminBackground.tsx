export const AdminBackground = () => {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.11) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute -top-32 right-0 h-125 w-125 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(225,29,46,0.18) 0%, transparent 68%)' }}
      />
      <div
        className="absolute bottom-0 left-0 h-100 w-100 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 68%)' }}
      />
    </>
  );
};