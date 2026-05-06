import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | ÉLÉVATION',
  description: 'Admin login page',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {children}
    </div>
  );
}