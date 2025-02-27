
export function ProgressCard() {
  return (
    <div className="rounded-lg border border-pink-200 bg-pink-50/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V16M12 16L16 12M12 16L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="font-medium">Progress</h3>
        </div>
        <span className="text-sm font-medium">0 XP</span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Current Streak:</span>
          <span>0 days</span>
        </div>
        <div className="flex justify-between">
          <span>Total Entries:</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
}
