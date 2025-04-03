import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to upload image to Supabase Storage
export async function uploadImage(file: File, bucket = "listings") {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file)

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

// Function to delete image from Supabase Storage
export async function deleteImage(url: string, bucket = "listings") {
  try {
    // Extract file path from URL
    const urlObj = new URL(url)
    const pathSegments = urlObj.pathname.split("/")
    const filePath = pathSegments[pathSegments.length - 1]

    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

