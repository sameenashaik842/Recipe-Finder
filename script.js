const searchBox=document.querySelector('.search-box');
const searchBtn=document.querySelector('.search-btn');
const recipeContainer=document.querySelector('.recipe-container');
const recipeContent=document.querySelector('.recipe-content');
const closeBtn=document.querySelector('.close-btn');

const fetchRecipes=async(query)=>{
  recipeContainer.innerHTML="<h2>Fetching recipes...</h2>";
  try{
    const data=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response=await data.json();
    recipeContainer.innerHTML="";
    response.meals.forEach(meal=>{
      const recipeDiv=document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML=`
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal.length>17 ? meal.strMeal.substring(0,17).concat("...") : meal.strMeal}</h3>
        <p><span>${meal.strArea=="Unknown" ? "Indian" : meal.strArea}</span> Dish</p>
      `;
      const button=document.createElement('button');
      button.classList.add('recipe-btn');
      button.textContent="View Recipe";
      recipeDiv.appendChild(button);
      button.addEventListener('click',()=>{
        openRecipePopup(meal);
      });
      recipeContainer.appendChild(recipeDiv);
    });
    searchBox.value="";
  }
  catch(error){
    recipeContainer.innerHTML="<h2>Error in fetching recipes... Type a valid recipe name...</h2>";
  }
}

const openRecipePopup=(meal)=>{
  recipeContent.innerHTML=`
    <h2 class="recipe-name">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredients">${fetchIngredients(meal)}</ul>
    <div class="instructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeContent.parentElement.style.display="block";
}

const fetchIngredients=(meal)=>{
  let ingredientsList="";
  for(let i=1;i<=20;i++){
    const ingredient=meal[`strIngredient${i}`];
    if(ingredient){
      const measure=meal[`strMeasure${i}`];
      ingredientsList+=`<li>${ingredient} ${measure}</li>`
    }
    else{
      break;
    }
  }
  return ingredientsList;
}

closeBtn.addEventListener('click',()=>{
  recipeContent.parentElement.style.display="none";
});

searchBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  const searchInput=searchBox.value.trim();
  if(!searchInput){
    recipeContainer.innerHTML="<h2>Type a recipe name...</h2>";
    return;
  }
  fetchRecipes(searchInput);
});