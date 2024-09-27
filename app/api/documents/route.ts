// pages/api/documents.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // Define the directory containing uploaded files
  const uploadsDir = path.join(process.cwd(), 'uploads');

  try {
    // Read the files in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    // Map the files to the desired format
    const documents = files.map((file) => {
      return {
        id: file, // You might want to generate a more unique ID based on your needs
        name: file,
        url: `/uploads/${file}`, // Serve the file from the uploads directory
      };
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error reading documents:", error);
    return NextResponse.json({ message: "Failed to fetch documents." }, { status: 500 });
  }
}
