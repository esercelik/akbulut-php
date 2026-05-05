import type { Consultant } from "@/types/site/consultant";

export const consultants: Consultant[] = [
  {
    id: 4,
    slug: "mukremin-akbulut",
    name: "M\u00fckremin Akbulut",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / G\u00f6lc\u00fck",
    activePortfolioCount: 11,
    salePortfolioCount: 7,
    rentPortfolioCount: 4,
  },
  {
    id: 1,
    slug: "eser-celik",
    name: "Eser \u00c7elik",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / \u0130zmit",
    activePortfolioCount: 18,
    salePortfolioCount: 11,
    rentPortfolioCount: 7,
  },
  {
    id: 2,
    slug: "abdurrahman-yavuzer",
    name: "Abdurrahman Yavuzer",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / Kartepe",
    activePortfolioCount: 14,
    salePortfolioCount: 9,
    rentPortfolioCount: 5,
  },
  {
    id: 3,
    slug: "murat-celik",
    name: "Murat \u00c7elik",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / Ba\u015fiskele",
    activePortfolioCount: 16,
    salePortfolioCount: 10,
    rentPortfolioCount: 6,
  },
  {
    id: 5,
    slug: "mehmet-uzun",
    name: "Mehmet Uzun",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / Derince",
    activePortfolioCount: 13,
    salePortfolioCount: 8,
    rentPortfolioCount: 5,
  },
  {
    id: 6,
    slug: "bunyamin-eren-ertekin",
    name: "B\u00fcnyamin Eren Ertekin",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / K\u00f6rfez",
    activePortfolioCount: 15,
    salePortfolioCount: 9,
    rentPortfolioCount: 6,
  },
  {
    id: 7,
    slug: "danisman-7",
    name: "Dan\u0131\u015fman 7",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / Gebze",
    activePortfolioCount: 12,
    salePortfolioCount: 8,
    rentPortfolioCount: 4,
  },
  {
    id: 8,
    slug: "danisman-8",
    name: "Dan\u0131\u015fman 8",
    title: "Gayrimenkul Dan\u0131\u015fman\u0131",
    region: "Kocaeli / Dar\u0131ca",
    activePortfolioCount: 10,
    salePortfolioCount: 6,
    rentPortfolioCount: 4,
  },
];

export const getConsultants = () => consultants;

export const getConsultantBySlug = (slug: string) =>
  consultants.find((consultant) => consultant.slug === slug) ?? null;
