import { useState } from 'react'
import RecordForm from '@/components/features/RecordForm'

const constraints = {
  video: {
    frameRate: { ideal: 60, max: 120 }
  }
}

type RecorderParams = {
  fileName: string
  mimeType: string
}

const initRecorder = async ({ fileName, mimeType }: RecorderParams) => {
  const media = await navigator.mediaDevices.getDisplayMedia(constraints)
  const recorder = new MediaRecorder(media, { mimeType })

  recorder.start()

  const [video] = media.getVideoTracks()
  video?.addEventListener('ended', () => {
    recorder.stop()
  })

  recorder.addEventListener('dataavailable', (e) => {
    const blob = new Blob([e.data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  })

  return recorder
}

export default function Record() {
  const [recorder, setRecorder] = useState<any>(null)
  const [recorderParams, setRecorderParams] = useState<RecorderParams | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = (values: any) => {
    setRecorderParams(values)
    handleStart()
  }

  const handleStart = () => {
    if (recorderParams) {
      initRecorder(recorderParams).then((rec) => {
        setRecorder(rec)
        setIsRecording(true)
      })
    }
  }

  const handleStop = () => {
    recorder?.stop()
    isRecording && setIsRecording(false)
  }

  const handleLoad = (values: any) => {
    setRecorderParams(values)
  }

  return (
    <div className='flex flex-col gap-4 w-full p-2'>
      {isRecording ? (
        <button
          className='relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
          onClick={handleStop}
        >
          <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
          <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
            🎥 Start recording
          </span>
        </button>
      ) : (
        <RecordForm onLoad={handleLoad} onSubmit={handleSubmit} />
      )}
    </div>
  )
}
