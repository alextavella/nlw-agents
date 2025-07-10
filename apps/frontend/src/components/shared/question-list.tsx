import { useRoomQuestions } from '@/hooks/use-room-questions'
import { QuestionItem } from './question-item'

type Props = {
  roomId: string
}

export function QuestionList({ roomId }: Props) {
  const { questions } = useRoomQuestions(roomId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">Perguntas & Respostas</h2>
      </div>

      {questions?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  )
}
