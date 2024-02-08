export default function RecordStream({
  blobUrl,
  children,
}: {
  blobUrl: string;
  children: any;
}) {
  return (
    <div>
      <video src={blobUrl} controls />
      {children}
    </div>
  );
}
