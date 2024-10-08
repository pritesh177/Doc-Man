"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const PreviewPage=()=>{
    const search=useSearchParams();
    const url=search.get('url');

    return(
        <div>
            {url?(
            <iframe src={url}
            width="100%"
            height="1000px"
            title="Document Preview"
            style={{border:'1px solid #ccc'}} />
            ):(
                <p>Loading please wait.....</p>
            )}
        </div>
    )

}

const Page = () => {
    return (
      <Suspense fallback={<div>Loading preview...</div>}>
        <PreviewPage />
      </Suspense>
    );
  };

export default Page;