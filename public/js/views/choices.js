import Choices from 'choices.js';

const cuisineList = [
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
  'Berber',
  'Brazilian',
  'British',
  'Buddhist',
  'Bulgarian',
  'Cajun',
  'Cantonese',
  'Caribbean',
  'Chechen',
  'Chinese',
  'Chinese-Islamic',
  'Circassian',
  'Crimean-Tatar',
  'Cypriot',
  'Czech',
  'Danish',
  'Egyptian',
  'English',
  'Ethiopian',
  'Eritrean',
  'Estonian',
  'French',
  'Filipino',
  'Georgian',
  'German',
  'Goan',
  'Goan-Catholic',
  'Greek',
  'Gujarati',
  'Hyderabad',
  'Indian',
  'Indian-Chinese',
  'Indian-Singaporean',
  'Indonesian',
  'Inuit',
  'Irish',
  'Italian-American',
  'Italian',
  'Jewish',
  'Karnataka',
  'Kazakh',
  'Keralite',
  'Korean',
  'Kurdish',
  'Laotian',
  'Lebanese',
  'Latvian',
  'Lithuanian',
  'Louisiana-Creole',
  'Maharashtrian',
  'Mangalorean',
  'Malay',
  'Malaysian-Chinese',
  'Malaysian-Indian',
  'Mediterranean',
  'Mennonite',
  'Mexican',
  'Mordovian',
  'Mughal',
  'Native-American',
  'Nepalese',
  'New-Mexican',
  'Odia',
  'Parsi',
  'Pashtun',
  'Polish',
  'Pennsylvania-Dutch',
  'Pakistani',
  'Peranakan',
  'Persian',
  'Peruvian',
  'Portuguese',
  'Punjabi',
  'Rajasthani',
  'Romanian',
  'Russian',
  'Sami',
  'Serbian',
  'Sindhi',
  'Slovak',
  'Slovenian',
  'Somali',
  'South-Indian',
  'Soviet',
  'Spanish',
  'Sri-Lankan',
  'Taiwanese',
  'Tatar',
  'Texan',
  'Thai',
  'Turkish',
  'Tamil',
  'Udupi',
  'Ukrainian',
  'Vietnamese',
  'Yamal',
  'Zambian',
  'Zanzibari',
  'others',
];

// choices element
const selectCuisineEle = document.querySelector('#select-el');

// options
const choicesCuisineOptions = {
  choices: [
    {
      value: 'indian',
      label: 'indian',
      selected: true,
      disabled: false,
    },
  ],

  renderChoiceLimit: 3,
  removeItemButton: true,
};

cuisineList.forEach((el) => {
  choicesCuisineOptions.choices.push({
    value: `${el}`,
    label: `${el}`,
  });
});

if (selectCuisineEle) new Choices(selectCuisineEle, choicesCuisineOptions);

export const processSelect = () => {
  const selectUnitArr = Array.from(document.querySelectorAll('.select-unit'));

  const units = [
    'mcg',
    'mg',
    'kg',
    'oz',
    'lb',
    'ml',
    'l',
    'tsp',
    'Tbs',
    'cup',
    'ug',
  ];

  // choices for units
  const choicesUnitOptions = {
    choices: [
      {
        value: 'g',
        label: 'g',
        selected: true,
      },
    ],
    renderChoiceLimit: 3,
    removeItemButton: true,
  };

  units.forEach((el) => {
    choicesUnitOptions.choices.push({
      value: `${el}`,
      label: `${el}`,
    });
  });

  selectUnitArr.forEach((el) => {
    if (!el.isEventListenerSet) {
      el.isEventListenerSet = true;
      new Choices(el, choicesUnitOptions);
    }
  });
};

processSelect();
