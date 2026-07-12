import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const useAuthMock = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

import ProtectedRoute from "./ProtectedRoute";

type AuthState = Partial<ReturnType<typeof buildAuth>>;

function buildAuth(overrides: Record<string, unknown> = {}) {
  return {
    user: null,
    session: null,
    loading: false,
    roles: [] as string[],
    isSuperAdmin: false,
    isAdmin: false,
    isHallManager: false,
    isBungalowManager: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    ...overrides,
  };
}

function renderProtected(
  auth: AuthState,
  allowedRoles?: ("super_admin" | "admin" | "hall_manager" | "bungalow_manager")[]
) {
  useAuthMock.mockReturnValue(buildAuth(auth));
  return render(
    <MemoryRouter initialEntries={["/admin/secret"]}>
      <Routes>
        <Route path="/auth" element={<div>Login Page</div>} />
        <Route path="/admin" element={<div>Admin Home</div>} />
        <Route
          path="/admin/secret"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Secret Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it("shows a spinner while auth state is loading", () => {
    const { container } = renderProtected({ loading: true });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to /auth", () => {
    renderProtected({ user: null });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children for any authenticated user when no roles are required", () => {
    renderProtected({ user: { id: "u1" } });
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("renders children when the user has an allowed role", () => {
    renderProtected({ user: { id: "u1" }, isAdmin: true }, ["admin"]);
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("redirects to /admin when the user lacks the required role", () => {
    renderProtected({ user: { id: "u1" }, isHallManager: true }, ["admin"]);
    expect(screen.getByText("Admin Home")).toBeInTheDocument();
    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
  });

  it("grants access when any one of several allowed roles matches", () => {
    renderProtected({ user: { id: "u1" }, isBungalowManager: true }, [
      "admin",
      "bungalow_manager",
    ]);
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });

  it("super_admin passes an admin-only gate (isAdmin includes super_admin)", () => {
    renderProtected(
      { user: { id: "u1" }, isSuperAdmin: true, isAdmin: true },
      ["admin"]
    );
    expect(screen.getByText("Secret Content")).toBeInTheDocument();
  });
});
