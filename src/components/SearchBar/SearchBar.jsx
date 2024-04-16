import React, { useState } from "react";
import { toast } from "react-hot-toast";

import css from "./SearchBar.module.css";

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState("");

  const handleChange = e => setQuery(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    const inputValue = query.trim();
    if (!inputValue) {
      toast.error("Please enter a valid query");
      setQuery("");
      return;
    }
    if (inputValue.toLowerCase() === prevQuery) {
      toast.error("Please enter another query");
      return;
    }
    onSubmit(inputValue);
    setQuery("");
    setPrevQuery(inputValue.toLowerCase());
  };

  return (
    <>
      <header>
        <form className={css.form} onSubmit={handleSubmit}>
          <input
            type="text"
            autoComplete="off"
            placeholder="Search images"
            value={query}
            onChange={handleChange}
          />
          <button className={css.search} type="submit">
            Search
          </button>
        </form>
      </header>
    </>
  );
};

export default SearchBar;
