// https://www.youtube.com/watch?v=xYA2bcEHKg8&ab_channel=System22WebDesign%7CDiviThemeElementorWP
$(function () {
    $(document).scroll(function () {
      $('nav').toggleClass('scrolled', $(this).scrollTop() > 100);
    });
  });