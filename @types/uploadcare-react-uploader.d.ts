declare module '@uploadcare/react-uploader' {
    import * as React from 'react';
  
    export interface UploadcareFile {
      uuid: string;
      cdnUrl: string;
      status: string;
      file: File;
      fileInfo: {
        originalFilename: string;
        size: number;
      };
    }
  
    interface FileUploaderMinimalProps {
      onChange: (files: { allEntries: UploadcareFile[] }) => void;
      pubkey: string;
    }
  
    export const FileUploaderMinimal: React.FC<FileUploaderMinimalProps>;
  }
  

  