export default function RecordStream({
  blobUrl,
  children,
}: {
  blobUrl: string;
  children: any;
}) {
  return (
    <div>
      <h1>Record Stream</h1>
      <video src={blobUrl} controls />
      {blobUrl}
      {children}
    </div>
  );
}
