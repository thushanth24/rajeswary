import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { ReactNode } from "react";

const authMocks = {
  onAuthStateChange: vi.fn(),
  getSession: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
};
const fromMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (...args: unknown[]) => authMocks.onAuthStateChange(...args),
      getSession: (...args: unknown[]) => authMocks.getSession(...args),
      signInWithPassword: (...args: unknown[]) => authMocks.signInWithPassword(...args),
      signOut: (...args: unknown[]) => authMocks.signOut(...args),
    },
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

import { AuthProvider, useAuth } from "./useAuth";

function chainResolving(data: unknown, error: unknown = null) {
  const chain: Record<string, unknown> = {};
  for (const method of ["select", "eq", "in", "limit", "order"]) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error }).then(resolve);
  return chain;
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const fakeUser = { id: "user-1", email: "admin@example.com" };
const fakeSession = { user: fakeUser, access_token: "token" };

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    authMocks.getSession.mockResolvedValue({ data: { session: null } });
    fromMock.mockImplementation(() => chainResolving([]));
  });

  it("throws when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });

  it("starts unauthenticated when there is no session", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.roles).toEqual([]);
    expect(result.current.isAdmin).toBe(false);
  });

  it("loads the user and roles from an existing session", async () => {
    authMocks.getSession.mockResolvedValue({ data: { session: fakeSession } });
    fromMock.mockImplementation((table: string) =>
      chainResolving(table === "user_roles" ? [{ role: "admin" }] : [])
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.user).not.toBeNull());
    await waitFor(() => expect(result.current.roles).toEqual(["admin"]));
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isSuperAdmin).toBe(false);
    expect(result.current.isHallManager).toBe(false);
  });

  it("treats super_admin as admin too", async () => {
    authMocks.getSession.mockResolvedValue({ data: { session: fakeSession } });
    fromMock.mockImplementation((table: string) =>
      chainResolving(table === "user_roles" ? [{ role: "super_admin" }] : [])
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isSuperAdmin).toBe(true));
    expect(result.current.isAdmin).toBe(true);
  });

  it("signIn delegates to supabase and surfaces errors", async () => {
    const authError = new Error("Invalid login credentials");
    authMocks.signInWithPassword.mockResolvedValue({ error: authError });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let response: { error: Error | null } | undefined;
    await act(async () => {
      response = await result.current.signIn("a@b.com", "wrong");
    });

    expect(authMocks.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "wrong",
    });
    expect(response?.error).toBe(authError);
  });

  it("signOut calls supabase and clears roles", async () => {
    authMocks.getSession.mockResolvedValue({ data: { session: fakeSession } });
    authMocks.signOut.mockResolvedValue({ error: null });
    fromMock.mockImplementation((table: string) =>
      chainResolving(table === "user_roles" ? [{ role: "admin" }] : [])
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.roles).toEqual(["admin"]));

    await act(async () => {
      await result.current.signOut();
    });

    expect(authMocks.signOut).toHaveBeenCalled();
    expect(result.current.roles).toEqual([]);
  });

  it("unsubscribes from auth changes on unmount", async () => {
    const unsubscribe = vi.fn();
    authMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
    });

    const { result, unmount } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
