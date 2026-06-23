import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  fetchDistrictOptions,
  fetchNeighborhoodOptions,
  normalizeLocationValue,
  type LocationOption,
} from "@/lib/locations";
import { index as listingsIndex } from "@/routes/listings";

export type ListingFilters = {
  cityId?: string | number;
  districtId?: string | number;
  neighborhoodId?: string | number;
  city?: string;
  district?: string;
  neighborhood?: string;
  listingType?: string;
  propertyType?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
};

export type ListingFilterOptions = {
  cities: LocationOption[];
  listingTypes: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export const defaultFilterOptions: ListingFilterOptions = {
  cities: [],
  listingTypes: {
    SALE: "Satilik",
    RENT: "Kiralik",
  },
  propertyTypes: {
    APARTMENT: "Daire",
    VILLA: "Villa",
    OFFICE: "Ofis",
    SHOP: "Dukkan",
    LAND: "Arsa",
    BUILDING: "Bina",
  },
};

type SearchBarProps = {
  filters?: ListingFilters;
  filterOptions?: ListingFilterOptions;
  compact?: boolean;
};

const emptyFilters: ListingFilters = {};

type SearchFormState = {
  cityId: string;
  districtId: string;
  neighborhoodId: string;
  listingType: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
};

function buildListingsUrl(filters: SearchFormState) {
  const query: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "") {
      query[key] = value;
    }
  });

  return listingsIndex.url({ query });
}

function initialFormState(filters: ListingFilters): SearchFormState {
  return {
    cityId: normalizeLocationValue(filters.cityId),
    districtId: normalizeLocationValue(filters.districtId),
    neighborhoodId: normalizeLocationValue(filters.neighborhoodId),
    listingType: normalizeLocationValue(filters.listingType),
    propertyType: normalizeLocationValue(filters.propertyType),
    minPrice: normalizeLocationValue(filters.minPrice),
    maxPrice: normalizeLocationValue(filters.maxPrice),
  };
}

export default function SearchBar({
  filters: initialFilters = emptyFilters,
  filterOptions = defaultFilterOptions,
  compact = false,
}: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFormState>(() => initialFormState(initialFilters));
  const [districtOptions, setDistrictOptions] = useState<LocationOption[]>([]);
  const [neighborhoodOptions, setNeighborhoodOptions] = useState<LocationOption[]>([]);

  useEffect(() => {
    setFilters(initialFormState(initialFilters));
  }, [initialFilters]);

  useEffect(() => {
    if (!filters.cityId) {
      setDistrictOptions([]);
      setNeighborhoodOptions([]);
      return;
    }

    const controller = new AbortController();

    fetchDistrictOptions(filters.cityId, controller.signal)
      .then((options) => {
        setDistrictOptions(options);
        setFilters((current) => ({
          ...current,
          districtId: options.some((option) => String(option.id) === current.districtId) ? current.districtId : "",
          neighborhoodId:
            current.districtId && options.some((option) => String(option.id) === current.districtId)
              ? current.neighborhoodId
              : "",
        }));
      })
      .catch(() => {
        setDistrictOptions([]);
      });

    return () => controller.abort();
  }, [filters.cityId]);

  useEffect(() => {
    if (!filters.districtId) {
      setNeighborhoodOptions([]);
      return;
    }

    const controller = new AbortController();

    fetchNeighborhoodOptions(filters.districtId, controller.signal)
      .then((options) => {
        setNeighborhoodOptions(options);
        setFilters((current) => ({
          ...current,
          neighborhoodId: options.some((option) => String(option.id) === current.neighborhoodId)
            ? current.neighborhoodId
            : "",
        }));
      })
      .catch(() => {
        setNeighborhoodOptions([]);
      });

    return () => controller.abort();
  }, [filters.districtId]);

  function updateFilter<Key extends keyof SearchFormState>(key: Key, value: SearchFormState[Key]) {
    setFilters((current) => {
      if (key === "cityId") {
        return {
          ...current,
          cityId: value,
          districtId: "",
          neighborhoodId: "",
        };
      }

      if (key === "districtId") {
        return {
          ...current,
          districtId: value,
          neighborhoodId: "",
        };
      }

      return { ...current, [key]: value };
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.visit(buildListingsUrl(filters), {
      method: "get",
      preserveScroll: false,
      preserveState: false,
    });
  }

  return (
    <section className={compact ? "" : "relative z-10 mx-4 -mt-20 max-w-7xl px-0 sm:mx-5 sm:-mt-24 lg:mx-auto lg:px-8"}>
      <div className={compact ? "" : "premium-shadow overflow-hidden border border-stone-line bg-white p-5 lg:p-8"}>
        {!compact ? (
          <div className="mb-6 flex min-w-0 flex-col justify-between gap-2 border-b border-stone-line pb-5 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <p className="section-eyebrow">Portfoy arama</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-navy">
                <span className="block">Size en uygun</span>
                <span className="block">gayrimenkulu bulun</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Sehir, ilce, mahalle, tip ve fiyat araligina gore secili portfoyleri kesfedin.
            </p>
          </div>
        ) : null}

        <form
          onSubmit={submit}
          className={
            compact
              ? "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
              : "grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8"
          }
        >
          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Sehir</span>
            <select
              name="cityId"
              value={filters.cityId}
              onChange={(event) => updateFilter("cityId", event.target.value)}
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line bg-white px-3 text-sm text-navy outline-none transition focus:border-gold"
            >
              <option value="">Sehir secin</option>
              {filterOptions.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Ilce</span>
            <select
              name="districtId"
              value={filters.districtId}
              onChange={(event) => updateFilter("districtId", event.target.value)}
              disabled={!filters.cityId}
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line bg-white px-3 text-sm text-navy outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-gold"
            >
              <option value="">Ilce secin</option>
              {districtOptions.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Mahalle</span>
            <select
              name="neighborhoodId"
              value={filters.neighborhoodId}
              onChange={(event) => updateFilter("neighborhoodId", event.target.value)}
              disabled={!filters.districtId}
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line bg-white px-3 text-sm text-navy outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-gold"
            >
              <option value="">Mahalle secin</option>
              {neighborhoodOptions.map((neighborhood) => (
                <option key={neighborhood.id} value={neighborhood.id}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Ilan Tipi</span>
            <select
              name="listingType"
              value={filters.listingType}
              onChange={(event) => updateFilter("listingType", event.target.value)}
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line bg-white px-3 text-sm text-navy outline-none transition focus:border-gold"
            >
              <option value="">Tumu</option>
              {Object.entries(filterOptions.listingTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Emlak Tipi</span>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={(event) => updateFilter("propertyType", event.target.value)}
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line bg-white px-3 text-sm text-navy outline-none transition focus:border-gold"
            >
              <option value="">Tumu</option>
              {Object.entries(filterOptions.propertyTypes).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Minimum Fiyat</span>
            <input
              type="number"
              min="0"
              step="1"
              name="minPrice"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
              placeholder="₺"
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line px-3 text-sm outline-none transition focus:border-gold"
            />
          </label>

          <label className="block min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Maksimum Fiyat</span>
            <input
              type="number"
              min="0"
              step="1"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
              placeholder="₺"
              className="mt-2 h-[52px] w-full min-w-0 rounded-[2px] border border-stone-line px-3 text-sm outline-none transition focus:border-gold"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-[2px] bg-navy px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-navy-soft md:col-span-2 xl:col-span-4 2xl:col-span-1 2xl:self-end"
          >
            <Search size={18} />
            Ara
          </button>
        </form>
      </div>
    </section>
  );
}
