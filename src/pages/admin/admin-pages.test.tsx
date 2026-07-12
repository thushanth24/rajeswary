import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";

vi.mock("@/integrations/supabase/client", async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  return { supabase: supabaseMock };
});

import {
  resetSupabaseMock,
  setTableData,
  signInAs,
  fakeUser,
} from "@/test/supabase-mock";
import { renderWithProviders } from "@/test/test-utils";

import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import HallsManagement from "./HallsManagement";
import BookingsManagement from "./BookingsManagement";
import InventoryManagement from "./InventoryManagement";
import ManagerAssignments from "./ManagerAssignments";
import UnacknowledgedBookings from "./UnacknowledgedBookings";
import NewManualBooking from "./NewManualBooking";
import AuditLogs from "./AuditLogs";
import Reports from "./Reports";
import AdminCalendar from "./Calendar";
import ContactMessages from "./ContactMessages";
import Settings from "./Settings";
import BungalowBookings from "./BungalowBookings";
import BungalowRoomManagement from "./BungalowRoomManagement";
import GalleryAlbums from "./GalleryAlbums";

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

const dbBooking = {
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
  status: "new",
  payment_status: "unpaid",
  advance_paid_amount: 0,
  advance_amount: null,
  total_amount: null,
  is_manual_booking: false,
  reference_number: "CH-2026-ABCDE",
  acknowledged_at: null,
  confirmed_at: null,
  created_at: "2026-07-01T10:00:00Z",
  updated_at: "2026-07-01T10:00:00Z",
  halls: { name: "Chelva Mahal" },
};

function seedAdminTables() {
  setTableData({
    halls: [dbHall],
    hall_sections: [],
    hall_managers: [],
    bookings: [dbBooking],
    hall_closed_dates: [],
    booking_inventory: [],
    inventory: [],
    profiles: [
      {
        id: fakeUser.id,
        email: "admin@example.com",
        full_name: "Admin User",
        created_at: "2026-01-01T00:00:00Z",
      },
    ],
    contact_messages: [
      {
        id: "msg-1",
        name: "Ravi",
        email: "ravi@example.com",
        phone: "0770000000",
        message: "Do you have availability in September?",
        is_read: false,
        created_at: "2026-07-01T10:00:00Z",
      },
    ],
    audit_logs: [
      {
        id: "log-1",
        action: "UPDATE",
        table_name: "bookings",
        record_id: "booking-1",
        user_id: fakeUser.id,
        user_email: "admin@example.com",
        old_data: null,
        new_data: null,
        created_at: "2026-07-01T10:00:00Z",
      },
    ],
    bungalow_rooms: [
      {
        id: "room-1",
        name: "Double Room AC-1",
        location: "East Wing",
        room_type: "Double Room",
        ac_type: "AC",
        max_adults: 2,
        max_children: 1,
        tariff_room_only: 6000,
        tariff_bb: 8000,
        tariff_full_board: 12000,
        amenities: ["Wi-Fi"],
        description: "Room",
        rules: [],
        check_in_time: "12:00 PM",
        check_out_time: "11:00 AM",
        images: [],
        available: true,
        display_order: 1,
      },
    ],
    bungalow_bookings: [
      {
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
        status: "confirmed",
        created_at: "2026-07-01T10:00:00Z",
      },
    ],
    hall_gallery_albums: [],
    hall_gallery_photos: [],
  });
}

beforeEach(() => {
  resetSupabaseMock();
  signInAs(["super_admin"]);
  seedAdminTables();
});

async function expectRenders(ui: React.ReactElement, route = "/admin") {
  const { container } = renderWithProviders(ui, { route, path: route });
  await waitFor(() => expect(container.firstChild).not.toBeNull());
  return container;
}

describe("admin pages render for a super_admin", () => {
  it("Dashboard renders", async () => {
    await expectRenders(<Dashboard />);
  });

  it("UserManagement renders and lists users", async () => {
    await expectRenders(<UserManagement />, "/admin/users");
    await waitFor(() =>
      expect(screen.getAllByText(/admin@example\.com/i).length).toBeGreaterThan(0)
    );
  });

  it("HallsManagement renders and lists halls", async () => {
    await expectRenders(<HallsManagement />, "/admin/halls");
    await waitFor(() =>
      expect(screen.getAllByText(/chelva mahal/i).length).toBeGreaterThan(0)
    );
  });

  it("BookingsManagement renders and lists bookings", async () => {
    await expectRenders(<BookingsManagement />, "/admin/bookings");
    await waitFor(() =>
      expect(screen.getAllByText(/priya kumar/i).length).toBeGreaterThan(0)
    );
  });

  it("InventoryManagement renders", async () => {
    await expectRenders(<InventoryManagement />, "/admin/inventory");
  });

  it("ManagerAssignments renders", async () => {
    await expectRenders(<ManagerAssignments />, "/admin/managers");
  });

  it("UnacknowledgedBookings renders", async () => {
    await expectRenders(<UnacknowledgedBookings />, "/admin/unacknowledged");
  });

  it("NewManualBooking renders", async () => {
    await expectRenders(<NewManualBooking />, "/admin/new-booking");
  });

  it("AuditLogs renders and shows log entries", async () => {
    await expectRenders(<AuditLogs />, "/admin/audit-logs");
    await waitFor(() =>
      expect(screen.getAllByText(/bookings/i).length).toBeGreaterThan(0)
    );
  });

  it("Reports renders", async () => {
    await expectRenders(<Reports />, "/admin/reports");
  });

  it("Calendar renders", async () => {
    await expectRenders(<AdminCalendar />, "/admin/calendar");
  });

  it("ContactMessages renders and shows messages", async () => {
    await expectRenders(<ContactMessages />, "/admin/contact-messages");
    await waitFor(() =>
      expect(screen.getAllByText(/ravi/i).length).toBeGreaterThan(0)
    );
  });

  it("Settings renders", async () => {
    await expectRenders(<Settings />, "/admin/settings");
  });

  it("BungalowBookings renders and shows guest bookings", async () => {
    await expectRenders(<BungalowBookings />, "/admin/bungalow-bookings");
    await waitFor(() =>
      expect(screen.getAllByText(/guest one/i).length).toBeGreaterThan(0)
    );
  });

  it("BungalowRoomManagement renders and shows rooms", async () => {
    await expectRenders(<BungalowRoomManagement />, "/admin/bungalow-rooms");
    await waitFor(() =>
      expect(screen.getAllByText(/double room ac-1/i).length).toBeGreaterThan(0)
    );
  });

  it("GalleryAlbums renders", async () => {
    await expectRenders(<GalleryAlbums />, "/admin/gallery");
  });
});
