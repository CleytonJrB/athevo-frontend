import {
  createSocialImage,
  socialImageContentType,
  socialImageSize,
} from "@/lib/metadata/social-image"

export const alt = "Athevo — Gestão precisa para academias"
export const size = socialImageSize
export const contentType = socialImageContentType

export default function OpenGraphImage() {
  return createSocialImage()
}
