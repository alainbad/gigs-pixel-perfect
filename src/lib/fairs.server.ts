import { createServerFn } from "@tanstack/react-start";
import { type Fair, SEED_FAIRS } from "./fairs-data";

// Airtable base schema (table default name "Fairs"), one row per career fair:
//   id          Single line text   e.g. "CF-081"
//   name        Single line text
//   host        Single line text
//   venue       Single line text
//   city        Single line text
//   region      Single select      North America | Europe | Middle East | Asia Pacific | Latin America | Africa | Global
//   date        Single line text   display date, e.g. "18 Jul 2026"
//   iso         Single line text   ISO 8601 datetime, e.g. "2026-07-18T09:00:00Z"
//   format      Single select      In-Person | Hybrid | Virtual
//   employers   Number
//   openings    Number
//   attendees   Number
//   industries  Multiple select
//   status      Single select      Registration Open | Almost Full | Waitlist
//   featured    Checkbox
//   img         URL / Single line text
//
// Configure via env vars: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, and optionally AIRTABLE_TABLE_NAME
// (defaults to "Fairs"). Without these set, the page falls back to SEED_FAIRS.

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

type AirtableResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function recordToFair(record: AirtableRecord): Fair {
  const f = record.fields;
  return {
    id: String(f.id ?? record.id),
    name: String(f.name ?? ""),
    host: String(f.host ?? ""),
    venue: String(f.venue ?? ""),
    city: String(f.city ?? ""),
    region: String(f.region ?? ""),
    date: String(f.date ?? ""),
    iso: String(f.iso ?? ""),
    format: (f.format as Fair["format"]) ?? "In-Person",
    employers: Number(f.employers ?? 0),
    openings: Number(f.openings ?? 0),
    attendees: Number(f.attendees ?? 0),
    industries: Array.isArray(f.industries) ? f.industries.map(String) : [],
    status: (f.status as Fair["status"]) ?? "Registration Open",
    featured: Boolean(f.featured),
    img: String(f.img ?? ""),
  };
}

async function fetchAllRecords(baseId: string, table: string, apiKey: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`);
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) {
      throw new Error(`Airtable request failed: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as AirtableResponse;
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

export const getFairs = createServerFn({ method: "GET" }).handler(async (): Promise<Fair[]> => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME || "Fairs";

  if (!apiKey || !baseId) {
    return SEED_FAIRS;
  }

  try {
    const records = await fetchAllRecords(baseId, table, apiKey);
    if (records.length === 0) return SEED_FAIRS;
    return records.map(recordToFair);
  } catch (error) {
    console.error("Failed to load fairs from Airtable, falling back to seed data:", error);
    return SEED_FAIRS;
  }
});
