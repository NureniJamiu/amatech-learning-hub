import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const { publicId } = await req.json()

  if (!publicId) {
    return NextResponse.json({ success: false, error: "No publicId provided" }, { status: 400 })
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error("Cloudinary deletion failed:", err)
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
}
