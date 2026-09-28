"use client";

import { useCallback, useEffect, useState } from "react";
import { profile as seedProfile } from "@/lib/demo-data";
import { PROFILE_CHANGE_EVENT, readCareerProfile, saveCareerProfile } from "@/lib/profile-storage";
import type { Profile } from "@/types";

export function useCareerProfile() {
  const [profile, setProfile] = useState<Profile>(seedProfile);
  useEffect(() => {
    const sync = () => setProfile(readCareerProfile());
    sync();
    window.addEventListener(PROFILE_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROFILE_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const updateProfile = useCallback((next: Profile | ((current: Profile) => Profile)) => {
    const updated = typeof next === "function" ? next(readCareerProfile()) : next;
    setProfile(updated);
    saveCareerProfile(updated);
  }, []);
  return [profile, updateProfile] as const;
}
