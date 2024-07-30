import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number) {
 // Check if number is undefined or null
 if (number === undefined || number === null) {
  return "0,00";
}

// Divide number by 100 to get the desired format
number /= 100;

// Convert number to string
let numStr = number.toString();

// Check if number has decimal part
let hasDecimal = numStr.includes('.');

// Split the number into integer and decimal parts
let parts = numStr.split('.');
let integerPart = parts[0];
let decimalPart = hasDecimal ? parts[1].padEnd(2, '0') : '00'; // pad with zeros if necessary

// Add commas to separate thousands
integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// If integerPart is empty, set it to '0'
integerPart = integerPart || '0';

// Return formatted number
return integerPart + ',' + decimalPart;
}



 
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();