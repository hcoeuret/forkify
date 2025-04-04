import 'regenerator-runtime/runtime';
import { API_URL, API_KEY } from "./config";  
import { RES_PER_PAGE } from "./config";  
import { AJAX, AJAX } from "./helper";

//API key f77d85d4-a452-4564-a8f7-f1907bdd60f6


export const state = {
  recipe: {},
  search: {
    query : '',
    results : [],
    page : 1,
    resultsPerPage : RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function(data){
  const {recipe} = data.data;
  return {
    id: `#${recipe.id}`,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key})
}
}

export const loadRecipe = async function(id){
  try{
    const data = await AJAX(`${API_URL}${id.slice(1)}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data)

    if(state.bookmarks.some(rec => rec.id === id))
      state.recipe.bookmarked = true;
    else
      state.recipe.bookmarked = false;

  }
  catch(err){
    throw err;
  }
}

export const loadSearchResult = async function(query){
  try{
    state.search.query = query
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: `#${rec.id}`,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
      }
    }) 
  }
  catch(err){
    throw err;
  }
}

export const getSearchResultsPage = function(page = 1){
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end); 
}

export const updateServings = function(newServing){
  if(newServing <= 0) return;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServing/state.recipe.servings)
})
  state.recipe.servings = newServing;
}

const persistBookmarks = function(){
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
  
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  state.recipe.bookmarked = true;

  persistBookmarks();
}

export const removeBookmark = function(id){
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id)
  state.bookmarks.splice(index, 1);
  state.recipe.bookmarked = false;

  persistBookmarks();
}

const init = function(){
  const storage = localStorage.getItem('bookmarks')
  if (storage) state.bookmarks = JSON.parse(storage);
}
init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks');
};
//clearBookmarks();

export const uploadRecipe = async function(newRecipe){
  try{
    const ingredients = Object.entries(newRecipe)
    .filter(ing => ing[0].startsWith('ingredient') && ing[1] !=='')
    .map(ing => {
      const ingArr = ing[1].split(',')
      if(ingArr.length !== 3) throw new Error("wrong ingredient format please use correct format")
      const [quantity, unit, description] = ingArr;
      return {quantity : quantity ? +quantity : null, unit, description};
    })

    const recipe = {
      id: ``,
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: newRecipe.servings,
      cooking_time: newRecipe.cookingTime,
      ingredients
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`,recipe);
    state.recipe = createRecipeObject(data); 
    addBookmark(state.recipe);
  }
  catch(err){
    throw err;
  }
}