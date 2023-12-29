import { z } from "zod"
export const entrySchema = z.object({
  label: z.string(), // notes, audio, document
  title: z.string(), // topic/file name
  date: z.string(), // date of creation
  userId: z.string(),
  id: z.string(),
})

export type Entry = z.infer<typeof entrySchema>

export const labels = [
  {
    value: "note",
    label: "Note",
    color: "border-orange-400"
  },
  {
    value: "audio",
    label: "Audio",
    color: "border-gray-400"
  },
  {
    value: "document",
    label: "Document",
    color: "border-gray-600"
  },
]

export type Note = {
  id: string;
  title: string;
  content: string;
  created: string;
  tags: string[];
  userId: string;
}
