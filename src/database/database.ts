import { randomUUID } from "crypto";

import { faker } from "@faker-js/faker";

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

interface Company {
  id: string;
  name: string;
  arr: number;
  createdAt: Date;
  tier: "basic" | "premium" | "enterprise";
}

function generateCompany(): Company {
  let companyName = "";

  while (!companyName || companyName.length > 20) {
    companyName = faker.company.name();
  }

  return {
    id: randomUUID(),
    name: companyName,
    arr: faker.number.int({ min: 100000, max: 999999 }),
    createdAt: faker.date.between({ from: "2020-01-01", to: "2025-01-01" }),
    tier: faker.helpers.arrayElement(["basic", "premium", "enterprise"]),
  };
}

class DatabaseSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  companies: Company[] = [];

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.companies = Array.from({ length: 100 }, generateCompany);
  }

  editCompany(id: string, company: Partial<Company>) {
    this.companies = this.companies.map((c) =>
      c.id === id ? { ...c, ...company } : c
    );
    this.updatedAt = new Date();
  }

  deleteCompany(id: string) {
    this.companies = this.companies.filter((c) => c.id !== id);
    this.updatedAt = new Date();
  }

  createCompany(company: Company) {
    this.companies.push(company);
    this.updatedAt = new Date();
  }
}

class Database {
  sessions: Record<string, DatabaseSession> = {};

  constructor() {}

  initializeSession(sessionId?: string) {
    const id = sessionId || randomUUID();

    if (!(id in this.sessions)) {
      this.sessions[id] = new DatabaseSession(id);
    }

    // Check for old sessions and delete them.
    this.deleteOldSessions();

    return this.sessions[id];
  }

  /**
   * Delete any sessions that haven't been updated in the last 24 hours.
   */
  deleteOldSessions() {
    for (const sessionId in this.sessions) {
      if (
        this.sessions[sessionId].updatedAt <
        new Date(Date.now() - TWENTY_FOUR_HOURS)
      ) {
        delete this.sessions[sessionId];
      }
    }
  }
}

const database = new Database();

export default database;
