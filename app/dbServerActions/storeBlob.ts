"use server"
import { put } from "@vercel/blob"

export default async function StoreImageBlob(imageData: ArrayBuffer | Uint8Array | Buffer, filename: string) {
  try {
    let dataToUpload: ArrayBuffer | Buffer;
    
    if (imageData instanceof Uint8Array) {
      dataToUpload = Buffer.from(imageData);
    } else {
      dataToUpload = imageData;
    }
    // Store image in vercel blob
    const blob = await put(filename, dataToUpload, {
      access: "public",
    })

    console.log("Image stored successfully in Vercel Blob:", blob.url)

    return {
      success: true,
      url: blob.url,
      message: "Image stored successfully",
    }
  } catch (e) {
    console.error("Blob processing error:", e)
    // Something went wrong - no changes were made to vercel blob
    throw new Error("Failed to store image in blob storage")
  }
}
