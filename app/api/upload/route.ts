// app/api/upload.ts
import { NextRequest,NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';
import client from '../../../db';

export async function POST(request:NextRequest){
  try{
  const formData=await request.formData();
  const file= formData.get('file');
    

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'No valid file uploaded' }, { status: 400 });
  }

  const uploadPath = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadPath, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadPath, file.name);

  fs.writeFileSync(filePath, buffer);

  // Store file info in PostgreSQL
  await client.query(
    'INSERT INTO documents (title, description, file_path) VALUES ($1, $2, $3)',
    [file.name, 'Your description here', `uploads/${file.name}`]
  );

  return NextResponse.json({ success: true, file: { name: file.name } }, { status: 201 });
}catch (error) {
  console.error("Error handling file upload:", error); // Log the error
  return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
}

}

