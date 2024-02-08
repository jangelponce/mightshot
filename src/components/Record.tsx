import { useState } from 'react';

import RecordForm from '@/components/features/RecordForm';
import useMediaRecord from '@/hooks/useMediaRecord';

import RecordStream from './features/RecordStream';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type RecorderParams = {
  fileName: string;
  mimeType: string;
};

type AlertType = {
  message: string;
  type: 'default' | 'destructive';
};

const defaultRecorderParams = {
  fileName: '',
  mimeType: 'video/webm;codecs=vp9',
} as RecorderParams;

export default function Record() {
  const [recorderParams, setRecorderParams] = useState<RecorderParams>(
    defaultRecorderParams,
  );
  const [alert, setAlert] = useState<AlertType | false>(false);
  const {
    blobUrl,
    isRecording,
    userAgentSupported,
    downloadMedia,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useMediaRecord({
    mimeType: recorderParams.mimeType,
    fileName: recorderParams.fileName,
  });

  const handleStart = async () => {
    if (userAgentSupported) {
      startRecording();
      return;
    }

    setAlert({
      message: 'The current browser does not support screen recording.',
      type: 'destructive',
    });
  };

  const handleSubmit = (values: any) => {
    setRecorderParams(values);
    handleStart();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handleLoad = (values: any) => {
    setRecorderParams(values);
  };

  const handleCancel = () => {
    cancelRecording();
    setRecorderParams(defaultRecorderParams);
    setAlert(false);
  };

  return (
    <div className="flex w-full flex-col gap-4 p-2">
      {alert && (
        <Alert variant={alert.type}>
          <AlertTitle>Oops!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      {blobUrl ? (
        <RecordStream blobUrl={blobUrl}>
          <div className="flex flex-row items-center gap-2 align-middle">
            <button
              className="m-1 h-12 w-full rounded-full bg-slate-950 text-white outline outline-1 outline-slate-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              onClick={downloadMedia}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex size-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                📥 Download
              </span>
            </button>
          </div>
        </RecordStream>
      ) : (
        <>
          {isRecording ? (
            <>
              <button
                className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                onClick={handleStop}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex size-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  🎥 Stop recording
                </span>
              </button>
            </>
          ) : (
            <RecordForm onLoad={handleLoad} onSubmit={handleSubmit} />
          )}
        </>
      )}
    </div>
  );
}
