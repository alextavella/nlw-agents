import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateRoom } from '@/hooks/use-create-room'

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório (mínimo 3 caracteres)' }),
  description: z.string()
})

type FormSchema = z.infer<typeof formSchema>

export function CreateRoomForm() {
  const { createRoom, isLoading } = useCreateRoom()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const isSubmitting = form.formState.isSubmitting
  const isDisabled = isSubmitting || isLoading

  async function onSubmit(data: FormSchema) {
    await createRoom({
      name: data.name,
      description: data.description
    })

    form.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar sala</CardTitle>
        <CardDescription>Crie uma sala para compartilhar com outros usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da sala</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Nome da sala"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da sala</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isDisabled}
                      placeholder="Descrição da sala"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isDisabled} type="submit">
              Criar sala
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
