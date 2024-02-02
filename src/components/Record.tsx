import { useState } from 'react';

import RecordForm from '@/components/features/RecordForm';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const constraints = {
  video: {
    frameRate: { ideal: 60, max: 120 },
  },
};

type RecorderParams = {
  fileName: string;
  mimeType: string;
};

type AlertType = {
  message: string;
  type: 'default' | 'destructive';
};

const initRecorder = async ({ fileName, mimeType }: RecorderParams) => {
  if (!navigator.mediaDevices.getDisplayMedia) return false;

  const media = await navigator.mediaDevices.getDisplayMedia(constraints);
  const recorder = new MediaRecorder(media, { mimeType });

  recorder.start();

  const [stream] = media.getVideoTracks();
  stream?.addEventListener('ended', () => {
    recorder.stop();
  });

  recorder.addEventListener('dataavailable', (e) => {
    const blob = new Blob([e.data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  });

  return stream;
};

export default function Record() {
  const [recorderParams, setRecorderParams] = useState<RecorderParams | null>(
    null,
  );
  const [streamTrack, setStreamTrack] = useState<
    MediaStreamTrack | undefined
  >();
  const [isRecording, setIsRecording] = useState(false);
  const [alert, setAlert] = useState<AlertType | false>(false);

  const handleStart = async () => {
    if (recorderParams) {
      const stream = await initRecorder(recorderParams);
      if (stream) {
        setStreamTrack(stream);
        setIsRecording(true);
      } else {
        setAlert({
          message: 'The current browser does not support screen recording.',
          type: 'destructive',
        });
      }
    }
  };

  const handleSubmit = (values: any) => {
    setRecorderParams(values);
    handleStart();
  };

  const handleStop = () => {
    streamTrack?.stop();
    setIsRecording(false);
  };

  const handleLoad = (values: any) => {
    setRecorderParams(values);
  };

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      {alert && (
        <Alert variant={alert.type}>
          <AlertTitle>Oops!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      {isRecording ? (
        <button
          className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          onClick={handleStop}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex size-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            🎥 Stop recording
          </span>
        </button>
      ) : (
        <RecordForm onLoad={handleLoad} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
