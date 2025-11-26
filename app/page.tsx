import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  Globe2,
  Shield,
  BarChart3,
  Coins,
  Crown,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-amber-50/20 dark:to-amber-950/10">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-amber-600" />
              <span className="text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                Pandora&apos;s Box
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#features">
                <Button variant="ghost" size="sm">
                  Features
                </Button>
              </Link>
              <Link href="#benefits">
                <Button variant="ghost" size="sm">
                  Benefits
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-yellow-50/50 to-background dark:from-amber-950/20 dark:via-yellow-950/10 dark:to-background" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Real-Time Gold Price Tracking
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Revolutionize Your{" "}
                <span className="bg-linear-to-r from-amber-600 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Jewelry Portfolio
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground">
                Track, manage, and maximize your gold jewelry investments with
                real-time market prices across 8 gold purities and multiple
                currencies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Start Tracking Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-amber-200 dark:border-amber-800 w-full sm:w-auto"
                  >
                    View Demo
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600" />
                  <span>8 gold purities</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[600px] h-[400px]">
              <div className="absolute inset-0 bg-linear-to-br from-amber-200 to-yellow-200 dark:from-amber-900 dark:to-yellow-900 rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/api/placeholder/800/600"
                  alt="Luxury gold jewelry collection"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6" />
                    <span className="text-sm font-semibold">
                      Premium Collection
                    </span>
                  </div>
                  <p className="text-2xl font-bold">Track Your Treasure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              8
            </div>
            <div className="text-sm text-muted-foreground">Gold Purities</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              8+
            </div>
            <div className="text-sm text-muted-foreground">Currencies</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-sm text-muted-foreground">
              Real-Time Prices
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-muted-foreground">Free</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Manage Your Collection
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for serious jewelry investors and
            collectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-amber-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Real-Time Gold Prices</CardTitle>
              <CardDescription>
                Live market prices for all 8 gold purities (10K-24K) updated
                every 24 hours with smart caching
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe2 className="w-20 h-20 text-blue-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Multi-Currency Support</CardTitle>
              <CardDescription>
                Track your portfolio in 8+ major currencies: USD, EUR, GBP, JPY,
                PHP, AUD, CAD, CNY
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUp className="w-20 h-20 text-green-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Investment Tracking</CardTitle>
              <CardDescription>
                Monitor profits, losses, and ROI with detailed analytics and
                performance metrics
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="w-20 h-20 text-purple-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Portfolio Analytics</CardTitle>
              <CardDescription>
                Visual charts showing composition by gold type, top performers,
                and investment distribution
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <Coins className="w-20 h-20 text-orange-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Smart Valuation</CardTitle>
              <CardDescription>
                Automatic calculation of current values based on weight, purity,
                and live gold prices
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative h-48 overflow-hidden bg-linear-to-br from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-20 h-20 text-slate-600/20 group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white dark:bg-gray-900 shadow-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
            </div>
            <CardHeader>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your jewelry collection data is stored securely with
                industry-standard encryption
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Showcase 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                src="/api/placeholder/700/500"
                alt="Real-time gold price dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-br from-amber-600/20 to-yellow-600/20" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-sm font-semibold text-amber-900 dark:text-amber-200">
                Live Pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Track{" "}
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  8 Gold Purities
                </span>{" "}
                in Real-Time
              </h2>
              <p className="text-xl text-muted-foreground">
                From 10K to 24K, get accurate market prices updated every 24
                hours. Our smart caching system ensures you always have the
                latest data while staying within API limits.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    24K, 22K, 21K, 20K, 18K, 16K, 14K, 10K gold pricing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Automatic conversion to your preferred currency
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Powered by GoldAPI for accurate market data
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Showcase 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-sm font-semibold text-amber-900 dark:text-amber-200">
                Portfolio Management
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Organize Your{" "}
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Entire Collection
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Upload photos, track details, and monitor the value of every
                piece in your jewelry collection. From rings to necklaces,
                manage it all in one place.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Multi-image gallery for each item
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Detailed purchase history and descriptions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Filter by category, gold type, and more
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/api/placeholder/700/500"
                alt="Jewelry collection management"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-br from-amber-600/20 to-yellow-600/20" />
            </div>
          </div>

          {/* Showcase 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
              <img
                src="/api/placeholder/700/500"
                alt="Investment analytics and charts"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-br from-amber-600/20 to-yellow-600/20" />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-950/30 text-sm font-semibold text-amber-900 dark:text-amber-200">
                Analytics
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Smart Analytics
                </span>{" "}
                for Better Decisions
              </h2>
              <p className="text-xl text-muted-foreground">
                Visualize your portfolio performance with intuitive charts and
                detailed metrics. See your profits, losses, and top performers
                at a glance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Portfolio composition by gold type
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Profit/loss tracking and ROI calculations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-muted-foreground">
                    Top performers and investment insights
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id="benefits"
        className="bg-linear-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/10 dark:to-yellow-950/10 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                Why Choose{" "}
                <span className="bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Pandora&apos;s Box
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The smart way to manage your precious jewelry investments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Always Know Your Worth
                    </h3>
                    <p className="text-muted-foreground">
                      Get instant valuations based on current market rates.
                      Never wonder what your collection is worth.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Make Informed Decisions
                    </h3>
                    <p className="text-muted-foreground">
                      Track performance over time and identify your best
                      investments with detailed analytics.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Simple & Intuitive
                    </h3>
                    <p className="text-muted-foreground">
                      Beautiful interface designed for ease of use. Add items,
                      track values, and view analytics effortlessly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Complete Coverage
                    </h3>
                    <p className="text-muted-foreground">
                      Support for all gold purities from 10K to 24K, covering
                      every piece in your collection.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Global Currency Support
                    </h3>
                    <p className="text-muted-foreground">
                      View your portfolio value in your preferred currency with
                      automatic conversion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
                    <p className="text-muted-foreground">
                      Fully responsive design works perfectly on desktop,
                      tablet, and mobile devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardContent className="p-12 text-center space-y-6">
            <Crown className="w-16 h-16 text-amber-600 mx-auto" />
            <h2 className="text-4xl font-bold">
              Start Tracking Your Jewelry Portfolio Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join jewelry investors and collectors who trust Pandora&apos;s Box
              to manage their precious collections
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-lg px-8 py-6"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-amber-200 dark:border-amber-800"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-600" />
                <span className="text-xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Pandora&apos;s Box
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted platform for jewelry portfolio management and gold
                price tracking.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#benefits"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Benefits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-amber-600 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Pandora&apos;s Box. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by{" "}
              <a
                href="https://www.goldapi.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:underline"
              >
                GoldAPI
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
