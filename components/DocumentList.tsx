// "use client"

// import React,{useState,useEffect} from "react";
// import Link from "next/link";

// interface Document{
//     id:string,
//     name:string,
//     url:string
// }

// const DocumentList:React.FC=()=>{
//     const[documents,setDocuments]=useState<Document[]>([]);

//     useEffect(()=>{
//         const fetchDocs=async()=>{
//             const res=await fetch("/api/documents");
//             if (!res.ok) {
//                 console.error("Failed to fetch documents:", res.statusText);
//                 return;
//               }
//             const data=await res.json();
//             setDocuments(data);
//         };
//         fetchDocs();
//     },[]);

//     const handlePreview = (url: string) => {
//         window.open(url, "_blank");
//       };
    
//     return(
//         <React.Fragment>
//         <h2 className="text-2xl text-gray-500">List of Docs</h2>
//         <div className="absolute top-4 right-4 space-x-4">
//         <Link href="/">
//               <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
//                 Home
//               </button>
//         </Link>
//         <Link href="/uploader">
//               <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
//                 Upload File
//               </button>
//         </Link>
//         </div>
//         <ul>
//             {documents.map((docs)=>
//             (
//                 <li key={docs.id} className="flex item-center justify-between mt-2">
//                     <span className="flex-1">
//                         <a href={docs.url} target="_blank" rel="noopener noreferrer">
//                         {docs.name}
//                         </a>
//                     </span>
//                     <button 
//                     onClick={()=>handlePreview(docs.url)}
//                     className="mx-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-600">
//                         Preview
//                     </button>
//                 </li>
//             ))}
//         </ul>
//         </React.Fragment>
//     );
// };

// export default DocumentList;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileInfo,
  listOfFiles,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';

interface Document {
  id: string;
  name: string;
  url: string;
}

// interface UploadcareFile {
//   uuid: string;
//   original_filename: string;
//   cdn_url: string;
// }

// interface UploadcareFileResponse {
//   results: UploadcareFile[];
//   // next?: string; // For pagination, in case there's a next page of files
// }

// Credentials to fetch docs
const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: 'abe080c3e4c6de65e1a6',
  secretKey: '746ee7873089a4efed2e',
});

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      //const res = await fetch("/api/documents");
      // Return the lsit of files from the uplaodcare console that are uploaded
      try{
      const res =  await listOfFiles(
        {},
        { authSchema: uploadcareSimpleAuthSchema }
      )
      if (!res || res.results.length === 0) {
        console.error("Failed to fetch documents or no documents found");
        return;
      }

       // Map the response data into the desired format for rendering
       const filesData:Document[] = res.results.map((file: FileInfo) => ({
        id: file.uuid,
        name: file.originalFilename,
        url: `https://ucarecdn.com/${file.uuid}/`,  // Use the CDN URL for the file
      }));

      setDocuments(filesData); // Set the list of files in state
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
      // if (!res.ok) {
      //   console.error("Failed to fetch documents:", res.statusText);
      //   return;
      // }
    //   const data = await res.json();
    //   setDocuments(data);
    // };
    fetchDocs();
  }, []);

  // const handleDelete =async (id : string)=>{
  //   const res=await fetch(`/api/uploads/${id}`,{method:'DELETE'});
  //   if(res.ok){
  //       setDocuments(documents.filter(doc=>doc.id!==id));
  //       console.log("File Deleted Successfully");
  //   }
  //   else{
  //       console.log("Error Deleting File");
  //   }
  // }

  const handlePreview = (url: string) => {
    // const cleanedFilename = filename.replace(/^\d+-/, "");
    // const previewUrl = `/api/uploads/${cleanedFilename}`;
    // console.log("Preview URL:", previewUrl); 
    // setPreviewUrl(previewUrl);
    // setIsPreviewOpen(true);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };
  

  const closePreview = () => {
    setPreviewUrl(null);
    setIsPreviewOpen(false);
  };

  

  return (
    <React.Fragment>
      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/">
          <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
            Home
          </button>
        </Link>
        <Link href="/uploader">
          <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
            Upload File
          </button>
        </Link>
      </div>
      <h2 className="text-2xl text-gray-500 font-semibold mb-4 mt-10 ml-4">List of Docs</h2>
      <ul className="mt-11 space-y-3">
        {/* {documents.map((doc) => {
            const docName = doc.name.replace(/^\d+-/, "");
            return(
          <li key={doc.id} className="flex items-center justify-between p-3 bg-black rounded-lg shadow-lg glow hover:shadow-2x1 transition duration-200">
            <span className="flex-1 text-white font-medium">
              <a href={`/api/uploads/${doc.name}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {docName}
              </a>
            </span>
            <button
              onClick={() => handlePreview(doc.name)}
              className="ml-4 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Preview
            </button>
            <button
              onClick={() => handleDelete(doc.id)}
              className="ml-4 px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </li>
            
        )
})} */}
{documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between p-3 bg-black rounded-lg shadow-lg hover:shadow-2xl transition duration-200">
            <span className="flex-1 text-white font-medium">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {doc.name}
              </a>
            </span>
            <button
              onClick={() => handlePreview(doc.url)}
              className="ml-4 px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              Preview
            </button>
          </li>
           ))}
      </ul>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={closePreview}
            >
              Close
            </button>
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-96"
                title="Document Preview"
              />
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DocumentList;
