import Image from 'next/image'
import type { Metadata } from 'next'
import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/profile/accountForm"
import { UserAuthForm } from '@/components/profile/authForm'

export const metadata: Metadata = {
  title: "Scribe - Profile",
}


export default function Profile() {
  return (
    <main className="w-full max-w-[1000px] h-full flex-l flex-col space-y-8 px-6 py-24 md:flex overflow-auto">
      <div className="flex items-center justify-start space-y-2">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground font-light">
            Update your account settings.
          </p>
        </div>
      </div>
      <Separator className="bg-gray-400"/>
      <AccountForm />
      <Separator className="bg-gray-400"/>
      <UserAuthForm />
    </main>
  )
}
