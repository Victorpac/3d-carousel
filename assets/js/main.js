const scene             = document.querySelector('.anim-carousel');
const sceneCarousel     = new Swiper('.scene-carousel', {
  slidesPerView: 5,
  speed: 300,   // Animation speed
  // centeredSlides: true,
  centeredSlidesBounds: true,
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
      if (scene.classList.contains('_active')) {
        console.log('ok');
        activeSceneAnimation(this.slides[this.activeIndex]);
      }
    },

    click: function () {
      if (this.slides[this.activeIndex].classList.contains('swiper-slide-active')) {
        activeSceneAnimation(this.slides[this.activeIndex]);
      }
    }
  }
});


function activeSceneAnimation(el) {
  const sceneWrapper            = document.querySelector('.anim-carousel__content');
  const nextSlideImage          = document.querySelector('.scene-hero.swiper-slide-next .scene-hero__image');
  const prevSlideImage          = document.querySelector('.scene-hero.swiper-slide-prev .scene-hero__image');
  const activeSlideDescription  = el.querySelector('.hero-description');

  let active_bg_color           = el.getAttribute('data-background-color');
  let nextSlideImagePos         = nextSlideImage?.getBoundingClientRect();
  let invisibleSlides           = new Map();
  let update_freq               = 10;   // Interval of updating slide offset


  // Addin active status for the whole block (.anim-carousel)
  scene.classList.add('_active');  
  sceneWrapper.style.background = active_bg_color;

  // Preparing a list of invisible slides and their starting position
  // sceneCarousel.slides.forEach(item => {
  //   if (
  //     (!item.classList.contains('swiper-slide-prev')) &&
  //     (!item.classList.contains('swiper-slide-active')) &&
  //     (!item.classList.contains('swiper-slide-next')) 
  //     ) {
  //       const itemImage     = item.querySelector('.scene-hero__image');
  //       const itemOffset    = itemImage.getBoundingClientRect().x;

  //       // item.style.width = `${itemImage.offsetWidth}px`;

  //       invisibleSlides.set(item, [itemOffset, itemImage]);
  //     }
  // });


  for (let i = 0; i < sceneCarousel.slides.length; i++) {
    const item = sceneCarousel.slides[i];
    const itemImagePos = item.querySelector('.scene-hero__image').getBoundingClientRect();

    
    if (item.classList.contains('swiper-slide-prev')) {
      item.style.setProperty('--slide-offset', `-${prevSlideImage?.offsetWidth}px`);

    }else if (item.classList.contains('swiper-slide-active')) {
      item.style.setProperty('--slide-offset', `0px`);

    }else if (item.classList.contains('swiper-slide-next')) {
      let itemOffset = item.getBoundingClientRect();
      item.style.setProperty('--slide-offset', `-${itemImagePos.x+((itemImagePos.width*3.5))}px`);
    }else {
      // let imageCurrentWidth = entry[1][1].offsetWidth;
      item.style.setProperty('--slide-offset', `-${Math.abs(itemImagePos.x)+(itemImagePos.width*3.5)}px`);
    }
  }
  

  // let nextSildeOffset = (nextSlideImage?.offsetWidth * 0.7)+(el.offsetWidth);
  // let nextSildeOffset           = nextSlideImagePos?.x+((nextSlideImage?.offsetWidth*1.5)+(el.offsetWidth-activeSlideDescription.offsetWidth));
  // let activeSlideImagePos       = el.querySelector('.scene-hero__image').getBoundingClientRect();

  // let activeSlideImageWidth = el.querySelector('.scene-hero__image')
  // console.log(activeSlideImagePos.width);

  // sceneCarousel.el.style.setProperty('--scene-prev-slide-offset', `-${prevSlideImage?.offsetWidth}px`);
  // sceneCarousel.el.style.setProperty('--scene-active-slide-offset', `${activeSlideImagePos.x}px`);
  // sceneCarousel.el.style.setProperty('--scene-next-slide-offset', `-${nextSlideImagePos.right+100}px`);

  // // Updating offset for invisible slides
  // for (let entry of invisibleSlides) {
  //   let imageCurrentWidth = entry[1][1].offsetWidth;
  //   entry[0].style.setProperty('--scene-invisible-slide-offset', `-${entry[1][0]+imageCurrentWidth}px`);
  // }
  

  // Algorithm for updating CSS variables with the actual slide offset
  // let slideOffsetUpdate = setInterval(() => {
  //   // let nextSildeOffset = (nextSlideImage?.offsetWidth * 0.7)+(el.offsetWidth);
  //   let nextSildeOffset           = nextSlideImagePos?.x+((nextSlideImage?.offsetWidth*1.5)+(el.offsetWidth-activeSlideDescription.offsetWidth));
  //   let activeSlideImagePos       = el.querySelector('.scene-hero__image').getBoundingClientRect();

  //   // let activeSlideImageWidth = el.querySelector('.scene-hero__image')
  //   // console.log(activeSlideImagePos.width);

  //   sceneCarousel.el.style.setProperty('--scene-prev-slide-offset', `-${prevSlideImage?.offsetWidth}px`);
  //   sceneCarousel.el.style.setProperty('--scene-active-slide-offset', `-${activeSlideImagePos.x}px`);
  //   sceneCarousel.el.style.setProperty('--scene-next-slide-offset', `-${nextSildeOffset}px`);

  //   // Updating offset for invisible slides
  //   for (let entry of invisibleSlides) {
  //     let imageCurrentWidth = entry[1][1].offsetWidth;
  //     entry[0].style.setProperty('--scene-invisible-slide-offset', `-${entry[1][0]+imageCurrentWidth}px`);
  //   }
  // }, update_freq);  

  // Stop slide offset updating (Event fires based on the first carousel slide)
  sceneCarousel.slides[0].querySelector('.scene-hero__image').addEventListener('transitionend', () => {
    // clearInterval(slideOffsetUpdate);
    activeSlideDescription.classList.add('_active');
  });
}

