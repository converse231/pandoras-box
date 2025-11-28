"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Weight,
  Coins,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Filter,
  SortAsc,
  Crown,
  Gem,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  BarChart3,
  PieChart,
  RefreshCw,
  Save,
  LogOut,
  Moon,
  Sun,
  Loader2,
  Camera,
  FileDown,
  FileUp,
  FileJson,
  FileSpreadsheet,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  mockJewelryData,
  exchangeRates,
  currencySymbols,
  currencyFlags,
} from "@/lib/mockData";
import {
  getGoldPrices,
  fetchGoldPrices,
  getTimeSinceUpdate,
} from "@/lib/goldPriceCache";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/theme-provider";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  // User profile state
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    avatarUrl: string;
  }>({
    fullName: "",
    avatarUrl: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [goldTypeFilter, setGoldTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [jewelryItems, setJewelryItems] = useState<typeof mockJewelryData>([]);
  const [isLoadingJewelry, setIsLoadingJewelry] = useState(true);
  const [selectedItem, setSelectedItem] = useState<
    (typeof mockJewelryData)[0] | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof exchangeRates>("PHP");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | number | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<
    (typeof mockJewelryData)[0] | null
  >(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    goldType: "",
    weight: 0,
    buyPrice: 0,
    currentValue: 0,
    dateBought: "",
    description: "",
    images: [] as string[],
    tags: [] as string[],
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    category: "Ring",
    goldType: "24k",
    weight: 0,
    buyPrice: 0,
    dateBought: new Date().toISOString().split("T")[0],
    description: "",
    images: [] as string[],
    tags: [] as string[],
  });
  // Pending images that haven't been uploaded yet (for add form)
  const [addPendingImages, setAddPendingImages] = useState<
    { file: File | Blob; preview: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditDragging, setIsEditDragging] = useState(false);
  // Pending images for edit form
  const [editPendingImages, setEditPendingImages] = useState<
    { file: File | Blob; preview: string }[]
  >([]);
  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Tag input state
  const [addTagInput, setAddTagInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");

  // Suggested tags for quick selection
  const suggestedTags = [
    "White Gold",
    "Yellow Gold",
    "Rose Gold",
    "Japan",
    "Saudi",
    "Dubai",
    "Women",
    "Men",
    "Vintage",
    "Modern",
    "Gift",
    "Anniversary",
    "Wedding",
    "Engagement",
    "Investment",
    "Heirloom",
  ];

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"add" | "edit">("add");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Image cropping state
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropMode, setCropMode] = useState<"add" | "edit">("add");
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );
  const [editingImageType, setEditingImageType] = useState<
    "uploaded" | "pending"
  >("pending");

  // Gold price state
  const [goldPricesPerGram, setGoldPricesPerGram] = useState({
    "24k": 7490, // PHP per gram (fallback)
    "22k": 6866,
    "21k": 6554,
    "20k": 6243,
    "18k": 5618,
    "16k": 4993,
    "14k": 4369,
    "10k": 3120,
  });
  const [priceLastUpdated, setPriceLastUpdated] = useState<string>("");
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  // Fetch gold prices on mount
  useEffect(() => {
    const loadGoldPrices = async () => {
      const data = await getGoldPrices();
      setGoldPricesPerGram(data.prices);
      setPriceLastUpdated(data.timestamp);
    };
    loadGoldPrices();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserProfile({
            fullName: profile.full_name || user.email?.split("@")[0] || "User",
            avatarUrl: profile.avatar_url || "/api/placeholder/100/100",
          });
        } else {
          // Fallback to email
          setUserProfile({
            fullName: user.email?.split("@")[0] || "User",
            avatarUrl: "/api/placeholder/100/100",
          });
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };

    loadUserProfile();
  }, [supabase, router]);

  // Fetch jewelry items from database
  useEffect(() => {
    const loadJewelryItems = async () => {
      try {
        setIsLoadingJewelry(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/login");
          return;
        }

        const { data: items, error: itemsError } = await supabase
          .from("jewelry_items")
          .select("*")
          .eq("user_id", user.id)
          .order("date_bought", { ascending: false });

        if (itemsError) {
          console.error("Error loading jewelry items:", itemsError);
          setJewelryItems([]);
          return;
        }

        // Transform database data to match component format
        const transformedItems = (items || []).map((item) => ({
          id: item.id,
          name: item.name,
          images: item.images || [],
          category: item.category,
          goldType: item.gold_type,
          weight: parseFloat(item.weight),
          buyPrice: parseFloat(item.buy_price),
          currentValue: parseFloat(item.current_value),
          dateBought: item.date_bought,
          description: item.description || "",
          tags: item.tags || [],
        }));

        setJewelryItems(transformedItems);
      } catch (err) {
        console.error("Error in loadJewelryItems:", err);
        setJewelryItems([]);
      } finally {
        setIsLoadingJewelry(false);
      }
    };

    loadJewelryItems();
  }, [supabase, router]);

  // Manual refresh function
  const handleRefreshPrices = async () => {
    setIsRefreshingPrices(true);
    try {
      const data = await fetchGoldPrices();
      setGoldPricesPerGram(data.prices);
      setPriceLastUpdated(data.timestamp);
    } catch (error) {
      console.error("Failed to refresh prices:", error);
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Calculate statistics
  const totalValue = jewelryItems.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const totalInvested = jewelryItems.reduce(
    (sum, item) => sum + item.buyPrice,
    0
  );
  const totalProfit = totalValue - totalInvested;
  const profitPercentage = ((totalProfit / totalInvested) * 100).toFixed(1);
  const totalWeight = jewelryItems.reduce((sum, item) => sum + item.weight, 0);
  const totalItems = jewelryItems.length;

  // Filter and sort jewelry items
  const filteredItems = jewelryItems
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGoldType =
        goldTypeFilter === "all" || item.goldType === goldTypeFilter;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesGoldType && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.dateBought).getTime() - new Date(a.dateBought).getTime()
          );
        case "value-high":
          return b.currentValue - a.currentValue;
        case "value-low":
          return a.currentValue - b.currentValue;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Calculate statistics for filtered items (used in Collection tab)
  const filteredTotalValue = filteredItems.reduce(
    (sum, item) => sum + item.currentValue,
    0
  );
  const filteredTotalInvested = filteredItems.reduce(
    (sum, item) => sum + item.buyPrice,
    0
  );
  const filteredTotalProfit = filteredTotalValue - filteredTotalInvested;
  const filteredProfitPercentage =
    filteredTotalInvested > 0
      ? ((filteredTotalProfit / filteredTotalInvested) * 100).toFixed(1)
      : "0.0";
  const filteredTotalWeight = filteredItems.reduce(
    (sum, item) => sum + item.weight,
    0
  );
  const filteredTotalItems = filteredItems.length;

  const convertCurrency = (amount: number) => {
    const rate = exchangeRates[selectedCurrency];
    return amount * rate;
  };

  const formatCurrency = (amount: number) => {
    const convertedAmount = convertCurrency(amount);
    const symbol = currencySymbols[selectedCurrency];

    // Format with appropriate decimal places
    const decimals = selectedCurrency === "JPY" ? 0 : 2;

    return `${symbol}${convertedAmount.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleItemClick = (item: (typeof mockJewelryData)[0]) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
  };

  const nextImage = () => {
    if (selectedItem && currentImageIndex < selectedItem.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleEditClick = (item: (typeof mockJewelryData)[0]) => {
    setEditingItem(item);
    setEditFormData({
      name: item.name,
      category: item.category,
      goldType: item.goldType,
      weight: item.weight,
      buyPrice: item.buyPrice,
      currentValue: item.currentValue,
      dateBought: item.dateBought,
      description: item.description,
      images: item.images || [],
      tags: item.tags || [],
    });
    setIsDialogOpen(false); // Close the detail dialog
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      // Upload pending images to storage first
      let uploadedUrls: string[] = [];
      if (editPendingImages.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          uploadedUrls = await uploadImagesToStorage(editPendingImages);
          toast.success(
            `${uploadedUrls.length} image(s) uploaded successfully!`
          );
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload images. Please try again.");
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Combine already uploaded images with newly uploaded ones
      const allImages = [...editFormData.images, ...uploadedUrls];

      // Calculate current value based on weight × current gold price
      const currentValue =
        editFormData.weight *
        goldPricesPerGram[
          editFormData.goldType as keyof typeof goldPricesPerGram
        ];

      // Update in database
      const { error: updateError } = await supabase
        .from("jewelry_items")
        .update({
          name: editFormData.name,
          images: allImages,
          category: editFormData.category,
          gold_type: editFormData.goldType,
          weight: editFormData.weight,
          buy_price: editFormData.buyPrice,
          current_value: currentValue,
          date_bought: editFormData.dateBought,
          description: editFormData.description,
          tags: editFormData.tags,
        })
        .eq("id", editingItem.id);

      if (updateError) {
        console.error("Error updating jewelry:", updateError);
        toast.error("Failed to update jewelry item. Please try again.");
        return;
      }

      // Update local state
      const updatedItems = jewelryItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: editFormData.name,
              images: allImages,
              category: editFormData.category,
              goldType: editFormData.goldType,
              weight: editFormData.weight,
              buyPrice: editFormData.buyPrice,
              currentValue: currentValue,
              dateBought: editFormData.dateBought,
              description: editFormData.description,
              tags: editFormData.tags,
            }
          : item
      );

      setJewelryItems(updatedItems);
      setIsEditDialogOpen(false);
      setEditingItem(null);

      // Cleanup Object URLs to prevent memory leaks
      editPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setEditPendingImages([]);
      setUploadProgress(0);
      setEditTagInput("");

      toast.success("Jewelry item updated successfully!");
    } catch (err) {
      console.error("Error in handleSaveEdit:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    // Cleanup Object URLs to prevent memory leaks
    editPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setEditPendingImages([]);
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setEditTagInput("");
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (itemId: string | number) => {
    setItemToDelete(itemId);
    setIsDeleteDialogOpen(true);
  };

  // Perform actual delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Find the item to get its images
      const item = jewelryItems.find((i) => i.id === itemToDelete);

      // Delete images from storage first
      if (item && item.images && item.images.length > 0) {
        const imagePaths: string[] = [];

        for (const imageUrl of item.images) {
          if (imageUrl.includes("jewelry-images")) {
            try {
              const urlParts = imageUrl.split("/jewelry-images/");
              if (urlParts[1]) {
                const filePath = urlParts[1].split("?")[0];
                imagePaths.push(filePath);
              }
            } catch (error) {
              console.error("Error parsing image URL:", error);
            }
          }
        }

        if (imagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from("jewelry-images")
            .remove(imagePaths);

          if (storageError) {
            console.error("Error deleting images from storage:", storageError);
          }
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from("jewelry_items")
        .delete()
        .eq("id", itemToDelete);

      if (deleteError) {
        console.error("Error deleting jewelry:", deleteError);
        toast.error("Failed to delete jewelry item. Please try again.");
        setIsDeleteDialogOpen(false);
        return;
      }

      // Remove from local state
      setJewelryItems(jewelryItems.filter((item) => item.id !== itemToDelete));

      // Close detail dialog if it's open for this item
      if (selectedItem?.id === itemToDelete) {
        setIsDialogOpen(false);
        setSelectedItem(null);
      }

      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success("Jewelry item deleted successfully!");
    } catch (err) {
      console.error("Error in handleConfirmDelete:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };

  // Helper function to upload multiple images to Supabase Storage
  const uploadImagesToStorage = async (
    images: { file: File | Blob; preview: string }[]
  ): Promise<string[]> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const { file } = images[i];

      // Create unique filename
      const fileExt = file instanceof File ? file.name.split(".").pop() : "jpg";
      const fileName = `${user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("jewelry-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "image/jpeg",
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("jewelry-images").getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);

      // Update progress
      setUploadProgress(Math.round(((i + 1) / images.length) * 100));
    }

    return uploadedUrls;
  };

  const handleAddFormChange = (
    field: string,
    value: string | number | string[]
  ) => {
    setAddFormData({
      ...addFormData,
      [field]: value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await processFiles(files);
    }
  };

  const processFiles = async (files: FileList) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (fileArray.length === 0) {
      return;
    }

    // If single image, open cropper
    if (fileArray.length === 1) {
      const imageUrl = URL.createObjectURL(fileArray[0]);
      setImageToCrop(imageUrl);
      setCropMode("add");
      setIsCropDialogOpen(true);
    } else {
      // For multiple images, add directly without cropping
      const newPendingImages = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setAddPendingImages((prev) => [...prev, ...newPendingImages]);
      toast.success(`${fileArray.length} images added`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  // Image Cropping Functions
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageToCrop,
        croppedAreaPixels,
        rotation
      );

      // Create Object URL for instant preview (no upload yet)
      const preview = URL.createObjectURL(croppedImage);
      const pendingImage = { file: croppedImage, preview };

      // Check if we're replacing an existing image
      if (editingImageIndex !== null) {
        // Replace existing image
        if (cropMode === "add") {
          if (editingImageType === "pending") {
            // Revoke old preview URL
            URL.revokeObjectURL(addPendingImages[editingImageIndex].preview);
            const newPendingImages = [...addPendingImages];
            newPendingImages[editingImageIndex] = pendingImage;
            setAddPendingImages(newPendingImages);
          }
        } else {
          if (editingImageType === "pending") {
            // Revoke old preview URL
            URL.revokeObjectURL(editPendingImages[editingImageIndex].preview);
            const newPendingImages = [...editPendingImages];
            newPendingImages[editingImageIndex] = pendingImage;
            setEditPendingImages(newPendingImages);
          }
        }
        toast.success("Image updated successfully!");
      } else {
        // Add new image
        if (cropMode === "add") {
          setAddPendingImages((prev) => [...prev, pendingImage]);
        } else {
          setEditPendingImages((prev) => [...prev, pendingImage]);
        }
        toast.success("Image added successfully!");
      }

      // Clean up and close
      URL.revokeObjectURL(imageToCrop);
      setImageToCrop(null);
      setIsCropDialogOpen(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCroppedAreaPixels(null);
      setEditingImageIndex(null);
      setEditingImageType("pending");
    } catch (error) {
      console.error("Error cropping image:", error);
      toast.error("Failed to crop image");
    }
  };

  const handleCropCancel = () => {
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    setImageToCrop(null);
    setIsCropDialogOpen(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setEditingImageIndex(null);
    setEditingImageType("pending");
  };

  // Function to recrop an existing image
  const handleRecropImage = (
    imageUrl: string,
    index: number,
    type: "uploaded" | "pending",
    mode: "add" | "edit"
  ) => {
    setImageToCrop(imageUrl);
    setCropMode(mode);
    setEditingImageIndex(index);
    setEditingImageType(type);
    setIsCropDialogOpen(true);
  };

  // Camera Functions
  const openCamera = async (mode: "add" | "edit") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
        audio: false,
      });

      setCameraStream(stream);
      setCameraMode(mode);
      setIsCameraOpen(true);

      // Wait for video ref to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to capture photo");
          return;
        }

        // Create Object URL for cropping
        const imageUrl = URL.createObjectURL(blob);
        setImageToCrop(imageUrl);
        setCropMode(cameraMode);
        setIsCropDialogOpen(true);

        closeCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Cleanup pending images on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      addPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      editPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [addPendingImages, editPendingImages]);

  const handleRemoveImage = async (index: number) => {
    const imageUrl = addFormData.images[index];

    // Only delete from storage if it's a Supabase URL (not base64 preview)
    if (imageUrl.includes("jewelry-images") && !imageUrl.startsWith("data:")) {
      try {
        const urlParts = imageUrl.split("/jewelry-images/");
        if (urlParts[1]) {
          const filePath = urlParts[1].split("?")[0]; // Remove query params

          const { error } = await supabase.storage
            .from("jewelry-images")
            .remove([filePath]);

          if (error) {
            console.error("Error deleting image:", error);
          }
        }
      } catch (error) {
        console.error("Error removing image from storage:", error);
      }
    }
    // If it's base64, just remove from state (nothing to delete from storage)

    // Remove from form state
    const newImages = addFormData.images.filter((_, i) => i !== index);
    setAddFormData({
      ...addFormData,
      images: newImages,
    });
  };

  // Edit Dialog Image Handlers
  const handleEditImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      await processEditFiles(files);
    }
  };

  const processEditFiles = async (files: FileList) => {
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (fileArray.length === 0) {
      return;
    }

    // If single image, open cropper
    if (fileArray.length === 1) {
      const imageUrl = URL.createObjectURL(fileArray[0]);
      setImageToCrop(imageUrl);
      setCropMode("edit");
      setIsCropDialogOpen(true);
    } else {
      // For multiple images, add directly without cropping
      const newPendingImages = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setEditPendingImages((prev) => [...prev, ...newPendingImages]);
      toast.success(`${fileArray.length} images added`);
    }
  };

  const handleEditDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditDragging(true);
  };

  const handleEditDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditDragging(false);
  };

  const handleEditDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processEditFiles(files);
    }
  };

  const handleRemoveEditImage = async (index: number) => {
    const imageUrl = editFormData.images[index];

    // Only delete from storage if it's a Supabase URL (not base64 preview)
    if (imageUrl.includes("jewelry-images") && !imageUrl.startsWith("data:")) {
      try {
        const urlParts = imageUrl.split("/jewelry-images/");
        if (urlParts[1]) {
          const filePath = urlParts[1].split("?")[0]; // Remove query params

          const { error } = await supabase.storage
            .from("jewelry-images")
            .remove([filePath]);

          if (error) {
            console.error("Error deleting image:", error);
          }
        }
      } catch (error) {
        console.error("Error removing image from storage:", error);
      }
    }
    // If it's base64, just remove from state (nothing to delete from storage)

    // Remove from form state
    const newImages = editFormData.images.filter((_, i) => i !== index);
    setEditFormData({
      ...editFormData,
      images: newImages,
    });
  };

  const handleAddJewelry = async () => {
    // Validate required fields
    if (!addFormData.name || !addFormData.weight || !addFormData.buyPrice) {
      toast.error(
        "Please fill in all required fields (Name, Weight, Buy Price)"
      );
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be logged in to add jewelry");
        return;
      }

      // Upload pending images to storage first
      let uploadedUrls: string[] = [];
      if (addPendingImages.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          uploadedUrls = await uploadImagesToStorage(addPendingImages);
          toast.success(
            `${uploadedUrls.length} image(s) uploaded successfully!`
          );
        } catch (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload images. Please try again.");
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Combine already uploaded images with newly uploaded ones
      const allImages = [...addFormData.images, ...uploadedUrls];

      // Calculate current value based on weight × current gold price
      const currentValue =
        addFormData.weight *
        goldPricesPerGram[
          addFormData.goldType as keyof typeof goldPricesPerGram
        ];

      // Insert into database
      const { data: newItem, error: insertError } = await supabase
        .from("jewelry_items")
        .insert({
          user_id: user.id,
          name: addFormData.name,
          images: allImages,
          category: addFormData.category,
          gold_type: addFormData.goldType,
          weight: addFormData.weight,
          buy_price: addFormData.buyPrice,
          current_value: currentValue,
          date_bought: addFormData.dateBought,
          description: addFormData.description,
          tags: addFormData.tags,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error adding jewelry:", insertError);
        toast.error("Failed to add jewelry item. Please try again.");
        return;
      }

      // Transform and add to local state
      if (newItem) {
        const transformedItem = {
          id: newItem.id,
          name: newItem.name,
          images: newItem.images || [],
          category: newItem.category,
          goldType: newItem.gold_type,
          weight: parseFloat(newItem.weight),
          buyPrice: parseFloat(newItem.buy_price),
          currentValue: parseFloat(newItem.current_value),
          dateBought: newItem.date_bought,
          description: newItem.description || "",
          tags: newItem.tags || [],
        };

        setJewelryItems([transformedItem, ...jewelryItems]);
      }

      setIsAddDialogOpen(false);

      // Cleanup Object URLs to prevent memory leaks
      addPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));

      // Reset form
      setAddFormData({
        name: "",
        category: "Ring",
        goldType: "24k",
        weight: 0,
        buyPrice: 0,
        dateBought: new Date().toISOString().split("T")[0],
        description: "",
        images: [],
        tags: [],
      });
      setAddPendingImages([]);
      setUploadProgress(0);
      setAddTagInput("");

      toast.success("Jewelry item added successfully!");
    } catch (err) {
      console.error("Error in handleAddJewelry:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsUploading(false);
    }
  };

  const handleCancelAdd = () => {
    // Cleanup Object URLs to prevent memory leaks
    addPendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setAddPendingImages([]);
    setIsAddDialogOpen(false);
    // Reset form
    setAddFormData({
      name: "",
      category: "Ring",
      goldType: "24k",
      weight: 0,
      buyPrice: 0,
      dateBought: new Date().toISOString().split("T")[0],
      description: "",
      images: [],
      tags: [],
    });
    setAddTagInput("");
  };

  // Export data to JSON
  const handleExportJSON = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalItems: jewelryItems.length,
        items: jewelryItems,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-collection-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!", {
        description: `Exported ${jewelryItems.length} items to JSON`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  // Export data to CSV
  const handleExportCSV = () => {
    try {
      // Define CSV headers
      const headers = [
        "Name",
        "Category",
        "Gold Type",
        "Weight (g)",
        "Buy Price",
        "Date Bought",
        "Description",
        "Tags",
        "Images Count",
      ];

      // Convert jewelry data to CSV rows
      const rows = jewelryItems.map((item: (typeof mockJewelryData)[0]) => [
        `"${item.name.replace(/"/g, '""')}"`,
        item.category,
        item.goldType,
        item.weight,
        item.buyPrice,
        item.dateBought,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        `"${(item.tags || []).join(", ")}"`,
        item.images?.length || 0,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row: (string | number)[]) => row.join(",")),
      ].join("\n");

      // Create and download file
      const dataBlob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jewelry-collection-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!", {
        description: `Exported ${jewelryItems.length} items to CSV`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  // Import data from JSON
  const handleImportJSON = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Authentication error", {
          description: "Please log in again",
        });
        return;
      }

      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate the import data structure
      if (!importData.items || !Array.isArray(importData.items)) {
        toast.error("Invalid file format", {
          description: "The file does not contain valid jewelry data",
        });
        return;
      }

      // Import each item
      let successCount = 0;
      let errorCount = 0;

      for (const item of importData.items) {
        try {
          const { error: insertError } = await supabase
            .from("jewelry_items")
            .insert({
              user_id: user.id,
              name: item.name,
              category: item.category,
              gold_type: item.goldType,
              weight: item.weight,
              buy_price: item.buyPrice,
              date_bought: item.dateBought,
              description: item.description || "",
              images: item.images || [],
              tags: item.tags || [],
            });

          if (insertError) {
            console.error("Insert error:", insertError);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          console.error("Item import error:", error);
          errorCount++;
        }
      }

      // Refresh the jewelry data by reloading from database
      if (successCount > 0) {
        const { data: items, error: itemsError } = await supabase
          .from("jewelry_items")
          .select("*")
          .eq("user_id", user.id)
          .order("date_bought", { ascending: false });

        if (!itemsError && items) {
          // Transform database data to match component format
          const transformedItems = items.map((item) => ({
            id: item.id,
            name: item.name,
            images: item.images || [],
            category: item.category,
            goldType: item.gold_type,
            weight: parseFloat(item.weight),
            buyPrice: parseFloat(item.buy_price),
            currentValue: parseFloat(item.current_value),
            dateBought: item.date_bought,
            description: item.description || "",
            tags: item.tags || [],
          }));

          setJewelryItems(transformedItems);
        }

        toast.success("Import completed!", {
          description: `Successfully imported ${successCount} items${
            errorCount > 0 ? `, ${errorCount} failed` : ""
          }`,
        });
      } else {
        toast.error("Import failed", {
          description: "No items were imported",
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data", {
        description: "Please check the file format and try again",
      });
    }

    // Reset the file input
    if (importFileInputRef.current) {
      importFileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm"></div>
                <div className="relative bg-linear-to-br from-amber-400 via-yellow-500 to-amber-600 p-1.5 md:p-2 rounded-lg shadow-lg shadow-amber-500/30">
                  <Sparkles
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-linear-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                  Pandora&apos;s Box
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Jewelry Portfolio Management
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 md:gap-2 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3"
                  >
                    <Image
                      src={currencyFlags[selectedCurrency]}
                      alt={selectedCurrency}
                      width={16}
                      height={16}
                      className="rounded-sm md:w-5 md:h-5"
                    />
                    <span className="hidden sm:inline">{selectedCurrency}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Currency</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.keys(exchangeRates).map((currency) => (
                    <DropdownMenuItem
                      key={currency}
                      onClick={() =>
                        setSelectedCurrency(
                          currency as keyof typeof exchangeRates
                        )
                      }
                      className={
                        selectedCurrency === currency ? "bg-accent" : ""
                      }
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Image
                          src={
                            currencyFlags[
                              currency as keyof typeof currencyFlags
                            ]
                          }
                          alt={currency}
                          width={20}
                          height={20}
                          className="rounded-sm"
                        />
                        <span className="flex-1">
                          {
                            currencySymbols[
                              currency as keyof typeof currencySymbols
                            ]
                          }{" "}
                          {currency}
                        </span>
                        {selectedCurrency === currency && (
                          <span className="text-primary">✓</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 md:h-9 md:w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button
                className="font-semibold h-8 md:h-9 text-xs md:text-sm px-2 md:px-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden sm:inline">Add Jewelry</span>
              </Button>

              {/* Export/Import Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9"
                  >
                    <FileDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Data Management</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Export to JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export to CSV
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => importFileInputRef.current?.click()}
                  >
                    <FileUp className="w-4 h-4 mr-2" />
                    Import from JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Hidden file input for import */}
              <input
                ref={importFileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 md:h-9 md:w-9"
                  >
                    <Avatar className="w-7 h-7 md:w-8 md:h-8">
                      <AvatarImage src={userProfile.avatarUrl} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs md:text-sm">
                        {userProfile.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="collection" className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4 sm:mb-8 h-auto p-1">
            <TabsTrigger
              value="collection"
              className="gap-1 sm:gap-2 text-sm sm:text-base py-2"
            >
              <Crown className="w-4 h-4" />
              Collection
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="gap-1 sm:gap-2 text-sm sm:text-base py-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="inline sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="border-amber-200 dark:border-amber-800/50 bg-linear-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Total Value
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {formatCurrency(totalValue)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    {totalProfit >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span
                      className={
                        totalProfit >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {profitPercentage}% ({formatCurrency(totalProfit)})
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Total Weight
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {totalWeight.toFixed(1)}g
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Weight className="w-4 h-4" />
                    <span>Across {totalItems} items</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Total Invested
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {formatCurrency(totalInvested)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Coins className="w-4 h-4" />
                    <span>Initial investment</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Collection Size
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {totalItems} Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gem className="w-4 h-4" />
                    <span>Precious pieces</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Gold Prices Section */}
            <Card className="mb-4 sm:mb-8 border-amber-200 dark:border-amber-800/50 bg-linear-to-br from-amber-50/30 to-yellow-50/30 dark:from-amber-950/10 dark:to-yellow-950/10">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div>
                    <CardTitle className="text-base sm:text-xl font-bold flex items-center gap-2">
                      <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600" />
                      <span>Live Gold Prices per Gram</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1">
                      Real-time market prices • Cached for 24 hours
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshPrices}
                    disabled={isRefreshingPrices}
                    className="border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-950/50 w-full sm:w-auto h-10 sm:h-9"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRefreshingPrices ? "animate-spin" : ""
                      } sm:mr-2`}
                    />
                    <span className="ml-2 sm:ml-0">Refresh Prices</span>
                  </Button>
                </div>
                {priceLastUpdated && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {getTimeSinceUpdate(priceLastUpdated)}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* 24K Gold */}
                  <div className="bg-linear-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 p-4 rounded-lg border border-amber-300 dark:border-amber-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          24K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        99.9%
                      </span>
                    </div>
                    <div className="text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                      {formatCurrency(goldPricesPerGram["24k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 22K Gold */}
                  <div className="bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          22K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        91.7%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrency(goldPricesPerGram["22k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 21K Gold */}
                  <div className="bg-linear-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          21K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        87.5%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                      {formatCurrency(goldPricesPerGram["21k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 20K Gold */}
                  <div className="bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          20K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        83.3%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                      {formatCurrency(goldPricesPerGram["20k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 18K Gold */}
                  <div className="bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          18K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">75%</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                      {formatCurrency(goldPricesPerGram["18k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 16K Gold */}
                  <div className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          16K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        66.7%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                      {formatCurrency(goldPricesPerGram["16k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 14K Gold */}
                  <div className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          14K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        58.3%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                      {formatCurrency(goldPricesPerGram["14k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>

                  {/* 10K Gold */}
                  <div className="bg-linear-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          10K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        41.7%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                      {formatCurrency(goldPricesPerGram["10k"])}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      per gram
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts & Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Portfolio Composition Chart */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        Portfolio Composition
                      </CardTitle>
                      <CardDescription className="text-sm">
                        By gold type and weight
                      </CardDescription>
                    </div>
                    <PieChart className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Calculate gold type distribution */}
                    {(() => {
                      const goldTypeData = filteredItems.reduce(
                        (
                          acc: Record<
                            string,
                            { weight: number; value: number; count: number }
                          >,
                          item
                        ) => {
                          if (!acc[item.goldType]) {
                            acc[item.goldType] = {
                              weight: 0,
                              value: 0,
                              count: 0,
                            };
                          }
                          acc[item.goldType].weight += item.weight;
                          acc[item.goldType].value += item.currentValue;
                          acc[item.goldType].count += 1;
                          return acc;
                        },
                        {}
                      );

                      const colors: Record<string, string> = {
                        "24k": "bg-amber-500",
                        "22k": "bg-yellow-500",
                        "18k": "bg-orange-500",
                        "14k": "bg-amber-600",
                      };

                      return Object.entries(goldTypeData).map(
                        ([type, data]) => {
                          const percentage = (
                            (data.weight / totalWeight) *
                            100
                          ).toFixed(1);
                          return (
                            <div key={type} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-3 h-3 rounded-full ${colors[type]}`}
                                  />
                                  <span className="font-medium">
                                    {type.toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-muted-foreground">
                                    {data.weight.toFixed(1)}g
                                  </span>
                                  <span className="font-semibold">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className={`${colors[type]} h-2 rounded-full transition-all`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Performance Chart */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        Top Performers
                      </CardTitle>
                      <CardDescription className="text-sm">
                        By profit margin
                      </CardDescription>
                    </div>
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Calculate top performers */}
                    {filteredItems
                      .map((item) => ({
                        ...item,
                        profit: item.currentValue - item.buyPrice,
                        profitPercentage:
                          ((item.currentValue - item.buyPrice) /
                            item.buyPrice) *
                          100,
                      }))
                      .sort((a, b) => b.profitPercentage - a.profitPercentage)
                      .slice(0, 5)
                      .map((item, index) => {
                        const maxProfit = Math.max(
                          ...filteredItems.map(
                            (i) =>
                              ((i.currentValue - i.buyPrice) / i.buyPrice) * 100
                          )
                        );
                        const barWidth =
                          (item.profitPercentage / maxProfit) * 100;
                        const isPositive = item.profit >= 0;

                        return (
                          <div key={item.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-muted-foreground">
                                  #{index + 1}
                                </span>
                                <span className="font-medium truncate max-w-[150px]">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={
                                    isPositive
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {isPositive ? "+" : ""}
                                  {item.profitPercentage.toFixed(1)}%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatCurrency(item.profit)}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isPositive ? "bg-green-500" : "bg-red-500"
                                }`}
                                style={{ width: `${Math.abs(barWidth)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collection Tab - Just the feed */}
          <TabsContent value="collection">
            {/* Filters and Search */}
            <Card className="mb-4 sm:mb-6 border-border bg-card">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search jewelry..."
                        className="pl-10 border-border"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setSearchQuery(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Gold Type Filter */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={goldTypeFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("all")}
                    >
                      All Gold
                    </Button>
                    <Button
                      variant={goldTypeFilter === "24k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("24k")}
                    >
                      24K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "22k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("22k")}
                    >
                      22K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "21k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("21k")}
                    >
                      21K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "20k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("20k")}
                    >
                      20K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "18k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("18k")}
                    >
                      18K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "16k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("16k")}
                    >
                      16K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "14k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("14k")}
                    >
                      14K
                    </Button>
                    <Button
                      variant={goldTypeFilter === "10k" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGoldTypeFilter("10k")}
                    >
                      10K
                    </Button>
                  </div>

                  <Separator
                    orientation="vertical"
                    className="hidden md:block h-auto"
                  />

                  {/* Category Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        {categoryFilter === "all"
                          ? "All Categories"
                          : categoryFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("all")}
                      >
                        All Categories
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Ring")}
                      >
                        Rings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Necklace")}
                      >
                        Necklaces
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Necklace w/ Pendant")}
                      >
                        Necklace w/ Pendants
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Pendant")}
                      >
                        Pendants
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Bracelet")}
                      >
                        Bracelets
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Earrings")}
                      >
                        Earrings
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Chain")}
                      >
                        Chains
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setCategoryFilter("Bangle")}
                      >
                        Bangles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sort */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border"
                      >
                        <SortAsc className="w-4 h-4 mr-2" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSortBy("date")}>
                        Date Added
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("value-high")}>
                        Value (High to Low)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("value-low")}>
                        Value (Low to High)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name")}>
                        Name (A-Z)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Filtered Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 sm:mb-6">
              {/* Filtered Total Value */}
              <Card className="border-amber-200 dark:border-amber-800/50 bg-linear-to-br from-amber-50/50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Total Value
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold bg-linear-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                    {formatCurrency(filteredTotalValue)}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs">
                    {filteredTotalProfit >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={
                        filteredTotalProfit >= 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }
                    >
                      {filteredProfitPercentage}% (
                      {formatCurrency(filteredTotalProfit)})
                    </span>
                  </div>
                </CardHeader>
              </Card>

              {/* Filtered Total Weight */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Weight className="w-3 h-3" />
                    Total Weight
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {filteredTotalWeight.toFixed(2)}g
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Across {filteredTotalItems} items</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Filtered Total Invested */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Coins className="w-3 h-3" />
                    Total Invested
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {formatCurrency(filteredTotalInvested)}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Initial investment</span>
                  </div>
                </CardHeader>
              </Card>

              {/* Filtered Collection Size */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">
                    Collection Size
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    {filteredTotalItems} Items
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Gem className="w-3 h-3" />
                    <span>Precious pieces</span>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Jewelry Grid */}
            {isLoadingJewelry ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
                  <p className="text-muted-foreground">
                    Loading your jewelry collection...
                  </p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-muted rounded-full">
                      <Crown className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {jewelryItems.length === 0
                          ? "No Jewelry Items Yet"
                          : "No Items Match Your Filters"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {jewelryItems.length === 0
                          ? "Start building your collection by adding your first jewelry item"
                          : "Try adjusting your filters or search query"}
                      </p>
                      {jewelryItems.length === 0 && (
                        <Button
                          onClick={() => setIsAddDialogOpen(true)}
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Item
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const profit = item.currentValue - item.buyPrice;
                  const profitPercent = (
                    (profit / item.buyPrice) *
                    100
                  ).toFixed(1);

                  return (
                    <Card
                      key={item.id}
                      className="border-border bg-card hover:shadow-lg transition-all overflow-hidden group cursor-pointer hover:scale-[1.02]"
                      onClick={() => handleItemClick(item)}
                    >
                      {/* Image */}
                      <div className="relative h-64 bg-muted overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Crown className="w-24 h-24 text-muted-foreground/20" />
                          </div>
                        )}
                        <Badge className="absolute top-2 left-2 bg-linear-to-r from-amber-500 to-yellow-600 text-white border-0 text-xs shadow-lg">
                          {item.goldType}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 bg-white/90 dark:bg-neutral-900/90 border-border opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(item);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(item.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CardHeader className="pb-3 pt-4">
                        <div>
                          <CardTitle className="text-base mb-0.5">
                            {item.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {item.category}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2 pt-0">
                        {/* Current Value */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            Current Value
                          </span>
                          <span className="text-base font-bold text-primary">
                            {formatCurrency(item.currentValue)}
                          </span>
                        </div>

                        <Separator />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                          <div>
                            <p className="text-muted-foreground text-[10px] mb-0.5">
                              Weight
                            </p>
                            <p className="font-semibold">{item.weight}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[10px] mb-0.5">
                              Buy Price
                            </p>
                            <p className="font-semibold text-xs">
                              {formatCurrency(item.buyPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[10px] mb-0.5">
                              Profit/Loss
                            </p>
                            <p
                              className={`font-semibold text-xs ${
                                profit >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {profit >= 0 ? "+" : ""}
                              {formatCurrency(profit)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[10px] mb-0.5">
                              Change
                            </p>
                            <p
                              className={`font-semibold text-xs ${
                                profit >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {profit >= 0 ? "+" : ""}
                              {profitPercent}%
                            </p>
                          </div>
                        </div>

                        <Separator />

                        {/* Date */}
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Purchased on {formatDate(item.dateBought)}
                          </span>
                        </div>

                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Sheet */}
      <Sheet
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          // Prevent closing if camera or crop dialog is open
          if (isCameraOpen || isCropDialogOpen) return;
          if (!open) handleCancelEdit();
          else setIsEditDialogOpen(true);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto p-0"
          onInteractOutside={(e) => {
            if (isCameraOpen || isCropDialogOpen) e.preventDefault();
          }}
        >
          {editingItem && (
            <div
              className={`${
                isCameraOpen || isCropDialogOpen ? "pointer-events-none" : ""
              }`}
            >
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="text-xl font-bold">
                  Edit Jewelry Details
                </SheetTitle>
                <SheetDescription className="text-sm">
                  Update the information for {editingItem.name}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-6 pb-6 mt-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditFormChange("name", e.target.value)
                    }
                    placeholder="Jewelry name"
                    className="border-border"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(value: string) =>
                      handleEditFormChange("category", value)
                    }
                  >
                    <SelectTrigger id="edit-category" className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ring">Ring</SelectItem>
                      <SelectItem value="Necklace">Necklace</SelectItem>
                      <SelectItem value="Necklace w/ Pendant">
                        Necklace w/ Pendant
                      </SelectItem>
                      <SelectItem value="Pendant">Pendant</SelectItem>
                      <SelectItem value="Bracelet">Bracelet</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Chain">Chain</SelectItem>
                      <SelectItem value="Bangle">Bangle</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gold Type */}
                <div className="space-y-2">
                  <Label htmlFor="edit-goldType">Gold Type</Label>
                  <Select
                    value={editFormData.goldType}
                    onValueChange={(value: string) =>
                      handleEditFormChange("goldType", value)
                    }
                  >
                    <SelectTrigger id="edit-goldType" className="border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24k">24K Gold</SelectItem>
                      <SelectItem value="22k">22K Gold</SelectItem>
                      <SelectItem value="21k">21K Gold</SelectItem>
                      <SelectItem value="20k">20K Gold</SelectItem>
                      <SelectItem value="18k">18K Gold</SelectItem>
                      <SelectItem value="16k">16K Gold</SelectItem>
                      <SelectItem value="14k">14K Gold</SelectItem>
                      <SelectItem value="10k">10K Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight (grams)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={editFormData.weight || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditFormChange(
                        "weight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="border-border"
                  />
                </div>

                {/* Buy Price */}
                <div className="space-y-2">
                  <Label htmlFor="edit-buyPrice">
                    Buy Price ({selectedCurrency})
                  </Label>
                  <Input
                    id="edit-buyPrice"
                    type="number"
                    value={editFormData.buyPrice || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditFormChange(
                        "buyPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="border-border"
                  />
                </div>

                {/* Current Value (Calculated) */}
                {editFormData.weight > 0 && editFormData.goldType && (
                  <div className="space-y-2">
                    <Label>Estimated Current Value ({selectedCurrency})</Label>
                    <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                      <span className="text-muted-foreground">
                        {formatCurrency(
                          editFormData.weight *
                            goldPricesPerGram[
                              editFormData.goldType as keyof typeof goldPricesPerGram
                            ]
                        )}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({editFormData.weight}g ×{" "}
                        {formatCurrency(
                          goldPricesPerGram[
                            editFormData.goldType as keyof typeof goldPricesPerGram
                          ]
                        )}
                        /g)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on current {editFormData.goldType} gold price
                    </p>
                  </div>
                )}

                {/* Date Bought */}
                <div className="space-y-2">
                  <Label htmlFor="edit-dateBought">Date Bought</Label>
                  <Input
                    id="edit-dateBought"
                    type="date"
                    value={editFormData.dateBought}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleEditFormChange("dateBought", e.target.value)
                    }
                    className="border-border"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleEditFormChange("description", e.target.value)
                    }
                    placeholder="Add any additional details..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-md border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    value={editTagInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEditTagInput(e.target.value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const trimmedTag = editTagInput.trim();
                        if (
                          trimmedTag &&
                          !editFormData.tags.includes(trimmedTag)
                        ) {
                          handleEditFormChange("tags", [
                            ...editFormData.tags,
                            trimmedTag,
                          ]);
                          setEditTagInput("");
                        }
                      }
                    }}
                    placeholder="Type a tag and press Enter (e.g., vintage, gift)"
                    className="border-border"
                  />
                  {editFormData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editFormData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const newTags = editFormData.tags.filter(
                                (_, i) => i !== index
                              );
                              handleEditFormChange("tags", newTags);
                            }}
                            className="hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-2">
                      Suggested tags:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedTags
                        .filter((tag) => !editFormData.tags.includes(tag))
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              handleEditFormChange("tags", [
                                ...editFormData.tags,
                                tag,
                              ]);
                            }}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Images Upload */}
                <div className="space-y-2">
                  <Label>Images</Label>

                  {/* Upload Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* File Upload */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                          : "border-border hover:border-amber-400 hover:bg-accent"
                      }`}
                      onDragOver={handleEditDragOver}
                      onDragLeave={handleEditDragLeave}
                      onDrop={handleEditDrop}
                      onClick={() =>
                        document.getElementById("edit-image-upload")?.click()
                      }
                    >
                      <input
                        id="edit-image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`p-3 rounded-full ${
                            isDragging
                              ? "bg-amber-100 dark:bg-amber-900/30"
                              : "bg-muted"
                          }`}
                        >
                          <Upload
                            className={`w-5 h-5 ${
                              isDragging
                                ? "text-amber-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {isDragging ? "Drop here" : "Upload Files"}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Click or drag
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Camera Button */}
                    <div
                      onClick={() => openCamera("edit")}
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all border-border hover:border-amber-400 hover:bg-accent"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-muted">
                          <Camera className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">Take Photo</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Use camera
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(editFormData.images.length > 0 ||
                    editPendingImages.length > 0) && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {/* Show already uploaded images */}
                      {editFormData.images.map((img, idx) => (
                        <div key={`uploaded-${idx}`} className="relative group">
                          <img
                            src={img}
                            alt={`Uploaded ${idx + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newImages = editFormData.images.filter(
                                (_: string, i: number) => i !== idx
                              );
                              setEditFormData({
                                ...editFormData,
                                images: newImages,
                              });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {/* Show pending images (not uploaded yet) */}
                      {editPendingImages.map((pendingImage, idx) => (
                        <div key={`pending-${idx}`} className="relative group">
                          <img
                            src={pendingImage.preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-20 object-cover rounded border border-amber-500"
                          />
                          <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Preview
                          </div>
                          {/* Edit/Recrop button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecropImage(
                                pendingImage.preview,
                                idx,
                                "pending",
                                "edit"
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit/Recrop image"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              URL.revokeObjectURL(pendingImage.preview);
                              setEditPendingImages((prev) =>
                                prev.filter((_, i) => i !== idx)
                              );
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t mt-4">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-border w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-amber-600 hover:bg-amber-700 text-white flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading {uploadProgress}%
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Jewelry Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-[100vw] sm:max-w-[95vw] md:max-w-3xl h-screen sm:h-auto sm:max-h-[90vh] overflow-y-auto pt-3 sm:pt-4 px-3 sm:px-6 pb-4 sm:pb-6"
          onInteractOutside={(e) => {
            if (isCameraOpen) e.preventDefault();
          }}
        >
          {selectedItem && (
            <div
              className={`space-y-2 sm:space-y-2.5 ${
                isCameraOpen ? "pointer-events-none" : ""
              }`}
            >
              <DialogHeader className="pb-1 sm:pb-1.5 pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      {selectedItem.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-0.5">
                      {selectedItem.category} • {selectedItem.goldType}
                    </DialogDescription>
                  </div>
                  <Badge className="bg-linear-to-r from-amber-500 to-yellow-600 text-white border-0 text-xs shadow-lg">
                    {selectedItem.goldType}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Image Carousel */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                {/* Image */}
                {selectedItem.images && selectedItem.images.length > 0 ? (
                  <img
                    src={selectedItem.images[currentImageIndex]}
                    alt={`${selectedItem.name} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Crown className="w-24 h-24 text-muted-foreground/20" />
                  </div>
                )}

                {/* Navigation Buttons */}
                {selectedItem.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 dark:bg-neutral-900/90 border-border opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 dark:bg-neutral-900/90 border-border opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      disabled={
                        currentImageIndex === selectedItem.images.length - 1
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs">
                      {currentImageIndex + 1} / {selectedItem.images.length}
                    </div>
                  </>
                )}

                {/* Image Dots */}
                {selectedItem.images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedItem.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-primary w-4"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-1">
                <h3 className="font-semibold text-sm mb-1">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <Separator />

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Current Value
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(selectedItem.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Purchase Price
                  </p>
                  <p className="text-base font-semibold">
                    {formatCurrency(selectedItem.buyPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Weight
                  </p>
                  <p className="text-base font-semibold flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5 text-muted-foreground" />
                    {selectedItem.weight}g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    Gold Type
                  </p>
                  <p className="text-base font-semibold">
                    {selectedItem.goldType}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profit/Loss Section */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Investment Performance
                    </p>
                    <div className="flex items-center gap-2">
                      {selectedItem.currentValue - selectedItem.buyPrice >=
                      0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-xl font-bold ${
                          selectedItem.currentValue - selectedItem.buyPrice >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedItem.currentValue - selectedItem.buyPrice >= 0
                          ? "+"
                          : ""}
                        {formatCurrency(
                          selectedItem.currentValue - selectedItem.buyPrice
                        )}
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          selectedItem.currentValue - selectedItem.buyPrice >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        (
                        {(
                          ((selectedItem.currentValue - selectedItem.buyPrice) /
                            selectedItem.buyPrice) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Date */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Purchased on {formatDate(selectedItem.dateBought)}</span>
              </div>

              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedItem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(selectedItem);
                  }}
                >
                  <Edit className="w-3.5 h-3.5 mr-1.5" />
                  Edit Details
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 h-9"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedItem) {
                      handleDeleteClick(selectedItem.id);
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Jewelry Sheet */}
      <Sheet
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          // Prevent closing if camera or crop dialog is open
          if (isCameraOpen || isCropDialogOpen) return;
          if (!open) handleCancelAdd();
          else setIsAddDialogOpen(true);
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl overflow-y-auto p-0"
          onInteractOutside={(e) => {
            if (isCameraOpen || isCropDialogOpen) e.preventDefault();
          }}
        >
          <div
            className={`${
              isCameraOpen || isCropDialogOpen ? "pointer-events-none" : ""
            }`}
          >
            <SheetHeader className="px-6 pt-6">
              <SheetTitle className="text-xl font-bold">
                Add New Jewelry
              </SheetTitle>
              <SheetDescription className="text-sm">
                Add a new jewelry item to your collection
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3 sm:space-y-4 px-6 pb-6 mt-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="add-name">Name *</Label>
                <Input
                  id="add-name"
                  value={addFormData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAddFormChange("name", e.target.value)
                  }
                  placeholder="e.g., Diamond Ring"
                  className="border-border"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="add-images">Images</Label>
                <div className="space-y-3">
                  {/* Upload Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* File Upload */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("add-images")?.click()
                      }
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                          : "border-border hover:border-amber-400 hover:bg-accent"
                      }`}
                    >
                      <input
                        type="file"
                        id="add-images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`p-3 rounded-full ${
                            isDragging
                              ? "bg-amber-100 dark:bg-amber-900/30"
                              : "bg-muted"
                          }`}
                        >
                          <Upload
                            className={`w-5 h-5 ${
                              isDragging
                                ? "text-amber-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-medium">
                            {isDragging ? "Drop here" : "Upload Files"}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Click or drag
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Camera Button */}
                    <div
                      onClick={() => openCamera("add")}
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all border-border hover:border-amber-400 hover:bg-accent"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-muted">
                          <Camera className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs font-medium">Take Photo</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Use camera
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Count */}
                  {(addFormData.images.length > 0 ||
                    addPendingImages.length > 0) && (
                    <div className="text-center">
                      <div className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                        {addFormData.images.length + addPendingImages.length}{" "}
                        image(s) selected
                        {addPendingImages.length > 0 &&
                          ` (${addPendingImages.length} pending upload)`}
                      </div>
                    </div>
                  )}

                  {/* Image Previews */}
                  {(addFormData.images.length > 0 ||
                    addPendingImages.length > 0) && (
                    <div className="grid grid-cols-3 gap-2">
                      {/* Show already uploaded images */}
                      {addFormData.images.map((image, index) => (
                        <div
                          key={`uploaded-${index}`}
                          className="relative group"
                        >
                          <img
                            src={image}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {/* Show pending images (not uploaded yet) */}
                      {addPendingImages.map((pendingImage, index) => (
                        <div
                          key={`pending-${index}`}
                          className="relative group"
                        >
                          <img
                            src={pendingImage.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-amber-500"
                          />
                          <div className="absolute top-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Preview
                          </div>
                          {/* Edit/Recrop button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRecropImage(
                                pendingImage.preview,
                                index,
                                "pending",
                                "add"
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit/Recrop image"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              URL.revokeObjectURL(pendingImage.preview);
                              setAddPendingImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Category and Gold Type Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-category">Category *</Label>
                  <select
                    id="add-category"
                    value={addFormData.category}
                    onChange={(e) =>
                      handleAddFormChange("category", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-background [&_option]:text-foreground"
                  >
                    <option value="Ring">Ring</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Necklace w/ Pendant">
                      Necklace w/ Pendant
                    </option>
                    <option value="Pendant">Pendant</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Chain">Chain</option>
                    <option value="Bangle">Bangle</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-goldType">Gold Type *</Label>
                  <select
                    id="add-goldType"
                    value={addFormData.goldType}
                    onChange={(e) =>
                      handleAddFormChange("goldType", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&_option]:bg-background [&_option]:text-foreground"
                  >
                    <option value="24k">24K (99.9%)</option>
                    <option value="22k">22K (91.7%)</option>
                    <option value="21k">21K (87.5%)</option>
                    <option value="20k">20K (83.3%)</option>
                    <option value="18k">18K (75%)</option>
                    <option value="16k">16K (66.7%)</option>
                    <option value="14k">14K (58.3%)</option>
                    <option value="10k">10K (41.7%)</option>
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="add-weight">Weight (grams) *</Label>
                <Input
                  id="add-weight"
                  type="number"
                  step="0.1"
                  value={addFormData.weight || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAddFormChange(
                      "weight",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="e.g., 5.2"
                  className="border-border"
                />
              </div>

              {/* Buy Price */}
              <div className="space-y-2">
                <Label htmlFor="add-buyPrice">
                  Buy Price ({selectedCurrency}) *
                </Label>
                <Input
                  id="add-buyPrice"
                  type="number"
                  step="0.01"
                  value={addFormData.buyPrice || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAddFormChange(
                      "buyPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="e.g., 25000"
                  className="border-border"
                />
              </div>

              {/* Current Value (Calculated) */}
              {addFormData.weight > 0 && addFormData.goldType && (
                <div className="space-y-2">
                  <Label>Estimated Current Value ({selectedCurrency})</Label>
                  <div className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                    <span className="text-muted-foreground">
                      {formatCurrency(
                        addFormData.weight *
                          goldPricesPerGram[
                            addFormData.goldType as keyof typeof goldPricesPerGram
                          ]
                      )}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({addFormData.weight}g ×{" "}
                      {formatCurrency(
                        goldPricesPerGram[
                          addFormData.goldType as keyof typeof goldPricesPerGram
                        ]
                      )}
                      /g)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on current {addFormData.goldType} gold price
                  </p>
                </div>
              )}

              {/* Date Bought */}
              <div className="space-y-2">
                <Label htmlFor="add-dateBought">Date Purchased *</Label>
                <Input
                  id="add-dateBought"
                  type="date"
                  value={addFormData.dateBought}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleAddFormChange("dateBought", e.target.value)
                  }
                  className="border-border"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="add-description">Description</Label>
                <textarea
                  id="add-description"
                  value={addFormData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleAddFormChange("description", e.target.value)
                  }
                  placeholder="Add a description of your jewelry..."
                  rows={3}
                  className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="add-tags">Tags</Label>
                <Input
                  id="add-tags"
                  value={addTagInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddTagInput(e.target.value);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmedTag = addTagInput.trim();
                      if (
                        trimmedTag &&
                        !addFormData.tags.includes(trimmedTag)
                      ) {
                        handleAddFormChange("tags", [
                          ...addFormData.tags,
                          trimmedTag,
                        ]);
                        setAddTagInput("");
                      }
                    }
                  }}
                  placeholder="Type a tag and press Enter (e.g., vintage, gift)"
                  className="border-border"
                />
                {addFormData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {addFormData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = addFormData.tags.filter(
                              (_, i) => i !== index
                            );
                            handleAddFormChange("tags", newTags);
                          }}
                          className="hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Tags */}
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Suggested tags:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedTags
                      .filter((tag) => !addFormData.tags.includes(tag))
                      .map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            handleAddFormChange("tags", [
                              ...addFormData.tags,
                              tag,
                            ]);
                          }}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t mt-4">
              <Button
                variant="outline"
                className="border-border w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
                onClick={handleCancelAdd}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm"
                onClick={handleAddJewelry}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Jewelry
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this jewelry item?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              jewelry item and remove all associated images from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Crop Dialog */}
      {isCropDialogOpen && imageToCrop && (
        <div
          className="fixed inset-0 bg-black pointer-events-auto flex flex-col"
          style={{ zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-black/80 z-20">
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCropCancel();
              }}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <h3 className="text-white font-semibold">
              {editingImageIndex !== null ? "Edit Image" : "Crop Image"}
            </h3>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCropSave();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              Done
            </Button>
          </div>

          {/* Cropper Area */}
          <div className="relative flex-1 bg-black">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#000",
                },
              }}
            />
          </div>

          {/* Bottom Controls */}
          <div className="bg-black/90 p-4 space-y-4 z-20">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <span>Zoom</span>
                </div>
                <ZoomIn className="w-4 h-4" />
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  <span>Rotation</span>
                </div>
                <span>{rotation}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Full-Screen Camera Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-100 bg-black pointer-events-auto">
          {/* Camera Preview - Full Screen */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Viewfinder Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-8 sm:inset-12 border-2 border-white/30 rounded-lg">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
            </div>
          </div>

          {/* Top Bar - Close Button */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-b from-black/60 to-transparent z-10">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeCamera}
                className="text-white hover:bg-white/20 h-10 w-10 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
              <p className="text-white text-sm font-medium">
                Position your jewelry
              </p>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </div>

          {/* Bottom Controls - Camera Button */}
          <div className="absolute bottom-0 left-0 right-0 pb-8 pt-6 sm:pb-12 sm:pt-8 bg-linear-to-t from-black/80 via-black/40 to-transparent z-10">
            <div className="flex items-center justify-center gap-8">
              {/* Cancel Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={closeCamera}
                className="text-white hover:bg-white/20 text-base font-medium px-6"
              >
                Cancel
              </Button>

              {/* Capture Button - Large Circle */}
              <button
                type="button"
                onClick={capturePhoto}
                className="relative w-20 h-20 rounded-full border-4 border-white bg-transparent hover:bg-white/10 transition-all active:scale-95"
              >
                <div className="absolute inset-2 rounded-full bg-white" />
              </button>

              {/* Empty spacer for symmetry */}
              <div className="w-24" />
            </div>
          </div>

          {/* Hidden Canvas for Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
}
