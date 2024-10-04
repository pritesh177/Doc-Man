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
  