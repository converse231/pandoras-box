import { NextResponse } from "next/server";

// GoldAPI.io endpoint
const GOLDAPI_URL = "https://www.goldapi.io/api";
const API_KEY = "goldapi-1km0smie6olkt-io"; // Your API key

export async function GET() {
  try {
    console.log("🔍 Fetching gold prices from GoldAPI...");

    // Fetch XAU (Gold) prices in USD (GoldAPI doesn't support PHP directly)
    const response = await fetch(`${GOLDAPI_URL}/XAU/USD`, {
      method: "GET",
      headers: {
        "x-access-token": API_KEY,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache the API response
    });

    console.log("📡 API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", response.status, errorText);
      throw new Error(`GoldAPI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("📊 API Response data:", JSON.stringify(data, null, 2));

    // Check for API errors in the response
    if (data.error) {
      console.error("❌ API Error in response:", data.error);
      throw new Error(`GoldAPI error: ${data.error}`);
    }

    // GoldAPI returns price per troy ounce and per gram in USD
    const pricePerOunceUSD = data.price; // in USD
    const pricePerGram24kUSD = data.price_gram_24k; // in USD
    const pricePerGram22kUSD = data.price_gram_22k; // in USD
    const pricePerGram21kUSD = data.price_gram_21k; // in USD
    const pricePerGram20kUSD = data.price_gram_20k; // in USD
    const pricePerGram18kUSD = data.price_gram_18k; // in USD
    const pricePerGram16kUSD = data.price_gram_16k; // in USD
    const pricePerGram14kUSD = data.price_gram_14k; // in USD
    const pricePerGram10kUSD = data.price_gram_10k; // in USD

    if (!pricePerOunceUSD || pricePerOunceUSD === 0) {
      console.error("❌ Invalid price received:", pricePerOunceUSD);
      throw new Error("Invalid price data from API");
    }

    // Convert USD to PHP (approximate rate: 1 USD = 56.25 PHP)
    // For production, you should use a real-time forex API
    const USD_TO_PHP = 56.25;
    const pricePerOuncePHP = pricePerOunceUSD * USD_TO_PHP;

    // Convert prices from USD to PHP for all karats
    const goldPrices = {
      "24k": Math.round(pricePerGram24kUSD * USD_TO_PHP * 100) / 100,
      "22k": Math.round(pricePerGram22kUSD * USD_TO_PHP * 100) / 100,
      "21k": Math.round(pricePerGram21kUSD * USD_TO_PHP * 100) / 100,
      "20k": Math.round(pricePerGram20kUSD * USD_TO_PHP * 100) / 100,
      "18k": Math.round(pricePerGram18kUSD * USD_TO_PHP * 100) / 100,
      "16k": Math.round(pricePerGram16kUSD * USD_TO_PHP * 100) / 100,
      "14k": Math.round(pricePerGram14kUSD * USD_TO_PHP * 100) / 100,
      "10k": Math.round(pricePerGram10kUSD * USD_TO_PHP * 100) / 100,
    };

    console.log("💰 Price per ounce (USD):", pricePerOunceUSD);
    console.log(
      "💰 Price per ounce (PHP):",
      pricePerOuncePHP.toFixed(2),
      "PHP"
    );
    console.log("✅ Calculated gold prices (PHP):", goldPrices);

    return NextResponse.json({
      success: true,
      prices: goldPrices,
      timestamp: new Date().toISOString(),
      source: "GoldAPI.io",
      pricePerOuncePHP: Math.round(pricePerOuncePHP * 100) / 100,
      pricePerOunceUSD: pricePerOunceUSD,
      exchangeRate: USD_TO_PHP,
      rawData: data, // Include raw data for debugging
    });
  } catch (error) {
    console.error("❌ Error fetching gold prices:", error);

    // Return fallback prices if API fails
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch gold prices",
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
        source: "fallback",
      },
      { status: 500 }
    );
  }
}
