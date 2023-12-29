'use client'
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import UploadIcon from '@/icons/upload';
import { toast } from "@/components/ui/use-toast";
import { v5 as uuidv5, v4 as uuidv4, NIL as NIL_UUID } from 'uuid';
import { Note } from '@/types/notes'; 
import { createItem } from '@/lib/cosmosDB/crud';
import path from 'path';
import useAppStore from '@/stores/appStore';

export default function UploadButton() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false); // New state variable
  const addNote = useAppStore((state) => state.addNote);

  const { register, handleSubmit, reset } = useForm();

  const validateFileType = (file: File) => {
    const fileName = file.name;
    
    const validFileTypes = ['.txt', '.md'];

    if (!validFileTypes.includes(path.extname(fileName))) {
      toast({ 
        variant: "info",
        description: (
          <div>
            {"File type not supported. Please upload a .txt or .md file."}
          </div>
        )
       });
      return false;
    }
    return true;
  }
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // check file type
      if (!validateFileType(event.target.files[0])) {
        event.target.value = '';
        setFileUploaded(false);
        return;
      }

      setFileUploaded(true); // Update state when file is selected
    } else {
      setFileUploaded(false); // Reset state if no file is selected
    }
  };

  const getFileContent = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  const onSubmit = async (data: any) => {
    if (data.file.length === 0) {
      toast({ 
        variant: "info",
        description: (
          <div>
            {"No file selected."}
          </div>
        )
       });
      return;
    }
    
    const file = data.file[0];
    const fileName = data.file[0].name;

    // check file type 
    if (!validateFileType(file)) {
      return;
    }

    // parse file content
    try {
      const content = await getFileContent(file);
      const note: Note = {
        id: uuidv4(),
        title: fileName,
        content: content,
        created: new Date().toISOString(),
        tags: ['note'],
        userId: uuidv5('user', NIL_UUID),
      };

      // create item
      const response = await createItem(note);
      console.log(response);

      addNote(note);

    } catch (error) {
      console.log("error parsing file: " + error);
      toast({ 
        variant: "info",
        description: (
          <div>
            {`Error parsing file.`}
          </div>
        )
      });
      return;
    }

    toast({ 
      variant: "info",
      description: (
        <div>
          {`File uploaded: ${fileName}`}
        </div>
      )
     });
    setDialogOpen(false);
    setFileUploaded(false); // Reset state
    reset();
  };

  const buttonClasses = fileUploaded
  ? "font-light bg-orange-400 hover:bg-orange-500 active:scale-95 text-gray-100"
  : "font-light bg-gray-350 text-gray-400";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className={`text-sm font-light flex flex-col items-center rounded-lg px-2 py-1 lowercase cursor-pointer transition duration-150 ease-in-out hover:bg-gray-300`} onClick={() => setDialogOpen(true)}>
          <UploadIcon className="h-8 w-8" />
          upload
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className={cn("font-light")}>New File Entry</DialogTitle>
            <DialogDescription className={cn("font-light")}>
              Upload audio/documents to the knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5 my-6">
            <Input
              {...register("file", { required: true })}
              type="file"
              accept='.txt,.md'
              className="font-light bg-gray-100 shadow-none"
              onChange={onFileChange}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" className={cn(`font-light bg-gray-350 transition duration-150 ease-in-out ${buttonClasses}`)}>
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// TODO: make this accept multiple files