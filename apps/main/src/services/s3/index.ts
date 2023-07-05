import { lookup } from 'mime-types';

export const S3Api = {
  upload: async (
    file: File,
    s3PresignedUrl: string,
    headers: Record<string, string>
  ) =>
    fetch(s3PresignedUrl, {
      body: file,
      method: 'PUT',
      headers: Object.assign(
        { 'Content-Type': lookup(file.name) || 'application/octet-stream' },
        headers
      ),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unknown');
        }
      })
      .catch((err) => {
        throw err;
      }),
  download: async (s3PresignedUrl: string, downloadedFileName: string) =>
    fetch(s3PresignedUrl, { method: 'GET' })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(
          new Blob([blob], {
            type: `${blob.type};charset=utf-8`,
          })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', downloadedFileName);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        throw err;
      }),
};
