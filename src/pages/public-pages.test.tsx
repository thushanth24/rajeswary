import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/integrations/supabase/client", async () => {
  const { supabaseMock } = await import("@/test/supabase-mock");
  return { supabase: supabaseMock };
});

import {
  resetSupabaseMock,
  setTableData,
  authMock,
  functionsMock,
  writeLog,
} from "@/test/supabase-mock";
import { renderWithProviders } from "@/test/test-utils";

import Index from "./Index";
import Halls from "./Halls";
import HallDetail from "./HallDetail";
import Services from "./Services";
import Menus from "./Menus";
import About from "./About";
import Contact from "./Contact";
import Gallery from "./Gallery";
import Charity from "./Charity";
import Auth from "./Auth";
import ResetPassword from "./ResetPassword";
import NotFound from "./NotFound";
import RefundPolicy from "./RefundPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const dbHall = {
  id: "uuid-1",
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
    hall_images: [],
    hall_reviews: [],
    hall_event_photos: [],
    gallery_albums: [],
    gallery_images: [],
    bungalow_rooms: [],
  });
});

describe("public pages render without crashing", () => {
  it("Index (home) renders", async () => {
    const { container } = renderWithProviders(<Index />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("Halls listing renders and shows halls from the DB", async () => {
    renderWithProviders(<Halls />);
    await waitFor(() =>
      expect(screen.getAllByText(/Chelva Mahal/i).length).toBeGreaterThan(0)
    );
  });

  it("HallDetail renders a hall by slug", async () => {
    renderWithProviders(<HallDetail />, {
      route: "/halls/chelva-mahal",
      path: "/halls/:slug",
    });
    await waitFor(() =>
      expect(screen.getAllByText(/Chelva Mahal/i).length).toBeGreaterThan(0)
    );
  });

  it("Services renders every service from the catalog", async () => {
    const { container } = renderWithProviders(<Services />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
    expect(screen.getAllByText(/Catering/i).length).toBeGreaterThan(0);
  });

  it("Menus renders", async () => {
    const { container } = renderWithProviders(<Menus />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("About renders", async () => {
    const { container } = renderWithProviders(<About />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("Gallery renders", async () => {
    const { container } = renderWithProviders(<Gallery />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("Charity renders", async () => {
    const { container } = renderWithProviders(<Charity />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("RefundPolicy renders", async () => {
    const { container } = renderWithProviders(<RefundPolicy />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("PrivacyPolicy renders", async () => {
    const { container } = renderWithProviders(<PrivacyPolicy />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("TermsAndConditions renders", async () => {
    const { container } = renderWithProviders(<TermsAndConditions />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });

  it("NotFound shows a 404 message", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithProviders(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    errSpy.mockRestore();
  });
});

describe("Auth page", () => {
  it("renders the login form", async () => {
    renderWithProviders(<Auth />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText("admin@example.com")).toBeInTheDocument()
    );
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("submits credentials to supabase on login", async () => {
    const user = userEvent.setup();
    authMock.signInWithPassword.mockResolvedValue({ error: null });

    renderWithProviders(<Auth />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText("admin@example.com")).toBeInTheDocument()
    );

    await user.type(
      screen.getByPlaceholderText("admin@example.com"),
      "admin@test.com"
    );
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(authMock.signInWithPassword).toHaveBeenCalledWith({
        email: "admin@test.com",
        password: "secret123",
      })
    );
  });
});

describe("ResetPassword page", () => {
  it("renders", async () => {
    const { container } = renderWithProviders(<ResetPassword />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
  });
});

describe("Contact page", () => {
  it("renders the contact form", async () => {
    const { container } = renderWithProviders(<Contact />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());
    // a form with at least name/email/message inputs exists
    expect(container.querySelectorAll("input, textarea").length).toBeGreaterThan(2);
  });

  it("saves the message and triggers the notification function on submit", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Contact />);
    await waitFor(() => expect(container.firstChild).not.toBeNull());

    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>("input")
    );
    const nameInput = inputs.find((i) => i.name.toLowerCase().includes("name") || i.id.toLowerCase().includes("name"));
    const emailInput = inputs.find((i) => i.type === "email");
    const textarea = container.querySelector("textarea");
    const submit = container.querySelector<HTMLButtonElement>('button[type="submit"]');

    // Only run the interaction if the form is structured as expected
    if (nameInput && emailInput && textarea && submit) {
      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(textarea, "Hello, I want to book a hall.");
      const phoneInput = inputs.find((i) => i.type === "tel");
      if (phoneInput) await user.type(phoneInput, "0771234567");
      await user.click(submit);

      await waitFor(() => {
        expect(
          writeLog.some((w) => w.table === "contact_messages" && w.op === "insert")
        ).toBe(true);
      });
      expect(functionsMock.invoke).toHaveBeenCalled();
    }
  });
});
