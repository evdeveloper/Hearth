$(document).ready(function () {
    svg4everybody({});

    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        speed: 1000,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        autoplay: {
            delay: 5000,
            disableOnInteraction: true
          },
      });

      $('.swiper-container').on('mouseenter', function(e) {
          mySwiper.autoplay.stop();
      });
      $('.swiper-container').on('mouseleave', function(e) {
          mySwiper.autoplay.start();
      });
      
      
      function modalActive() {
        $('[data-modal="modal"]').on('click',function(){
            $('.modal').show('easing').addClass('modal-overlay');
            $('.index-page').css({'overflow':'hidden'});
            $('.modal__inner').show('easing');
            $('.modal__close').animate({
              top: '30px'
            },'easing');
        });
      }

      function modalClose() {
        $('.modal__close').on('click', function(){
          $('.modal').hide('fast').removeClass('modal-overlay');
          $('.index-page').css({'overflow': 'auto'});
          $(this).css({'top': '-1000px'});
        });
      }

      function targetClose() {
        $(document).mouseup(function (e) {
          var container = $('.modal');
          if (container.has(e.target).length === 0){
              container.hide();
              $('.index-page').css({'overflow': 'auto'});
              $('.modal__close').css({'top': '-1000px'});
          }
      });
    }

  
      modalActive();
      modalClose();
      targetClose();
});