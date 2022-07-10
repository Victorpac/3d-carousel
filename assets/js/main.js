// User settings
const activeSceneImageScale = 3.5;
const sceneSlideAnimationDuration = 3000; // ms

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
    activeIndexChange: function () {
      const actSlide = this.slides[this.activeIndex];
      const wrapper = this.$wrapperEl[0];

      if (scene.classList.contains('_active')) {
        wrapper.addEventListener('transitionend', activeAnim = () => {
          activeSceneAnimation(actSlide);
          wrapper.removeEventListener('transitionend', activeAnim);
        });
      }
    },
    click: function () {
      const actSlide = this.slides[this.activeIndex];
      const wrapper = this.$wrapperEl[0];

      if (actSlide.classList.contains('swiper-slide-active')) {
        if (wrapper.style.transitionDuration !== '0ms') {
          wrapper.addEventListener('transitionend', activeAnim = () => {
            activeSceneAnimation(actSlide);
            wrapper.removeEventListener('transitionend', activeAnim);
          });
        }else {
          activeSceneAnimation(actSlide);
        }
      }
    },

  }
});



function activeSceneAnimation(el) {
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const activeSlideDescription  = el.querySelector('.hero-description');
  const exit                    = document.querySelector('#sceneActiveSlideExit');

  let active_bg_color           = el.getAttribute('data-background-color');


  // Addin active status for the whole block (.anim-carousel)
  scene.classList.add('_active');  
  sceneWrapper.style.background = active_bg_color;
  sceneCarousel.$el[0].style.setProperty('--image-scale', activeSceneImageScale);

  sceneCarousel.$wrapperEl[0].transform = `translate3d(${sceneCarousel.$wrapperEl[0].transform+200}px, 0px, 0px)`;

  setTimeout(() => {
    console.log('test');
    sceneCarousel.$wrapperEl[0].transform = `translate3d(0px, 0px, 0px)`;
  }, 500);


  let sumImagesWidth          = 0;
  let activeSlideImageWidth   = 0;
  for (let i = 0; i < sceneCarousel.slides.length; i++) {
    const item                  = sceneCarousel.slides[i];
    const itemImagePos          = item.querySelector('.scene-hero__image').getBoundingClientRect();
    const windowWidth           = document.documentElement.offsetWidth;
    
    let itemOffset              = 0;
    let itemAnimDuration        = sceneSlideAnimationDuration;


    if (item.classList.contains('swiper-slide-prev')) {
      itemOffset = itemImagePos.width;

    }else if (item.classList.contains('swiper-slide-active')) {
      itemOffset = itemImagePos.x-(windowWidth*0.1)/2;
      activeSlideImageWidth = itemImagePos.width;

    }else if (item.classList.contains('swiper-slide-next')) {
      itemOffset = (itemImagePos.x + (sumImagesWidth * (activeSceneImageScale-1)) - (activeSlideImageWidth*activeSceneImageScale))+(windowWidth*0.9);
    }else {
      if (i > sceneCarousel.activeIndex) {
        itemOffset = (itemImagePos.x-sumImagesWidth)+(sumImagesWidth*activeSceneImageScale)+(itemImagePos.width*activeSceneImageScale)+(windowWidth*0.1); 
        itemAnimDuration += i*50;
      }else {
        itemOffset = (Math.abs(itemImagePos.x)+(itemImagePos.width*activeSceneImageScale)); // Math.abs(itemImagePos.x)+(itemImagePos.width*3.5)
      }
    }

    sumImagesWidth += itemImagePos.width;

    item.style.setProperty('--slide-anim-duration', `${itemAnimDuration}ms`);
    item.style.setProperty('--slide-offset', `${-itemOffset}px`);
  }

  exit.addEventListener('click', () => {
    scene.classList.remove('_active');
    sceneWrapper.style.background = 'unset';
  });

  // Stop slide offset updating (Event fires based on the first carousel slide)
  el.querySelector('.scene-hero__image').addEventListener('animationend', () => {
    activeSlideDescription.classList.add('_active');
    el.classList.add('_step-2');
  });
}

