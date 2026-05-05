export type LocationOption = {
  id: number;
  name: string;
};

type LocationResponse = {
  data?: LocationOption[];
};

export function normalizeLocationValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

async function fetchLocationOptions(url: string, signal?: AbortSignal): Promise<LocationOption[]> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Location request failed.");
  }

  const payload = (await response.json()) as LocationResponse;

  return Array.isArray(payload.data) ? payload.data : [];
}

export function fetchDistrictOptions(cityId: string | number, signal?: AbortSignal): Promise<LocationOption[]> {
  return fetchLocationOptions(`/locations/districts?city_id=${encodeURIComponent(String(cityId))}`, signal);
}

export function fetchNeighborhoodOptions(
  districtId: string | number,
  signal?: AbortSignal,
): Promise<LocationOption[]> {
  return fetchLocationOptions(
    `/locations/neighborhoods?district_id=${encodeURIComponent(String(districtId))}`,
    signal,
  );
}
