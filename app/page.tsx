import Link from "next/link";


export default function Home() {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600">Document Management System</h1>
      <p className="mt-4 mb-3 text-lg text-gray-500 md:text-xl dark:text-gray-400 ">It is used to Navigate and Upload Files</p>

      <div className="absolute top-4 right-4 space-x-4">
        <Link href="/uploader">
              <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                Upload File
              </button>
        </Link>
        <Link href="/documents">
              <button className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Docs
              </button>
        </Link>
      </div>
   </div>
  );

}