"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputFile() {
  const handleUpload = (e: any) => {
    if (!e.target.files) return console.log("No files");
    const file = e.target.files[0] as File;
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const chunk_size = 1000;
      const chunk_count = buffer.byteLength / chunk_size;

      for (let i = 0; i < chunk_count + 1; i++) {
        const chunk = buffer.slice(i * chunk_size, (i + 1) * chunk_size);
        console.log(chunk);
        await fetch("http://localhost:5000/api/v1/video/upload", {
          method: "POST",
          body: chunk,
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-length": `${chunk.byteLength}`,
            "file-name": file.name,
            "Content-Range": `bytes ${i * chunk_size}-${
              (i + 1) * chunk_size - 1
            }/${buffer.byteLength}`,
          },
        });
      }
    };
  };
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" onChange={handleUpload} />
    </div>
  );
}
