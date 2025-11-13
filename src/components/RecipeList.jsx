import { Fragment } from "react";
import PropTypes from "prop-types";
import { Recipe } from "./Recipe.jsx";

export function RecipeList({ recipes = [] }) {
  return (
    <div>
      {recipes.map((recipe) => (
        <Fragment key={recipe._id}>
          <Recipe {...recipe} />
          <hr />
        </Fragment>
      ))}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.shape(Recipe.propTypes)).isRequired,
};