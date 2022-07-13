// User settings
const activeSceneImageScale = 3.5; // CSS property transform: scale()
const sceneActiveSlideWidth = 70; // vw (vw = % of screen width)
const sceneSlideOffsetDuration = 2000; // ms


const scene             = document.querySelector('.anim-carousel');
const sceneCarousel     = new Swiper('.scene-carousel', {
  slidesPerView: 5,
  speed: 300,   // Animation speed
  centeredSlides: true,
  slideToClickedSlide: true,
  mousewheel: {
    forceToAxis: true
  },
  // Navigation arrows
  navigation: {
    nextEl: '.scene-nav__button-next',
    prevEl: '.scene-nav__button-prev'
  },
  on: {
    click: function (el) {
      const actSlide = el.clickedSlide;

      let 
        scene_is_active     = scene.classList.contains('_active'),
        swiper_is_anim      = el.animating,
        slide_is_active     = actSlide.classList.contains('swiper-slide-active');
      
      if ((!scene_is_active) &&  (!swiper_is_anim) && (slide_is_active)) {
        startScene(actSlide);
      }
    },
  }
});


scene.style.setProperty('--slide-offset-duration', `${sceneSlideOffsetDuration}ms`);


function startScene (active_el, isActive=false) {
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const exit                    = document.querySelector('#sceneActiveSlideExit');
  const activeSlideDescription  = active_el.querySelector('.hero-description');
  const active_bg_color         = active_el.getAttribute('data-background-color');
  const saveSlideWidth          = active_el.style.width;
  const saveTransform           = sceneCarousel.wrapperEl.style.transform;
  const slidesCount             = sceneCarousel.slides.length;

  
  if (!isActive) {
    scene.classList.add('_active');
    sceneCarousel.wrapperEl.style.transitionDuration = '2000ms';
    scene.style.setProperty('--scene-active-slide-width', `${sceneActiveSlideWidth}vw`);
    sceneCarousel.el.style.setProperty('--image-scale', activeSceneImageScale);
  } 
  sceneWrapper.style.background = active_bg_color;
  sceneCarousel.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';


  let imageTransitionDelay = 0;
  let delayIndex = 200;
  for (let i = 0; i < slidesCount; i++) {
    const item            = sceneCarousel.slides[i];
    const itemImage       = item.querySelector('.scene-hero__image');
    const itemImagePos    = itemImage.getBoundingClientRect();
    const windowWidth     = document.documentElement.offsetWidth;

    if (item.classList.contains('swiper-slide-prev')) {
      imageTransitionDelay = 0;
      item.style.left = `0px`;
      itemImage.classList.add('_active');
    }else if (item.classList.contains('swiper-slide-active')) {
      imageTransitionDelay = 0;
      item.style.left = `${(windowWidth*0.3) / 2}px`;

    }else if (item.classList.contains('swiper-slide-next')) {
      imageTransitionDelay = 0;
      item.style.left = `0px`;
      itemImage.classList.add('_active');
    }else {
      if (i > sceneCarousel.activeIndex) {
        imageTransitionDelay += delayIndex;
      }
      if (!isActive) {
        item.style.left = `${-itemImagePos.width*3.5}px`;
        if (i > sceneCarousel.activeIndex) {
          item.style.zIndex = -i;
        }
      }else {
        item.style.left = `${-itemImagePos.width}px`;
      }
    }
    item.style.width = '0px';
    itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
    if (!isActive) itemImage.style.setProperty('--slide-image-transform', `translate3d(0px, 35%, 0px) scale(${activeSceneImageScale})`);
  }

  active_el.addEventListener('transitionend', secondAnimationStep = () => {
    active_el.classList.add('_step-2');
    activeSlideDescription.classList.add('_active');

    if (!isActive) {
      sceneCarousel.slides.forEach(item => {
        item.style.position = 'absolute';
      });
    }
  }, {once:true});

  exit.addEventListener('click', () => {
    slideExit(active_el, saveSlideWidth, saveTransform, delayIndex);
  }, {once:true});


  sceneCarousel.once('touchStart', actveSceneTouchStart = (swiper, event) => {
    if (scene.classList.contains('_active')) {
      let startPoint = event.x;
      
      swiper.allowTouchMove = false;

      sceneCarousel.el.addEventListener('pointermove', actveSceneMove = event => {
        if (Math.abs(startPoint-event.x) > parseInt(saveSlideWidth)) {
          if (startPoint-event.x > 0) {
            swiper.slideNext(0);
          }else {
            swiper.slidePrev(0);
          }
          scene.style.setProperty('--slide-offset-duration', `200ms`);
          startPoint = event.x;
          swiper.setTranslate(0);
          startScene(swiper.slides[swiper.activeIndex], true);
        }
      });

      sceneCarousel.el.addEventListener('pointerup', event => {
        console.log('success!');
        sceneCarousel.el.removeEventListener('pointermove', actveSceneMove);
      });

    }
  });
}

      // active_el.classList.remove('_step-2');
      // activeSlideDescription.classList.remove('_active');

      // const activeSlide = swiper.slides[swiper.activeIndex];
      // startScene(activeSlide);


function slideExit (active_el, s_width, s_transform, delayIndex) {
  const activeSlideDescription  = active_el.querySelector('.hero-description');
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const d_Index                 = delayIndex/10;
  const slidesCount             = sceneCarousel.slides.length;
  
  let imageTransitionDelay = slidesCount * d_Index;

  active_el.removeEventListener('transitionend', secondAnimationStep);
  active_el.classList.remove('_step-2');
  activeSlideDescription.classList.remove('_active');

  scene.classList.remove('_active');
  sceneWrapper.style.background = 'unset';

  for (let i = 0; i < slidesCount; i++) {
    const item          = sceneCarousel.slides[i];
    const itemImage     = item.querySelector('.scene-hero__image'); 

    if (item.classList.contains('swiper-slide-active')) {  
      item.style.transitionProperty = 'transform, left';
    }else if ( (!item.classList.contains('swiper-slide-prev')) && (!item.classList.contains('swiper-slide-next')) ){
      imageTransitionDelay -= delayIndex;
    }
    item.style.removeProperty('position');
    item.style.left = 0;
    item.style.width = s_width;

    itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
  }

  active_el.addEventListener('transitionend', () => {
    sceneCarousel.wrapperEl.style.transform = s_transform;
    sceneCarousel.slides.forEach(item => {
      item.style.removeProperty('z-index');
      item.style.removeProperty('--slide-offset');
      item.style.removeProperty('--scene-active-slide-width');

      item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-trans-delay');
      item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-transform'); 
    });

    document.querySelector('.swiper-slide-prev .scene-hero__image').classList.remove('_active');
    document.querySelector('.swiper-slide-next .scene-hero__image').classList.remove('_active');
  }, {once: true});
}