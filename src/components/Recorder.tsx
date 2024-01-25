import { useEffect, useState } from 'react'

const constraints = {
  video: {
    frameRate: { ideal: 60, max: 120 }
  }
}

const options = {
  mimeType: 'video/webm;codecs=vp9'
}

const initRecorder = async () => {
  const media = await navigator.mediaDevices.getDisplayMedia(constraints)
  // eslint-disable-next-line no-undef
  const recorder = new MediaRecorder(media, options)

  recorder.start()

  const [video] = media.getVideoTracks()
  video.addEventListener('ended', () => {
    recorder.stop()
  })

  recorder.addEventListener('dataavailable', (e) => {
    const blob = new Blob([e.data], { type: options.mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recording.webm'
    a.click()
  })

  return recorder
}

export default function Recorder () {
  const [open, setOpen] = useState(false)
  // const [_, setRecorder] = useState(null)

  useEffect(() => {
    if (open) {
      // Start recording
      console.log('Start recording')
      initRecorder()
    } else {
      // Stop recording
    }
  }, [open])

  return (
    <button
      onClick={() => setOpen(!open)}
      className='relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'
    >
      <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
      <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
        🎥 Start recording
      </span>
    </button>
  )
}
