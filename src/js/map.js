ymaps.ready(init);
var myMap;
var geoObjects = [];
var clusterer;

let isBaloon = true; // флаг для открытия баллуна плейсмарка или кластера

let storage = localStorage;

let currentPlace; //определяет координаты по нажатию на плейсмарк
let idS; //берет ID нажатых кластера/плейсмарка

const currentPlacemark = {
    address: '',
    cords: [],
    text: 'Отзывов пока нет...',
    name: '',
    place: ''
};
const allPlacemarks = JSON.parse(storage.data || '[]');

function init() {
    myMap = new ymaps.Map("map", {
        center: [59.929159198358875, 30.299870112622873],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['default', 'scrollZoom']
    });

    //    клик по карте, открытие модалки
    myMap.events.add('click', function (e) {
        let address;
        let coords = e.get('coords');

        currentPlacemark.cords = coords;
        currentPlace = '';
        isBaloon = true;

        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            address = firstGeoObject.getAddressLine();
            return address;
        }).then(function (data) {
            currentPlacemark.address = data;
            baloonrewiew(coords);
        })
    });

    //создание балуна-отзывов   
    function baloonrewiew(coords) {
        const MyBalloonLayout = ymaps.templateLayoutFactory.createClass(`  
        <div class="modal">
            <div class="modal__header">  
                <h3 class="modal__title"> </h3> 
                <button class="modal__close" type="button"></button>
            </div> 
            <div class="modal__reviews">
                Отзывов пока нет...
            </div> 
            <div class="modal__form form">
                <h3 class="form__title">ВАШ ОТЗЫВ</h3>
                <input type="text" class="form__input" id="name"placeholder="Ваше имя">
                <input type="text" class="form__input" id="place" placeholder="Укажите место">
                <textarea class="form__input form__input--ta" id="text" placeholder="Поделитесь впечатлениями"></textarea>
                <button class="form__btn">Add</button>
            </div>  
        </div>`)

        if (!myMap.balloon.isOpen()) {
            myMap.balloon.open(coords, {}, {
                balloonContentHeader: "",
                contentLayout: MyBalloonLayout,
                closeButton: false
            });
        } else {
            myMap.balloon.close();
        }
    }

    //кластер
    function createCluster() {
        Data = new Date();
        Day = Data.getDate();
        Month = Data.getMonth();
        Year = Data.getFullYear();

        const customItemClusterContent = ymaps.templateLayoutFactory.createClass(
            `<div class="modal-cluster"> 
            <h2 class="cluster_header"> {{ properties.balloonContentHeader|raw }} </h2>
            <a class="cluster_link" href="#"> {{ properties.balloonContentAddress|raw }} </a>
            <div class="cluster_review"> {{ properties.balloonContentBody|raw }}</div>
            <div class="cluster_date"> {{ properties.balloonContentFooter|raw }} </div>
           </div>`
        );

        clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: customItemClusterContent
        });
        
        for (let i = 0; i < allPlacemarks.length; i++) {
            geoObjects[i] = new ymaps.Placemark(allPlacemarks[i].cords, {
                balloonContentHeader: allPlacemarks[i].place,
                balloonContentAddress: allPlacemarks[i].address,
                balloonContentBody: allPlacemarks[i].text,
                balloonContentFooter: `${Day}.${Month}.${Year}`,
            }, {
                hasBalloon: false,
                iconLayout: 'default#image',
                iconImageHref: './img/placemark-active.png',
                iconImageSize: [24, 36],
                draggable: false,
            });
        }

        myMap.geoObjects.add(clusterer);
        clusterer.add(geoObjects);
    }
    createCluster();

    //клик по геообъектам
    myMap.geoObjects.events.add('click', function (e) {
        isBaloon = false;
        currentPlace = e.get('coords');
        currentPlacemark.cords = currentPlace;
        
        // Получим данные о состоянии объекта внутри кластера.
        const geoObjectState = clusterer.getObjectState(e.get('target'));
       // Проверяем, находится ли объект в видимой области карты.
        if (geoObjectState.isShown) {
            // Если объект попадает в кластер, открываем балун кластера с нужным выбранным объектом.
            if (!geoObjectState.isClustered) {
                isBaloon = true;
                myMap.balloon.close();
                baloonrewiew(currentPlace);
                idS = e.get('target');

            }
            //???почему не срабатывает else

        }
        if (!isBaloon) {
            idS = (e.get('target')).getGeoObjects();
        }
    });
    
    //клик по баллуну  
    myMap.balloon.events.add('open', function (e) {
        Data = new Date();
        Day = Data.getDate();
        Month = Data.getMonth();
        Year = Data.getFullYear();
        
        for (let i = 0; i < allPlacemarks.length; i++) {
            geoObjects[i].id = allPlacemarks[i].id;
            }
        //каcтомизируем лейаут баллуна (для сохраения автопэна)
        if (isBaloon) {
            (function baloonStyle() {
                const modalLayout = document.querySelector('.modal');
                const modalParent = modalLayout.parentNode.parentNode;

                modalParent.style.width = '100%';
                modalParent.style.height = '100%';
                modalParent.style.overflow = 'visible';
                modalParent.parentNode.style.padding = 0;
                modalParent.parentNode.style.background = 'transparent';
                modalParent.parentNode.parentNode.style.background = 'transparent';
                modalParent.parentNode.parentNode.parentNode.style.boxShadow = 'none';
                modalParent.parentNode.parentNode.nextSibling.style.display = 'none';
            })();
            
            //элементы баллуна плейсмарка
            const btnClose = document.querySelector('.modal__close');
            const modalTitle = document.querySelector('.modal__title')
            const inputName = document.querySelector('#name');
            const inputPlace = document.querySelector('#place');
            const inputText = document.querySelector('#text');
            const btnAdd = document.querySelector('.form__btn');
            const reviews = document.querySelector('.modal__reviews');
            const reviewBlock = document.createElement('div');

            //сбрасываем содержимое и заполняем нужным
            modalTitle.textContent = currentPlacemark.address;
            reviews.innerHTML = '';
            reviews.textContent = 'Отзывов пока нет';

            if (currentPlace) {
            
                    
                if (idS.length > 0) {
                    for (id of idS) {
                        for (let i = 0; i < allPlacemarks.length; i++) {
                            if (id.id == allPlacemarks[i].id) {
                                reviews.textContent = '';
                                createBlockReview(allPlacemarks[i].name, allPlacemarks[i].place, allPlacemarks[i].text);
                                modalTitle.textContent = allPlacemarks[i].address;
                            }
                        }
                    }
                } else {
                    for (let i = 0; i < allPlacemarks.length; i++) {
                        if (idS.id == allPlacemarks[i].id) {
                            reviews.textContent = '';
                            createBlockReview(allPlacemarks[i].name, allPlacemarks[i].place, allPlacemarks[i].text);
                            modalTitle.textContent = allPlacemarks[i].address;
                        }
                    }
                }

            }

            function createBlockReview(name, place, text) {

                const reviewName = document.createElement('span');
                const reviewPlace = document.createElement('span');
                const reviewText = document.createElement('p');
                const reviewDate = document.createElement('span');

                reviewBlock.classList.add('modal__review-block');
                reviewName.classList.add('modal__review-title');
                reviewPlace.classList.add('modal__review-place');
                reviewDate.classList.add('modal__review-date');
                reviewText.classList.add('modal__review-text');

                reviewDate.textContent = `${Day}.${Month}.${Year}`;
                reviewName.textContent = name;
                reviewPlace.textContent = place;
                reviewText.textContent = text;

                reviewBlock.appendChild(reviewName);
                reviewBlock.appendChild(reviewPlace);
                reviewBlock.appendChild(reviewDate);
                reviewBlock.appendChild(reviewText);
                reviews.appendChild(reviewBlock);
            }


            btnClose.addEventListener('click', function () {
                myMap.balloon.close();
            })


            btnAdd.addEventListener('click', function () {

                myMap.geoObjects.remove(clusterer);
                reviews.textContent = '';

                createBlockReview(inputName.value, inputPlace.value, inputText.value);

                currentPlacemark.name = inputName.value;
                currentPlacemark.place = inputPlace.value;
                currentPlacemark.text = inputText.value;
                currentPlacemark.id = Math.random().toString(36).substr(2, 9);
                
                const clone = {}; // новый пустой объект
                // копируем в него все свойства currentPlacemark
                for (let key in currentPlacemark) {
                    clone[key] = currentPlacemark[key];
                }

                allPlacemarks.push(clone);

                createCluster();

                for (let i = 0; i < allPlacemarks.length; i++) {
                    geoObjects[i].id = allPlacemarks[i].id;
                }
                
                inputName.value = '';
                inputPlace.value = '';
                inputText.value = '';

                storage.data = JSON.stringify(allPlacemarks);
//              storage.data = ''; //разкомментить. чтобы очистить локалсторадж
            });
        }

        if (!isBaloon) {

            const clusterLink = document.querySelector('.cluster_link')

            document.addEventListener('click', function (e) {
                if (e.target.tagName == "A") {
                    myMap.balloon.close();
                    baloonrewiew(currentPlace);
                    isBaloon = true;
                }
            });
        }
    });
}

