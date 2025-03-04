import PropTypes from "prop-types";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div className="flex items-center relative">
        <img src="./search.svg" alt="" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent pl-10 sm:pr-10 text-base text-gray-200 placeholder-light-500 outline-hidden"
        />
      </div>
    </div>
  );
};
//PROP TYPES
Search.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default Search;
