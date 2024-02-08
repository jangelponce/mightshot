import { useCallback, useMemo, useRef, useState } from 'react';

type OnRecordingStoppedParams = {
  blobUrl: string;
};

type UseMediaRecordProps = {
  mimeType: string;
  fileName: string;
  onRecordingStopped?: (params: OnRecordingStoppedParams) => void;
};

const constraints = {
  video: {
    frameRate: { ideal: 60, max: 120 },
  },
};

export default function useMediaRecord({
  mimeType,
  fileName,
  onRecordingStopped = () => null,
}: UseMediaRecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');

  const displayMedia = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStreamTrack = useRef<MediaStreamTrack | null>(null);

  const userAgentSupported = useMemo(() => Boolean(window.MediaRecorder), []);

  const addEventListeners = useCallback(() => {
    if (mediaStreamTrack.current) {
      mediaStreamTrack.current.addEventListener('ended', () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
      });

      mediaRecorder.current?.addEventListener('dataavailable', (e) => {
        const blob = new Blob([e.data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        onRecordingStopped({ blobUrl: url });
      });
    }
  }, [mediaStreamTrack]);

  const downloadMedia = useCallback(() => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      a.click();
    }
  }, [blobUrl]);

  const initMediaRecorder = async () => {
    displayMedia.current =
      await navigator.mediaDevices.getDisplayMedia(constraints);
    mediaRecorder.current = new MediaRecorder(displayMedia.current, {
      mimeType,
    });
  };

  const startRecording = useCallback(() => {
    if (userAgentSupported)
      initMediaRecorder().then(() => {
        mediaRecorder.current?.start();
        mediaStreamTrack.current =
          displayMedia.current?.getVideoTracks()[0] || null;

        addEventListeners();
        setIsRecording(true);
      });
  }, [mediaRecorder]);

  const stopRecording = useCallback(() => {
    mediaRecorder.current?.stop();
  }, [mediaRecorder]);

  const cancelRecording = useCallback(() => {
    if (displayMedia.current) {
      displayMedia.current.getTracks().forEach((track) => track.stop());
    }
    setBlobUrl('');
    setIsRecording(false);
  }, [displayMedia]);

  return {
    blobUrl,
    displayMedia,
    isRecording,
    downloadMedia,
    cancelRecording,
    mediaRecorder,
    mediaStreamTrack,
    startRecording,
    stopRecording,
    userAgentSupported,
  };
}
