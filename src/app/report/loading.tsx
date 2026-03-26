export default function ReportLoading() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="card p-8 space-y-6 animate-pulse">
        {/* Title placeholder */}
        <div className="h-8 bg-gray-200 rounded-lg w-2/3" />

        {/* Description placeholder */}
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />

        {/* Form field placeholders */}
        <div className="space-y-4 pt-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-12 bg-gray-100 rounded-xl w-full" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-12 bg-gray-100 rounded-xl w-full" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-24 bg-gray-100 rounded-xl w-full" />
          </div>
        </div>

        {/* Button placeholder */}
        <div className="pt-4">
          <div className="h-12 bg-gray-200 rounded-xl w-40" />
        </div>
      </div>
    </div>
  );
}
