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
  Focus on using succint language but retaining a detailed summary, presenting new facts and ideas.
  New example problems, facts, formulas, definitions, and references should be marked distinctively and completely.
  Your goal is to reduce the length of the transcript but should be complete retain all the important information and details.
  The summary should allow a reader to understand the lecture completely without having to read the entire transcript.
  You should use a bullet points and sub-bullet points to organize the summary. Complete sentences are not required.
  If the new context isn't useful, respond with the phrase "CONCISE SUMMARY: no new content".

  CONCISE SUMMARY:`
}

// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteSystemPrompt = () => {
  return `
    Your objective is to produce polished lecture notes from a provided summary. 
    The notes should be:
    - Concise yet comprehensive
    - Hierarchically structured with headings, subheadings, and various levels of bullet points
    - Clear and easy to understand
    - No longer than a single page
    Ensure that important elements like formulas, examples, definitions, and references are distinctively highlighted.
  `;
}


// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteUserPrompt = (summary: string, topic: string) => {
  return `
    As a domain expert in ${topic}, you have been given a summarized version of a lecture about ${topic}. 
    Your task is to transform the summary into polished lecture notes. Here are some guidelines:
    - The notes should capture the essence of the topic comprehensively.
    - Utilize a hierarchical structure with headings, subheadings, bullet points, and sub-bullets for clarity.
    - Distinctly mark and highlight new formulas, examples, definitions, and references.
    - Do not omit any critical details from the summary.
    ------------
    ${summary}
    ------------
    Based on the above summary, construct detailed and organized LECTURE NOTES:
  `;
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