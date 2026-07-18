import { PDFParse } from "pdf-parse";

export const extractTextFromPDFBuffer = async (buffer: Buffer): Promise<string> => {
  try {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    await (parser as any).load();
    const textResult = await parser.getText();
    return textResult.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
