// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const file = formData.get('file');

//   // Implement file handling logic here (e.g., save to storage)

//   if (file) {
//     console.log("file uploaded")
//     return NextResponse.json({ message: 'File uploaded successfully!' }, { status: 200 });
//   } else {
//     console.log("file uploaded failed")
//     return NextResponse.json({ message: 'File upload failed.' }, { status: 400 });
//   }
// }

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  // Check if the file is valid
  if (file && file instanceof Blob) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define the directory to store uploaded files
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, filename);

    // Write the file to the filesystem
    fs.writeFileSync(filePath, buffer);

    console.log("File uploaded:", filename);
    return NextResponse.json({ message: 'File uploaded successfully!', filename }, { status: 200 });
  } else {
    console.log("File upload failed");
    return NextResponse.json({ message: 'File upload failed.' }, { status: 400 });
  }
}
