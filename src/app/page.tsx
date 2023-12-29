import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Scribe
    </main>
  )
}

// todo
// UI ideas
// - down arrow to scroll all the way down
// - local storage for page position, filter, etc.
// - folders, auto category
// - adjust context length based on model
// - error recovery


// vector store
// - combine: https://learn.microsoft.com/en-us/samples/azure-samples/azure-search-dotnet-scale/multiple-data-sources/
// - blob for files
// - nosql for markdown notes
// - azure full text search for notes page: https://learn.microsoft.com/en-us/azure/search/search-lucene-query-architecture
// - ai search indeces

// GPT cache?

// good logging and telemetry, open telemetry

// use GPT3.5 to determine how much GPT4. to use