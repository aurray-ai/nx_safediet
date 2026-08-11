import { ImageResponse } from "next/og";

import { OgImageContent, ogImageSize } from "./og-image-content";

export const alt = "SAFEDIET — AI Meal Planning That Fits Your Budget";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
