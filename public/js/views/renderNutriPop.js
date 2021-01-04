import { setInitialValues } from '../utils/setInitialValues';

const renderMacros = (macroObj) => {
  return `
	<div class="nutriprofile__macros">
		<h5 class="heading-5">${macroObj.nutrientName}</h5>
		<span>${macroObj.value} ${macroObj.unitName}</span>
	</div>
	`;
};

const renderMicros = (macroObj) => {
  return `<div class="nutriprofile__micros">
        <h5 class="heading-5">${macroObj.nutrientName}</h5>
        <span>${macroObj.value} ${macroObj.unitName}</span>
	  </div>`;
};

const renderNutriCard = (nutriObj) => {
  return `
	<div class="nutriprofile__card">
		<h4 class="nutriprofile__desc">${nutriObj.description}</h4>
		<p class="paragraph">${nutriObj.ingredients}</p>
		<div class="nutriprofile__macros-box">
		${nutriObj.processedData.macros.map((el) => renderMacros(el)).join(' ')}
		</div>
		<button class="btn nutriprofile__btn nutriprofile__btn-view">
			view entire nutrients
		</button>
		<button class="btn nutriprofile__btn nutriprofile__btn-select">
			select
		</button>
	</div>
	`;
};

export const renderNutriPop = (data, forData) => {
  let html = `
	<div class="nutriprofile" data-for="${forData}">
	  <button class="btn btn__delete btn-nutri">&times;</button>

	  <!-- instructions -->
	  <ul class="nutriprofile__notes">
		<li>
		  check if the nutriprofile is raw or enriched with vitamins -- because
		  this may inflate the nutrition
		</li>
		<li>
		  if not getting the accurate food nutriprofile then try different
		  combination of words as food,raw or food,unbranded, etc
		</li>
		<li>all the measurements are calculated per 100g basis</li>
		<li>
		  some food may not be available in the USDA api and so you have to
		  input data on your own
		</li>
	  </ul>

	  <div class="nutriprofile__inner-box">
	  	${data.map((el) => renderNutriCard(el)).join(' ')}
	  </div>
	</div>
	`;

  document.querySelector('body').insertAdjacentHTML('beforeend', html);
};

export const renderEntireView = (data) => {
  let html = `
	<div class="nutriprofile__entire-view">
	  <button class="btn btn__delete btn-back">&larr;</button>
	  <h4 class="nutriprofile__desc">${data.description}</h4>
  
	  <p class="paragraph">${data.ingredients}</p>
  
	  <div class="nutriprofile__macros-box">
	  ${data.processedData.macros.map((el) => renderMacros(el)).join(' ')}
	  </div>
  
	  <div class="nutriprofile__micros-box">
	  ${data.processedData.micros.map((el) => renderMicros(el)).join(' ')}
	  </div>
	</div>
	`;

  document.querySelector('.nutriprofile').insertAdjacentHTML('beforeend', html);
};
