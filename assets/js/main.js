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

  for (let i = 0; i < sceneCarousel.slides.length; i++) {
    const item = sceneCarousel.slides[i];
    const itemImagePos = item.querySelector('.scene-hero__image').getBoundingClientRect();
    
    if (item.classList.contains('swiper-slide-prev')) {
      // item.style.setProperty('--slide-offset', `-${itemImagePos.width*0.5}px`);

    }else if (item.classList.contains('swiper-slide-active')) {
      const windowWidth = document.documentElement.offsetWidth;
      let itemOffset = itemImagePos.x-(windowWidth-el.offsetWidth)/2;
      item.style.setProperty('--slide-offset', `${-itemOffset}px`);

    }else if (item.classList.contains('swiper-slide-next')) {      
      // item.style.setProperty('--slide-offset', `-${itemImagePos.x+((itemImagePos.width*3.5)/4)}px`);

    }
  }

  // Stop slide offset updating (Event fires based on the first carousel slide)
  el.querySelector('.scene-hero__image').addEventListener('transitionend', () => {
    // clearInterval(slideOffsetUpdate);
    activeSlideDescription.classList.add('_active');
  });

  exit.addEventListener('click', function () {
    scene.classList.remove('_active');
    sceneWrapper.style.background = 'unset';
  });
}

