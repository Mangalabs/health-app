import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Função utilitária para combinar classes do Tailwind
 * e resolver conflitos (ex: p-2 p-4 -> p-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
