import React, { SVGProps } from 'react'


export function EmptyRecordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>\
      <path fill="currentColor" d="M12 12Zm0 6q-2.496 0-4.248-1.752T6 12q0-2.496 1.752-4.248T12 6q2.496 0 4.248 1.752T18 12q0 2.496-1.752 4.248T12 18Zm0-1q2.075 0 3.538-1.463T17 12q0-2.075-1.463-3.538T12 7Q9.925 7 8.462 8.463T7 12q0 2.075 1.463 3.538T12 17Z"></path>
    </svg>
  )
}
export default EmptyRecordIcon


export function FullRecordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12.004 18q-2.506 0-4.255-1.745Q6 14.509 6 12.004q0-2.506 1.745-4.255Q9.491 6 11.996 6q2.506 0 4.255 1.745Q18 9.491 18 11.996q0 2.506-1.745 4.255Q14.509 18 12.004 18Z"></path></svg>
  )
}