import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import { elements, renderLoader, clearLoader } from './views/base';


/** Global State of the App
 * - Search Object
 * - Current Recipe
 * - Shopping list Object
 * - Liked Recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //TODO
    
    
    if(query) {
        // 2) New Search Object and add to State
        state.search = new Search(query)
        console.log(state)
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try{
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something wrong with the search ...');
            clearLoader();
        }
        

    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage)
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id)

    if(id){
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // TESTING
        window.r = state.recipe;

        try {
            // Get Recipe Data and Parse Ingredients
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render 
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            // console.log(state);
            //console.log(state.recipe);
        } catch(err){
            alert(`Actual Error: ${err}........Error processing recipe!`)
            console.log(err)
        }
        
    }
};

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));