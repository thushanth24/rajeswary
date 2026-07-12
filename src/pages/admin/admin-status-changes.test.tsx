import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/integrations/supabase/client", async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  return { supabase: supabaseMock };
});

import {
  resetSupabaseMock,
  setTableData,
  signInAs,
  writeLog,
  fakeUser,
} from "@/test/supabase-mock";
import { renderWithProviders } from "@/test/test-utils";
import BookingsManagement from "./BookingsManagement";
import BungalowBookings from "./BungalowBookings";

const dbHall = {
  id: "hall-uuid-1",
  slug: "chelva-mahal",
  name: "Chelva Mahal",
  is_active: true,
};

const hallBooking = (status: string) => ({
  id: "booking-1",
  hall_id: "hall-uuid-1",
  section_id: null,
  event_date: "2026-09-01",
  event_start_time: "09:00",
  event_end_time: "14:00",
  event_type: "Wedding",
  customer_name: "Priya Kumar",
  customer_phone: "0771234567",
  customer_email: "priya@example.com",
  expected_guests: 400,
  special_requests: null,
  status,
  payment_status: "unpaid",
  advance_paid_amount: 0,
  advance_amount: null,
  total_amount: null,
  internal_notes: null,
  is_manual_booking: false,
  reference_number: "CH-2026-ABCDE",
  acknowledged_at: null,
  confirmed_at: null,
  cancellation_reason: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-01T10:00:00Z",
  halls: { name: "Chelva Mahal" },
});

const bungalowBooking = (status: string) => ({
  id: "bb-1",
  full_name: "Guest One",
  mobile_number: "0771234567",
  email: null,
  address: null,
  id_proof_type: null,
  id_proof_url: null,
  room_type: "Double Room AC-1",
  ac_type: "AC",
  package_type: "roomOnly",
  check_in_date: "2026-09-01",
  check_out_date: "2026-09-02",
  adults: 2,
  children: 0,
  purpose: null,
  special_requests: null,
  total_amount: 6000,
  payment_status: "paid",
  paid_amount: 6000,
  status,
  created_at: "2026-07-01T10:00:00Z",
});

function lastUpdate(table: string) {
  return [...writeLog].reverse().find((w) => w.table === table && w.op === "update");
}

/**
 * BookingsManagement re-fetches while the hall_manager role resolves, which
 * remounts the table rows. Wait for that cycle to settle before clicking,
 * otherwise the click lands on a detached DOM node.
 */
function settle(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

describe("hall booking status changes (BookingsManagement as hall_manager)", () => {
  beforeEach(() => {
    resetSupabaseMock();
    signInAs(["hall_manager"]);
    setTableData({
      halls: [dbHall],
      hall_managers: [{ hall_id: "hall-uuid-1", user_id: fakeUser.id }],
      hall_sections: [],
      booking_inventory: [],
      hall_closed_dates: [],
    });
  });

  it("acknowledges a new booking", async () => {
    setTableData({ bookings: [hallBooking("new")] });
    const user = userEvent.setup();
    renderWithProviders(<BookingsManagement />, {
      route: "/admin/bookings",
      path: "/admin/bookings",
    });

    await screen.findByRole(
      "button",
      { name: /acknowledge/i },
      { timeout: 5000 }
    );
    await settle();
    await user.click(screen.getByRole("button", { name: /acknowledge/i }));

    await waitFor(() => {
      const update = lastUpdate("bookings");
      expect(update).toBeTruthy();
      expect(update!.payload).toMatchObject({
        status: "acknowledged",
        acknowledged_by: fakeUser.id,
      });
      expect(update!.payload.acknowledged_at).toBeTruthy();
    });
  });

  it("confirms an acknowledged booking from the detail dialog", async () => {
    setTableData({ bookings: [hallBooking("acknowledged")] });
    const user = userEvent.setup();
    renderWithProviders(<BookingsManagement />, {
      route: "/admin/bookings",
      path: "/admin/bookings",
    });

    // open the detail dialog via the row's first (eye) action button
    await screen.findByText("Priya Kumar", undefined, { timeout: 5000 });
    await settle();
    const row = screen.getByText("Priya Kumar").closest("tr")!;
    await user.click(within(row).getAllByRole("button")[0]);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm booking/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      const update = lastUpdate("bookings");
      expect(update).toBeTruthy();
      expect(update!.payload).toMatchObject({
        status: "confirmed",
        confirmed_by: fakeUser.id,
      });
      expect(update!.payload.confirmed_at).toBeTruthy();
    });
  });

  it("cancels a booking with a reason and releases its inventory", async () => {
    setTableData({ bookings: [hallBooking("confirmed")] });
    const user = userEvent.setup();
    renderWithProviders(<BookingsManagement />, {
      route: "/admin/bookings",
      path: "/admin/bookings",
    });

    await screen.findByText("Priya Kumar", undefined, { timeout: 5000 });
    await settle();
    const row = screen.getByText("Priya Kumar").closest("tr")!;
    await user.click(within(row).getAllByRole("button")[0]);

    const cancelButton = await screen.findByRole("button", {
      name: /cancel booking/i,
    });
    await user.click(cancelButton);

    // reason is mandatory before Confirm Cancellation enables
    const confirmCancel = await screen.findByRole("button", {
      name: /confirm cancellation/i,
    });
    expect(confirmCancel).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(/reason for cancellation/i),
      "Customer requested"
    );
    await waitFor(() => expect(confirmCancel).not.toBeDisabled());
    await user.click(confirmCancel);

    await waitFor(() => {
      const update = lastUpdate("bookings");
      expect(update).toBeTruthy();
      expect(update!.payload).toMatchObject({
        status: "cancelled",
        cancelled_by: fakeUser.id,
        cancellation_reason: "Customer requested",
      });
    });
    // inventory allocations must be deleted on cancellation
    expect(
      writeLog.some((w) => w.table === "booking_inventory" && w.op === "delete")
    ).toBe(true);
  });
});

describe("bungalow booking status changes (BungalowBookings as super_admin)", () => {
  beforeEach(() => {
    resetSupabaseMock();
    signInAs(["super_admin"]);
    setTableData({ bungalow_rooms: [] });
  });

  async function clickRowAction(titleName: RegExp) {
    const user = userEvent.setup();
    renderWithProviders(<BungalowBookings />, {
      route: "/admin/bungalow-bookings",
      path: "/admin/bungalow-bookings",
    });
    await screen.findAllByText("Guest One");
    const button = await screen.findByTitle(titleName);
    await user.click(button);
  }

  it("confirms a pending booking", async () => {
    setTableData({ bungalow_bookings: [bungalowBooking("pending")] });
    await clickRowAction(/^confirm$/i);
    await waitFor(() => {
      expect(lastUpdate("bungalow_bookings")!.payload).toMatchObject({
        status: "confirmed",
      });
    });
  });

  it("checks in a confirmed booking", async () => {
    setTableData({ bungalow_bookings: [bungalowBooking("confirmed")] });
    await clickRowAction(/^check in$/i);
    await waitFor(() => {
      expect(lastUpdate("bungalow_bookings")!.payload).toMatchObject({
        status: "checked_in",
      });
    });
  });

  it("completes a checked-in booking", async () => {
    setTableData({ bungalow_bookings: [bungalowBooking("checked_in")] });
    await clickRowAction(/^complete$/i);
    await waitFor(() => {
      expect(lastUpdate("bungalow_bookings")!.payload).toMatchObject({
        status: "completed",
      });
    });
  });

  it("cancels a pending booking", async () => {
    setTableData({ bungalow_bookings: [bungalowBooking("pending")] });
    await clickRowAction(/^cancel$/i);
    await waitFor(() => {
      expect(lastUpdate("bungalow_bookings")!.payload).toMatchObject({
        status: "cancelled",
      });
    });
  });
});
