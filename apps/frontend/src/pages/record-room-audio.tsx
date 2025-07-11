import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices?.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

export function RecordRoomAudio() {
  const params = useParams()

  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function createRecorder(audio: MediaStream) {
    mediaRecorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000
    })
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prev) => [...prev, event.data])
      }
    }
    mediaRecorder.current.onstart = () => setIsRecording(true)
    mediaRecorder.current.onstop = () => setIsRecording(false)
    mediaRecorder.current.start()
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Não é possível gravar áudio nesse navegador')
      return
    }

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100
      }
    })

    createRecorder(audio)

    intervalRef.current = setInterval(() => {
      mediaRecorder.current?.stop()
      createRecorder(audio)
    }, 5000)
  }

  async function stopRecording() {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop()
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.webm')

    await api.post(`/rooms/${params.roomId}/audio`, formData)
  }

  useEffect(() => {
    return () => {
      mediaRecorder.current?.stop()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (!params.roomId) {
    return <Navigate to="/" />
  }
  // if (!isRecordingSupported) {
  //   return <div>Não é possível gravar áudio nesse navegador</div>
  // }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      {isRecording ? (
        <Button onClick={stopRecording}>Parar gravação</Button>
      ) : (
        <Button onClick={startRecording}>Gravar áudio</Button>
      )}
      {isRecording && <p>Gravando...</p>}
    </div>
  )
}
