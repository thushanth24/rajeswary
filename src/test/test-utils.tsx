import { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import { TooltipProvider } from "@/components/ui/tooltip";

interface RenderOptions {
  route?: string;
  /** Route pattern for the element, e.g. "/halls/:slug". Defaults to the route. */
  path?: string;
}

/**
 * Renders a component inside the same provider stack as App.tsx
 * (react-query, helmet, language, auth, tooltips, router).
 * The supabase client must be mocked by the calling test file.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = "/", path }: RenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <MemoryRouter initialEntries={[route]}>
                {path ? (
                  <Routes>
                    <Route path={path} element={children} />
                    <Route path="*" element={<div data-testid="navigated-away" />} />
                  </Routes>
                ) : (
                  children
                )}
              </MemoryRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper });
}
