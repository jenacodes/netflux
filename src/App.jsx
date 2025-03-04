import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Header from "./components/Header";
import Loading from "./components/Loading";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim(); // Trim any whitespace or special characters

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    if (!API_KEY) {
      console.error("API Key missing or invalid:", API_KEY);
      seterrorMessage("API key is not configured correctly");
      return;
    }

    setisLoading(true);
    seterrorMessage("");
    try {
      // const endpoint = query
      //   ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
      //       query
      //     )}&include_adult=false&language=en-US&page=1`
      //   : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // console.log("With headers:", {
      //   ...API_OPTIONS.headers,
      //   Authorization: "Bearer [HIDDEN]", // Don't log the actual token
      // });

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.status_message || `API Error: ${response.status}`);
      }

      if (!data.results || data.results.length === 0) {
        seterrorMessage(
          query ? `No movies found for "${query}"` : "No movies available"
        );

        setMoviesList([]);
        return;
      }

      //Validate movie data structure
      // const validMovies = data.results.filter(
      //   (movie) => movie.id && movie.title && typeof movie.title === "string"
      // );

      // setMoviesList(validMovies);

      setMoviesList(data.results || []);

      //if the query and data results exists
      if (query && data.results.length > 0) {
        // try {
        //   await updateSearchCount(query, data.results.length[0]);
        // } catch (error) {
        //   console.error("Error updating search count:", error);
        // }

        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      seterrorMessage(
        error.message || "Error fetching movies. Please try again later."
      );
      setMoviesList([]);
    } finally {
      setisLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      if (movies && Array.isArray(movies)) {
        setTrendingMovies(movies);
      } else {
        console.error("Invalid trending movies data:", movies);
        setTrendingMovies([]);
      }
    } catch (error) {
      console.error(`Error fetching Trending Movies:`, error);
      setTrendingMovies([]);
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchMovies(debouncedSearchTerm);
    } else {
      fetchMovies();
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <Header />
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className="text-2xl text-white sm:text-3xl font-bold">
                Trending Movies
              </h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2 className="text-2xl text-white sm:text-3xl font-bold ">
              {searchTerm ? "Search Results" : "All Movies"}
            </h2>
            {isLoading && <Loading />}
            {!isLoading && errorMessage && (
              <p className="text-red-600">{errorMessage}</p>
            )}
            {!isLoading && !errorMessage && moviesList.length > 0 && (
              <ul>
                {moviesList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
            {!isLoading &&
              !errorMessage &&
              moviesList.length === 0 &&
              searchTerm && (
                <p className="text-white">
                  No movies found. Try a different search term.
                </p>
              )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
