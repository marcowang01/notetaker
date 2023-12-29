import React, { SVGProps } from 'react'

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor"  strokeWidth="0.1" d="M4.615 19q-.69 0-1.152-.462Q3 18.075 3 17.385V6.615q0-.69.463-1.152Q3.925 5 4.615 5h4.981l2 2h7.789q.69 0 1.152.463q.463.462.463 1.152v8.77q0 .69-.462 1.152q-.463.463-1.153.463H4.615Zm0-1h14.77q.269 0 .442-.173t.173-.442v-8.77q0-.269-.173-.442T19.385 8h-8.19l-2-2h-4.58q-.269 0-.442.173T4 6.615v10.77q0 .269.173.442t.442.173ZM4 18V6v12Z"></path>
    </svg>
  )
}
export default FolderIcon