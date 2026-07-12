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
} from "@/test/supabase-mock";
import { renderWithProviders } from "@/test/test-utils";
import Booking from "./Booking";

const dbHall = {
  id: "hall-uuid-1",
  slug: "chelva-mahal",
  name: "Chelva Mahal",
  image_url: null,
  capacity_min: 300,
  capacity_max: 800,
  description: "A grand hall",
  short_description: "Grand hall",
  features: ["Stage"],
  event_types: ["Wedding"],
  price_range: "₹1,00,000",
  has_ac: true,
  has_parking: true,
  has_dining: true,
  has_stage: true,
  has_power_backup: true,
  has_bride_room: true,
  has_groom_room: true,
  washrooms_count: 4,
  is_active: true,
};

beforeEach(() => {
  resetSupabaseMock();
  setTableData({
    halls: [dbHall],
    hall_sections: [],
    bookings: [],
    hall_closed_dates: [],
  });
});

/** Picks the last selectable day in the currently displayed calendar month. */
async function pickFutureDate(user: ReturnType<typeof userEvent.setup>) {
  const dateButton = screen.getByRole("button", { name: /pick a date|choose/i });
  await user.click(dateButton);

  // move to next month so a selectable day always exists regardless of today's date
  await screen.findByRole("grid");
  await user.click(
    screen.getAllByRole("button", { name: /next month/i }).slice(-1)[0]
  );
  const grid = await screen.findByRole("grid");
  const dayButtons = within(grid)
    .getAllByRole("gridcell")
    .flatMap((cell) =>
      cell.tagName === "BUTTON"
        ? [cell as HTMLButtonElement]
        : Array.from(cell.querySelectorAll("button"))
    )
    .filter((b) => !b.disabled && /^\d+$/.test(b.textContent?.trim() ?? ""));
  expect(dayButtons.length).toBeGreaterThan(0);
  await user.click(dayButtons[dayButtons.length - 1]);
}

async function selectTimeSlot(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp
) {
  const trigger = screen.getByRole("combobox");
  await user.click(trigger);
  const option = await screen.findByRole("option", { name: label });
  await user.click(option);
}

describe("Booking page — step 1 (hall selection)", () => {
  it("renders the hall list", async () => {
    renderWithProviders(<Booking />, { route: "/booking", path: "/booking" });
    await waitFor(() =>
      expect(screen.getAllByText("Chelva Mahal").length).toBeGreaterThan(0)
    );
    expect(screen.getByText(/select a mandapam/i)).toBeInTheDocument();
  });

  it("keeps Next disabled until a hall is chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />, { route: "/booking", path: "/booking" });
    await waitFor(() =>
      expect(screen.getAllByText("Chelva Mahal").length).toBeGreaterThan(0)
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();

    await user.click(screen.getByText("Chelva Mahal"));
    await waitFor(() => expect(nextButton).not.toBeDisabled());
  });

  it("starts on step 2 when a hall is preselected via URL", async () => {
    renderWithProviders(<Booking />, {
      route: "/booking?hall=chelva-mahal",
      path: "/booking",
    });
    // step 2 shows event types instead of the hall picker
    await waitFor(() =>
      expect(screen.getByText(/wedding ceremony/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/select a mandapam/i)).not.toBeInTheDocument();
  });
});

describe("Booking page — full happy path", () => {
  it("walks through all 3 steps and inserts the booking", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />, {
      route: "/booking?hall=chelva-mahal",
      path: "/booking",
    });

    // Step 2 — event details
    await waitFor(() =>
      expect(screen.getByText(/wedding ceremony/i)).toBeInTheDocument()
    );
    await user.click(screen.getByText(/wedding ceremony/i));
    await pickFutureDate(user);
    await selectTimeSlot(user, /morning/i);
    await user.type(screen.getByLabelText(/guest/i), "400");

    const nextButton = screen.getByRole("button", { name: /next/i });
    await waitFor(() => expect(nextButton).not.toBeDisabled());
    await user.click(nextButton);

    // Step 3 — contact details
    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Test Customer");
    await user.type(screen.getByLabelText(/phone/i), "0771234567");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);

    // Booking row inserted with the right shape
    await waitFor(() => {
      const insert = writeLog.find(
        (w) => w.table === "bookings" && w.op === "insert"
      );
      expect(insert).toBeTruthy();
    });

    const insert = writeLog.find(
      (w) => w.table === "bookings" && w.op === "insert"
    )!;
    expect(insert.payload).toMatchObject({
      hall_id: "hall-uuid-1",
      event_start_time: "09:00",
      event_end_time: "14:00",
      customer_name: "Test Customer",
      customer_phone: "0771234567",
      expected_guests: 400,
      status: "new",
      payment_status: "unpaid",
      is_manual_booking: false,
    });
    expect(insert.payload.reference_number).toMatch(/^CH-\d{4}-[A-Z2-9]{5}$/);

    // Success screen shows the reference
    await waitFor(() =>
      expect(
        screen.getAllByText(/^CH-\d{4}-[A-Z2-9]{5}$/).length
      ).toBeGreaterThan(0)
    );
  }, 30000);

  it("rejects an invalid phone number and does not insert", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />, {
      route: "/booking?hall=chelva-mahal",
      path: "/booking",
    });

    await waitFor(() =>
      expect(screen.getByText(/wedding ceremony/i)).toBeInTheDocument()
    );
    await user.click(screen.getByText(/wedding ceremony/i));
    await pickFutureDate(user);
    await selectTimeSlot(user, /morning/i);
    await user.type(screen.getByLabelText(/guest/i), "400");
    await user.click(screen.getByRole("button", { name: /next/i }));

    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Test Customer");
    await user.type(screen.getByLabelText(/phone/i), "123"); // too short

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await user.click(submitButton);

    // give the submit handler a tick, then confirm nothing was written
    await new Promise((r) => setTimeout(r, 50));
    expect(
      writeLog.find((w) => w.table === "bookings" && w.op === "insert")
    ).toBeUndefined();
  }, 30000);

  it("blocks submission when the slot was booked while filling the form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Booking />, {
      route: "/booking?hall=chelva-mahal",
      path: "/booking",
    });

    await waitFor(() =>
      expect(screen.getByText(/wedding ceremony/i)).toBeInTheDocument()
    );
    await user.click(screen.getByText(/wedding ceremony/i));
    await pickFutureDate(user);
    await selectTimeSlot(user, /morning/i);
    await user.type(screen.getByLabelText(/guest/i), "400");
    await user.click(screen.getByRole("button", { name: /next/i }));

    const nameInput = await screen.findByLabelText(/name/i);
    await user.type(nameInput, "Test Customer");
    await user.type(screen.getByLabelText(/phone/i), "0771234567");

    // Someone books a conflicting fullday slot right before submission
    setTableData({
      bookings: [
        {
          id: "b1",
          section_id: null,
          event_start_time: "09:00",
          event_end_time: "18:00",
          event_date: "any",
          status: "confirmed",
        },
      ],
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    // Bounced back to step 2 (event details visible again), nothing inserted
    await waitFor(() =>
      expect(screen.getByText(/wedding ceremony/i)).toBeInTheDocument()
    );
    expect(
      writeLog.find((w) => w.table === "bookings" && w.op === "insert")
    ).toBeUndefined();
  }, 30000);
});
