"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  Info,
  DollarSign,
  CreditCard,
  Camera,
  AlertCircle,
  HelpCircle,
  Lock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import AuthRequiredDialog from "@/components/auth-required-dialog"

const categories = [
  "Vehicles",
  "Real Estate",
  "Collectibles",
  "Fashion",
  "Electronics",
  "Furniture",
  "Home & Kitchen",
  "Business Equipment",
  "Sports & Outdoors",
  "Jewelry & Watches",
  "Art & Antiques",
  "Books & Media",
  "Musical Instruments",
  "Toys & Games",
]

const subcategories = {
  Vehicles: ["Cars", "Motorcycles", "Trucks", "Boats", "Parts & Accessories"],
  "Real Estate": ["Houses", "Apartments", "Land", "Commercial", "Vacation Rentals"],
  Collectibles: ["Stamps", "Coins", "Trading Cards", "Memorabilia", "Vintage Items"],
  Fashion: ["Clothing", "Shoes", "Accessories", "Bags", "Watches"],
  Electronics: ["Phones", "Computers", "Cameras", "Audio", "Gaming"],
  Furniture: ["Living Room", "Bedroom", "Dining", "Office", "Outdoor"],
  "Home & Kitchen": ["Appliances", "Cookware", "Decor", "Lighting", "Storage"],
  "Business Equipment": ["Office", "Restaurant", "Retail", "Industrial", "Medical"],
  "Sports & Outdoors": ["Fitness", "Camping", "Fishing", "Team Sports", "Water Sports"],
  "Jewelry & Watches": ["Rings", "Necklaces", "Earrings", "Bracelets", "Luxury Watches"],
  "Art & Antiques": ["Paintings", "Sculptures", "Prints", "Antique Furniture", "Pottery"],
  "Books & Media": ["Books", "Magazines", "Vinyl Records", "CDs & DVDs", "Manuscripts"],
  "Musical Instruments": ["Guitars", "Pianos", "Drums", "Wind Instruments", "DJ Equipment"],
  "Toys & Games": ["Action Figures", "Board Games", "Puzzles", "Vintage Toys", "Outdoor Toys"],
}

const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "For Parts/Not Working"]

const locations = [
  "Port of Spain",
  "San Fernando",
  "Arima",
  "Chaguanas",
  "San Juan",
  "Scarborough, Tobago",
  "Point Fortin",
  "Princes Town",
  "Couva",
  "Sangre Grande",
  "Diego Martin",
  "Tunapuna",
  "Siparia",
  "Rio Claro",
  "Penal",
  "Mayaro",
]

interface FormData {
  title: string
  category: string
  subcategory: string
  condition: string
  description: string
  features: string[]
  startingBid: string
  reservePrice: string
  buyNowPrice: string
  location: string
  duration: string
  images: File[]
  imageUrls: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  contactWhatsapp: boolean
  hidePhone: boolean
  paymentMethod: string
  termsAgreed: boolean
  premium: boolean
  featured: boolean
  boldTitle: boolean
  highlightListing: boolean
}

export default function PostAdPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(25)
  const [activeTab, setActiveTab] = useState("basic")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [featureInput, setFeatureInput] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [securityInfo, setSecurityInfo] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    description: "",
    features: [],
    startingBid: "",
    reservePrice: "",
    buyNowPrice: "",
    location: "",
    duration: "7",
    images: [],
    imageUrls: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactWhatsapp: true,
    hidePhone: false,
    paymentMethod: "credit-card",
    termsAgreed: false,
    premium: false,
    featured: false,
    boldTitle: false,
    highlightListing: false,
  })

  // Check authentication status when component mounts
  useEffect(() => {
    // This is a mock authentication check
    // In a real app, you would check your auth state from a context or API
    const checkAuth = () => {
      // Mock: User is not authenticated
      setIsAuthenticated(false)

      // If not authenticated, show the auth dialog
      if (!isAuthenticated) {
        setShowAuthDialog(true)
      }
    }

    checkAuth()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subcategory: "", // Reset subcategory when category changes
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)

      // Limit to 10 images total
      const totalImages = formData.images.length + newFiles.length
      if (totalImages > 10) {
        setFormErrors((prev) => ({
          ...prev,
          images: "You can upload a maximum of 10 images",
        }))
        return
      }

      const newUrls = newFiles.map((file) => URL.createObjectURL(file))

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imageUrls: [...prev.imageUrls, ...newUrls],
      }))

      // Clear error if it exists
      if (formErrors.images) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...formData.images]
    const newUrls = [...formData.imageUrls]

    newImages.splice(index, 1)
    newUrls.splice(index, 1)

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageUrls: newUrls,
    }))
  }

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...formData.images]
    const newUrls = [...formData.imageUrls]

    // Move the image
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)

    // Move the URL
    const [movedUrl] = newUrls.splice(fromIndex, 1)
    newUrls.splice(toIndex, 0, movedUrl)

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageUrls: newUrls,
    }))
  }

  const makeMainImage = (index: number) => {
    if (index === 0) return // Already main image
    reorderImages(index, 0)
  }

  const addFeature = () => {
    if (featureInput.trim() && formData.features.length < 10) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }))
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...formData.features]
    newFeatures.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }))
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) errors.title = "Title is required"
      if (!formData.category) errors.category = "Category is required"
      if (formData.category && !formData.subcategory) errors.subcategory = "Subcategory is required"
      if (!formData.condition) errors.condition = "Condition is required"
      if (!formData.description.trim()) errors.description = "Description is required"
      if (!formData.startingBid) errors.startingBid = "Starting bid is required"
      if (formData.reservePrice && Number(formData.reservePrice) <= Number(formData.startingBid)) {
        errors.reservePrice = "Reserve price must be higher than starting bid"
      }
      if (formData.buyNowPrice && Number(formData.buyNowPrice) <= Number(formData.startingBid)) {
        errors.buyNowPrice = "Buy now price must be higher than starting bid"
      }
      if (!formData.location) errors.location = "Location is required"
      if (!formData.duration) errors.duration = "Duration is required"
    } else if (step === 2) {
      if (formData.imageUrls.length === 0) errors.images = "At least one image is required"
    } else if (step === 3) {
      if (!formData.contactName.trim()) errors.contactName = "Name is required"
      if (!formData.contactPhone.trim()) errors.contactPhone = "Phone number is required"
      if (!formData.contactEmail.trim()) errors.contactEmail = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) errors.contactEmail = "Email is invalid"
      if (!formData.termsAgreed) errors.termsAgreed = "You must agree to the terms and conditions"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      setProgress(newStep * 25)
    }
  }

  const prevStep = () => {
    const newStep = currentStep - 1
    setCurrentStep(newStep)
    setProgress(newStep * 25)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(3)) {
      // Process form submission
      console.log("Form submitted:", formData)
      // Redirect to success page or dashboard
      setCurrentStep(4)
      setProgress(100)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const calculateTotal = () => {
    let total = 50 // Base listing fee

    if (formData.premium) total += 25
    if (formData.featured) total += 30
    if (formData.boldTitle) total += 10
    if (formData.highlightListing) total += 15

    return total
  }

  const handleLoginRedirect = () => {
    router.push("/auth/login?redirect=/post-ad")
  }

  const handleSignupRedirect = () => {
    router.push("/auth/signup?redirect=/post-ad")
  }

  // If not authenticated and dialog is shown, render only the dialog
  if (!isAuthenticated && showAuthDialog) {
    return (
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onLogin={handleLoginRedirect}
        onSignup={handleSignupRedirect}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">ezyauction.tt</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/categories" className="text-sm font-medium hover:underline underline-offset-4">
              Categories
            </Link>
            <Link href="/listings" className="text-sm font-medium hover:underline underline-offset-4">
              Browse Listings
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              John Doe
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 md:px-6 md:py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-2xl font-bold mt-4 md:text-3xl">Post Your Ad</h1>
            <p className="text-gray-500 mt-2">Create a new listing to sell your item through auction</p>
          </div>

          {currentStep < 4 && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Step {currentStep} of 3</span>
                <span className="text-sm font-medium">{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />

              <div className="relative mt-8">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {currentStep > 1 ? <Check className="h-5 w-5" /> : 1}
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep > 1 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {currentStep > 2 ? <Check className="h-5 w-5" /> : 2}
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${currentStep > 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    3
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Item Details</span>
                  <span>Photos</span>
                  <span>Contact & Payment</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide detailed information about your item to attract potential buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details & Features</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing & Duration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="title">
                          Title <span className="text-red-500">*</span>
                        </Label>
                        <span className="text-xs text-gray-500">{formData.title.length}/100</span>
                      </div>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., 'Vintage Trinidad Carnival Costume'"
                        value={formData.title}
                        onChange={handleInputChange}
                        maxLength={100}
                        className={formErrors.title ? "border-red-500" : ""}
                      />
                      {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
                      <p className="text-xs text-gray-500">
                        A clear, descriptive title will help buyers find your item
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.category && <p className="text-xs text-red-500">{formErrors.category}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subcategory">
                          Subcategory <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.subcategory}
                          onValueChange={(value) => handleSelectChange("subcategory", value)}
                          disabled={!formData.category}
                        >
                          <SelectTrigger className={formErrors.subcategory ? "border-red-500" : ""}>
                            <SelectValue
                              placeholder={formData.category ? "Select a subcategory" : "Select category first"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.category &&
                              subcategories[formData.category as keyof typeof subcategories]?.map((subcategory) => (
                                <SelectItem key={subcategory} value={subcategory}>
                                  {subcategory}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {formErrors.subcategory && <p className="text-xs text-red-500">{formErrors.subcategory}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">
                        Condition <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger className={formErrors.condition ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.condition && <p className="text-xs text-red-500">{formErrors.condition}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <span className="text-xs text-gray-500">{formData.description.length}/2000</span>
                      </div>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your item in detail, including condition, features, and any other relevant information"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        maxLength={2000}
                        className={formErrors.description ? "border-red-500" : ""}
                      />
                      {formErrors.description && <p className="text-xs text-red-500">{formErrors.description}</p>}
                      <p className="text-xs text-gray-500">
                        Be detailed and honest about the item's condition, history, and any flaws
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => handleSelectChange("location", value)}
                      >
                        <SelectTrigger className={formErrors.location ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button onClick={() => setActiveTab("details")} className="bg-emerald-600 hover:bg-emerald-700">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Key Features (Optional)</Label>
                          <span className="text-xs text-gray-500">{formData.features.length}/10</span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add a feature (e.g., 'Handmade', 'Limited Edition')"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            maxLength={50}
                          />
                          <Button
                            type="button"
                            onClick={addFeature}
                            disabled={!featureInput.trim() || formData.features.length >= 10}
                            className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
                          >
                            Add
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                          Add up to 10 key features to highlight what makes your item special
                        </p>

                        {formData.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => removeFeature(index)}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Tips for a Great Description</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                              <li>Be specific about the item's condition, age, and history</li>
                              <li>Mention any unique features or selling points</li>
                              <li>Include dimensions, materials, and technical specifications</li>
                              <li>Disclose any flaws, damage, or repairs honestly</li>
                              <li>Explain why you're selling the item</li>
                              <li>Mention if original packaging, manuals, or accessories are included</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("basic")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={() => setActiveTab("pricing")} className="bg-emerald-600 hover:bg-emerald-700">
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="startingBid">
                            Starting Bid (TTD) <span className="text-red-500">*</span>
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="sr-only">Starting bid info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  The minimum amount bidders must offer to participate in the auction
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="startingBid"
                            name="startingBid"
                            type="number"
                            placeholder="0.00"
                            className={`pl-9 ${formErrors.startingBid ? "border-red-500" : ""}`}
                            value={formData.startingBid}
                            onChange={handleInputChange}
                            min="1"
                          />
                        </div>
                        {formErrors.startingBid && <p className="text-xs text-red-500">{formErrors.startingBid}</p>}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="reservePrice">Reserve Price (Optional)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="sr-only">Reserve price info</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  The minimum price you're willing to accept. Item won't sell if bidding doesn't reach
                                  this amount.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input
                            id="reservePrice"
                            name="reservePrice"
                            type="number"
                            placeholder="0.00"
                            className={`pl-9 ${formErrors.reservePrice ? "border-red-500" : ""}`}
                            value={formData.reservePrice}
                            onChange={handleInputChange}
                            min="0"
                          />
                        </div>
                        {formErrors.reservePrice && <p className="text-xs text-red-500">{formErrors.reservePrice}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="buyNowPrice">Buy Now Price (Optional)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                <HelpCircle className="h-3 w-3" />
                                <span className="sr-only">Buy now price info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Set a price that allows buyers to purchase the item immediately without waiting for the
                                auction to end.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          id="buyNowPrice"
                          name="buyNowPrice"
                          type="number"
                          placeholder="0.00"
                          className={`pl-9 ${formErrors.buyNowPrice ? "border-red-500" : ""}`}
                          value={formData.buyNowPrice}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      {formErrors.buyNowPrice && <p className="text-xs text-red-500">{formErrors.buyNowPrice}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="duration">
                          Auction Duration <span className="text-red-500">*</span>
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                <HelpCircle className="h-3 w-3" />
                                <span className="sr-only">Duration info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                How long your auction will run. Longer durations may attract more bidders.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => handleSelectChange("duration", value)}
                      >
                        <SelectTrigger className={formErrors.duration ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="10">10 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.duration && <p className="text-xs text-red-500">{formErrors.duration}</p>}
                    </div>

                    <div className="mt-6 p-4 border rounded-lg bg-amber-50 border-amber-200">
                      <h3 className="font-medium mb-3">Premium Options</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="premium"
                              checked={formData.premium}
                              onCheckedChange={(checked) => handleCheckboxChange("premium", checked as boolean)}
                            />
                            <div>
                              <Label htmlFor="premium" className="font-medium">
                                Premium Listing (+TTD $25)
                              </Label>
                              <p className="text-xs text-gray-500">Higher search ranking and premium badge</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="featured"
                              checked={formData.featured}
                              onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                            />
                            <div>
                              <Label htmlFor="featured" className="font-medium">
                                Featured Listing (+TTD $30)
                              </Label>
                              <p className="text-xs text-gray-500">Appears on homepage and category pages</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="boldTitle"
                              checked={formData.boldTitle}
                              onCheckedChange={(checked) => handleCheckboxChange("boldTitle", checked as boolean)}
                            />
                            <div>
                              <Label htmlFor="boldTitle" className="font-medium">
                                Bold Title (+TTD $10)
                              </Label>
                              <p className="text-xs text-gray-500">
                                Makes your listing title stand out in search results
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="highlightListing"
                              checked={formData.highlightListing}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange("highlightListing", checked as boolean)
                              }
                            />
                            <div>
                              <Label htmlFor="highlightListing" className="font-medium">
                                Highlight Listing (+TTD $15)
                              </Label>
                              <p className="text-xs text-gray-500">Adds a colored background to your listing</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={() => setActiveTab("details")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                        Continue to Photos <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
                <CardDescription>
                  Add high-quality photos of your item to increase your chances of selling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Camera className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Drag and drop your photos here</h3>
                  <p className="text-sm text-gray-500 mb-4">or click the button below to browse your files</p>
                  <div className="relative">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button variant="outline" className="relative z-10" onClick={triggerFileInput}>
                      Browse Files
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Maximum 10 photos. Each photo must be less than 5MB. Supported formats: JPG, PNG, WEBP.
                  </p>
                </div>

                {formErrors.images && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{formErrors.images}</AlertDescription>
                  </Alert>
                )}

                {formData.imageUrls.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Uploaded Photos ({formData.imageUrls.length}/10)</h3>
                      <p className="text-xs text-gray-500">Drag to reorder • First image is the main photo</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden border">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Uploaded image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove image</span>
                            </Button>
                          </div>
                          {index === 0 ? (
                            <Badge className="absolute bottom-1 left-1 bg-emerald-600">Main Photo</Badge>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs py-0 h-6"
                              onClick={() => makeMainImage(index)}
                            >
                              Set as main
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 mt-6">
                  <h3 className="text-sm font-medium">Photo Tips</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-emerald-100 p-2 mb-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-center">Use natural lighting to show true colors</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-emerald-100 p-2 mb-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-center">Take photos from multiple angles</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                      <div className="rounded-full bg-emerald-100 p-2 mb-2">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                      <p className="text-center">Include close-ups of details and any flaws</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={formData.imageUrls.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Contact & Payment</CardTitle>
                <CardDescription>
                  Provide your contact information and complete the payment to list your item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        placeholder="e.g., John Smith"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className={formErrors.contactName ? "border-red-500" : ""}
                      />
                      {formErrors.contactName && <p className="text-xs text-red-500">{formErrors.contactName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        placeholder="e.g., 868-123-4567"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className={formErrors.contactPhone ? "border-red-500" : ""}
                      />
                      {formErrors.contactPhone && <p className="text-xs text-red-500">{formErrors.contactPhone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="e.g., your.email@example.com"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={formErrors.contactEmail ? "border-red-500" : ""}
                    />
                    {formErrors.contactEmail && <p className="text-xs text-red-500">{formErrors.contactEmail}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="contactWhatsapp"
                      checked={formData.contactWhatsapp}
                      onCheckedChange={(checked) => handleCheckboxChange("contactWhatsapp", checked as boolean)}
                    />
                    <Label htmlFor="contactWhatsapp" className="text-sm">
                      Allow WhatsApp contact (recommended)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hidePhone"
                      checked={formData.hidePhone}
                      onCheckedChange={(checked) => handleCheckboxChange("hidePhone", checked as boolean)}
                    />
                    <Label htmlFor="hidePhone" className="text-sm">
                      Hide my phone number from public view
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Listing Fee</h3>
                    <span className="font-semibold">TTD $50.00</span>
                  </div>

                  {formData.premium && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Premium Listing</h3>
                      <span className="font-semibold">TTD $25.00</span>
                    </div>
                  )}

                  {formData.featured && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Featured Listing</h3>
                      <span className="font-semibold">TTD $30.00</span>
                    </div>
                  )}

                  {formData.boldTitle && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Bold Title</h3>
                      <span className="font-semibold">TTD $10.00</span>
                    </div>
                  )}

                  {formData.highlightListing && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Highlight Listing</h3>
                      <span className="font-semibold">TTD $15.00</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between font-medium">
                    <h3>Total</h3>
                    <span className="text-lg">TTD ${calculateTotal().toFixed(2)}</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                    <div className="flex">
                      <Info className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Listing Fee Information</p>
                        <p className="mt-1">
                          A listing fee of TTD $50 is required to post your ad. This fee helps maintain the quality of
                          our platform and provides you with a {formData.duration}-day listing period.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSecurityInfo(!securityInfo)}
                          className="text-emerald-700 hover:underline mt-2 flex items-center"
                        >
                          <Lock className="h-3 w-3 mr-1" /> View security information
                        </button>
                      </div>
                    </div>
                  </div>

                  {securityInfo && (
                    <div className="bg-gray-50 border rounded-md p-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-emerald-600" />
                        Security Information
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        ezyauction.tt uses industry-leading encryption and security measures:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 256-bit SSL encryption for all transactions</li>
                        <li>• PCI DSS compliant payment processing</li>
                        <li>• Two-factor authentication for account protection</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Data is encrypted at rest and in transit</li>
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="credit-card" id="credit-card" className="peer sr-only" />
                        <Label
                          htmlFor="credit-card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600"
                        >
                          <CreditCard className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Credit Card</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="bank-transfer" id="bank-transfer" className="peer sr-only" />
                        <Label
                          htmlFor="bank-transfer"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600"
                        >
                          <DollarSign className="mb-3 h-6 w-6" />
                          <span className="text-sm font-medium">Bank Transfer</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input id="expiryDate" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input id="nameOnCard" placeholder="John Doe" />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "bank-transfer" && (
                    <div className="bg-gray-50 border rounded-md p-4 mt-4">
                      <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Please transfer TTD ${calculateTotal().toFixed(2)} to the following account:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Bank:</span> First Caribbean Bank
                        </p>
                        <p>
                          <span className="font-medium">Account Name:</span> ezyauction.tt Ltd
                        </p>
                        <p>
                          <span className="font-medium">Account Number:</span> 1234567890
                        </p>
                        <p>
                          <span className="font-medium">Reference:</span> Your email address
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">
                        Your listing will be approved once payment is confirmed.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="termsAgreed"
                    checked={formData.termsAgreed}
                    onCheckedChange={(checked) => handleCheckboxChange("termsAgreed", checked as boolean)}
                    className={formErrors.termsAgreed ? "border-red-500" : ""}
                  />
                  <Label htmlFor="termsAgreed" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {formErrors.termsAgreed && <p className="text-xs text-red-500">{formErrors.termsAgreed}</p>}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                  Pay & Post Ad
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="text-center">
              <CardContent className="pt-10 pb-10">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-6">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Ad Has Been Posted!</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Your listing has been successfully created and is now live on ezyauction.tt. You can manage your
                  listings from your dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/listings">
                    <Button variant="outline">Browse Listings</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Go to Dashboard</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

