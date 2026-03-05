export const OPTION_COLORS = [
  { name: 'Gray', bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-200', value: 'gray' },
  { name: 'Red', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', value: 'red' },
  { name: 'Orange', bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', value: 'orange' },
  { name: 'Yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', value: 'yellow' },
  { name: 'Green', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', value: 'green' },
  { name: 'Blue', bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', value: 'blue' },
  { name: 'Purple', bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', value: 'purple' },
  { name: 'Pink', bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', value: 'pink' },
];

export function getOptionColorClasses(color: string) {
  return OPTION_COLORS.find((c) => c.value === color) ?? OPTION_COLORS[0];
}
