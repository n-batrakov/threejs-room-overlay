export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

export const downloadStream = async (stream: ReadableStream<Uint8Array>, filename: string) => {
  const handle = await (window as any).showSaveFilePicker({ suggestedName: filename });
  const writable = await handle.createWritable();
  await stream.pipeTo(writable);
};

export const streamToBlob = async (stream: ReadableStream<Uint8Array>, mime: string) => {
  const response = new Response(stream, { headers: { 'Content-Type': mime } });
  return await response.blob();
}
