import type { ShortlistedCandidate } from "@/lib/types";

const SHORTLIST_KEY = "devhire_shortlist";
const STATS_KEY = "devhire_stats";
const RECENT_SEARCHES_KEY = "devhire_recent_searches";

const DEMO_SHORTLIST: ShortlistedCandidate[] = [
  {
    id: 810438,
    username: "gaearon",
    avatarUrl: "https://avatars.githubusercontent.com/u/810438?v=4",
    profileUrl: "https://github.com/gaearon",
    name: "Dan Abramov",
    company: "@remix_run",
    location: "London, UK",
    publicRepos: 280,
    addedAt: "2026-07-28T10:15:00.000Z",
    rating: 5,
    comment: "Strong React fundamentals and clear technical writing. Great senior hire signal.",
    label: "Strong Hire",
  },
  {
    id: 499550,
    username: "yyx990803",
    avatarUrl: "https://avatars.githubusercontent.com/u/499550?v=4",
    profileUrl: "https://github.com/yyx990803",
    name: "Evan You",
    company: "Independent",
    location: "Singapore",
    publicRepos: 190,
    addedAt: "2026-07-30T14:40:00.000Z",
    rating: 5,
    comment: "Framework-level systems thinker. Excellent for platform / DX leadership roles.",
    label: "Strong Hire",
  },
  {
    id: 170270,
    username: "sindresorhus",
    avatarUrl: "https://avatars.githubusercontent.com/u/170270?v=4",
    profileUrl: "https://github.com/sindresorhus",
    name: "Sindre Sorhus",
    company: null,
    location: "Thailand",
    publicRepos: 1200,
    addedAt: "2026-08-01T09:05:00.000Z",
    rating: 4,
    comment: "Prolific open-source author. Ideal for tooling and Node.js ecosystem work.",
    label: "Interview",
  },
  {
    id: 1500684,
    username: "kentcdodds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1500684?v=4",
    profileUrl: "https://github.com/kentcdodds",
    name: "Kent C. Dodds",
    company: "@EpicWeb-dev",
    location: "Salt Lake City, UT",
    publicRepos: 720,
    addedAt: "2026-08-02T16:20:00.000Z",
    rating: 4,
    comment: "Excellent educator and React testing depth. Strong culture / mentorship fit.",
    label: "Interview",
  },
  {
    id: 25254,
    username: "tj",
    avatarUrl: "https://avatars.githubusercontent.com/u/25254?v=4",
    profileUrl: "https://github.com/tj",
    name: "TJ Holowaychuk",
    company: "Apex",
    location: null,
    publicRepos: 310,
    addedAt: "2026-08-04T11:50:00.000Z",
    rating: 3,
    comment: "Deep backend and Go experience. Worth a screening call for infra roles.",
    label: "Maybe",
  },
  {
    id: 1024025,
    username: "rauchg",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    profileUrl: "https://github.com/rauchg",
    name: "Guillermo Rauch",
    company: "@vercel",
    location: "San Francisco, CA",
    publicRepos: 160,
    addedAt: "2026-08-05T08:30:00.000Z",
    rating: 5,
    comment: "Product + engineering leadership with modern web delivery expertise.",
    label: "Strong Hire",
  },
];

const DEMO_RECENT_SEARCHES = [
  "react typescript",
  "next.js",
  "fullstack node",
  "python ml",
  "golang backend",
  "vue",
];

const DEMO_STATS = {
  totalSearchedUsers: 128,
};

/** Seeds shortlist, dashboard stats, and recent searches for demo login. */
export function seedDemoData() {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(DEMO_SHORTLIST));
  localStorage.setItem(STATS_KEY, JSON.stringify(DEMO_STATS));
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(DEMO_RECENT_SEARCHES));
}
