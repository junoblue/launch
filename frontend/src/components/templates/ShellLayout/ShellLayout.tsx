import React from 'react';
import { NavigationMenu } from '@radix-ui/react-navigation-menu';

interface ShellLayoutProps {
  children: React.ReactNode;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <NavigationMenu>
            {/* Main Navigation Items */}
            <div className="flex gap-6 md:gap-10">
              {/* eCommerce Section */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  eCommerce
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-0 w-full sm:w-auto">
                  {/* eCommerce Menu Items */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* CRM Section */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>
                  CRM
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  {/* CRM Menu Items */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* ERP Section */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>
                  ERP
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  {/* ERP Menu Items */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              {/* Accounting Section */}
              <NavigationMenu.Item>
                <NavigationMenu.Trigger>
                  Accounting
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  {/* Accounting Menu Items */}
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </div>
          </NavigationMenu>

          {/* User Menu */}
          <div className="ml-auto flex items-center space-x-4">
            {/* User Profile & Settings */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex h-14 items-center">
          {/* Footer Content */}
        </div>
      </footer>
    </div>
  );
};

export default ShellLayout; 