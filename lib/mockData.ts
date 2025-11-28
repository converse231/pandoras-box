// Mock data for jewelry items
// Current values synced with live gold prices (as of Nov 2025)
// 24K: ₱7,490/g | 22K: ₱6,866/g | 21K: ₱6,554/g | 20K: ₱6,243/g
// 18K: ₱5,618/g | 16K: ₱4,993/g | 14K: ₱4,369/g | 10K: ₱3,120/g
export const mockJewelryData = [
  {
    id: 1,
    name: "Gold Wedding Band",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
    category: "Ring",
    goldType: "18k",
    weight: 5.2,
    buyPrice: 25000,
    currentValue: 29213, // 5.2g × ₱5,618/g = ₱29,213.6
    dateBought: "2024-01-15",
    description:
      "Elegant 18k gold wedding band with classic design. Features a smooth polished finish and comfortable fit.",
    tags: ["wedding", "classic", "elegant"],
  },
  {
    id: 2,
    name: "Diamond Necklace",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    category: "Necklace",
    goldType: "22k",
    weight: 12.5,
    buyPrice: 95000,
    currentValue: 120000, // Gold: ₱85,825 + Diamond premium
    dateBought: "2023-12-10",
    description:
      "Stunning 22k gold necklace adorned with brilliant cut diamonds. A timeless piece perfect for special occasions.",
    tags: ["diamond", "luxury", "special occasion"],
  },
  {
    id: 3,
    name: "Classic Gold Bracelet",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
    category: "Bracelet",
    goldType: "24k",
    weight: 8.7,
    buyPrice: 60000,
    currentValue: 65163, // 8.7g × ₱7,490/g = ₱65,163
    dateBought: "2024-02-20",
    description:
      "Pure 24k gold bracelet with intricate chain design. Heavy and luxurious feel with exceptional craftsmanship.",
    tags: ["pure gold", "luxury", "investment"],
  },
  {
    id: 4,
    name: "Pearl Earrings",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    category: "Earrings",
    goldType: "18k",
    weight: 3.2,
    buyPrice: 16000,
    currentValue: 20500, // Gold: ₱17,978 + Pearl premium
    dateBought: "2024-03-05",
    description:
      "Beautiful 18k gold earrings with genuine pearls. Delicate and elegant design suitable for any occasion.",
    tags: ["pearl", "elegant", "delicate"],
  },
  {
    id: 5,
    name: "Vintage Gold Chain",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
    category: "Necklace",
    goldType: "22k",
    weight: 15.3,
    buyPrice: 98000,
    currentValue: 125000, // Gold: ₱105,050 + Vintage premium
    dateBought: "2023-11-28",
    description:
      "Vintage 22k gold chain with antique finish. A collector's piece with unique character and historical appeal.",
    tags: ["vintage", "antique", "collector"],
  },
  {
    id: 6,
    name: "Signet Ring",
    images: ["/api/placeholder/800/600"],
    category: "Ring",
    goldType: "14k",
    weight: 4.8,
    buyPrice: 19000,
    currentValue: 20971, // 4.8g × ₱4,369/g = ₱20,971.2
    dateBought: "2024-01-30",
    description:
      "Classic 14k gold signet ring with smooth top for personalization. Timeless style with modern comfort fit.",
    tags: ["signet", "classic", "personalizable"],
  },
  {
    id: 7,
    name: "Rose Gold Band",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    category: "Ring",
    goldType: "21k",
    weight: 6.5,
    buyPrice: 38000,
    currentValue: 42601, // 6.5g × ₱6,554/g = ₱42,601
    dateBought: "2024-02-14",
    description:
      "Beautiful 21k rose gold band with romantic pink hue. Perfect blend of durability and luxury.",
    tags: ["rose gold", "romantic", "gift"],
  },
  {
    id: 8,
    name: "Gold Pendant",
    images: ["/api/placeholder/800/600"],
    category: "Necklace",
    goldType: "20k",
    weight: 7.2,
    buyPrice: 40000,
    currentValue: 44950, // 7.2g × ₱6,243/g = ₱44,949.6
    dateBought: "2023-12-25",
    description:
      "Elegant 20k gold pendant with intricate filigree work. Features exceptional craftsmanship and detail.",
    tags: ["pendant", "filigree", "handcrafted"],
  },
  {
    id: 9,
    name: "Everyday Chain",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600"],
    category: "Necklace",
    goldType: "16k",
    weight: 9.5,
    buyPrice: 42000,
    currentValue: 47434, // 9.5g × ₱4,993/g = ₱47,433.5
    dateBought: "2024-03-10",
    description:
      "Durable 16k gold chain perfect for everyday wear. Strong and stylish with comfortable weight.",
    tags: ["everyday", "durable", "casual"],
  },
  {
    id: 10,
    name: "Simple Band",
    images: ["/api/placeholder/800/600"],
    category: "Ring",
    goldType: "10k",
    weight: 5.5,
    buyPrice: 15000,
    currentValue: 17160, // 5.5g × ₱3,120/g = ₱17,160
    dateBought: "2024-01-20",
    description:
      "Affordable 10k gold band perfect for casual wear. Great balance of gold content and durability.",
    tags: ["affordable", "casual", "everyday"],
  },
];

// Currency exchange rates (base: PHP)
export const exchangeRates = {
  PHP: 1,
  USD: 0.01778,
  EUR: 0.01636,
  GBP: 0.01404,
  JPY: 2.658,
  AUD: 0.02702,
  CAD: 0.02418,
  CNY: 0.12871,
};

export const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  PHP: "₱",
  CNY: "¥",
};

export const currencyFlags = {
  USD: "/flags/US.svg",
  EUR: "/flags/DE.svg", // Using Germany as representative for Euro
  GBP: "/flags/GB.svg",
  JPY: "/flags/JP.svg",
  AUD: "/flags/AU.svg",
  CAD: "/flags/CA.svg",
  PHP: "/flags/PH.svg",
  CNY: "/flags/CN.svg",
};

