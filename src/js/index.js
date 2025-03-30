import '../../node_modules/glightbox/dist/css/glightbox.min.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/animate.css';
import '../css/style.css';
import ogImage from '../images/logo/og-image.png'; // Import the Open Graph image
import robotsTxt from '../robots.txt'; // Import robots.txt
import sitemapXml from '../sitemap.xml'; // Import sitemap.xmlimport GLightbox from 'glightbox';
import Swiper, { Navigation } from 'swiper';
import WOW from 'wowjs';

window.wow = new WOW.WOW({
  live: false,
});

window.wow.init({
  offset: 50,
});

// Testimonial
const testimonial = new Swiper('.mySwiper', {
  // configure Swiper to use modules
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 30,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  breakpoints: {
    // when window width is >= 640px
    768: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
});

//========= glightbox 
//GLightbox({
 // href: "https://www.youtube.com/watch?v=r44RKWyfcFw&fbclid=IwAR21beSJORalzmzokxDRcGfkZA1AtRTE__l5N4r09HcGS5Y6vOluyouM9EM",
 // type: "video",
 // source: "youtube", //vimeo, youtube or local
  //width: 900,
  //autoplayVideos: true,
//});

(function () {
  'use strict';

  /* ========  mobile menu  start ========= */
  const menuWrapper = document.querySelector('.menu-wrapper');
  const body = document.querySelector('body');
  document.querySelector('.navbarOpen').addEventListener('click', () => {
    menuWrapper.classList.remove('hidden');
    body.classList.add('overflow-hidden');
  });
  document.querySelector('.navbarClose').addEventListener('click', () => {
    menuWrapper.classList.add('hidden');
    body.classList.remove('overflow-hidden');
  });

  // === close navbar-collapse when a  clicked
  document.querySelectorAll('.navbar li:not(.submenu-item) a').forEach((e) =>
    e.addEventListener('click', () => {
      menuWrapper.classList.add('hidden');
      body.classList.remove('overflow-hidden');
    })
  );

  // === Sub-menu
  const submenuItems = document.querySelectorAll('.submenu-item');
  submenuItems.forEach((el) => {
    el.querySelector('a').addEventListener('click', () => {
      el.querySelector('a').classList.toggle('active');
      el.querySelector('.submenu').classList.toggle('hidden');
    });
  });

  /* ========  mobile menu end ========= */

  window.onscroll = function () {
    // ===  Sticky Navbar
    const header = document.querySelector('.navbar');
    if (window.pageYOffset >= 100) {
      header.classList.add('sticky-navbar');
    } else {
      header.classList.remove('sticky-navbar');
    }

    // ===  show or hide the back-top-top button
    const backToTop = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  };

  /* ========  themeSwitcher start ========= */

// Theme Vars
const themeSwitcher = document.getElementById('themeSwitcher'); // Button to toggle theme
const userTheme = localStorage.getItem('theme'); // Get the saved theme from localStorage
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches; // Check system theme

// Initial Theme Check
const themeCheck = () => {
  if (userTheme === 'dark' || (!userTheme && systemTheme)) {
    document.documentElement.classList.add('dark'); // Apply dark mode
  } else {
    document.documentElement.classList.remove('dark'); // Apply light mode
  }
};

// Manual Theme Switch
const themeSwitch = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark'); // Switch to light mode
    localStorage.setItem('theme', 'light'); // Save preference in localStorage
  } else {
    document.documentElement.classList.add('dark'); // Switch to dark mode
    localStorage.setItem('theme', 'dark'); // Save preference in localStorage
  }
};

// Add Event Listener to Theme Switcher Button
if (themeSwitcher) {
  themeSwitcher.addEventListener('click', () => {
    themeSwitch();
  });
}

// Invoke Theme Check on Initial Load
themeCheck();
  /* ========  themeSwitcher End ========= */

  /* ========  scroll to top  start ========= */
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;

      const val = Math.easeInOutQuad(currentTime, start, change, duration);

      element.scrollTop = val;

      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.querySelector('.back-to-top').onclick = () => {
    scrollTo(document.documentElement);
  };
  /* ========  scroll to top  end ========= */
})();

// Document Loaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent form submission
      const webhookUrl = process.env.REACT_APP_WEBHOOK_URL;
      const formData = new FormData(this);
      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      };
      console.log("weburl", webhookUrl);
      console.log("data", data); // Log the data being sent

      fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
        },
        body: JSON.stringify(data), // Stringify the data to JSON
      })
      .then(response => {
        if (response.ok) { // Check if response status is OK (2xx)
          return response.text(); // If OK, return the response as text
        } else {
          throw new Error('Something went wrong'); // Throw an error if response is not OK
        }
      })
      .then(responseText => {
        console.log('Response from webhook:', responseText); // Log the raw response (e.g., "Accepted")
        alert('Thank you for reaching out! We will get back to you soon.'); // Show "Thank You" message
      })
      .catch((error) => {
        console.error('Error:', error); // Log any error that occurs
        alert('Something went wrong. Please try again later.'); // Show error message
      });
    });
  } else {
    console.log('Form element not found in the DOM.');
  }
});