import { Logo } from '@/components/ui/Logo';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        {children}
        <div className="text-secondary-text mt-6 text-center text-xs">
          <span>&copy; {new Date().getFullYear()} Project Review. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
