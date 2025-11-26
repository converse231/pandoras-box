// Cache duration: 24 hours (in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface GoldPrices {
  "24k": number;
  "22k": number;
  "21k": number;
  "20k": number;
  "18k": number;
  "16k": number;
  "14k": number;
  "10k": number;
}

interface CachedData {
  prices: GoldPrices;
  timestamp: string;
  source: string;
}

/**
 * Get cached gold prices from localStorage
 * Returns null if cache is expired or doesn't exist
 */
export function getCachedGoldPrices(): CachedData | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem("goldPrices");
    if (!cached) return null;

    const data: CachedData = JSON.parse(cached);
    const cacheAge = Date.now() - new Date(data.timestamp).getTime();

    // Check if cache is still valid (less than 24 hours old)
    if (cacheAge < CACHE_DURATION) {
      return data;
    }

    // Cache expired, remove it
    localStorage.removeItem("goldPrices");
    return null;
  } catch (error) {
    console.error("Error reading gold price cache:", error);
    return null;
  }
}

/**
 * Save gold prices to localStorage cache
 */
export function setCachedGoldPrices(data: CachedData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("goldPrices", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving gold price cache:", error);
  }
}

/**
 * Fetch fresh gold prices from API and cache them
 */
export async function fetchGoldPrices(): Promise<CachedData> {
  try {
    console.log("🔄 Fetching fresh gold prices...");
    const response = await fetch("/api/gold-prices", {
      cache: "no-store",
    });

    console.log("📡 Fetch response status:", response.status);
    const data = await response.json();
    console.log("📊 Fetched data:", data);

    if (!data.prices || Object.keys(data.prices).length === 0) {
      console.error("❌ Invalid data structure:", data);
      throw new Error("Invalid price data received");
    }

    const cachedData: CachedData = {
      prices: data.prices,
      timestamp: data.timestamp,
      source: data.source,
    };

    // Cache the result only if it's valid
    if (data.success !== false) {
      setCachedGoldPrices(cachedData);
      console.log("✅ Gold prices cached successfully");
    }

    return cachedData;
  } catch (error) {
    console.error("❌ Error fetching gold prices:", error);

    // Return fallback prices
    return {
      prices: {
        "24k": 7490,
        "22k": 6866,
        "21k": 6554,
        "20k": 6243,
        "18k": 5618,
        "16k": 4993,
        "14k": 4369,
        "10k": 3120,
      },
      timestamp: new Date().toISOString(),
      source: "fallback-error",
    };
  }
}

/**
 * Get gold prices - from cache if available and valid, otherwise fetch fresh
 */
export async function getGoldPrices(): Promise<CachedData> {
  // Try to get from cache first
  const cached = getCachedGoldPrices();
  if (cached) {
    return cached;
  }

  // Cache miss or expired, fetch fresh data
  return fetchGoldPrices();
}

/**
 * Get time since last update in human-readable format
 */
export function getTimeSinceUpdate(timestamp: string): string {
  const now = Date.now();
  const updateTime = new Date(timestamp).getTime();
  const diff = now - updateTime;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}
