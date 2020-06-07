!function(e){var n={};function t(a){if(n[a])return n[a].exports;var r=n[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(a,r,function(n){return e[n]}.bind(null,r));return a},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="build",t(t.s=0)}([function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);\n/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_map_js__WEBPACK_IMPORTED_MODULE_0__);\n\n\n//# sourceURL=webpack:///./src/js/index.js?")},function(module,exports){eval("function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nymaps.ready(init);\n\nfunction init() {\n  var myMap;\n  var clusterer;\n  var geoObjects = [];\n  var isBaloon = true; // флаг для открытия баллуна плейсмарка или кластера\n\n  var storage = localStorage;\n  var currentPlace; // определяет координаты по нажатию на плейсмарк\n\n  var idS; // берет ID нажатых кластера/плейсмарка\n\n  var currentPlacemark = {\n    address: '',\n    cords: [],\n    text: 'Отзывов пока нет...',\n    name: '',\n    place: ''\n  };\n  var allPlacemarks = JSON.parse(storage.data || '[]');\n  myMap = new ymaps.Map('map', {\n    center: [59.929159198358875, 30.299870112622873],\n    zoom: 12,\n    controls: ['zoomControl'],\n    behaviors: ['default', 'scrollZoom']\n  }); //    клик по карте, открытие модалки\n\n  myMap.events.add('click', function (e) {\n    var address;\n    var coords = e.get('coords');\n    currentPlacemark.cords = coords;\n    currentPlace = '';\n    isBaloon = true;\n    ymaps.geocode(coords).then(function (res) {\n      var firstGeoObject = res.geoObjects.get(0);\n      address = firstGeoObject.getAddressLine();\n      return address;\n    }).then(function (data) {\n      currentPlacemark.address = data;\n      baloonrewiew(coords);\n    });\n  }); // создание балуна-отзывов\n\n  function baloonrewiew(coords) {\n    var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(\"  \\n        <div class=\\\"modal\\\">\\n            <div class=\\\"modal__header\\\">  \\n                <h3 class=\\\"modal__title\\\"> </h3> \\n                <button class=\\\"modal__close\\\" type=\\\"button\\\"></button>\\n            </div> \\n            <div class=\\\"modal__reviews\\\">\\n                \\u041E\\u0442\\u0437\\u044B\\u0432\\u043E\\u0432 \\u043F\\u043E\\u043A\\u0430 \\u043D\\u0435\\u0442...\\n            </div> \\n            <div class=\\\"modal__form form\\\">\\n                <h3 class=\\\"form__title\\\">\\u0412\\u0410\\u0428 \\u041E\\u0422\\u0417\\u042B\\u0412</h3>                \\n                <input type=\\\"text\\\" class=\\\"form__input\\\" id=\\\"name\\\"placeholder=\\\"\\u0412\\u0430\\u0448\\u0435 \\u0438\\u043C\\u044F\\\">                \\n                <input type=\\\"text\\\" class=\\\"form__input\\\" id=\\\"place\\\" placeholder=\\\"\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u043C\\u0435\\u0441\\u0442\\u043E\\\">              \\n                <textarea class=\\\"form__input form__input--ta\\\" id=\\\"text\\\" placeholder=\\\"\\u041F\\u043E\\u0434\\u0435\\u043B\\u0438\\u0442\\u0435\\u0441\\u044C \\u0432\\u043F\\u0435\\u0447\\u0430\\u0442\\u043B\\u0435\\u043D\\u0438\\u044F\\u043C\\u0438\\\">\\n                </textarea>               \\n                <button class=\\\"form__btn\\\">Add</button>\\n            </div>  \\n        </div>\");\n\n    if (!myMap.balloon.isOpen()) {\n      myMap.balloon.open(coords, {}, {\n        balloonContentHeader: '',\n        contentLayout: MyBalloonLayout,\n        closeButton: false\n      });\n    } else {\n      myMap.balloon.close();\n    }\n  } // кластер\n\n\n  function createCluster() {\n    var Data = new Date();\n    var Day = Data.getDate();\n    var Month = Data.getMonth();\n    var Year = Data.getFullYear();\n    var customItemClusterContent = ymaps.templateLayoutFactory.createClass(\"<div class=\\\"modal-cluster\\\"> \\n            <h2 class=\\\"cluster_header\\\"> {{ properties.balloonContentHeader|raw }} </h2>\\n            <a class=\\\"cluster_link\\\" href=\\\"#\\\"> {{ properties.balloonContentAddress|raw }} </a>\\n            <div class=\\\"cluster_review\\\"> {{ properties.balloonContentBody|raw }}</div>\\n            <div class=\\\"cluster_date\\\"> {{ properties.balloonContentFooter|raw }} </div>\\n           </div>\");\n    clusterer = new ymaps.Clusterer({\n      clusterDisableClickZoom: true,\n      // Устанавливаем стандартный макет балуна кластера \"Карусель\".\n      clusterBalloonContentLayout: 'cluster#balloonCarousel',\n      clusterBalloonItemContentLayout: customItemClusterContent\n    });\n\n    for (var i = 0; i < allPlacemarks.length; i++) {\n      geoObjects[i] = new ymaps.Placemark(allPlacemarks[i].cords, {\n        balloonContentHeader: allPlacemarks[i].place,\n        balloonContentAddress: allPlacemarks[i].address,\n        balloonContentBody: allPlacemarks[i].text,\n        balloonContentFooter: \"\".concat(Day, \".\").concat(Month, \".\").concat(Year)\n      }, {\n        hasBalloon: false,\n        iconLayout: 'default#image',\n        iconImageHref: './img/placemark-active.png',\n        iconImageSize: [24, 36],\n        draggable: false\n      });\n    }\n\n    myMap.geoObjects.add(clusterer);\n    clusterer.add(geoObjects);\n  }\n\n  createCluster(); // клик по геообъектам\n\n  myMap.geoObjects.events.add('click', function (e) {\n    isBaloon = false;\n    currentPlace = e.get('coords');\n    currentPlacemark.cords = currentPlace; // Получим данные о состоянии объекта внутри кластера.\n\n    var geoObjectState = clusterer.getObjectState(e.get('target')); // Проверяем, находится ли объект в видимой области карты.\n\n    if (geoObjectState.isShown) {\n      // Если объект не попадает в кластер, открываем балун плейсмарка.\n      if (!geoObjectState.isClustered) {\n        isBaloon = true;\n        myMap.balloon.close();\n        baloonrewiew(currentPlace);\n        idS = e.get('target');\n      }\n    }\n\n    if (!isBaloon) {\n      idS = e.get('target').getGeoObjects();\n    }\n  }); // клик по баллуну  \n\n  myMap.balloon.events.add('open', function () {\n    var Data = new Date();\n    var Day = Data.getDate();\n    var Month = Data.getMonth();\n    var Year = Data.getFullYear();\n\n    for (var i = 0; i < allPlacemarks.length; i++) {\n      geoObjects[i].id = allPlacemarks[i].id;\n    } // каcтомизируем лейаут баллуна (для сохраения автопэна)\n\n\n    if (isBaloon) {\n      // eslint-disable-next-line no-inner-declarations\n      var createBlockReview = function createBlockReview(name, place, text) {\n        var reviewName = document.createElement('span');\n        var reviewPlace = document.createElement('span');\n        var reviewText = document.createElement('p');\n        var reviewDate = document.createElement('span');\n        reviewBlock.classList.add('modal__review-block');\n        reviewName.classList.add('modal__review-title');\n        reviewPlace.classList.add('modal__review-place');\n        reviewDate.classList.add('modal__review-date');\n        reviewText.classList.add('modal__review-text');\n        reviewDate.textContent = \"\".concat(Day, \".\").concat(Month, \".\").concat(Year);\n        reviewName.textContent = name;\n        reviewPlace.textContent = place;\n        reviewText.textContent = text;\n        reviewBlock.appendChild(reviewName);\n        reviewBlock.appendChild(reviewPlace);\n        reviewBlock.appendChild(reviewDate);\n        reviewBlock.appendChild(reviewText);\n        reviews.appendChild(reviewBlock);\n      };\n\n      var modalLayout = document.querySelector('.modal');\n\n      (function baloonStyle() {\n        var modalParent = modalLayout.parentNode.parentNode;\n        modalParent.style.width = '100%';\n        modalParent.style.height = '100%';\n        modalParent.style.overflow = 'visible';\n        modalParent.parentNode.style.padding = 0;\n        modalParent.parentNode.style.background = 'transparent';\n        modalParent.parentNode.parentNode.style.background = 'transparent';\n        modalParent.parentNode.parentNode.parentNode.style.boxShadow = 'none';\n        modalParent.parentNode.parentNode.nextSibling.style.display = 'none';\n      })(); // элементы баллуна плейсмарка\n\n\n      var btnClose = document.querySelector('.modal__close');\n      var modalTitle = document.querySelector('.modal__title');\n      var inputName = document.querySelector('#name');\n      var inputPlace = document.querySelector('#place');\n      var inputText = document.querySelector('#text');\n      var btnAdd = document.querySelector('.form__btn');\n      var reviews = document.querySelector('.modal__reviews');\n      var reviewBlock = document.createElement('div'); // сбрасываем содержимое и заполняем нужным\n\n      modalTitle.textContent = currentPlacemark.address;\n      reviews.innerHTML = '';\n      reviews.textContent = 'Отзывов пока нет';\n\n      if (currentPlace) {\n        if (idS.length > 0) {\n          var _iterator = _createForOfIteratorHelper(idS),\n              _step;\n\n          try {\n            for (_iterator.s(); !(_step = _iterator.n()).done;) {\n              var id = _step.value;\n\n              for (var _i = 0; _i < allPlacemarks.length; _i++) {\n                if (id.id == allPlacemarks[_i].id) {\n                  reviews.textContent = '';\n                  createBlockReview(allPlacemarks[_i].name, allPlacemarks[_i].place, allPlacemarks[_i].text);\n                  modalTitle.textContent = allPlacemarks[_i].address;\n                }\n              }\n            }\n          } catch (err) {\n            _iterator.e(err);\n          } finally {\n            _iterator.f();\n          }\n        } else {\n          for (var _i2 = 0; _i2 < allPlacemarks.length; _i2++) {\n            if (idS.id == allPlacemarks[_i2].id) {\n              reviews.textContent = '';\n              createBlockReview(allPlacemarks[_i2].name, allPlacemarks[_i2].place, allPlacemarks[_i2].text);\n              modalTitle.textContent = allPlacemarks[_i2].address;\n            }\n          }\n        }\n      }\n\n      btnClose.addEventListener('click', function () {\n        myMap.balloon.close();\n      });\n      btnAdd.addEventListener('click', function () {\n        if (inputName.value.length >= 3 && inputPlace.value.length >= 3 && inputText.value.length >= 3) {\n          myMap.geoObjects.remove(clusterer);\n          reviews.textContent = '';\n          createBlockReview(inputName.value, inputPlace.value, inputText.value);\n          currentPlacemark.name = inputName.value;\n          currentPlacemark.place = inputPlace.value;\n          currentPlacemark.text = inputText.value;\n          currentPlacemark.id = Math.random().toString(36).substr(2, 9);\n          var clone = {}; // новый пустой объект\n          // копируем в него все свойства currentPlacemark\n          // eslint-disable-next-line guard-for-in\n\n          for (var key in currentPlacemark) {\n            clone[key] = currentPlacemark[key];\n          }\n\n          allPlacemarks.push(clone);\n          createCluster();\n          console.log(inputName.value.length);\n\n          for (var _i3 = 0; _i3 < allPlacemarks.length; _i3++) {\n            geoObjects[_i3].id = allPlacemarks[_i3].id;\n          }\n\n          inputName.value = '';\n          inputPlace.value = '';\n          inputText.value = '';\n          storage.data = JSON.stringify(allPlacemarks); //   storage.data = ''; //разкомментить. чтобы очистить локалсторадж\n        } else {\n          // eslint-disable-next-line no-inner-declarations\n          var validForm = function validForm() {\n            alertBtn.textContent = 'ok';\n            alertError.classList.add('form-error');\n            alertBtn.classList.add('form-error-btn');\n            alertError.textContent = 'Поля должны содержать больше трёх символов';\n            alertError.appendChild(alertBtn);\n            modalLayout.appendChild(alertError);\n          };\n\n          var alertError = document.createElement('div');\n          var alertBtn = document.createElement('button');\n          validForm();\n          alertBtn.addEventListener('click', function () {\n            modalLayout.removeChild(alertError);\n          });\n        }\n      });\n    }\n\n    if (!isBaloon) {\n      document.addEventListener('click', function (e) {\n        if (e.target.tagName == 'A') {\n          myMap.balloon.close();\n          baloonrewiew(currentPlace);\n          isBaloon = true;\n        }\n      });\n    }\n  });\n}\n\n//# sourceURL=webpack:///./src/js/map.js?")}]);