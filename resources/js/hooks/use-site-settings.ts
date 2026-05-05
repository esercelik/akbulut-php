import { usePage } from "@inertiajs/react";
import type { SiteSettings } from "@/types/site-settings";

type SharedProps = {
  siteSettings: SiteSettings;
};

export function useSiteSettings(): SiteSettings {
  return usePage<SharedProps>().props.siteSettings;
}
