'use client'

import useAppStore from "@/stores/appStore";
import SpeakerIcon from "@/icons/speaker";

export default function SpeechBar(){
  const isListening = useAppStore((state) => state.isListening);
  const transcript = useAppStore((state) => state.displayTranscript);
  // const transcript = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, nec aliquam nisl nisl nec nisl."

  return (
    <>
      {isListening && (
        <div 
          className="absolute top-0 right-6 text-sm text-gray-400 w-full flex flex-r items-center justify-end gap-1 z-20"
          style={{ fontFamily: 'var(--font-mono)'}}
        >
          <SpeakerIcon className="w-6 h-6" />
          <span className="w-[53ch] overflow-hidden font-light">
            {transcript.length > 50 && "..."}{transcript.slice(-50)}
          </span>
        </div>
      )}
    </>
  )
}