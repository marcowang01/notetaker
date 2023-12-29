import React, { SVGProps } from 'react'

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor"strokeWidth="0.1" d="M3 20.077V4.615q0-.69.463-1.152Q3.925 3 4.615 3h14.77q.69 0 1.152.463q.463.462.463 1.152v10.77q0 .69-.462 1.153q-.463.462-1.153.462H6.077L3 20.077ZM5.65 16h13.735q.23 0 .423-.192q.192-.193.192-.423V4.615q0-.23-.192-.423Q19.615 4 19.385 4H4.615q-.23 0-.423.192Q4 4.385 4 4.615v13.03L5.65 16ZM4 16V4v12Z"></path>
    </svg>
  )
}


export default ChatIcon
