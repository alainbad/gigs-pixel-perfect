export type Fair = {
  id: string;
  name: string;
  host: string;
  venue: string;
  city: string;
  region: string;
  date: string;
  iso: string;
  format: "In-Person" | "Hybrid" | "Virtual";
  employers: number;
  openings: number;
  attendees: number;
  industries: string[];
  status: "Registration Open" | "Almost Full" | "Waitlist";
  featured?: boolean;
  img: string;
};

// Used when Airtable isn't configured (no AIRTABLE_API_KEY) so the page still renders.
export const SEED_FAIRS: Fair[] = [
  { id: "CF-081", name: "Gulf Talent Summit", host: "Dubai Chamber", venue: "Madinat Jumeirah", city: "Dubai", region: "Middle East", date: "18 Jul 2026", iso: "2026-07-18T09:00:00Z", format: "In-Person", employers: 148, openings: 1240, attendees: 3400, industries: ["Technology", "Finance", "Consulting"], status: "Registration Open", featured: true, img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200" },
  { id: "CF-082", name: "Frankfurt Finance Forum", host: "Deutsche Börse", venue: "The Squaire", city: "Frankfurt", region: "Europe", date: "04 Aug 2026", iso: "2026-08-04T09:00:00Z", format: "Hybrid", employers: 96, openings: 720, attendees: 2100, industries: ["Finance", "Consulting", "Legal"], status: "Registration Open", img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200" },
  { id: "CF-083", name: "London Creative Register", host: "Tate & Partners", venue: "The Barbican", city: "London", region: "Europe", date: "22 Aug 2026", iso: "2026-08-22T10:00:00Z", format: "In-Person", employers: 112, openings: 890, attendees: 2600, industries: ["Design", "Media", "Marketing"], status: "Almost Full", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200" },
  { id: "CF-084", name: "Singapore Tech Convocation", host: "GovTech SG", venue: "Marina Bay Sands", city: "Singapore", region: "Asia Pacific", date: "09 Sep 2026", iso: "2026-09-09T09:00:00Z", format: "Hybrid", employers: 174, openings: 1620, attendees: 4200, industries: ["Technology", "Data", "Engineering"], status: "Registration Open", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200" },
  { id: "CF-085", name: "Remote Futures Weekend", host: "GIGS Global", venue: "Virtual — worldwide", city: "Online", region: "Global", date: "26 Sep 2026", iso: "2026-09-26T00:00:00Z", format: "Virtual", employers: 210, openings: 2400, attendees: 8800, industries: ["Technology", "Design", "Writing", "Marketing"], status: "Registration Open", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" },
  { id: "CF-086", name: "New York Prestige Fair", host: "Cornell Careers", venue: "The Plaza", city: "New York", region: "North America", date: "14 Oct 2026", iso: "2026-10-14T09:00:00Z", format: "In-Person", employers: 132, openings: 980, attendees: 2900, industries: ["Finance", "Consulting", "Legal", "Media"], status: "Waitlist", img: "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&q=80&w=1200" },
];
