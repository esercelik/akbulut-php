import type { Property } from "@/types/site/property";

export const properties: Property[] = [
  {
    id: 1,
    slug: "bogaz-manzarali-premium-villa",
    title: "Bo\u011faz Manzaral\u0131 Premium Villa",
    city: "\u0130stanbul",
    district: "Beykoz",
    neighborhood: "Acarkent",
    price: "\u20BA78.500.000",
    area: 620,
    rooms: "7+2",
    baths: 5,
    status: "Sat\u0131l\u0131k",
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "Do\u011fayla i\u00e7 i\u00e7e, geni\u015f bah\u00e7e kullan\u0131m\u0131 ve y\u00fcksek g\u00fcvenlikli site avantaj\u0131yla se\u00e7kin aile ya\u015fam\u0131 i\u00e7in tasarlanm\u0131\u015f \u00f6zel villa.",
    features: ["Ak\u0131ll\u0131 ev sistemi", "\u00d6zel havuz", "Kapal\u0131 garaj", "Peyzajl\u0131 bah\u00e7e"],
    advisor: {
      name: "Selin Akbulut",
      phone: "+90 212 000 00 00",
      email: "selin@akbulutemlak.com",
    },
  },
  {
    id: 2,
    slug: "nishantasi-luks-rezidans-dairesi",
    title: "Ni\u015fanta\u015f\u0131 L\u00fcks Rezidans Dairesi",
    city: "\u0130stanbul",
    district: "\u015ei\u015fli",
    neighborhood: "Ni\u015fanta\u015f\u0131",
    price: "\u20BA185.000 / Ay",
    area: 210,
    rooms: "4+1",
    baths: 3,
    status: "Kiral\u0131k",
    type: "Rezidans",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "\u015eehrin merkezinde, concierge hizmetleri ve y\u00fcksek kaliteli i\u00e7 mimari detaylar\u0131yla prestijli rezidans ya\u015fam\u0131.",
    features: ["Concierge", "Fitness alan\u0131", "Vale hizmeti", "Merkezi lokasyon"],
    advisor: {
      name: "Mert Y\u0131lmaz",
      phone: "+90 212 000 00 01",
      email: "mert@akbulutemlak.com",
    },
  },
  {
    id: 3,
    slug: "cankaya-modern-aile-dairesi",
    title: "\u00c7ankaya Modern Aile Dairesi",
    city: "Ankara",
    district: "\u00c7ankaya",
    neighborhood: "Gaziosmanpa\u015fa",
    price: "\u20BA16.750.000",
    area: 185,
    rooms: "4+1",
    baths: 2,
    status: "Sat\u0131l\u0131k",
    type: "Daire",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "Diplomatik b\u00f6lgede, kaliteli malzeme se\u00e7imi ve ferah plan\u0131yla uzun vadeli de\u011fer vadeden modern aile dairesi.",
    features: ["Ebeveyn banyosu", "Geni\u015f balkon", "Asans\u00f6r", "Kapal\u0131 otopark"],
    advisor: {
      name: "Derya Kara",
      phone: "+90 312 000 00 00",
      email: "derya@akbulutemlak.com",
    },
  },
  {
    id: 4,
    slug: "izmir-alsancak-ticari-ofis",
    title: "Alsancak Prestijli Ticari Ofis",
    city: "\u0130zmir",
    district: "Konak",
    neighborhood: "Alsancak",
    price: "\u20BA42.000.000",
    area: 340,
    rooms: "A\u00e7\u0131k Plan",
    baths: 4,
    status: "Sat\u0131l\u0131k",
    type: "Ofis",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "Kurumsal \u015firketler i\u00e7in y\u00fcksek g\u00f6r\u00fcn\u00fcrl\u00fck, g\u00fc\u00e7l\u00fc ula\u015f\u0131m ba\u011flant\u0131lar\u0131 ve esnek planlama imkan\u0131 sunan ticari ofis.",
    features: ["Resepsiyon", "Toplant\u0131 odalar\u0131", "Fiber altyap\u0131", "Deniz ula\u015f\u0131m\u0131na yak\u0131n"],
    advisor: {
      name: "Emre \u00d6zkan",
      phone: "+90 232 000 00 00",
      email: "emre@akbulutemlak.com",
    },
  },
  {
    id: 5,
    slug: "bodrum-denize-yakin-tas-villa",
    title: "Bodrum Denize Yak\u0131n Ta\u015f Villa",
    city: "Mu\u011fla",
    district: "Bodrum",
    neighborhood: "Yal\u0131kavak",
    price: "\u20BA310.000 / Ay",
    area: 280,
    rooms: "5+1",
    baths: 4,
    status: "Kiral\u0131k",
    type: "Villa",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "Sezonluk veya uzun d\u00f6nem kullan\u0131m i\u00e7in denize yak\u0131n, \u00f6zel terasl\u0131 ve do\u011fal ta\u015f dokusuyla s\u0131cak bir ya\u015fam alan\u0131.",
    features: ["Denize yak\u0131n", "\u00d6zel teras", "Tam donan\u0131ml\u0131 mutfak", "Bah\u00e7e kullan\u0131m\u0131"],
    advisor: {
      name: "Selin Akbulut",
      phone: "+90 212 000 00 00",
      email: "selin@akbulutemlak.com",
    },
  },
  {
    id: 6,
    slug: "kadikoy-yatirimlik-dukkan",
    title: "Kad\u0131k\u00f6y Caddede Yat\u0131r\u0131ml\u0131k D\u00fckkan",
    city: "\u0130stanbul",
    district: "Kad\u0131k\u00f6y",
    neighborhood: "Ba\u011fdat Caddesi",
    price: "\u20BA28.900.000",
    area: 120,
    rooms: "Tek B\u00f6l\u00fcm",
    baths: 1,
    status: "Sat\u0131l\u0131k",
    type: "D\u00fckkan",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85",
    featured: true,
    description:
      "Yaya trafi\u011fi g\u00fc\u00e7l\u00fc, marka g\u00f6r\u00fcn\u00fcrl\u00fc\u011f\u00fc y\u00fcksek ve kira getirisi potansiyeliyle \u00f6ne \u00e7\u0131kan ticari yat\u0131r\u0131m f\u0131rsat\u0131.",
    features: ["Cadde cepheli", "Y\u00fcksek tavan", "Depo alan\u0131", "Tabela g\u00f6r\u00fcn\u00fcrl\u00fc\u011f\u00fc"],
    advisor: {
      name: "Mert Y\u0131lmaz",
      phone: "+90 212 000 00 01",
      email: "mert@akbulutemlak.com",
    },
  },
];

export const getPropertyBySlug = (slug: string) =>
  properties.find((property) => property.slug === slug);

export type PropertyFilters = {
  listingType?: string;
  propertyType?: string;
  city?: string;
  district?: string;
  consultant?: string;
};

const normalize = (value?: string) => value?.toLocaleLowerCase("tr-TR").trim();

export const getFeaturedProperties = () => properties.filter((property) => property.featured);

export const getProperties = (filters: PropertyFilters = {}) =>
  properties.filter((property) => {
    const listingType =
      filters.listingType === "SALE"
        ? "Sat\u0131l\u0131k"
        : filters.listingType === "RENT"
          ? "Kiral\u0131k"
          : filters.listingType;
    const propertyTypeMap: Record<string, string> = {
      APARTMENT: "Daire",
      VILLA: "Villa",
      LAND: "Arsa",
      OFFICE: "Ofis",
      SHOP: "D\u00fckkan",
      BUILDING: "Bina",
    };
    const propertyType = filters.propertyType ? propertyTypeMap[filters.propertyType] ?? filters.propertyType : undefined;

    return (
      (!listingType || listingType === "T\u00fcm\u00fc" || property.status === listingType) &&
      (!propertyType || propertyType === "T\u00fcm\u00fc" || property.type === propertyType) &&
      (!filters.city || normalize(property.city)?.includes(normalize(filters.city) ?? "")) &&
      (!filters.district || normalize(property.district)?.includes(normalize(filters.district) ?? "")) &&
      (!filters.consultant || property.advisor.name.toLocaleLowerCase("tr-TR").includes(filters.consultant.replaceAll("-", " ")))
    );
  });

export const getPropertiesByConsultantSlug = (slug: string) => getProperties({ consultant: slug });
