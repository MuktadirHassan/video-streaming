"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

/**
 * @description uploads file to a server using chunked upload
 * Feats: shows progress bar, retry, cancel, pause, resume
 */
async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void,
  onCancel?: () => void
) {
  const url = "https://httpbin.org/post";
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  console.log(data);
}

export default function Videos() {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0); // [0, 100]
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    console.log("handleDrop");
    setDragging(false);
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files) return;
    await uploadFile(e.dataTransfer.files[0]);
    toast({
      title: "File uploaded",
    });
  };

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleOnChange");
    e.preventDefault();
    e.stopPropagation();
    if (!e.target.files) return;
    await uploadFile(e.target.files[0]);
    toast({
      title: "File uploaded",
    });
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={cn(
          "border border-dotted flex flex-col items-center justify-center h-64 rounded cursor-pointer space-y-2",
          dragging ? "bg-secondary" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleOnDragOver}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        <Label htmlFor="upload-file">Upload a file</Label>
        <Input
          ref={inputRef}
          id="upload-file"
          type="file"
          className="sr-only"
          hidden
          onChange={handleOnChange}
        />
        <p className="text-gray-500 text-sm"> or drag & drop a file</p>
      </div>
    </>
  );
}
