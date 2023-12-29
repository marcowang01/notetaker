"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GoogleIcon from "@/icons/google"
import SpinnerIcon from "@/icons/spinner"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn("flex flex-col items-left w-full gap-4", className)} {...props}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-start font-light text-md">
          <span className="bg-background text-muted-foreground">
              Sign in with Google
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} className="w-full max-w-[400px] bg-orange-400 text-gray-100 hover:bg-orange-500 active:scale-95 transition duration-150 ease-in-out" onClick={onSubmit}>
        {isLoading ? (
          <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      {/* <div onClick={() => run()} className="cursor-pointer w-full max-w-[400px] bg-orange-400 text-gray-100 hover:bg-orange-500 active:scale-95 transition duration-150 ease-in-out">
        run
      </div> */}
    </div>
  )
}