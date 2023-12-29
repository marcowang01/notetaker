import { ReactNode } from 'react';
import { Metadata } from 'next';

// Assuming 'Metadata' type is correctly imported from 'next'
export const metadata: Metadata = {
  title: 'Scribe - Notes',
};

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full max-w-[1000px] h-full flex-1 flex-col space-y-8 px-6 py-24 md:flex overflow-auto">
      <div className="flex items-center justify-start space-y-2">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Notes and Docs</h2>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
