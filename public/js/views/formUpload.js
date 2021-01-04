import { setNutriListeners } from '../controllers/setNutriListeners';
import { getTenNutriProfile } from '../models/getNutritionInfo';
import { processNutriProfile } from '../models/processNutriData';
import ClientError from '../utils/ClientError';
import { setInitialValues } from '../utils/setInitialValues';
import { processSelect } from './choices';
import { removeLoader, renderLoader } from './renderLoader';
import { renderNutriPop, renderEntireView } from './renderNutriPop';

const removeElementWithAnimation = (eleName, className) => {
  const ele = document.querySelector(eleName);

  ele.classList.add(className);

  setTimeout(() => {
    ele.remove();
  }, 500);
};

const setEntireViewEventListener = (data) => {
  // set the entire view eventhandler
  document.querySelectorAll('.nutriprofile__btn-view').forEach((el, ind) => {
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      el.addEventListener('click', (e) => {
        const selectData = data[ind];
        renderEntireView(selectData);

        document.querySelector('.nutriprofile__notes').style.display = 'none';
        document.querySelector('.nutriprofile__inner-box').style.display =
          'none';

        document.querySelector('.btn-back').addEventListener('click', (e) => {
          removeElementWithAnimation(
            '.nutriprofile__entire-view',
            'animate--out'
          );

          document.querySelector('.nutriprofile__notes').style.display =
            'block';
          document.querySelector('.nutriprofile__inner-box').style.display =
            'block';
        });
      });
    }
  });
};

const setSelectEventListener = (data) => {
  // set the entire view eventhandler
  document.querySelectorAll('.nutriprofile__btn-select').forEach((el, ind) => {
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      el.addEventListener('click', (e) => {
        const number = document.querySelector('.nutriprofile').dataset.for;
        const ele = document.getElementById(`upload__hidden-${number}`);

        // change the icon
        document
          .getElementById(`checkbox-${number}`)
          .setAttribute('xlink:href', `img/sprite.svg#icon-checkmark`);

        // set the value
        const stringData = JSON.stringify(data[ind]);
        ele.value = stringData;

        // close the nutriprofile
        removeElementWithAnimation('.nutriprofile', 'nutriprofile--animate');
      });
    }
  });
};

const checkIfUrlValid = (url) => {
  const anchor = document.createElement('a');
  anchor.href = url;

  console.dir(anchor);
  if (
    anchor.protocol &&
    anchor.hostname &&
    anchor.hostname !== window.location.hostname
  ) {
    return true;
  }

  return false;
};

export const validateChange = (e) => {
  const element = e.target;
  const value = element.value.trim();
  console.log(element.id, value);

  // TOGGLE DISABLE
  if (value) {
    document
      .getElementById(element.id === 'original-link' ? 'name' : 'original-link')
      .setAttribute('disabled', true);

    document
      .getElementById(element.id === 'original-link' ? 'original-link' : 'name')
      .setAttribute('required', true);
  } else {
    document
      .getElementById(element.id === 'original-link' ? 'name' : 'original-link')
      .removeAttribute('disabled');

    document.getElementById('original-link').removeAttribute('required');
  }

  // CHECK IF URL IS VALID
  if (element.id === 'original-link' && !checkIfUrlValid(value)) {
    new ClientError('Please provide a valid url').addErrorMessage();
  }
};

// for adding inputs
export const addInput = (e) => {
  e.preventDefault();

  const element = document.querySelector(
    `.upload__inner-${e.target.dataset.for}`
  );

  let html = `
  <input type="text" name="${e.target.dataset.for}-${
    element.children.length + 1
  }" />
  `;

  element.insertAdjacentHTML('beforeend', html);
};

// for removing inputs
export const removeInput = (e) => {
  e.preventDefault();

  const element = document.querySelector(
    `.upload__inner-${e.target.dataset.for}`
  );

  if (element.children.length > 1)
    document
      .querySelector(
        `input[name=${e.target.dataset.for}-${element.children.length}]`
      )
      .remove();
};

export const addIngredientsBox = (e) => {
  e.preventDefault();
  const element = document.querySelector('.upload__ingredients-box');

  const number = element.children.length - 1;

  let html = `
    <div class="upload__inner-ingredients upload__inner-ingredients--${number}">
          <label for="ingredient-${number}" class="upload__label">ingredient-${number}</label>
          <input type="text" name="ingredient-${number}" id="ingredient-${number}" required />
          <label for="quantity-${number}" class="upload__label">quantity-${number}</label>
          <input type="text" name="quantity-${number}" id="quantity-${number}" required />
          <select name="select-unit-${number}" class="select-unit"></select>
          <div class="upload__checkbox">
            <svg style="height: 4.5rem; width: 4.5rem; display: block">
              <use id="checkbox-${number}" xlink:href="img/sprite.svg#icon-spinner10"></use>
            </svg>
          </div>
         
          <input type="text" id="upload__hidden-${number}" name="nutrientProfile-${number}" hidden required/>
          <button data-for="${number}" class="upload__get-nutri">
            Get nutritional info
          </button>
        </div>
    `;

  e.target.insertAdjacentHTML('beforebegin', html);

  // initialize values
  setInitialValues();

  // to process the select element
  processSelect();

  // to add listeners
  setNutriListeners();
};

export const removeIngredientsBox = (e) => {
  e.preventDefault();
  const element = document.querySelector('.upload__ingredients-box');

  const number = element.children.length - 2;

  if (element.children.length > 3)
    document.querySelector(`.upload__inner-ingredients--${number}`).remove();
};

////////////////////////////////////////////////////////////////////////////////
// get and set NUTRI
////////////////////////////////////////////////////////////////////////////////

export const getNutri = async (e, forData) => {
  // check if already present
  if (document.querySelector('.nutriprofile')) return;

  // render loader
  renderLoader();

  const number = e.target.dataset.for;

  // get the ingredient name
  const input = document.getElementById(`ingredient-${number}`);
  const value = input.value;

  // retrieve ten nutrien values
  const data = await getTenNutriProfile(value);

  // process the data
  const newData = processNutriProfile(data);

  // remove loader
  removeLoader();

  //render the data
  renderNutriPop(newData, forData);

  // add the delete eventlistener
  document.querySelector('.btn-nutri').addEventListener('click', (e) => {
    removeElementWithAnimation('.nutriprofile', 'nutriprofile--animate');
  });

  // set entire view handlers
  setEntireViewEventListener(newData);

  // enter the selected nutriprofile into the hidden input
  setSelectEventListener(data);
};

export const setNutri = (e) => {
  e.preventDefault();
};
