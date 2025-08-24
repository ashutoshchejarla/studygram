import * as fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export async function processPDF(filePath: string): Promise<string> {
  try {
    // In production, you'd use a PDF processing library like pdf-parse
    // For now, we'll simulate PDF text extraction
    const buffer = await readFile(filePath);
    
    // This would typically use pdf-parse or similar:
    // const pdfData = await pdf(buffer);
    // return pdfData.text;
    
    // Placeholder implementation
    return `PDF content extracted from file. In production, this would use pdf-parse library to extract actual text content from the PDF file at ${filePath}.`;
  } catch (error) {
    throw new Error("Failed to process PDF file. Please ensure the file is a valid PDF.");
  }
}

export async function processTextFile(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error("Failed to read text file. Please ensure the file is valid text format.");
  }
}

export function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.toLowerCase().split('.').pop();
  return allowedTypes.includes(`.${extension}`);
}
