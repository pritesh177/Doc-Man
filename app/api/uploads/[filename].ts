// pages/api/uploads/[filename].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { filename },
  } = req;

  const uploadsDir = path.join(process.cwd(), 'uploads');
  const filePath = path.join(uploadsDir, filename as string);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf'); // Set appropriate content type based on the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res); // Stream the file to the response
  } else {
    res.status(404).json({ message: 'File not found' });
  }
}
