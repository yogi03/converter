import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function compressFileName(fileName: string): string {
  const maxLen = 15;
  if (fileName.length <= maxLen) return fileName;
  const extIndex = fileName.lastIndexOf('.');
  const ext = fileName.substring(extIndex);
  const name = fileName.substring(0, extIndex);
  return `${name.substring(0, 10)}...${name.substring(name.length - 3)}${ext}`;
}
