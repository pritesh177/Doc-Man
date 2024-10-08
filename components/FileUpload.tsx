
"use client";

import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';



const FileUpload: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const pathname=usePathname();
  const router=useRouter();

  // Validation schema
  const validate = yup.object().shape({
    file: yup
      .mixed()
      .required("File is Required")
      .test(
        'fileSize',
        'The file size should be less than 5MB',
        (value) => value && value instanceof File && value.size <= 5 * 1024 * 1024 // 5MB size limit
      )
      .test(
        'fileType',
        'Only PDF files are allowed',
        (value) => value && value instanceof File && value.type === 'application/pdf' // Only allow PDFs
      ),
  });

  const handleUploadDocs = async (values: { file: File | null }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (!values.file) return;
    const formData = new FormData();
    formData.append("UPLOADCARE_PUB_KEY","abe080c3e4c6de65e1a6");
    formData.append("files", values.file);

    setIsUploading(true);
    try {
      const response = await fetch('https://upload.uploadcare.com/base/', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }

      // Handle successful upload
      const data = await response.json();
      console.log('Uploadcare Response:', data);
      router.push("/documents");
    } catch (error) {
      setError("Error uploading file.");
      console.error("Upload error:", error);
    } finally {
      setSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/">
          <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700">
            Home
          </button>
        </Link>
        <Link href="/uploader">
          <button
            className={`px-4 py-3 rounded text-white ${pathname === '/uploader' ? 'bg-blue-600 cursor-not-allowed' : 'bg-gray-600 hover:bg-blue-700'}`}
            disabled={pathname === '/uploader'}
          >
            Upload File
          </button>
        </Link>
        <Link href="/documents">
          <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700">
            View Docs
          </button>
        </Link>
      </div>

      <Formik
        initialValues={{ file: null }}
        validationSchema={validate}
        onSubmit={handleUploadDocs}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div className='flex items-center space-x-4'> 
            <input
                type="file"
                accept="multipart/form-data"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  setFieldValue("file", file);
                  setError(null); // Clear previous error
                  setFileURL(file ? URL.createObjectURL(file) : null);
                }}
                className='block w-full px-4 py-2 text-sm text-gray-700 bg-gray-200 border border-gray-300 rounded-md cursor-pointer focus:outline-none'
              />
              <ErrorMessage name="file" component="div" className="text-red-500" />
              {error && <div className="text-red-500">{error}</div>}

              {fileURL && (
                <button
                  type="button"
                  className="p-2 rounded-full bg-gray-300 hover:bg-gray-600 focus:outline-none"
                  onClick={() => window.open(fileURL, "_blank")}
                  title="Preview File"
                >
               Preview
                </button>
              )}

              <button type="submit" disabled={isSubmitting}
              className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-gray-400'>
                Upload
              </button>{isUploading && (
        <div className="flex justify-center items-center mt-4">
          <div className="loader border-8 border-gray-300 border-t-8 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
              </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FileUpload;





//------------------------------------------------------------------------------------------------------------------------------------------------------------

// "use client";

// import React, {  useState,useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Formik, Form, ErrorMessage } from "formik";
// import * as yup from "yup";
// import { FileUploaderMinimal, UploadcareFile } from "@uploadcare/react-uploader";
// import '@uploadcare/react-uploader/core.css';
// import axios from "axios";



// const FileUpload: React.FC = () => {
//   const [preview, setPreview] = useState<string | null>(null);
//   //const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [Error, setError] = useState<string | null>(null);
//    const router = useRouter();
//    const pathname=usePathname();


//   // Validation schema
  // const validate = yup.object().shape({
  //   file: yup
  //     .mixed()
  //     .required("File is Required")
  //     .test(
  //       'fileSize',
  //       'The file size should be less than 5MB',
  //       (value) => value && value instanceof File && value.size <= 5 * 1024 * 1024 // 5MB size limit
  //     )
  //     .test(
  //       'fileType',
  //       'Only PDF files are allowed',
  //       (value) => value && value instanceof File && value.type === 'application/pdf' // Only allow PDFs
  //     ),
  // });

  
//   // Upload document function
//   // const handleUploadDocs = async (
//   //   values: { file: File|null },
//   //   { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void } 
//   // ) => {
//   //   if(!values.file)return;
//   //   setIsLoading(true);
//   //   setSubmitting(true);

//   //   router.push("/documents");

        
//   //      setSubmitting(false);
//   //     setIsLoading(false);
//   // };

// // Preview


//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <div className="absolute top-4 right-4 space-x-4">
//         <Link href="/">
//           <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700">
//             Home
//           </button>
//         </Link>
//         <Link href="">
//           <button
//               className={`px-4 py-3 rounded text-white ${pathname === '/uploader' ? 'bg-blue-600 cursor-not-allowed' : 'bg-gray-600 hover:bg-blue-700'}`}
//               disabled={pathname === '/uploader'}
//               >
//                 Upload File
//           </button>
//         </Link>
//         <Link href="/documents">
//           <button className="px-4 py-3 bg-gray-600 text-white rounded hover:bg-blue-700">
//             View Docs
//           </button>
//         </Link>
//       </div>
//       <Formik
//         initialValues={{ file: null }}
//         validationSchema={validate}
//         onSubmit={()=>{router.push("/documents")}}
//       >
//         {({ setFieldValue, isSubmitting }) => (
//           <Form>
//             <FileUploaderMinimal
//               onChange={(files:{ allEntries: UploadcareFile[] }) => {
//                 const selectedFile = files.allEntries.find((f) => f.status === "success"); // Change as necessary
//                 setError(null);
//                 if (!selectedFile) {
//                   setError("No file selected or upload failed. Please try again.");
//                   setFieldValue("file", null); // Clear the field value
//                   return; // No valid file selected
//                 }
//                   //setIsLoading(true);
//                   setFieldValue("file", selectedFile.file); // Use the correct file reference
//                   setPreview(selectedFile.cdnUrl);    // Set preview URL
//                   //setIsLoading(false); 
                
//               }}
//               pubkey="abe080c3e4c6de65e1a6" 
//             />
     
//             <ErrorMessage name="file" component="div" className="text-red-500" />
//             {Error && <div className="text-red-500 mb-2">{Error}</div>} 
            
//             {/* {isLoading ? (
//               <div className="mt-4 flex flex-col items-center">
//                 <p className="text-gray-500 mt-2">Uploading, please wait...</p>
//               </div>
//             ) : (<>
//                 {
//                   preview &&
//                   <button onClick={()=>window.open(`/preview?url=${encodeURIComponent(preview)}`)}
//                           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
//                             Preview
//                             </button>
//                 }
//             </>
//             )
//           } */}

//             <button
//               type="submit"
//               className={`mt-4 px-4 py-3 rounded ${
//                 !isSubmitting && preview
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : " bg-gray-400 text-gray-200 cursor-not-allowed "
//               }`}
//               disabled={isSubmitting || !preview}
//             >
//               Upload
//             </button>
//           </Form>
//         )}
//       </Formik>
//     </div>  
//   );
// };

// export default FileUpload;




// // Extra Codes:


// // handlefileupload
// // this the form data that takes input in form of forms
//     // const formData = new FormData();
//     // formData.append("file", values.file!);
//       // const res = await fetch("/api/uploadcare", {
//       //   method: "POST",
//       //   // API for uploading files on uplaodcare
//       //   body: JSON.stringify({
//       //     file: values.file
//       //   }),
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//       // });

//       // console.log("Response from server:", res);

//       // if (res.ok) {
//       //   const result = await res.json();
//       //   // setMsg("File Upload Successfully");
//       //   console.log("Uploaded File:", result.file);
//       //   setPreview(result.file.cdnUrl);
//     //   } else {
//     //     console.error("File Upload Failed");
//     //   }
//     // } catch (error) {
//     //   console.error("while file uploading error occurred...!" + error);
//     // } finally {




// // This is logic for formik and Yup to validate input file and ensure it is pdf
//   //       (value) => {
//   //         if (value && value instanceof File) {
//   //           const fileSize = value.size;
//   //           return fileSize <= 5 * 1024 * 1024;
//   //         }
//   //         return false;
//   //       }).test("fileType", "Only PDF files are allowed", (value) => {
//   //         // Check if the value is a File and has a type property
//   //         return value && value instanceof File && value.type === "application/pdf"; // Ensure it's a PDF
//   //       }),
//   // });
//   // const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   handleFile(e);
//   //   handlePreview(e);
//   // };
//   // const handleFilePreview = (file: File) => {
//   //   if (file && file.type === "application/pdf") {
//   //     const fileURL = URL.createObjectURL(file);
//   //     setPreview(fileURL);
//   //   } else {
//   //     setPreview(null);
//   //   }
//   // };
//   // const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const selectedFile = e.target.files && e.target.files[0];
//   //   if (selectedFile && selectedFile.type === "application/pdf") {
//   //     setFile(selectedFile);
//   //     // setMsg("");
//   //   } else {
//   //     setFile(null);
//   //     // setMsg("Only Pdf files are allowed");
//   //   }
//   // };



//   // inside return 
// // <input
// //               type="file"
// //               accept="application/pdf"
// //               className=" px-4 h-10 cursor-pointer border border-gray-300 shadow-sm mr-4 transition-colors duration-200"
// //               onChange={(e) => {
// //                 const selectedFile = e.currentTarget.files?.[0];
// //                 if (selectedFile) {
// //                   setFieldValue("file", selectedFile); // Set as an array
// //                   handleFilePreview(selectedFile);
// //                 }
// //               }}
// //             />
// //             <ErrorMessage
// //               name="file"
// //               component="div"
// //               className="text-red-500"
// //             />

// //             {isLoading ? (
// //               <div className="mt-4 flex flex-col items-center">
// //                 <p className="text-gray-500 mt-2">Uploading please wait...</p>
// //               </div>
// //             ) : (
// //               preview && (
// //                 <div className="mt-4">
// //                   <embed
// //                     src={preview}
// //                     type="application/pdf"
// //                     width="500px"
// //                     height="600px"
// //                   />
// //                 </div>
// //               )
// //             )}

// //             <button
// //               type="submit"
// //               className={`mt-4 px-4 py-3 rounded ${
// //                 !isSubmitting && preview
// //                   ? "bg-blue-600 text-white hover:bg-blue-700"
// //                   : " bg-gray-400 text-gray-200 cursor-not-allowed "
// //               }`}
// //               disabled={isSubmitting || !preview}
// //             >
// //               Upload
// //             </button>



// components/FileUpload.tsx
