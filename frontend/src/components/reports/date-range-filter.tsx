import type { DateRangePreset } from '../../pages/admin/reports.utils';

interface DateRangeFilterProps {
  preset: DateRangePreset;
  customStartDate: string;
  customEndDate: string;
  onPresetChange: (nextPreset: DateRangePreset) => void;
  onCustomStartDateChange: (value: string) => void;
  onCustomEndDateChange: (value: string) => void;
}

const presetOptions: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'TODAY', label: 'Today' },
  { value: 'WEEK', label: 'Week' },
  { value: 'MONTH', label: 'Month' },
  { value: 'CUSTOM', label: 'Custom' },
];

export default function DateRangeFilter({
  preset,
  customStartDate,
  customEndDate,
  onPresetChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className='bg-white p-6 rounded-xl shadow space-y-4'>
      <h2 className='text-lg font-semibold'>Date Filter</h2>

      <div className='flex flex-wrap gap-2'>
        {presetOptions.map((option) => (
          <button
            key={option.value}
            type='button'
            onClick={() => onPresetChange(option.value)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
              preset === option.value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {preset === 'CUSTOM' && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Start Date
            </label>
            <input
              type='date'
              value={customStartDate}
              onChange={(event) => onCustomStartDateChange(event.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              End Date
            </label>
            <input
              type='date'
              value={customEndDate}
              onChange={(event) => onCustomEndDateChange(event.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
            />
          </div>
        </div>
      )}
    </div>
  );
}
