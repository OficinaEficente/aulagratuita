(function(){
  var videoWrap=document.getElementById('video-wrap');
  var played=false;
  if(videoWrap){
    videoWrap.addEventListener('click',function(){
      if(played)return; played=true;
      videoWrap.innerHTML='<iframe src="https://www.youtube.com/embed/qK7X7hgpfPw?autoplay=1&rel=0" title="Aula gratuita de direção hidráulica" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      if(window.trackBoth) window.trackBoth('VideoPlay',{content_name:'Aula Gratuita - Direcao Hidraulica',content_category:'free_lesson'});
      if(window.gtag) gtag('event','video_start',{video_title:'Aula Gratuita - Direcao Hidraulica'});
    });
  }

  document.querySelectorAll('[data-label]').forEach(function(el){
    el.addEventListener('click',function(){
      var label=el.getAttribute('data-label');
      if(window.gtag) gtag('event','cta_click',{cta_label:label});
      if(label==='conhecer-treinamento-pago' && window.trackBoth){
        window.trackBoth('Lead',{content_name:'Treinamento Direcao Hidraulica',content_category:'paid_training_interest'});
      }
    });
  });
})();