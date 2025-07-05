import './globals.css';
import { ReduxProvider } from './providers';
import ThemeWrapper from './theme-wraper'; 

export const metadata = {
  title: 'Data Table Manager',
  description: 'Built by Saba 🚀',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
