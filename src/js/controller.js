import * as model from './model.js';
import {MODAL_CLOSE_SECONDS} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import { MODAL_CLOSE_SECONDS } from './config.js';

const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function(){
  try{
    const id = window.location.hash;
    
    if (!id) return;
    recipeView.renderSpinner(recipeContainer);

    // 0 - Update results view to mark selected search results
    resultView.update(model.getSearchResultsPage());
    
    // 1 - Getting recipe
    await model.loadRecipe(id);

    const {recipe} = model.state;
    
    // 2 - Rendering recipe
    recipeView.render(model.state.recipe);

    // 3 - Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
  }
  catch(err){
    recipeView.renderError();
  }
};

const controlSearchResult = async function(){
  try{

    resultView.renderSpinner();

    // 1 - Get search query
    const query = searchView.getQuery();
    if(!query) return;

    // 2 - Load search results
    await model.loadSearchResult(query)

    // 3 - Render results
    const recipes = model.getSearchResultsPage();
    resultView.render(recipes);

    // 4 - Render pagination views
    paginationView.render(model.state.search);


  }
  catch(err){
    throw err;
  }
}

const controlPagination = function(page){
  const recipes = model.getSearchResultsPage(page);
  resultView.render(recipes);
  paginationView.render(model.state.search);
}

const controlServings = function(newServing){
  // Update the recipe servings
  model.updateServings(newServing)
  // Update the view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  // 1 - Add or Remove bookmark
  if(!model.state.recipe.bookmarked){
    model.addBookmark(model.state.recipe);
  } 
  else{
    model.removeBookmark(model.state.recipe);
  }
  
  // 2 - Update recipe view
  recipeView.update(model.state.recipe);

  // 3 - RenderBookmark
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{
    //Show spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Rendering recipe
    recipeView.render(model.state.recipe);

    // Updating bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Success message
    addRecipeView.renderMessage();

    // Change ID in URL
    window.history.pushState(null,'', `${model.state.recipe.id}`)

    // Close window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SECONDS * 1000 );
    
  }
  catch(err){
    addRecipeView.renderError(err.message);
  }
  
}

const init = function(){
  recipeView.addHandlerRender(controlRecipes);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();



