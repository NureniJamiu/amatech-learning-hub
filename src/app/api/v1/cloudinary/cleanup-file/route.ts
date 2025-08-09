import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Cleanup uploaded file when database operation fails
 * This ensures transactional integrity for file uploads
 */
export async function POST(req: Request) {
  try {
    const { fileUrl } = await req.json()

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: "No file URL provided" }, { status: 400 })
    }

    // Extract public ID from Cloudinary URL
    const urlParts = fileUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    const publicId = filename.split('.')[0]

    // Include folder path if present
    const folderIndex = urlParts.indexOf('upload') + 1
    if (folderIndex < urlParts.length - 1) {
      const folders = urlParts.slice(folderIndex, -1).join('/')
      const fullPublicId = `${folders}/${publicId}`

      const result = await cloudinary.uploader.destroy(fullPublicId)
      return NextResponse.json({
        success: true,
        result,
        message: "File cleanup successful"
      })
    }

    const result = await cloudinary.uploader.destroy(publicId)
    return NextResponse.json({
      success: true,
      result,
      message: "File cleanup successful"
    })
  } catch (err) {
    console.error("Cloudinary cleanup failed:", err)
    return NextResponse.json({
      success: false,
      error: "Failed to cleanup file"
    }, { status: 500 })
  }
}
