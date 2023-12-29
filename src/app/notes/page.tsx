"use client"

// import { promises as fs } from "fs"
import path from "path"
import Image from "next/image"
import { set, z } from "zod"
import { useEffect, useState } from "react"
import { columns } from "@/components/notes/columns"
import { DataTable } from "@/components/notes/data-table"
// import { Entry, entrySchema } from "../../data/schema" 
import { getItemsByUser } from "@/lib/cosmosDB/crud"
import { v5 as uuidv5, v4 as uuidv4, NIL as NIL_UUID } from 'uuid';
import useAppStore from "@/stores/appStore"
import { Note, Entry } from "@/types/notes"

function parseNotesToEntries(notes: Note[]): Entry[] {
  const entries: Entry[] = notes.map((note) => {
    return {
      label: note.tags[0] || 'note',
      date: note.created,
      title: note.title,
      userId: note.userId,
      id: note.id,
    }
  });

  return entries;
}


export default function NotesPage() {
  const notes = useAppStore((state) => state.notes);
  const setNotes = useAppStore((state) => state.setNotes);
  const [entries, setEntries] = useState<Entry[]>([]);

  const userId = uuidv5('user', NIL_UUID);
  
  useEffect(() => {
    async function fetchNotes() {
      try{
        const items = await getItemsByUser(userId);
        setNotes(items);
      } catch (error) {
        console.log("error fetching items by user" + error);
        return [];
      }
    }

    fetchNotes();
  }, []);

  useEffect(() => {
    const parsedNotes = parseNotesToEntries(notes);
    setEntries(parsedNotes);
  }, [notes]);
  


  return (
    <>
      <DataTable data={entries} columns={columns} />
    </>
  )
}

// todo: add a refresh button to the page
// todo: add a loading icon to the table