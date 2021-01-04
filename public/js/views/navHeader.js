import getList from '../models/getList';

let cuisineList = [
  'Ainu',
  'Albanian',
  'Argentine',
  'Andhra',
  'American',
  'Anglo-Indian',
  'Arab',
  'Armenian',
  'Assyrian',
  'Awadhi',
  'Azerbaijani',
  'Balochi',
  'Belarusian',
  'Bangladeshi',
  'Bengali',
];

const categoryList = ['sweet', 'savoury', 'not-specified', 'others'];

const tagList = [
  'vegan',
  'gluten-free',
  'nuts-free',
  'sugar-free',
  'low-glycemic-index',
  'vegetarian',
  'non-vegetarian',
  'eggitarian',
  'sea-food',
  'diary-free',
  'lactose-free',
  'organic',
];

const allListObj = { categoryList, tagList, cuisineList };

getList().then((data) => {
  cuisineList = data;
  allListObj.cuisineList = cuisineList;
});

const constructNavList = (listArr, type) => {
  let html = `
      <ul class="nav__list nav__list-${type}">
                ${concatListElements(
                  listArr.map((el) => `<li><a href="#">${el}</a></li>`)
                )}
              </ul>
      `;

  return html;
};

const concatListElements = (listArr) => {
  let html = '';
  listArr.forEach((el) => (html += el));
  return html;
};

export const renderNavHeader = (ele) => {
  let html = `
    <nav class="nav">
        <button class="btn btn__delete nav__delete">&times;</button>
        <ul class="nav__list nav__list-main">
          <li>
            <span class="nav__head">cuisines</span>
            ${rendrList('cuisineList')}
          </li>
          <li>
            <span class="nav__head">tags</span>
            ${rendrList('tagList')}
          </li>
          <li>
            <span class="nav__head">category</span>
            ${rendrList('categoryList')}
          </li>
        </ul>
      </nav>
    `;

  ele.insertAdjacentHTML('beforeend', html);
};

const rendrList = (type, page = 0, limit = 7) => {
  let list;

  if (!Object.keys(allListObj).find((el) => el === type))
    return new Error('no list provided');

  list = allListObj[type];

  let li_list, btn_element;

  if (list.length <= limit) {
    li_list = constructNavList(list, type);
    btn_element = '';
  } else {
    //pagination process
    page = parseInt(page, 10);

    const start = page * limit;
    const end = (page + 1) * 7;

    const lastPage = Math.ceil(list.length / limit) - 1;
    console.log(page, start, end, lastPage);
    list = list.slice(start, end);
    console.log(list);

    //get the constructed li list
    li_list = constructNavList(list, type);

    //construct the buttons
    btn_element = constructBtn(page, lastPage, type);
  }

  return li_list + btn_element;
};

const constructBtn = (page, lastPage, type) => {
  let html;

  if (page === 0) {
    html = `
      <div class="nav__btn-container">
        <button class="btn btn-list" data-type="${type}" data-next-page="${
      page + 1
    }" > Next </button>
      </div>
    `;
  } else if (page > 0 && page < lastPage) {
    html = `
    <div class="nav__btn-container">
      <button class="btn btn-list"  data-type="${type}" data-prev-page="${
      page - 1
    }"> Prev </button>
    <button class="btn btn-list" data-type="${type}" data-next-page="${
      page + 1
    }"> Next </button>
    </div>
  `;
  } else if (page === lastPage) {
    html = `
    <div class="nav__btn-container">
    <button class="btn btn-list" data-type="${type}" data-prev-page="${
      page - 1
    }"> Prev </button>
    </div>
    `;
  }

  return html;
};

export const renderInnerList = (page, type, element) => {
  const heading = type.replace('List', '');
  console.log(heading);
  let html = `<span class="nav__head">${heading}s</span>`;

  html += rendrList(type, page);

  element.innerHTML = '';
  element.insertAdjacentHTML('afterbegin', html);
};

// const paginate = (list, page = 0, limit = 7) => {
//   //check if the array has more than the number of items required
//   if (list.length <= limit) {
//     return {
//       list,
//       page,
//       lastPage: 0,
//       isPaginate: false,
//     };
//   }

//   //pagination process
//   const start = page * limit;
//   const end = (page + 1) * 7;

//   const curList = list.slice(start, end);
//   const lastPage = Math.round(list.length / limit);

//   return {
//     list: curList,
//     page,
//     lastPage,
//     isPaginate: true,
//   };
// };

// const constructList = () => {};
