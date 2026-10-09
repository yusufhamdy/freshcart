export default function Loader() {
  return (
    <div className="flex justify-center py-16" role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
    </div>
  );
}
