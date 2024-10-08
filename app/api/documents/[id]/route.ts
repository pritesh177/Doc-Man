import {NextRequest,NextResponse} from 'next/server';
const UPLOADCARE_PUBLIC_KEY='abe080c3e4c6de65e1a6';
const UPLOADCARE_PRIVATE_KEY='746ee7873089a4efed2e';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Get the UUID from the dynamic route
          try{
            const response=await fetch(`https://api.uploadcare.com/files/${id}/`,{
            method:'DELETE',
            headers:{
                'Authorization':`Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_PRIVATE_KEY}`,
                'Content-type':'aapplication/json',
            },
    });
    if (!response.ok) {
        return NextResponse.json({ message: `Failed to delete file: ${response.statusText}` }, { status: 500 });
      }
  
      return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Failed to delete file', error }, { status: 500 });
    }
  }
  



  //--------------------------------------------------------------------------------------------------------------------------------------- -------------

//   import { NextRequest,NextResponse } from "next/server";
// import formidable from "formidable";
// import axios from 'axios';
// import { IncomingMessage } from "http";

// export const config = {
//     api: {
//       bodyParser: false, // Disable the default body parsing
//     },
//   };

// export async function POST(request:NextRequest){
//     const form = new formidable.IncomingForm(); // Create a new IncomingForm instance

//     return new Promise<NextResponse>((resolve, reject) => {
//       form.parse(request.body as unknown as IncomingMessage, async (err, fields, files) => {
//         if (err) {
//           return reject(NextResponse.json({ error: "Error parsing the file." }, { status: 500 }));
//         }
  
//         const file = files.file; // Access the uploaded file
//         if (!file) {
//           return reject(NextResponse.json({ error: "No file uploaded." }, { status: 400 }));
//         }
  
//         try {
//           // Prepare the file for upload to Uploadcare
//           const fileData = {
//             file: Array.isArray(files.file) ? files.file[0] : files.file, // This is the path of the uploaded file
//           };
  
//           // Upload to Uploadcare
//           const response = await axios.post(`https://upload.uploadcare.com/base/`, fileData, {
//             headers: {
//               'Accept': 'application/json',
//               'Authorization': `Uploadcare.Simple abe080c3e4c6de65e1a6:746ee7873089a4efed2e`, // Replace with your keys
//               'Content-Type': 'application/json',
//             },
//           });
  
//           // Resolve with the Uploadcare response
//           resolve(NextResponse.json(response.data));
//         } catch (uploadError) {
//           console.error('Uploadcare upload error:', uploadError);
//           return reject(NextResponse.json({ error: "Error uploading to Uploadcare." }, { status: 500 }));
//         }
//       });
//     });
//   }