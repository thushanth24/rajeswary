import { describe, it, expect } from "vitest";
import { halls } from "./halls";
import { bungalows } from "./bungalows";
import { services } from "./services";

describe("halls data", () => {
  it("has at least one hall", () => {
    expect(halls.length).toBeGreaterThan(0);
  });

  it("has unique ids and slugs", () => {
    const ids = halls.map((h) => h.id);
    const slugs = halls.map((h) => h.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every hall has a valid capacity range", () => {
    for (const hall of halls) {
      expect(hall.capacity.min).toBeGreaterThan(0);
      expect(hall.capacity.max).toBeGreaterThanOrEqual(hall.capacity.min);
    }
  });

  it("every hall has required display fields", () => {
    for (const hall of halls) {
      expect(hall.name.trim()).not.toBe("");
      expect(hall.shortDescription.trim()).not.toBe("");
      expect(hall.description.trim()).not.toBe("");
      expect(hall.image).toBeTruthy();
      expect(hall.features.length).toBeGreaterThan(0);
      expect(hall.eventTypes.length).toBeGreaterThan(0);
      expect(hall.facilities.washrooms).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("bungalows data", () => {
  it("has at least one room", () => {
    expect(bungalows.length).toBeGreaterThan(0);
  });

  it("has unique room ids", () => {
    const ids = bungalows.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tariffs increase with the meal plan", () => {
    for (const room of bungalows) {
      expect(room.tariff.roomOnly).toBeGreaterThan(0);
      expect(room.tariff.bbWithRoom).toBeGreaterThanOrEqual(room.tariff.roomOnly);
      expect(room.tariff.fullBoard).toBeGreaterThanOrEqual(room.tariff.bbWithRoom);
    }
  });

  it("every room has valid occupancy, images and rules", () => {
    for (const room of bungalows) {
      expect(room.maxOccupancy.adults).toBeGreaterThan(0);
      expect(room.maxOccupancy.children).toBeGreaterThanOrEqual(0);
      expect(room.images.length).toBeGreaterThan(0);
      expect(room.rules.length).toBeGreaterThan(0);
      expect(room.checkInTime).toBeTruthy();
      expect(room.checkOutTime).toBeTruthy();
    }
  });

  it("AC rooms are priced at or above their Non-AC counterparts of the same type", () => {
    const types = [...new Set(bungalows.map((b) => b.type))];
    for (const type of types) {
      const ac = bungalows.filter((b) => b.type === type && b.acType === "AC");
      const nonAc = bungalows.filter((b) => b.type === type && b.acType === "Non-AC");
      if (ac.length === 0 || nonAc.length === 0) continue;
      const minAc = Math.min(...ac.map((b) => b.tariff.roomOnly));
      const maxNonAc = Math.max(...nonAc.map((b) => b.tariff.roomOnly));
      expect(minAc).toBeGreaterThanOrEqual(maxNonAc);
    }
  });
});

describe("services data", () => {
  it("has at least one service", () => {
    expect(services.length).toBeGreaterThan(0);
  });

  it("has unique service ids", () => {
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every service has complete display fields and a valid category", () => {
    const categories = ["essential", "premium", "addon"];
    const badges = ["popular", "premium", "new", null];
    for (const service of services) {
      expect(service.name.trim()).not.toBe("");
      expect(service.description.trim()).not.toBe("");
      expect(service.features.length).toBeGreaterThan(0);
      expect(service.image).toBeTruthy();
      expect(categories).toContain(service.category);
      expect(badges).toContain(service.badge);
    }
  });
});
