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
  writeLog,
  functionsMock,
} from "@/test/supabase-mock";
import { renderWithProviders } from "@/test/test-utils";
import { bungalows as staticBungalows } from "@/data/bungalows";
import Bungalows from "./Bungalows";

beforeEach(() => {
  resetSupabaseMock();
  localStorage.clear();
  // empty DB → page falls back to the static bungalow catalog
  setTableData({ bungalow_rooms: [], bungalow_bookings: [] });
});

function enabledDaysInOpenCalendar() {
  const grids = screen.getAllByRole("grid");
  const grid = grids[grids.length - 1];
  return within(grid)
    .getAllByRole("gridcell")
    .flatMap((cell) =>
      cell.tagName === "BUTTON"
        ? [cell as HTMLButtonElement]
        : Array.from(cell.querySelectorAll("button"))
    )
    .filter((b) => !b.disabled && /^\d+$/.test(b.textContent?.trim() ?? ""));
}

async function goToNextMonth(user: ReturnType<typeof userEvent.setup>) {
  const nav = screen
    .getAllByRole("button", { name: /next month/i })
    .slice(-1)[0];
  await user.click(nav);
}

async function fillDates(
  user: ReturnType<typeof userEvent.setup>,
  dialog: HTMLElement
) {
  // Check-in: pick a mid-month day in the NEXT month (always selectable)
  const checkInTrigger = within(dialog)
    .getAllByRole("button")
    .find((b) => b.textContent?.trim() === "Select");
  expect(checkInTrigger).toBeTruthy();
  await user.click(checkInTrigger!);
  await goToNextMonth(user);
  let days = enabledDaysInOpenCalendar();
  const midIndex = Math.floor(days.length / 2);
  await user.click(days[midIndex]);

  // Check-out: the following day (one-night stay)
  const checkOutTrigger = within(dialog)
    .getAllByRole("button")
    .find((b) => b.textContent?.trim() === "Select");
  expect(checkOutTrigger).toBeTruthy();
  await user.click(checkOutTrigger!);
  await goToNextMonth(user);
  days = enabledDaysInOpenCalendar();
  expect(days.length).toBeGreaterThan(0);
  await user.click(days[0]); // first enabled day after check-in
}

async function openBookingDialog(user: ReturnType<typeof userEvent.setup>) {
  renderWithProviders(<Bungalows />, { route: "/bungalows", path: "/bungalows" });
  const bookButtons = await screen.findAllByRole("button", { name: /book now/i });
  await user.click(bookButtons[0]); // first card = Double Room
  return screen.findByRole("dialog");
}

describe("Bungalows page", () => {
  it("renders the room type cards from the static catalog", async () => {
    renderWithProviders(<Bungalows />, { route: "/bungalows", path: "/bungalows" });
    await waitFor(() =>
      expect(screen.getAllByText(/double room/i).length).toBeGreaterThan(0)
    );
    expect(screen.getAllByText(/triple room/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/family room/i).length).toBeGreaterThan(0);
  });

  it("creates a pending booking and starts PayHere checkout on submit", async () => {
    const user = userEvent.setup();
    const dialog = await openBookingDialog(user);

    await fillDates(user, dialog);
    await user.type(
      within(dialog).getByPlaceholderText("Your full name"),
      "Guest One"
    );
    await user.type(
      within(dialog).getByPlaceholderText("+94 77 123 4567"),
      "0771234567"
    );

    const submit = within(dialog).getByRole("button", {
      name: /proceed to payment/i,
    });
    await user.click(submit);

    await waitFor(() => {
      const insert = writeLog.find(
        (w) => w.table === "bungalow_bookings" && w.op === "insert"
      );
      expect(insert).toBeTruthy();
    });

    const insert = writeLog.find(
      (w) => w.table === "bungalow_bookings" && w.op === "insert"
    )!;
    expect(insert.payload).toMatchObject({
      full_name: "Guest One",
      mobile_number: "0771234567",
      ac_type: "AC",
      package_type: "roomOnly",
      status: "pending_payment",
      payment_status: "pending",
      paid_amount: 0,
      adults: 1,
      children: 0,
    });
    // one night at the AC double-room rate
    expect(insert.payload.total_amount).toBe(6000);
    // a physical AC room was assigned
    expect(insert.payload.room_type).toMatch(/^Double Room AC-/);

    // PayHere checkout was requested with the booking total
    await waitFor(() => expect(functionsMock.invoke).toHaveBeenCalled());
    const [fnName, fnArgs] = functionsMock.invoke.mock.calls[0];
    expect(fnName).toBe("payhere-checkout");
    expect(fnArgs.body.amount).toBe("6000.00");

    // proof snapshot stored for the post-payment receipt
    const proofKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("bungalow-booking-proof:")
    );
    expect(proofKeys).toHaveLength(1);
  }, 30000);

  it("assigns an AC room at Non-AC rates when all Non-AC rooms are taken", async () => {
    // all four static Non-AC double rooms are occupied for any date range
    setTableData({
      bungalow_bookings: [1, 2, 3, 4].map((i) => ({
        room_type: `Double Room Non-AC-${i}`,
        status: "confirmed",
      })),
    });

    const user = userEvent.setup();
    const dialog = await openBookingDialog(user);

    await user.click(within(dialog).getByRole("button", { name: /without ac/i }));
    await fillDates(user, dialog);
    await user.type(
      within(dialog).getByPlaceholderText("Your full name"),
      "Guest Two"
    );
    await user.type(
      within(dialog).getByPlaceholderText("+94 77 123 4567"),
      "0777654321"
    );
    await user.click(
      within(dialog).getByRole("button", { name: /proceed to payment/i })
    );

    await waitFor(() => {
      const insert = writeLog.find(
        (w) => w.table === "bungalow_bookings" && w.op === "insert"
      );
      expect(insert).toBeTruthy();
    });

    const insert = writeLog.find(
      (w) => w.table === "bungalow_bookings" && w.op === "insert"
    )!;
    // fallback business rule: AC room assigned, but billed as Non-AC preference
    expect(insert.payload.room_type).toMatch(/^Double Room AC-/);
    expect(insert.payload.ac_type).toBe("Non-AC");
    // billed at the Non-AC double room-only tariff for one night
    const nonAcTariff = staticBungalows.find(
      (b) => b.type === "Double Room" && b.acType === "Non-AC"
    )!.tariff.roomOnly;
    expect(insert.payload.total_amount).toBe(nonAcTariff);
  }, 30000);

  it("does not submit without required name and mobile", async () => {
    const user = userEvent.setup();
    const dialog = await openBookingDialog(user);

    await fillDates(user, dialog);
    await user.click(
      within(dialog).getByRole("button", { name: /proceed to payment/i })
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(
      writeLog.find((w) => w.table === "bungalow_bookings" && w.op === "insert")
    ).toBeUndefined();
    expect(functionsMock.invoke).not.toHaveBeenCalled();
  }, 30000);

  it("does not submit without dates", async () => {
    const user = userEvent.setup();
    const dialog = await openBookingDialog(user);

    await user.type(
      within(dialog).getByPlaceholderText("Your full name"),
      "Guest Three"
    );
    await user.type(
      within(dialog).getByPlaceholderText("+94 77 123 4567"),
      "0771112222"
    );
    await user.click(
      within(dialog).getByRole("button", { name: /proceed to payment/i })
    );

    await new Promise((r) => setTimeout(r, 50));
    expect(
      writeLog.find((w) => w.table === "bungalow_bookings" && w.op === "insert")
    ).toBeUndefined();
  }, 30000);
});
