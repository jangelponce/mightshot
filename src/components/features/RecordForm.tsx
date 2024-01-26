import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useEffect } from 'react'

const formSchema = z.object({
  fileName: z.string().min(2, {
    message: 'File name must be at least 2 characters.'
  }),
  mimeType: z.string(),
})

const mimeTypeOptions = [
  { value: 'video/webm;codecs=vp9', label: 'Webm (with vp9 codecs)' },
]

type RecordFormProps = {
  onLoad: (values: z.infer<typeof formSchema>) => void,
  onSubmit: (values: z.infer<typeof formSchema>) => void,
}

export default function RecordForm({
  onSubmit,
  onLoad
}: RecordFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: "",
      mimeType: "video/webm;codecs=vp9",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    onSubmit(values)
  }

  useEffect(() => {
    onLoad(form.getValues())
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8' autoComplete="off">
        <FormField
          control={form.control}
          name='fileName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='my recording'  {...field} />
              </FormControl>
              <FormDescription>
                This is how your video will be named.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='mimeType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a fruit' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {mimeTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                This is how your video will be saved.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          className='relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
          type='submit'
        >
          <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
          <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
            🎥 Start recording
          </span>
        </button>
      </form>
    </Form>
  )
}
