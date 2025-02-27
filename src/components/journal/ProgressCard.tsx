
export function ProgressCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">My Journal</h3>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Last Entry:</span>
          <span>None</span>
        </div>
      </div>
    </div>
  );
}
