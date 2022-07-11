// User settings
const activeSceneImageScale = 3.5; // CSS property transform: scale()
const sceneActiveSlideWidth = 70; // vw (vw = % of screen width)
const sceneSlideOffsetDuration = 2000; // ms


const scene             = document.querySelector('.anim-carousel');
const sceneCarousel     = new Swiper('.scene-carousel', {
  slidesPerView: 5,
  speed: 300,   // Animation speed
  // centeredSlides: true,
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
      const actSlide = el.slides[el.activeIndex];
      
      if (actSlide.classList.contains('swiper-slide-active')) {
        if (!el.animating) {
          startScene(actSlide);
          // this.animation = new sceneAnimation(actSlide);
        }
      }
    },
    // activeIndexChange: function (swiper) {
    //   const actSlide = swiper.slides[swiper.activeIndex];

    //   if (scene.classList.contains('_active')) {
    //       changeActiveSlide(actSlide);
    //       // this.animation = new sceneAnimation(actSlide);
        
    //   }
    // }
    // sliderMove: function (el, event) {
    //   const actSlide = el.slides[el.activeIndex];
    //   this.updateSlidesClasses();
    //   changeSlide(actSlide);
    // }
  }
});


scene.style.setProperty('--slide-offset-duration', `${sceneSlideOffsetDuration}ms`)


function changeActiveSlide (el) {
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const active_bg_color         = el.getAttribute('data-background-color');
  const activeSlideDescription  = el.querySelector('.hero-description');


  sceneWrapper.style.background = active_bg_color;
  sceneCarousel.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';

  for (let i = 0; i < sceneCarousel.slides.length; i++) {
    const item = sceneCarousel.slides[i];
    const itemImage = item.querySelector('.scene-hero__image');
    const itemImagePos = itemImage.getBoundingClientRect();
    const windowWidth = document.documentElement.offsetWidth;


    if (item.classList.contains('swiper-slide-prev')) {
      item.style.left = `0px`;
    }else if (item.classList.contains('swiper-slide-active')) {
      console.log(item, sceneCarousel.activeIndex);
      let itemOffset = (windowWidth*0.3) / 2;
      item.style.left = `${-itemOffset}px`;

    }else if (item.classList.contains('swiper-slide-next')) {
      item.style.left = `0px`;
    }else {
      item.style.left = `${-itemImagePos.width}px`;
    }
    item.style.position = 'absolute';
  }

  el.classList.add('_step-2');
  activeSlideDescription.classList.add('_active');
}


function startScene (el, isActive=false) {
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const exit                    = document.querySelector('#sceneActiveSlideExit');
  const activeSlideDescription  = el.querySelector('.hero-description');
  const activeSlideImage        = el.querySelector('.scene-hero__image');
  const active_bg_color         = el.getAttribute('data-background-color');
  const saveSlideWidth          = el.style.width;
  const saveTransform           = sceneCarousel.wrapperEl.style.transform;
  const slidesCount             = sceneCarousel.slides.length;


  if (!isActive) scene.classList.add('_active');

  sceneWrapper.style.background = active_bg_color;
  sceneCarousel.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';
  if (!isActive) {
    sceneCarousel.wrapperEl.style.transitionDuration = '3000ms';
    scene.style.setProperty('--scene-active-slide-width', `${sceneActiveSlideWidth}vw`);
    sceneCarousel.el.style.setProperty('--image-scale', activeSceneImageScale);
  } 

  let imageTransitionDelay = 0;
  let itemTransitionDelay = 0;
  let delayIndex = 150;
  for (let i = 0; i < slidesCount; i++) {
    const item = sceneCarousel.slides[i];
    const itemImage = item.querySelector('.scene-hero__image');
    const itemImagePos = itemImage.getBoundingClientRect();
    const windowWidth = document.documentElement.offsetWidth;

    if (item.classList.contains('swiper-slide-prev')) {
      imageTransitionDelay = 0;
      if (!isActive) itemTransitionDelay = (slidesCount)*delayIndex;
      item.style.left = `0px`;
    }else if (item.classList.contains('swiper-slide-active')) {
      imageTransitionDelay = 0;
      if (!isActive) itemTransitionDelay = (slidesCount)*delayIndex;
      let itemOffset = (windowWidth*0.3) / 2;
      item.style.left = `${itemOffset}px`;

    }else if (item.classList.contains('swiper-slide-next')) {
      imageTransitionDelay = 0;
      if (!isActive) itemTransitionDelay = (slidesCount)*delayIndex;
      item.style.left = `0px`;
    }else {
      if (!isActive) {
        itemTransitionDelay = (slidesCount-i)*delayIndex;
        imageTransitionDelay += 100;
        item.style.left = `${-itemImagePos.width*3.5}px`;
        if (i > sceneCarousel.activeIndex) {
          item.style.zIndex = -i;
        }
      }else {
        item.style.left = `${-itemImagePos.width}px`;
      }
    }
    item.style.width = '0px';
    item.style.setProperty('--slide-offset-delay', `${itemTransitionDelay}ms`);
    // itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
    if (!isActive) itemImage.style.setProperty('--slide-image-transform', `translate3d(0px, 35%, 0px) scale(${activeSceneImageScale})`);
  }

  el.addEventListener('transitionend', this.secondAnimationStep = () => {
    el.classList.add('_step-2');
    activeSlideDescription.classList.add('_active');
    sceneCarousel.wrapperEl.style.transitionDuration = '0ms';

    if (!isActive) {
      sceneCarousel.slides.forEach(item => {
        item.style.position = 'absolute';
      });
    }
  }, {once:true});


  exit.addEventListener('click', () => {
    stopScene();
  }, {once:true});

  sceneCarousel.on('slideChange', function (swiper) {
      el.classList.remove('_step-2');
      activeSlideDescription.classList.remove('_active');

      sceneCarousel.slides.forEach(item => {
        item.style.removeProperty('--slide-offset-delay');
      });

      const activeSlide = swiper.slides[swiper.activeIndex];
      swiper.updateSlidesClasses();
      startScene(activeSlide);
    });
}





// setTimeout(() => , 100);

class sceneAnimations {
  constructor (el) {
    this.sceneWrapper            = document.querySelector('.anim-carousel__content');
    this.exit                    = document.querySelector('#sceneActiveSlideExit');
    this.activeSlide             = el;
    this.activeSlideDescription  = el.querySelector('.hero-description');
    this.activeSlideImage        = el.querySelector('.scene-hero__image');
    this.active_bg_color         = el.getAttribute('data-background-color');
    this.saveSlideWidth          = el.style.width;
    this.saveTransform           = sceneCarousel.wrapperEl.style.transform;

    this.start();
  }

  start () {
    this.addProperties();
    this.addEvents();
  }

  addProperties () {
    scene.classList.add('_active');
    this.sceneWrapper.style.background = this.active_bg_color;
    this.activeSlide.style.setProperty('--scene-active-slide-width', `${sceneActiveSlideWidth}vw`);
    sceneCarousel.el.style.setProperty('--image-scale', activeSceneImageScale);
    sceneCarousel.wrapperEl.style.transform = 'translate3d(0px, 0px, 0px)';
    sceneCarousel.wrapperEl.style.transitionDuration = '3000ms';

    this.showSlide();
  }

  showSlide (isActive=false) {
    for (let i = 0; i < sceneCarousel.slides.length; i++) {
      const item                  = sceneCarousel.slides[i];
      const itemImage             = item.querySelector('.scene-hero__image');
      const itemImagePos          = item.querySelector('.scene-hero__image').getBoundingClientRect();
      const windowWidth           = document.documentElement.offsetWidth;
      const itemCount             = sceneCarousel.slides.length;

      if (isActive) {
        activeSceneImageScale = 1;
        this.addEvents();
      }
  
      let itemOffset = 0;
      let slideTransitionDelay = 0;
      let imageTransitionDelay = 0;
      if (item.classList.contains('swiper-slide-prev')) {
        itemOffset = itemImagePos.width / 2;
        imageTransitionDelay = 0;
        slideTransitionDelay = 0;
  
      }else if (item.classList.contains('swiper-slide-active')) {
        itemOffset = -(windowWidth*0.3) / 2;
        imageTransitionDelay = 0;
        slideTransitionDelay = 0;
  
      }else if (item.classList.contains('swiper-slide-next')) {
        imageTransitionDelay = 0;
        slideTransitionDelay = 0;
        this.activeSlideImage.addEventListener('transitionend', this.addPosition = () => {
          item.style.position = 'absolute';
        }, {once:true});
      }else {
        imageTransitionDelay = i * 100;
        slideTransitionDelay = (itemCount - i) * 100;
        if (i > sceneCarousel.activeIndex) {
          this.activeSlideImage.addEventListener('transitionend', this.addPosition = () => {
            item.style.position = 'absolute';
          }, {once:true});
          itemOffset = itemImagePos.width*activeSceneImageScale;
          item.style.zIndex = -i;
        }else {
          itemOffset = itemImagePos.width*activeSceneImageScale;
        }
      }
  
      item.style.width = '0px';
      itemImage.style.setProperty('--slide-image-trans-delay', `${imageTransitionDelay}ms`);
      if (!isActive) {
        itemImage.style.setProperty('--slide-image-transform', `translate3d(0px, 35%, 0px) scale(${activeSceneImageScale})`);
      }
      // item.style.setProperty('--slide-offset-delay', `${slideTransitionDelay}ms`);
      // item.style.setProperty('--slide-offset-duration', `${2}s`);
      item.style.setProperty('--slide-offset', `${-itemOffset}px`);
    }
  }

  addEvents () {
    this.activeSlideImage.addEventListener('transitionend', this.secondAnimationStep = () => {
      this.activeSlide.classList.add('_step-2');
      this.activeSlideDescription.classList.add('_active');
      sceneCarousel.wrapperEl.style.transitionDuration = '0ms';
    }, {once:true});

    this.exit.addEventListener('click', () => {
      this.removeActiveScene(this.activeSlide); 
    }, {once:true});
  }

  removeActiveScene () {
    // let slideTransitionDelay = 0;
    // sceneCarousel.slides.forEach(item => {
    //   item.classList.remove('_step-2');
    //   this.activeSlideDescription.classList.add('_active');
    //   sceneCarousel.wrapperEl.style.transitionDuration = '3000ms';
    //   item.style.removeProperty('position');
    //   item.style.width = this.saveSlideWidth;
    //   item.firstElementChild.style.setProperty('--slide-image-transform', `translate3d(0px, 35%, 0px) scale(1)`);
    //   item.style.setProperty('--slide-offset', `0px`);
    //   item.style.setProperty('--slide-offset-delay', `${slideTransitionDelay+=100}ms`);

    //   this.sceneWrapper.style.background = 'unset';
    // });

    scene.classList.remove('_active');
      this.sceneWrapper.style.background = 'unset';
      this.activeSlideDescription.classList.remove('_active');
      this.activeSlide.classList.remove('_step-2');
      sceneCarousel.slides.forEach(item => {
        item.style.width = this.saveSlideWidth;
        item.style.removeProperty('position');
        item.style.removeProperty('z-index');
        item.style.removeProperty('--slide-offset');
        item.style.removeProperty('--scene-active-slide-width');

        item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-trans-delay');
        item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-transform');
      });

      sceneCarousel.el.style.removeProperty('--image-scale');
      sceneCarousel.wrapperEl.style.transitionDuration = '0ms';
      sceneCarousel.wrapperEl.style.transform = this.saveTransform;

    // setTimeout(() => {
    //   scene.classList.remove('_active');
    //   this.sceneWrapper.style.background = 'unset';
    //   this.activeSlideDescription.classList.remove('_active');
    //   this.activeSlide.classList.remove('_step-2');
    //   sceneCarousel.slides.forEach(item => {
    //     item.style.removeProperty('position');
    //     item.style.removeProperty('z-index');
    //     item.style.removeProperty('--slide-offset');
    //     item.style.removeProperty('--scene-active-slide-width');

    //     item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-trans-delay');
    //     item.querySelector('.scene-hero__image').style.removeProperty('--slide-image-transform');
    //     sceneCarousel.el.style.removeProperty('--image-scale');
    //     sceneCarousel.wrapperEl.style.transitionDuration = '0ms';
    //     sceneCarousel.wrapperEl.style.transform = saveTransform;
    //   });
    // }, 3000);
  }
}


