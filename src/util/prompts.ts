// for generating a running summary of a lecture based on the transcript
const summarySystemPrompt = () => {
  return `Your task is to generate structured summaries for a live lecture. 
  Ensure the summaries capture essential points while being concise. Avoid repeating content already summarized.
  Clearly emphasize new formulas, examples, definitions, and references.
  If there are necessary corrections to a prior summary, highlight them.
  Utilize a structured approach: headings, subheadings, bullet points, and numbered lists are encouraged.
  `;
}

const summaryUserPrompt = (transcript: string, existing_summary: string, topic: string) => {
  return `
  Assume you're an expert in the area of ${topic}. 
  You are tasked with refining and appending to an existing summary based on new lecture content. 

  Given the new context, add to or refine the original summary. Do not generate redundant content that already exists in the summary.
  Focus on using succint language but retaining a detailed summary, presenting new facts and ideas.
  New example problems, facts, formulas, definitions, and references should be marked distinctively and completely.
  The summary should allow a reader to understand the lecture so far completely without having to read the entire transcript.
  You should use bullet points and sub-bullet points to organize the summary. Complete sentences are not required.
  If the new context isn't useful, respond with the phrase "SUMMARY: no new content".

  If there is no existing summary, please start a new one based on the lecture transcript.
  Here is the current summary: ${existing_summary || "No existing summary provided"}.
  
  Evaluate the most recent lecture transcript below for any noteworthy content.
  ------------
  ${transcript}
  ------------

  SUMMARY:
  `;
}

// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteSystemPrompt = () => {
  return `
    Your objective is to produce polished lecture notes from a provided summary. 
    The notes should be:
    - Concise yet comprehensive
    - Hierarchically structured with headings, subheadings, and various levels of bullet points
    - Clear and easy to understand
    Ensure that important elements like formulas, examples, definitions, and references are distinctively highlighted.
  `;
}


// for generating a polished lecture notes for the entire lecture based on the summary
const finalNoteUserPrompt = (summary: string, topic: string) => {
  return `
    As a domain expert in ${topic}, you have been given a summarized version of a lecture about ${topic}. 
    Your task is to transform the summary into polished lecture notes. Here are some guidelines:
    - The notes should capture the details comprehensively.
    - Utilize a hierarchical structure with headings, subheadings, bullet points, and sub-bullets for clarity.
    - Distinctly mark and highlight new formulas, examples, definitions, graphs and references.
    - Do not omit any details or information from the summary.
    - Bullet points should be short and to the point. Complete sentences are not required.
    
    Your focus is to organize the summary into a clear, easily readable and organized structure while maintaining details.
    It is especially important to highlight new formulas, examples, definitions, graphs and references.
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
  Use the summary provided to craft a concise and accurate response to the question. 
  If the answer isn't present in the summary, state "Answer not found in the summary." Only then, use your own knowledge to answer the question.

  Take a deep breath, think about this step by step and make sure you get it right.

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