"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileInfo,
  listOfFiles,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import { usePathname } from "next/navigation";

interface Document {
  id: string;
  name: string;
  url: string;
  date_uploaded: string; 
  time_uploaded: string; 
  datetime_uploaded:string;
}

// Credentials to fetch docs
const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: 'abe080c3e4c6de65e1a6',
  secretKey: '746ee7873089a4efed2e',
});




const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loader,setLoader]=useState<boolean>(false);
  const pathname=usePathname();

  useEffect(() => {
      setLoader(true);
      const fetchDocs = async () => {
      try{
      const res =  await listOfFiles(
        {limit:10},
        { authSchema: uploadcareSimpleAuthSchema }
      )
      if (!res || res.results.length === 0) {
        console.error("Failed to fetch documents or no documents found");
        return;
      }
        const filesData: Document[] = res.results.map((file: FileInfo) => {
        const datetime = new Date(file.datetimeUploaded);
        
        // Extract date and time
        const date = datetime.toLocaleDateString(); 
        const time = datetime.toLocaleTimeString(); 
        
        return {
          id: file.uuid,
          name: file.originalFilename,
          url: `https://ucarecdn.com/${file.uuid}/`, 
          datetime_uploaded:file.datetimeUploaded,
          date_uploaded: date,
          time_uploaded: time,
        };
      });
      

      const sortfiles: Document[] = filesData
      .sort((a: Document, b: Document) => new Date(b.datetime_uploaded).getTime() - new Date(a.datetime_uploaded).getTime()); // Sort by datetime_uploaded (newest first)

      setDocuments(sortfiles); // Set the list of files in state
      } catch (error) {
        console.error("Error fetching documents:", error);
      }finally{
        setLoader(false);
      }
    };

      
    fetchDocs();
  }, []);

   
  const handlePreview = (url: string) => {
    window.open(`/preview?url=${encodeURIComponent(url)}`);
  };

  const handleDelete=async(id:string)=>{
    try{
      const response=await fetch(`/api/documents/${id}`,{
        method:'DELETE',
      });
      if(!response.ok){
        console.log("Failed to Fetch Docs:",response.statusText)
        return;;
      }

      setDocuments((prevDocs)=>prevDocs.filter((doc)=>doc.id!==id));
      console.log("File Deleted Successfully");
    }
    catch (error) {
      console.error("Error deleting file:", error);
    }
  }
  
  return (
    <React.Fragment>
      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/">
          <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700 transition duration-300">
            Home
          </button>
        </Link>
        <Link href="/uploader">
          <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700 transition duration-300">
            Upload File
          </button>
        </Link>
        <Link href="">
        <button
  className={`px-4 py-3 rounded text-white ${pathname === '/documents' ? 'bg-blue-600 cursor-not-allowed' : 'bg-gray-600 hover:bg-blue-700'}`}
  disabled={pathname === '/documents'}
>
  View Docs
</button>
        </Link>
      </div>
      <h2 className="text-2xl text-gray-500 font-semibold mb-4 mt-10 ml-4">List of Docs</h2>
      {loader ? ( // Conditional rendering for loading
        <div className="flex justify-center items-center">
          <div className="loader border-8 border-gray-300 border-t-8 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div> {/* Loading icon */}
        </div>
      ):(
      <ul className="mt-11 space-y-3">
       
{documents.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between p-3 bg-black rounded-lg shadow-lg hover:shadow-2xl transition duration-200">
            <span className="flex-1 text-white font-medium flex items-center">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {doc.name} 
              </a>
              <p className="ml-4">{doc.date_uploaded}</p>
              <p className="ml-4">{doc.time_uploaded}</p>
            </span> 
        
            <div className="flex items-center">
            <button
              onClick={() => handlePreview(doc.url)}
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
            </div>       
          </li>
           ))}
      </ul>
      )}
    </React.Fragment>
  );
};



export default DocumentList;







//-----------------------------------------------------------------------------------------------------------------------------------

// Extra Code

// const cleanedFilename = filename.replace(/^\d+-/, "");
    // const previewUrl = `/api/uploads/${cleanedFilename}`;
    // console.log("Preview URL:", previewUrl); 
    // setPreviewUrl(previewUrl);
    // setIsPreviewOpen(true);
    //setPreviewUrl(url);
    //setIsPreviewOpen(true);
  // const closePreview = () => {
  //   setPreviewUrl(null);
  //   setIsPreviewOpen(false);
  // };


// Map the response data into the desired format for rendering
      //  const filesData:Document[] = res.results.map((file: FileInfo) => ({
      //   id: file.uuid,
      //   name: file.originalFilename,
      //   url: `https://ucarecdn.com/${file.uuid}/`, // Use the CDN URL for the file
      //   datetime_uploaded:new Date(file.datetimeUploaded),
      // }));
     
      // if (!res.ok) {
      //   console.error("Failed to fetch documents:", res.statusText);
      //   return;
      // }
    //   const data = await res.json();
    //   setDocuments(data);
    // };
  // useEffect(() => {
  //   const fetchDocs = async () => {
  //     try {
  //       const response = await fetch('https://api.uploadcare.com/files/', {
  //         method: 'GET',
  //         headers: {
  //           Authorization: 'Uploadcare.Simple YOUR_PUBLIC_KEY:YOUR_SECRET_KEY', // Replace with your keys
  //         },
  //       });

  //       if (!response.ok) {
  //         console.error('Failed to fetch documents:', response.statusText);
  //         return;
  //       }

  //       const data = await response.json();
        
  //       // Map the results to your document structure
  //       const docs: Document[] = data.results.map((file: any) => ({
  //         id: file.uuid,
  //         name: file.original_filename,
  //         url: `https://ucarecdn.com/${file.uuid}/`,
  //         datetime_uploaded: file.datetime_uploaded, // Timestamp of when the file was uploaded
  //       }));

  //       // Sort by `datetime_uploaded` in descending order (newest first)
  //       const sortedDocs = docs.sort((a, b) => 
  //         new Date(b.datetime_uploaded).getTime() - new Date(a.datetime_uploaded).getTime()
  //       );

  //       setDocuments(sortedDocs);
  //     } catch (error) {
  //       console.error('Error fetching documents:', error);
  //     }
  //   };

  //   fetchDocs();
  // }, []);

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





// interface UploadcareFile {
//   uuid: string;
//   original_filename: string;
//   cdn_url: string;
// }

// interface UploadcareFileResponse {
//   results: UploadcareFile[];
//   // next?: string; // For pagination, in case there's a next page of files
// }


//const res = await fetch("/api/documents");
      // Return the lsit of files from the uplaodcare console that are uploaded
      


   //const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  //const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  //const router=useRouter();

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



{/* {isPreviewOpen && (
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
      )} */}
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