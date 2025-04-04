import View from './View.js'
import icons from 'url:../../img/icons.svg'
import previewView from './previewView.js';

class ResultsView extends previewView{
  _parentElement = document.querySelector('.results')
  _errorMessage = "No recipes found for your query, please try again";
  _initMessage = "Start by searching for a recipe or an ingredient. Have fun!"
  
};


export default new ResultsView