import '@babel/polyfill';
import './views/choices';
import './models/getList';
import { renderNavHeader, renderInnerList } from './views/navHeader';
import {
  removeInput,
  addInput,
  validateChange,
  addIngredientsBox,
  removeIngredientsBox,
} from './views/formUpload';
import { setNutriListeners } from './controllers/setNutriListeners';
import Axios from 'axios';
import { setInitialValues } from './utils/setInitialValues';
import { loginFunc, signinFunc } from './controllers/auth';

const exploreBtn = document.querySelector('.btn-nav');
const signin = document.querySelector('.form__btn-signin');
const signup = document.querySelector('.form__btn-signup');

///////////////////////////////////////////////////////
// INITIALIZING THE INITIAL VALUES TO CHECK AGAINST
//////////////////////////////////////////////////////
setInitialValues();

//EVENT HANDLERS
///////////////////////////////////////////////////////
// NAvIGATION RELATED EVENTS
//////////////////////////////////////////////////////

//to add nav element
if (exploreBtn) {
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let nav = document.querySelector('.nav');
    const headerele = document.querySelector('.header');

    if (!nav) {
      //render the nav element
      renderNavHeader(headerele);

      //remove the explore button by animating it
      // exploreBtn.classList.remove('animate--in');
      exploreBtn.classList.add('animate--out');

      //set nav delete handler
      const navDelete = document
        .querySelector('.nav__delete')
        .addEventListener('click', deleteNav);

      //select it again so that we can animate it
      nav = document.querySelector('.nav');
      setTimeout(() => {
        nav.classList.add('animate--in');
      }, 100);
    }
  });
}

//to remove nav element
const deleteNav = (e) => {
  const nav = document.querySelector('.nav');

  //animate out nav
  nav.classList.remove('animate--in');
  // nav.classList.add('animate--out');

  //remove nav
  setTimeout(() => {
    document.querySelector('.nav').remove();
  }, 500);

  //animate the explore button
  exploreBtn.classList.remove('animate--out');
  // exploreBtn.classList.add('animate--in');
};

///////////////////////////////////////////////////////
// PAGINATION RELATED EVENTS
//////////////////////////////////////////////////////

//event handler for pagination
document.querySelector('.header').addEventListener('click', (e) => {
  const element = e.target;
  const parentLi = e.target.parentElement.parentElement;
  const { nextPage, prevPage, type } = e.target.dataset;
  if (element.className.includes('btn-list')) {
    renderInnerList(nextPage ? nextPage : prevPage, type, parentLi);
  }
});

///////////////////////////////////////////////////////
// WAYPOINTS RELATED EVENTS
//////////////////////////////////////////////////////

const waypoint = new Waypoint({
  element: document.querySelector('.header'),
  handler: function (direction) {
    if (direction === 'down') {
      document
        .querySelector('.header__bar-container')
        .classList.add('header__bar-container--sticky');
      // document.querySelector('.btn-nav').classList.add('btn-nav--sticky');
    } else if (direction === 'up') {
      document
        .querySelector('.header__bar-container')
        .classList.remove('header__bar-container--sticky');
      // document.querySelector('.btn-nav').classList.remove('btn-nav--sticky');
    }
  },
  offset: -300,
});

// document.querySelector('.macro-btn').addEventListener('click', (e) => {
//   document.querySelector('.card').classList.add('card--animate');
// });

// document.querySelector('.card__delete').addEventListener('click', (e) => {
//   document.querySelector('.card').classList.remove('card--animate');
// });

///////////////////////////////////////////////////////
// CARD RELATED EVENTS
//////////////////////////////////////////////////////

// childElementCount
Array.from(document.getElementsByClassName('macro-btn')).forEach((el, ind) => {
  el.addEventListener('click', (e) => {
    // const element = e.target.parentNode.parentNode.parentNode;
    const element = document.getElementById(`${ind + 1}`);
    console.dir(element);

    element.classList.add('card--animate');
  });
});

Array.from(document.getElementsByClassName('card__delete')).forEach(
  (el, ind) => {
    el.addEventListener('click', (e) => {
      // const element = e.target.parentNode.parentNode;
      const element = document.getElementById(`${ind + 1}`);
      console.dir(element);

      element.classList.remove('card--animate');
    });
  }
);

///////////////////////////////////////////////////////
// FORM RELATED EVENTS
//////////////////////////////////////////////////////

const originalLink = document.getElementById('original-link');
const name = document.getElementById('name');

if (originalLink) originalLink.addEventListener('change', validateChange);

if (name) name.addEventListener('change', validateChange);

Array.from(document.querySelectorAll('.upload__add-button')).forEach((el) => {
  if (!el.isEventListenerSet) {
    el.isEventListenerSet = true;
    el.addEventListener('click', addInput);
  }
});

Array.from(document.querySelectorAll('.upload__delete-button')).forEach(
  (el) => {
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      el.addEventListener('click', removeInput);
    }
  }
);

const addIngredients = document.querySelector('.upload__add-ingredients');

if (addIngredients) addIngredients.addEventListener('click', addIngredientsBox);

const removeIngredients = document.querySelector('.upload__delete-ingredients');

if (removeIngredients)
  removeIngredients.addEventListener('click', removeIngredientsBox);

const formEle = document.querySelector('.form-upload');

if (formEle) {
  formEle.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(formEle);
    const formEnteriesArr = Array.from(formData.entries());

    console.dir(formEle);

    // part 1: Constructing and getting the nutri-info
    let nutrientProfileArr = [];
    let ingredientsArr = [];
    let unitsArr = [];
    let quantityArr = [];

    formEnteriesArr.forEach((el) => {
      if (el[0].includes('nutrientProfile')) nutrientProfileArr.push(el);
      else if (el[0].includes('ingredient')) ingredientsArr.push(el);
      else if (el[0].includes('quantity')) quantityArr.push(el);
      else if (el[0].includes('select-unit')) unitsArr.push(el);
    });

    const ingredientsList = [];

    ingredientsArr.forEach((el, ind) => {
      const nutrientProfile = JSON.parse(nutrientProfileArr[ind][1].toString());

      ingredientsList.push({
        name: ingredientsArr[ind][1],
        quantity: quantityArr[ind][1],
        unit: unitsArr[ind][1],
        nutrientProfile,
      });
    });

    console.log(ingredientsList);

    const nutriInfoObj = {
      ingredientsList,
    };

    const response = await Axios({
      method: 'post',
      url: `http://127.0.0.1:3000/api/v0/recipes/get-nutri-info`,
      data: nutriInfoObj,
    });

    console.log(response);

    //  part 2:  actually posting the recipe
    const recipeObj = {};
    recipeObj.ingredients = [];
    recipeObj.healthBenefits = [];
    recipeObj.instructions = [];
    recipeObj.tags = [];

    recipeObj.nutrientProfile = response.data.data.nutriProfile;

    ingredientsList.forEach((el) => {
      delete el.nutrientProfile;
      recipeObj.ingredients.push(el);
    });

    formEnteriesArr.forEach((el) => {
      if (el[0].includes('name')) recipeObj.name = el[1];
      else if (el[0].includes('time'))
        recipeObj.cookingTime = parseInt(el[1], 10);
      else if (el[0].includes('servings'))
        recipeObj.servings = parseInt(el[1], 10);
      else if (el[0].includes('description')) recipeObj.description = el[1];
      else if (el[0].includes('instruction'))
        recipeObj.instructions.push(el[1]);
      else if (el[0].includes('health')) recipeObj.healthBenefits.push(el[1]);
      else if (el[0].includes('photo')) recipeObj.imageCover = el[1];
      else if (el[0].includes('select-el')) recipeObj.cuisine = el[1];
      else if (el[0].includes('tag')) recipeObj.tags.push(el[1]);
      else if (el[0].includes('category')) recipeObj.category = el[1];
      else if (el[0].includes('linkToOriginal'))
        recipeObj.linkToOriginal = el[1];
    });

    console.log(recipeObj);

    const recipeResponse = await Axios({
      method: 'post',
      url: `http://127.0.0.1:3000/api/v0/recipes`,
      data: recipeObj,
    });

    console.log(recipeResponse);
  });
}

///////////////////////////////////////////////////////
// NUTRI POPUP
//////////////////////////////////////////////////////

// set nutri listeners
setNutriListeners();

///////////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////////

if (signin) {
  signin.addEventListener('click', (e) => {
    e.preventDefault();

    // get the email & password
    const email = document.getElementById('email-1').value;
    const password = document.getElementById('password-1').value;

    // authenticate
    loginFunc([email, password]);
  });
}

if (signup) {
  signup.addEventListener('click', (e) => {
    e.preventDefault();

    // get the email & password
    const email = document.getElementById('email-2').value;
    const password = document.getElementById('password-2').value;
    const name = document.getElementById('name-2').value;
    const confirmPassword = document.getElementById('confirm-password-2').value;

    // authenticate
    signinFunc([name, email, password, confirmPassword]);
  });
}
