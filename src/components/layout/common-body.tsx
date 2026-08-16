import Header, { type HeaderProps } from "@/components/layout/header";
import { cn } from "@/lib/utils";

interface CommonBodyProps extends HeaderProps {
  children: React.ReactNode;
  showHeader?: boolean;
  hiddenBackgroundBlur?: boolean
}

export default function CommonBody({
  children,
  showHeader = false,
  hasName,
  hasNavigations,
  navigationItems,
  hasButtonsAuth,
  hiddenBackgroundBlur = false
}: CommonBodyProps) {
  return (
    <>
      {showHeader ? (
        <Header
          hasNavigations={hasNavigations}
          navigationItems={navigationItems}
          hasButtonsAuth={hasButtonsAuth}
          hasName={hasName}
        />
      ) : null}

      <main
        className={cn(
          "relative isolate flex flex-col overflow-clip bg-[#09090b] text-zinc-50",
          showHeader ? "min-h-[calc(100vh-4.5rem)]" : "min-h-screen"
        )}
      >
        {!hiddenBackgroundBlur &&
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-224 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_55%)]"
          />
        }

        {children}
      </main>
    </>
  );
}
