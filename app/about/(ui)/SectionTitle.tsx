export const SectionTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={`text-2xl sm:text-3xl font-black text-white text-center mb-10 ${className}`}
  >
    {children}
  </h2>
);