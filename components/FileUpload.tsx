"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";

const FileUpload: React.FC = () => {
  //const [file, setFile] = useState<File | null>(null);
  //const [msg, setMsg] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Validation schema
  const validate = yup.object().shape({
    file: yup
      .mixed()
      .required("File is Required")
      .test(
        "fileSize",
        "The size of file should be less than equal to 5MB",
        (value) => {
          if (value && value instanceof File) {
            const fileSize = value.size;
            return fileSize <= 5 * 1024 * 1024;
          }
          return false;
        }).test("fileType", "Only PDF files are allowed", (value) => {
          // Check if the value is a File and has a type property
          return value && value instanceof File && value.type === "application/pdf"; // Ensure it's a PDF
        }),
  });

  // const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   handleFile(e);
  //   handlePreview(e);
  // };

  const handleFilePreview = (file: File) => {
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    } else {
      setPreview(null);
    }
  };

  // const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files && e.target.files[0];
  //   if (selectedFile && selectedFile.type === "application/pdf") {
  //     setFile(selectedFile);
  //     // setMsg("");
  //   } else {
  //     setFile(null);
  //     // setMsg("Only Pdf files are allowed");
  //   }
  // };

  const handleUploadDocs = async (
    values: { file: File|null },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void } 
  ) => {
    setIsLoading(true);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("file", values.file!);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        // setMsg("File Upload Successfully");
        console.log("Uploaded File:", result.file);
        
        router.push("/documents");
      } else {
        console.error("File Upload Failed");
      }
    } catch (error) {
      console.error("while file uploading error occurred...!" + error);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/">
          <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Home
          </button>
        </Link>
        <Link href="/documents">
          <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
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
            <input
              type="file"
              accept="application/pdf"
              className=" px-4 h-10 cursor-pointer border border-gray-300 shadow-sm mr-4 transition-colors duration-200"
              onChange={(e) => {
                const selectedFile = e.currentTarget.files?.[0];
                if (selectedFile) {
                  setFieldValue("file", selectedFile); // Set as an array
                  handleFilePreview(selectedFile);
                }
              }}
            />
            <ErrorMessage
              name="file"
              component="div"
              className="text-red-500"
            />

            {isLoading ? (
              <div className="mt-4 flex flex-col items-center">
                <p className="text-gray-500 mt-2">Uploading please wait...</p>
              </div>
            ) : (
              preview && (
                <div className="mt-4">
                  <embed
                    src={preview}
                    type="application/pdf"
                    width="500px"
                    height="600px"
                  />
                </div>
              )
            )}

            <button
              type="submit"
              className={`mt-4 px-4 py-3 rounded ${
                !isSubmitting && preview
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : " bg-gray-400 text-gray-200 cursor-not-allowed "
              }`}
              disabled={isSubmitting || !preview}
            >
              Upload
            </button>
          </Form>
        )}
      </Formik>
      {/* {msg && <p className="mt-4 text-gray-500">{msg}</p>} */}
    </div>
  );
};

export default FileUpload;
