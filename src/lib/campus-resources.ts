/** Curated VT-facing resources (static; admin-managed table can replace this later). */
export type CampusResource = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: "crisis" | "counseling" | "wellness";
};

export const CAMPUS_RESOURCES: CampusResource[] = [
  {
    id: "cook",
    title: "Cook Counseling Center",
    description: "Counseling, psychiatric care, and 24/7 crisis support for students.",
    href: "https://www.ucc.vt.edu",
    category: "counseling",
  },
  {
    id: "timelycare",
    title: "TimelyCare",
    description: "Virtual mental health support including TalkNow and health coaching.",
    href: "https://ucc.vt.edu/timelycare.html",
    category: "counseling",
  },
  {
    id: "hokiewellness",
    title: "Hokie Wellness",
    description: "Programs and education to support student well-being.",
    href: "https://hokiewellness.vt.edu/students",
    category: "wellness",
  },
  {
    id: "dos",
    title: "Dean of Students",
    description: "Academic support, crisis support, and student advocacy.",
    href: "https://www.dos.vt.edu",
    category: "wellness",
  },
  {
    id: "988",
    title: "988 Suicide & Crisis Lifeline",
    description: "National line—call or text 988 if you are in crisis (US).",
    href: "https://988lifeline.org",
    category: "crisis",
  },
];
