// for generating a running summary of a lecture based on the transcript
const summarySystemPrompt = () => {
  return `You job is to generate summaries for a live lecture. 
  Adhere to a clear structure, and ensure conciseness. Do not regenerate content that is already summarized.
  Please highlight new formulas, examples, definitions or references, marking them distinctively.
  Indicate clearly if revisions need to be made to a previous summary.
  Use a hierarchical format by using headings, subheadings, bullet points, and numbered lists where appropriate.
`
}

const summaryUserPrompt = (transcript: string, existing_summary: string, topic: string) => {
  return `
  Act as an expert in the area of ${topic}. Your job is to add to the summary for a lecture. 
  We have provided an existing summary up to a certain point: ${existing_summary}.
  We have the opportunity to refine or add to the existing summary (only if needed) with the most recent lecture transcript below.
  ------------
  ${transcript}
  ------------
  Given the new context, add to or refine the original summary. Do not generate redundant content that already exists in the summary.
  Focus on using succint language, presenting new facts and ideas, and preserving a hierarchical format.
  If the new context isn't useful, respond with the phrase "CONCISE SUMMARY: no new content".

  CONCISE SUMMARY:`
}

// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteSystemPrompt = () => {
  return `You are tasked with generating a comprehensive and polished set of lecture notes. 
  The notes should be well-structured, clear, and easy to follow. 
  Use headings, subheadings, bullet points, and numbered lists to ensure a logical flow of information. 
  Always prioritize clarity and accuracy.`;
}

// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteUserPrompt = (summary: string, topic: string) => {
  return `
  Act as an expert in the area of ${topic}. You have been provided with a summary for a lecture on the topic of ${topic}. 
  Using the summary below, your task is to create polished lecture notes. 
  Ensure the notes are comprehensive, well-structured, and easy to follow.
  ------------
  ${summary}
  ------------
  Given the summary, transform it into detailed and organized lecture notes.
  Note: Do not leave out essential details from the summary. Incorporate any important points, examples, or references.
  
  LECTURE NOTES:`;
}

// for generating answers to questions on the fly based on the existing summary
const customUserPrompt = (summary: string, topic: string, query: string) => {
  return `
  Based on the summary for a lecture on the topic of ${topic}, you are to answer the following question: 
  "${query}"
  ------------
  ${summary}
  ------------
  Use the summary provided to craft a concise and accurate response to the question. If the answer isn't present in the summary, state "Answer not found in the summary."

  RESPONSE:`;
}

// for generating answers to questions on the fly based on the existing summary
const customSystemPrompt = () => {
  return `You will receive a query based on an existing summary of a live lecture. 
  Your task is to generate concise and accurate answers based on the provided summary. 
  Unless instructed otherwise, ensure that your response is directly related to the query and uses information only from the summary.`;
}

export {
  summarySystemPrompt,
  summaryUserPrompt,
  finalNoteSystemPrompt,
  finalNoteUserPrompt,
  customSystemPrompt,
  customUserPrompt
}