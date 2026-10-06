document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.navigation');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const slides=[...carousel.querySelectorAll('.slide')];
  const name=carousel.dataset.carousel;
  const dots=document.querySelector(`[data-dots="${name}"]`);
  const isImage=name==='thumbnails';
  const multiPreview=['landscape','portrait','ai-assisted','dtc','motion','ugc','pru','animated-ads','thumbnails'].includes(name);
  const format=name==='pru'?'PRU Life UK reel':name==='animated-ads'?'animated motion ad':name==='ai-assisted'?'AI-assisted':name==='ugc'?'UGC ad':name==='motion'?'motion graphics':name==='dtc'?'DTC ad':name==='landscape'?'long-form':'short-form';
  let current=0;
  slides.forEach((slide,i)=>{
    const dot=document.createElement('button');
    dot.type='button';
    dot.setAttribute('aria-label',isImage?`Go to thumbnail ${i+1}`:`Go to ${name} video ${i+1}`);
    dot.addEventListener('click',()=>show(i));
    dots.appendChild(dot);
    if(multiPreview){
      slide.addEventListener('click',event=>{
        if(i!==current&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){
          event.preventDefault();
          show(i);
          return;
        }
        if(slide.dataset.video&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){
          event.preventDefault();
          openPortfolioVideo(slide);
        }
        if(slide.dataset.image&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){
          event.preventDefault();
          openPortfolioImage(slide);
        }
      });
    }
  });
  function show(index){
    current=(index+slides.length)%slides.length;
    const before=(current-1+slides.length)%slides.length;
    const after=(current+1)%slides.length;
    slides.forEach((slide,i)=>{
      const visible=i===current||(multiPreview&&(i===before||i===after));
      slide.classList.toggle('show',i===current);
      slide.classList.toggle('is-before',multiPreview&&i===before);
      slide.classList.toggle('is-after',multiPreview&&i===after);
      slide.setAttribute('aria-hidden',String(!visible));
      slide.tabIndex=visible?0:-1;
      if(multiPreview){
        slide.setAttribute('aria-label',isImage?(i===current?`View thumbnail ${i+1}`:`Preview thumbnail ${i+1}`):(i===current?`Watch ${format} video ${i+1}`:`Preview ${format} video ${i+1}`));
      }
      if(visible)slide.querySelector('img')?.setAttribute('loading','eager');
    });
    [...dots.children].forEach((dot,i)=>{
      dot.classList.toggle('active',i===current);
      dot.setAttribute('aria-current',String(i===current));
    });
    const status=carousel.querySelector('.carousel-status');
    if(status)status.textContent=`${isImage?'Thumbnail':'Video'} ${current+1} of ${slides.length}`;
  }
  carousel.querySelector('.previous').addEventListener('click',()=>show(current-1));
  carousel.querySelector('.next').addEventListener('click',()=>show(current+1));

  /* Reliable mobile thumb swipe:
     left = next, right = previous.
     Runs inside this carousel closure and calls show() directly. */
  let swipeStartX=0;
  let swipeStartY=0;
  let swipeLastX=0;
  let swipeLastY=0;
  let swipeStartTime=0;
  let swipeTracking=false;
  let swipeHorizontal=false;
  let suppressSlideClickUntil=0;

  carousel.addEventListener('touchstart',event=>{
    if(event.touches.length!==1)return;
    const touch=event.touches[0];
    swipeStartX=touch.clientX;
    swipeStartY=touch.clientY;
    swipeLastX=touch.clientX;
    swipeLastY=touch.clientY;
    swipeStartTime=Date.now();
    swipeTracking=true;
    swipeHorizontal=false;
    carousel.classList.add('is-swipe-tracking');
  },{passive:true});

  carousel.addEventListener('touchmove',event=>{
    if(!swipeTracking||event.touches.length!==1)return;

    const touch=event.touches[0];
    swipeLastX=touch.clientX;
    swipeLastY=touch.clientY;

    const dx=swipeLastX-swipeStartX;
    const dy=swipeLastY-swipeStartY;

    /* Once the gesture is clearly horizontal, keep it inside the carousel.
       Vertical gestures are left alone so the page still scrolls normally. */
    if(!swipeHorizontal && Math.abs(dx)>12 && Math.abs(dx)>Math.abs(dy)*1.15){
      swipeHorizontal=true;
      carousel.classList.add('is-swiping');
    }

    if(swipeHorizontal && event.cancelable){
      event.preventDefault();
    }
  },{passive:false});

  carousel.addEventListener('touchend',event=>{
    if(!swipeTracking)return;

    if(event.changedTouches.length){
      swipeLastX=event.changedTouches[0].clientX;
      swipeLastY=event.changedTouches[0].clientY;
    }

    const dx=swipeLastX-swipeStartX;
    const dy=swipeLastY-swipeStartY;
    const elapsed=Date.now()-swipeStartTime;

    const isHorizontal=
      Math.abs(dx)>=36 &&
      Math.abs(dx)>Math.abs(dy)*1.12 &&
      elapsed<=1200;

    if(isHorizontal){
      suppressSlideClickUntil=Date.now()+550;
      show(current+(dx<0?1:-1));
    }

    swipeTracking=false;
    swipeHorizontal=false;
    carousel.classList.remove('is-swiping','is-swipe-tracking');
  },{passive:true});

  carousel.addEventListener('touchcancel',()=>{
    swipeTracking=false;
    swipeHorizontal=false;
    carousel.classList.remove('is-swiping','is-swipe-tracking');
  },{passive:true});

  /* A completed swipe must not also open the active video/link. */
  carousel.addEventListener('click',event=>{
    if(Date.now()<suppressSlideClickUntil){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  carousel.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();
      show(current+(event.key==='ArrowRight'?1:-1));
    }
  });

  show(0);
});

const videoDialog=document.getElementById('portfolio-video-dialog');
const portfolioPlayer=document.getElementById('portfolio-video-player');
const videoTitle=document.getElementById('portfolio-video-title');
const videoDirectLink=videoDialog.querySelector('.video-direct-link');
const videoError=videoDialog.querySelector('.video-dialog-error');
let videoTrigger=null;
let previousOverflow='';
function openPortfolioVideo(slide){
  videoTrigger=slide;
  document.querySelectorAll('video').forEach(video=>video.pause());
  videoTitle.textContent=slide.dataset.title;
  portfolioPlayer.setAttribute('aria-label',slide.dataset.title);
  portfolioPlayer.poster=slide.querySelector('img').src;
  portfolioPlayer.src=slide.dataset.video;
  videoDirectLink.href=slide.href;
  videoError.hidden=true;
  previousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';
  videoDialog.showModal();
  portfolioPlayer.play().catch(()=>{});
}
videoDialog.querySelector('.video-dialog-close').addEventListener('click',()=>videoDialog.close());
videoDialog.addEventListener('click',event=>{
  if(event.target!==videoDialog)return;
  const bounds=videoDialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)videoDialog.close();
});
videoDialog.addEventListener('close',()=>{
  portfolioPlayer.pause();
  portfolioPlayer.removeAttribute('src');
  portfolioPlayer.load();
  document.documentElement.style.overflow=previousOverflow;
  videoTrigger?.focus({preventScroll:true});
});
portfolioPlayer.addEventListener('error',()=>{
  if(videoDialog.open)videoError.hidden=false;
});

const imageDialog=document.getElementById('portfolio-image-dialog');
const imagePreview=document.getElementById('portfolio-image-preview');
let imageTrigger=null;
let imagePreviousOverflow='';
function openPortfolioImage(slide){
  imageTrigger=slide;
  document.querySelectorAll('video').forEach(video=>video.pause());
  document.getElementById('portfolio-image-title').textContent=slide.dataset.title;
  imageDialog.classList.toggle('is-landscape',slide.classList.contains('landscape-thumbnail'));
  imagePreview.src=slide.dataset.image;
  imagePreview.alt=slide.querySelector('img').alt;
  imageDialog.querySelector('.image-direct-link').href=slide.href;
  imagePreviousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';
  imageDialog.showModal();
}
imageDialog.querySelector('.image-dialog-close').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',event=>{
  if(event.target!==imageDialog)return;
  const bounds=imageDialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)imageDialog.close();
});
imageDialog.addEventListener('close',()=>{
  document.documentElement.style.overflow=imagePreviousOverflow;
  imagePreview.removeAttribute('src');
  imageTrigger?.focus({preventScroll:true});
});


// Mount only the selected post, stopping playback when a visitor switches tabs.
const achievementTabs=[...document.querySelectorAll('.achievement-tabs [role="tab"]')];
function selectAchievementTab(selected){
  achievementTabs.forEach(tab=>{
    const active=tab===selected;
    const panel=document.getElementById(tab.getAttribute('aria-controls'));
    const frame=panel.querySelector('iframe');
    if(!frame.dataset.src)frame.dataset.src=frame.getAttribute('src');
    tab.setAttribute('aria-selected',String(active));
    tab.tabIndex=active?0:-1;
    panel.hidden=!active;
    if(active&&!frame.getAttribute('src'))frame.src=frame.dataset.src;
    if(!active)frame.removeAttribute('src');
  });
}
achievementTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectAchievementTab(tab));
  tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%achievementTabs.length;
    else if(event.key==='ArrowLeft')next=(index-1+achievementTabs.length)%achievementTabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=achievementTabs.length-1;
    else return;
    event.preventDefault();
    selectAchievementTab(achievementTabs[next]);
    achievementTabs[next].focus();
  });
});

// About videos share one player area, with only the selected video active.
const aboutVideoTabs=[...document.querySelectorAll('.about-video-tabs [role="tab"]')];
function selectAboutVideoTab(selected){
 aboutVideoTabs.forEach(tab=>{
  const active=tab===selected;
  const panel=document.getElementById(tab.getAttribute('aria-controls'));
  tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;panel.hidden=!active;
  const frame=panel.querySelector('iframe');
  if(frame){if(!frame.dataset.src)frame.dataset.src=frame.getAttribute('src');if(active&&!frame.getAttribute('src'))frame.src=frame.dataset.src;if(!active)frame.removeAttribute('src');}
  const video=panel.querySelector('video');if(video&&!active)video.pause();
 });
}
aboutVideoTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>selectAboutVideoTab(tab));
 tab.addEventListener('keydown',event=>{
  let next=index;
  if(event.key==='ArrowRight')next=(index+1)%aboutVideoTabs.length;
  else if(event.key==='ArrowLeft')next=(index-1+aboutVideoTabs.length)%aboutVideoTabs.length;
  else if(event.key==='Home')next=0;else if(event.key==='End')next=aboutVideoTabs.length-1;else return;
  event.preventDefault();selectAboutVideoTab(aboutVideoTabs[next]);aboutVideoTabs[next].focus();
 });
});


/* Portfolio format filters */
(()=>{
  const buttons=[...document.querySelectorAll('.portfolio-filter')];
  const worksShell=document.querySelector('[data-filter-shell="works"]');
  const worksBlocks=worksShell?[...worksShell.querySelectorAll('[data-work-category]')]:[];
  const sectionTargets=[...document.querySelectorAll('[data-portfolio-category]')];

  if(!buttons.length)return;

  const applyPortfolioFilter=filter=>{
    buttons.forEach(button=>{
      const active=button.dataset.filter===filter;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });

    worksBlocks.forEach(block=>{
      const show=filter==='all'||block.dataset.workCategory===filter;
      block.hidden=!show;
    });

    if(worksShell){
      const showWorks=filter==='all'||worksBlocks.some(block=>block.dataset.workCategory===filter);
      worksShell.hidden=!showWorks;
    }

    sectionTargets.forEach(section=>{
      const categories=(section.dataset.portfolioCategory||'').split(/\s+/).filter(Boolean);
      section.hidden=!(filter==='all'||categories.includes(filter));
    });
  };

  buttons.forEach(button=>{
    button.addEventListener('click',()=>applyPortfolioFilter(button.dataset.filter));
  });

  applyPortfolioFilter('all');
})();
