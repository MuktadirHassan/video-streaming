"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";

export default function Videos() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files);
  };

  const handleOnChange = (e) => {
    console.log(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="border border-dotted flex flex-col items-center justify-center h-64 rounded cursor-pointer space-y-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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
        />
        <p className="text-gray-500 text-sm"> or drag & drop a file</p>
      </div>
    </>
  );
}
