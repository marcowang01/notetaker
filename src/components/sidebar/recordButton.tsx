'use client'
import React, { use, useEffect, useState } from 'react';
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {EmptyRecordIcon, FullRecordIcon} from '@/icons/record';
import { toast } from "@/components/ui/use-toast";
import useAppStore from '@/stores/appStore';
import useAzureRecognizer from '@/lib/speech/recognizer';

export default function RecordButton() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const isListening = useAppStore((state) => state.isListening);
  const [localTopic, setLocalTopic] = useState("");

  const topic = useAppStore((state) => state.topic);
  const setTopic = useAppStore((state) => state.setTopic);
  const setTranscript = useAppStore((state) => state.setTranscript);

  const {initRecognizer, startRecognizer, stopRecognizer} = useAzureRecognizer();

  useEffect(() => {
    initRecognizer();
  },[])

  const onSubmit = (action: 'topic' | 'recording') => {

    setTopic(localTopic);

    const topicMsg = localTopic ? `Current topic: ${localTopic}` : "No topic";
    let message = isListening ? `Recording stopped, saving notes...` : `${topicMsg}, recording starting...`;
  
    if (action === 'recording') {
      try{
        if (isListening) {
          stopRecognizer();
          setTranscript("");
        } else {
          startRecognizer();
        }
      } catch (error) {
        console.log(error);
        message = "Operation failed, please try again." + error;
      }
    }

    toast({ 
      variant: "info",
      description: (
        <div>
          {action === 'topic' ? topicMsg : message}
        </div>
      )
     });

    setDialogOpen(false); // Close the dialog
  };

  const onOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (open) {
      setLocalTopic(topic);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className={`text-sm font-light flex flex-col items-center rounded-lg px-2 py-1 lowercase cursor-pointer transition duration-150 ease-in-out hover:bg-gray-300`} onClick={() => setDialogOpen(true)}>
          {isListening ? (
            <>
              <FullRecordIcon className="h-8 w-8 text-orange-400" />
              stop
            </>
          ) : (
            <>
              <EmptyRecordIcon className="h-8 w-8" />
              record
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-md bg-gray-200" 
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
          <DialogHeader>
            <DialogTitle className={cn("font-light")}>{isListening ? "Update " : "New "} Audio Entry</DialogTitle>
            <DialogDescription className={cn("font-light")}>
              {isListening ? "Edit topic or stop recording" : "Generate notes from live audio"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5 my-6">
            <Input
              placeholder="Enter topic (optional)"
              onChange={(e) => setLocalTopic(e.target.value)}
              value={localTopic}
              className={cn("bg-gray-100 font-light shadow-none")}
            />
          </div>
          <DialogFooter className="sm:justify-start">
            {isListening && 
              <Button 
                type="submit" 
                onClick={() => onSubmit('topic')}
                className={cn("font-light bg-gray-400 text-gray-800 transition duration-150 ease-in-out hover:bg-gray-350 active:scale-95")}
              >
                Update Topic
              </Button>
            }
            <Button 
              type="submit" 
              onClick={() => onSubmit('recording')}
              className={cn("font-light bg-orange-400 text-gray-100 transition duration-150 ease-in-out hover:bg-orange-500 active:scale-95")}
            >
              {isListening ? "Stop Recording" : "Start Recording"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
