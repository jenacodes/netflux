import PropTypes from "prop-types";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="bg-dark-100 rounded-2xl shadow-inner shadow-light-100/10 p-5">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : `/no-movie.png`
        }
        alt={title}
      />

      <div className="mt-4">
        <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>

        <div className="mt-2 flex flex-row items-center flex-wrap gap-2">
          <div className="flex flex-row items-center gap-1">
            <img src="./star.svg" alt="Star icon" />
            <p className="text-white font-bold">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>
            <span className="text-sm text-gray-100">*</span>
            <p className="capitalize text-gray-100 font-medium text-base">
              {original_language}
            </p>
            <span className="text-sm text-gray-100">*</span>
            <p className="text-gray-100 font-medium text-base">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    original_language: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
};

export default MovieCard;
