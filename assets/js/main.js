// User settings
const windowWidth               = document.documentElement.offsetWidth;
const mobileModActiveWidth      = 520;
const mobile_mod                = windowWidth < mobileModActiveWidth;
const activeSceneImageScale     = 3.5; // CSS property transform: scale()
const sceneSlideOffsetDuration  = 1500; // ms
const slideSwipeSensibility     = (mobile_mod) ? 0.2 : 0.1;
const sceneActiveSlideWidth     = (mobile_mod) ? 95 : 70; // vw (vw = % of screen width)


const scene             = document.querySelector('.anim-carousel');
const sceneCarousel     = new Swiper('.scene-carousel', {
  speed: 300,   // Animation speed
  centeredSlides: true,
  slideToClickedSlide: true,
  slidesPerView: 2.5,
  breakpoints: {
    520: {
      slidesPerView:5,
    },
  },
  mousewheel: {
    forceToAxis: true
  },
  // Navigation arrows
  navigation: {
    nextEl: '.scene-nav__button-next',
    prevEl: '.scene-nav__button-prev'
  },
  // Swiper events
  on: {
    click: function (el) {
      const actSlide = el.clickedSlide;

      let 
        scene_is_active     = scene.classList.contains('_active'),
        swiper_is_anim      = el.animating,
        slide_is_active     = actSlide?.classList?.contains('swiper-slide-active');
      
      if ((!scene_is_active) &&  (!swiper_is_anim) && (slide_is_active)) {
        startScene(el);
      }
    },
  }
});


let description_is_act;
let saveSceneSlideWidth  = sceneCarousel.slides[0].offsetWidth;
let saveSceneTransform   = sceneCarousel.wrapperEl.style.transform;

scene.style.setProperty('--slide-offset-duration', `${sceneSlideOffsetDuration}ms`);



function startScene (swiper, isActive=false) {
  const active_el               = swiper.slides[swiper.activeIndex];
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const exit                    = document.querySelector('#sceneActiveSlideExit');
  const activeSlideDescription  = active_el.querySelector('.hero-description');
  const active_bg_color         = active_el.getAttribute('data-background-color');
  const slidesCount             = swiper.slides.length; 
  const delayIndex              = 200;

  let imageTransitionDelay  = 0;

  
  if (!isActive) {
    saveSceneTransform = swiper.wrapperEl.style.transform;
    scene.classList.add('_active');
    scene.style.setProperty('--scene-active-slide-width', `${sceneActiveSlideWidth}vw`);
    swiper.wrapperEl.style.transitionDuration = '1000ms';
    swiper.allowTouchMove = false;
    swiper.allowSlideNext = false;
    swiper.allowSlidePrev = false;
    if (mobile_mod) {
      description_is_act = false;
      swiper.el.addEventListener('pointerdown', actveSceneTouchStart_m);
    }else {
      swiper.el.addEventListener('pointerdown', actveSceneTouchStart);
    }
  }
  sceneWrapper.style.background = active_bg_color;
  swiper.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';


  for (let i = 0; i < slidesCount; i++) {
    const item            = swiper.slides[i];
    const itemImage       = item.querySelector('.scene-hero__image');
    const itemImagePos    = itemImage.getBoundingClientRect();
    

    if (item.classList.contains('swiper-slide-prev')) {
      imageTransitionDelay = 0;
      item.style.left = `0px`;    

    }else if (item.classList.contains('swiper-slide-active')) {
      imageTransitionDelay = 0;
      item.style.left = `${(windowWidth*((100-sceneActiveSlideWidth)/100)) / 2}px`;

    }else if (item.classList.contains('swiper-slide-next')) {
      imageTransitionDelay = 0;
      item.style.left = `0px`;

    }else {
      if (i > swiper.activeIndex) {
        imageTransitionDelay += delayIndex;
        if (!isActive) item.style.zIndex = -i;
      }
      item.style.left = isActive ? `${-itemImagePos.width}px` : `${-itemImagePos.width*3.5}px`;
    }
    item.style.width = '0px';
    itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
    if (!isActive) itemImage.style.setProperty('--slide-image-transform', `translate3d(0px, 35%, 0px) scale(${activeSceneImageScale})`);
  }


  active_el.addEventListener('transitionend', secondAnimationStep = () => {
    active_el.classList.add('_step-2');
    activeSlideDescription.classList.add('_active');
    if (!isActive) {
      swiper.slides.forEach(item => {
        item.style.position = 'absolute';
      });
    }
    active_el.addEventListener('transitionend', () => {
      exit.style.display = 'block';
    }, {once: true});
  }, {once: true});

  exit.addEventListener('click', () => {
    if (mobile_mod) {
      swiper.el.removeEventListener('pointerdown', actveSceneTouchStart_m);
    }else {
      swiper.el.removeEventListener('pointerdown', actveSceneTouchStart);
    }
    swiper.allowTouchMove = true;
    slideExit(swiper, active_el, delayIndex);
  }, {once: true});


  function actveSceneTouchStart (event) {
    if (scene.classList.contains('_active')) {
      const saveIndex = swiper.activeIndex;
      const active_el = swiper.slides[saveIndex];
      const activeSlideDescription = active_el.querySelector('.hero-description');
      
      let startPoint = event.x;
      active_el.classList.remove('_step-2');
      activeSlideDescription.classList.remove('_active');
      activeSlideDescription.style.removeProperty('left');
      
      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;

      swiper.el.addEventListener('pointermove', actveSceneTouchMove = event => {
        if (Math.abs(startPoint-event.x)/windowWidth > slideSwipeSensibility) {
          if (startPoint-event.x > 0) {
            if (swiper.activeIndex < swiper.slides.length-1) {
              startPoint = event.x;
              scene.style.setProperty('--slide-offset-duration', `500ms`);
              swiper.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)'; 
              swiper.slideNext(0);
              startScene(swiper, true);
            }
          }else {
            if (swiper.activeIndex > 0) {
              startPoint = event.x;
              scene.style.setProperty('--slide-offset-duration', `500ms`);
              swiper.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';
              swiper.slidePrev(0);
              startScene(swiper, true);
            }
          }
        }
      });
      swiper.el.addEventListener('pointerup', actveSceneTouchEnd = event => {
        if (swiper.activeIndex === saveIndex) {
          active_el.classList.add('_step-2');
          activeSlideDescription.classList.add('_active');
        }else {
          if (mobile_mod) {
            description_is_act = false;
            swiper.el.addEventListener('pointerdown', actveSceneTouchStart_m);
          }else {
            swiper.el.addEventListener('pointerdown', actveSceneTouchStart);
          }
        }
        swiper.el.removeEventListener('pointermove', actveSceneTouchMove);
        swiper.allowSlideNext = false;
        swiper.allowSlidePrev = false;
      }, {once: true});
    }
  }


  function actveSceneTouchStart_m (event) {
    if (scene.classList.contains('_active')) {
      if (event.x > windowWidth / 2) {
        if (!description_is_act) { 
          heroDescriptionSwipe(event);
        }else {
          actveSceneTouchStart(event);
        }
      }else {
        if (description_is_act) {
          heroDescriptionSwipe(event);
        }else {   
          actveSceneTouchStart(event);
        }
      }
    }
  }

  function heroDescriptionSwipe (event) {
    const startPoint = event.x;
    const active_el = swiper.slides[swiper.activeIndex];
    const activeSlideDescription = active_el.querySelector('.hero-description');
    const el_leftOffset = activeSlideDescription.getBoundingClientRect().x;

    let endPoint = 0;

    
    activeSlideDescription.style.transitionDuration = '0ms';
    active_el.addEventListener('pointermove', heroDescriptionMove = event => {
      activeSlideDescription.style.left = `${((el_leftOffset-(startPoint-event.x))/windowWidth)*100}%`;
      endPoint = event.x;
    });

    active_el.addEventListener('pointerup', event => {
      activeSlideDescription.style.transitionDuration = '700ms';
      active_el.removeEventListener('pointermove', heroDescriptionMove);
      activeSlideDescription.style.removeProperty('left');
      description_is_act = false; 
      if ((startPoint > endPoint) && (endPoint !== 0)) {
        if ((startPoint-endPoint)/windowWidth > 0.2) {
          activeSlideDescription.style.left = '0px';
          description_is_act = true;
        }
      }
    }, {once:true});
  }
}


function slideExit (swiper, active_el, delayIndex) {
  const activeSlideDescription  = active_el.querySelector('.hero-description');
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const exit                    = document.querySelector('#sceneActiveSlideExit');
  const d_Index                 = delayIndex/10;
  const slidesCount             = swiper.slides.length;
  
  let imageTransitionDelay = slidesCount * d_Index;


  active_el.removeEventListener('transitionend', secondAnimationStep);
  active_el.classList.remove('_step-2');
  activeSlideDescription.classList.remove('_active');
  activeSlideDescription.style.removeProperty('left');

  scene.classList.remove('_active');
  scene.style.setProperty('--slide-offset-duration', `${sceneSlideOffsetDuration}ms`);
  sceneWrapper.style.background = 'unset';
  swiper.wrapperEl.style.transitionDuration = '1000ms';
  swiper.allowTouchMove = true;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;

  exit.style.removeProperty('display');

  for (let i = 0; i < slidesCount; i++) {
    const item          = swiper.slides[i];
    const itemImage     = item.querySelector('.scene-hero__image'); 

    if (item.classList.contains('swiper-slide-active')) {  
      item.style.transitionProperty = 'transform, left';
    }else if ( (!item.classList.contains('swiper-slide-prev')) && (!item.classList.contains('swiper-slide-next')) ){
      imageTransitionDelay -= delayIndex;
    }
    item.style.removeProperty('position');
    item.style.removeProperty('left');
    item.style.width = `${saveSceneSlideWidth}px`;

    itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
  }

  active_el.addEventListener('transitionend', () => {
    swiper.wrapperEl.style.transform = saveSceneTransform;
    swiper.slides.forEach(item => {
      item.style.removeProperty('z-index');
      item.style.removeProperty('--slide-offset');
      item.style.removeProperty('--scene-active-slide-width');
      item.style.removeProperty('transition-property');

      item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-trans-delay');
      item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-transform'); 
    });
  }, {once: true});
}