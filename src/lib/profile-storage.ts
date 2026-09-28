import { profile as seedProfile } from "@/lib/demo-data";
import type { Profile } from "@/types";

const PROFILE_KEY = "career-profile";
export const PROFILE_CHANGE_EVENT = "career-profile-change";

export function readCareerProfile(): Profile {
  if (typeof window === "undefined") return seedProfile;
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (!saved) return seedProfile;
    const merged = { ...seedProfile, ...JSON.parse(saved) } as Profile;
    // Alex Morgan was only a fabricated starter value in the demo seed.
    if (merged.name === "Alex Morgan") merged.name = "";
    return merged;
  } catch {
    return seedProfile;
  }
}

export function saveCareerProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: profile }));
}
