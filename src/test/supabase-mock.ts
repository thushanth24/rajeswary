/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest";

/**
 * Shared Supabase mock used by all test suites.
 *
 * Usage in a test file:
 *
 *   vi.mock("@/integrations/supabase/client", async () => {
 *     const { supabaseMock } = await import("@/test/supabase-mock");
 *     return { supabase: supabaseMock };
 *   });
 *
 * Then seed data per test with `setTableData({ halls: [...] })` and reset
 * between tests with `resetSupabaseMock()`.
 */

type Row = Record<string, any>;

let tableData: Record<string, Row[]> = {};
let tableErrors: Record<string, { message: string } | null> = {};

/** Records every from() call so tests can assert on writes. */
export const writeLog: Array<{
  table: string;
  op: "insert" | "update" | "delete" | "upsert";
  payload?: any;
}> = [];

export function setTableData(tables: Record<string, Row[]>) {
  tableData = { ...tableData, ...tables };
}

export function setTableError(table: string, message: string) {
  tableErrors[table] = { message };
}

class QueryBuilder {
  private table: string;
  private singleMode: "single" | "maybeSingle" | null = null;
  private insertedPayload: any = null;
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";

  constructor(table: string) {
    this.table = table;
  }

  // -- builder methods (all chain) --
  select(..._args: any[]) {
    return this;
  }
  insert(payload: any) {
    this.op = "insert";
    this.insertedPayload = payload;
    writeLog.push({ table: this.table, op: "insert", payload });
    return this;
  }
  update(payload: any) {
    this.op = "update";
    writeLog.push({ table: this.table, op: "update", payload });
    return this;
  }
  upsert(payload: any) {
    this.op = "upsert";
    writeLog.push({ table: this.table, op: "upsert", payload });
    return this;
  }
  delete() {
    this.op = "delete";
    writeLog.push({ table: this.table, op: "delete" });
    return this;
  }
  eq() {
    return this;
  }
  neq() {
    return this;
  }
  in() {
    return this;
  }
  or() {
    return this;
  }
  not() {
    return this;
  }
  gte() {
    return this;
  }
  lte() {
    return this;
  }
  gt() {
    return this;
  }
  lt() {
    return this;
  }
  ilike() {
    return this;
  }
  contains() {
    return this;
  }
  order() {
    return this;
  }
  limit() {
    return this;
  }
  range() {
    return this;
  }
  single() {
    this.singleMode = "single";
    return this;
  }
  maybeSingle() {
    this.singleMode = "maybeSingle";
    return this;
  }

  // -- resolution --
  private resolveValue() {
    const error = tableErrors[this.table] ?? null;
    if (error) {
      return { data: null, error, count: 0 };
    }

    let rows: Row[];
    if (this.op === "insert" || this.op === "upsert") {
      rows = Array.isArray(this.insertedPayload)
        ? this.insertedPayload
        : this.insertedPayload
          ? [{ id: `mock-${this.table}-id`, ...this.insertedPayload }]
          : [];
    } else {
      rows = tableData[this.table] ?? [];
    }

    if (this.singleMode) {
      const row = rows[0] ?? null;
      if (this.singleMode === "single" && row === null) {
        return {
          data: null,
          error: { message: "JSON object requested, multiple (or no) rows returned" },
          count: 0,
        };
      }
      return { data: row, error: null, count: row ? 1 : 0 };
    }

    return { data: rows, error: null, count: rows.length };
  }

  then(resolve: (value: any) => any, reject?: (reason: any) => any) {
    return Promise.resolve(this.resolveValue()).then(resolve, reject);
  }
}

// -- auth --
export const authMock = {
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  updateUser: vi.fn(),
  resetPasswordForEmail: vi.fn(),
};

// -- edge functions --
export const functionsMock = {
  invoke: vi.fn(),
};

// -- storage --
export const storageUploadMock = vi.fn();
export const storageRemoveMock = vi.fn();
const storageMock = {
  from: () => ({
    upload: storageUploadMock,
    remove: storageRemoveMock,
    getPublicUrl: () => ({ data: { publicUrl: "https://example.com/mock.jpg" } }),
  }),
};

// -- realtime --
const channelMock = () => {
  const chan: any = {
    on: vi.fn(() => chan),
    subscribe: vi.fn(() => chan),
    unsubscribe: vi.fn(),
  };
  return chan;
};

export const fromSpy = vi.fn();

export const supabaseMock = {
  from: (table: string) => {
    fromSpy(table);
    return new QueryBuilder(table);
  },
  auth: authMock,
  functions: functionsMock,
  storage: storageMock,
  channel: channelMock,
  removeChannel: vi.fn(),
  rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
};

export const fakeUser = { id: "user-1", email: "admin@example.com" };
export const fakeSession = {
  user: fakeUser,
  access_token: "mock-token",
  refresh_token: "mock-refresh",
};

/**
 * Resets all mock state and installs sensible defaults:
 * no session, empty tables, successful auth calls.
 */
export function resetSupabaseMock() {
  tableData = {};
  tableErrors = {};
  writeLog.length = 0;
  fromSpy.mockClear();
  authMock.getSession.mockReset().mockResolvedValue({ data: { session: null } });
  authMock.onAuthStateChange.mockReset().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
  authMock.signInWithPassword.mockReset().mockResolvedValue({ error: null });
  authMock.signOut.mockReset().mockResolvedValue({ error: null });
  authMock.updateUser.mockReset().mockResolvedValue({ data: {}, error: null });
  authMock.resetPasswordForEmail.mockReset().mockResolvedValue({ error: null });
  functionsMock.invoke.mockReset().mockResolvedValue({ data: {}, error: null });
  storageUploadMock.mockReset().mockResolvedValue({ data: { path: "mock.jpg" }, error: null });
  storageRemoveMock.mockReset().mockResolvedValue({ data: null, error: null });
}

/** Seeds an authenticated session with the given roles. */
export function signInAs(roles: string[]) {
  authMock.getSession.mockResolvedValue({ data: { session: fakeSession } });
  setTableData({ user_roles: roles.map((role) => ({ role })) });
}
