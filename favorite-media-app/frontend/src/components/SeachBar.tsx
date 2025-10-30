import { FC } from "react";

interface SearchBarProps {
  query: string;
  onSearch: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({
  query,
  onSearch,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search media by title, type, or director..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      {/* Type Filter Dropdown */}
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="Movie">Movies</option>
        <option value="Series">Series</option>
        <option value="Documentary">Documentary</option>
      </select>
    </div>
  );
};

export default SearchBar;
