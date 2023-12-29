"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useAppStore from "@/stores/appStore"
import * as z from "zod"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"


const accountFormSchema = z.object({
  apikey: z
    .string()
    .length(51, {
      message: "API key must be 51 characters.",
    }),
  model: z
    .string({
      required_error: "Please select a model.",
    })
})

type AccountFormValues = z.infer<typeof accountFormSchema>


export function AccountForm() {
  const setModel = useAppStore((state) => state.setModel);
  const setApiKey = useAppStore((state) => state.setApikey);
  const model = useAppStore((state) => state.model);
  const apikey = useAppStore((state) => state.apikey);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      apikey: localStorage.getItem("apikey") || apikey,
      model: localStorage.getItem("model") || model,
    }
  })


  function onSubmit(data: AccountFormValues) {

    const { apikey, model } = data;

    // store into local storage
    setApiKey(apikey);
    setModel(model);
    localStorage.setItem("apikey", apikey);
    localStorage.setItem("model", model);

    toast({
      variant: "info",
      description: (
        // <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //   <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        // </pre>
        <div className="font-light">
          Settings updated. 
          {/* <br />
          {`model: ${model}`} <br />
          {`API key: ...${apikey.slice(-10)}`} */}
        </div>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="apikey"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel className="font-light text-md">OpenAI/Azure API Key</FormLabel>
              <FormControl >
                <Input 
                  placeholder="enter key here" 
                  className="bg-gray-100 font-light max-w-[400px]" {...field} 
                />
              </FormControl>
              <FormDescription className="font-light">
                Your key will be stored locally in your browser.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="mb-8">
              <FormLabel className="font-light text-md">OpenAI Model</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-100 font-light max-w-[400px]">
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-100 font-light max-w-[400px]">
                  <SelectItem value="gpt-4-1106-preview">gpt-4-1106-preview</SelectItem>
                  <SelectItem value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</SelectItem>
                  <SelectItem value="gpt-4">gpt-4</SelectItem>
                  <SelectItem value="gpt-4-32k">gpt-4-32k</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose which model to use for generation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 bg-orange-400 text-gray-100 font-light hover:bg-orange-500 active:scale-95 transition duration-150 ease-in-out">
          update
        </Button>
      </form>
    </Form>
  )
}