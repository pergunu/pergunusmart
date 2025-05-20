// Utility Functions
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

function generateRandomCode(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setQueryParam(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

function removeQueryParam(name) {
    const url = new URL(window.location);
    url.searchParams.delete(name);
    window.history.pushState({}, '', url);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function capitalize(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function truncate(str, length = 50) {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function parseJSONSafely(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

function stringifyJSONSafely(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        return '{}';
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

function loadStylesheet(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function detectIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const trident = ua.indexOf('Trident/');
    
    if (msie > 0) {
        // IE 10 or older
        return true;
    }
    
    if (trident > 0) {
        // IE 11
        return true;
    }
    
    // Other browsers
    return false;
}

function isTouchDevice() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

function localStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

function sessionStorageAvailable() {
    try {
        const test = 'test';
        sessionStorage.setItem(test, test);
        sessionStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

function isOnline() {
    return navigator.onLine;
}

function addOnlineListener(callback) {
    window.addEventListener('online', callback);
}

function addOfflineListener(callback) {
    window.addEventListener('offline', callback);
}

function getScreenOrientation() {
    if (window.screen.orientation) {
        return window.screen.orientation.type;
    }
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

function addOrientationChangeListener(callback) {
    window.addEventListener('orientationchange', callback);
}

function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
}

function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function addDarkModeListener(callback) {
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', callback);
    }
}

function getDevicePixelRatio() {
    return window.devicePixelRatio || 1;
}

function isRetinaDisplay() {
    return getDevicePixelRatio() > 1;
}

function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

function getScrollPosition() {
    return {
        x: window.pageXOffset || document.documentElement.scrollLeft,
        y: window.pageYOffset || document.documentElement.scrollTop
    };
}

function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function getDistanceBetweenElements(el1, el2) {
    const center1 = getElementCenter(el1);
    const center2 = getElementCenter(el2);
    return Math.sqrt(
        Math.pow(center2.x - center1.x, 2) + 
        Math.pow(center2.y - center1.y, 2)
    );
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function wrapElement(element, wrapper) {
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
}

function unwrapElement(wrapper) {
    const parent = wrapper.parentNode;
    while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, wrapper);
    }
    parent.removeChild(wrapper);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function addClassToElements(selector, className) {
    document.querySelectorAll(selector).forEach(el => el.classList.add(className));
}

function removeClassFromElements(selector, className) {
    document.querySelectorAll(selector).forEach(el => el.classList.remove(className));
}

function toggleClassOnElements(selector, className) {
    document.querySelectorAll(selector).forEach(el => el.classList.toggle(className));
}

function hasClass(element, className) {
    return element.classList.contains(className);
}

function addMultipleClasses(element, ...classNames) {
    element.classList.add(...classNames);
}

function removeMultipleClasses(element, ...classNames) {
    element.classList.remove(...classNames);
}

function toggleMultipleClasses(element, ...classNames) {
    classNames.forEach(className => element.classList.toggle(className));
}

function getComputedStyleValue(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
}

function setCSSVariable(name, value) {
    document.documentElement.style.setProperty(`--${name}`, value);
}

function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}

function animateCSS(element, animationName, callback) {
    element.classList.add('animated', animationName);
    
    function handleAnimationEnd() {
        element.classList.remove('animated', animationName);
        element.removeEventListener('animationend', handleAnimationEnd);
        
        if (typeof callback === 'function') callback();
    }
    
    element.addEventListener('animationend', handleAnimationEnd);
}

function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let start = null;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = Math.min(progress / duration, 1);
        if (progress < duration) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

function fadeOut(element, duration = 300) {
    let start = null;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = Math.max(1 - progress / duration, 0);
        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            element.style.display = 'none';
        }
    };
    
    window.requestAnimationFrame(step);
}

function toggleFade(element, duration = 300) {
    if (window.getComputedStyle(element).display === 'none') {
        fadeIn(element, duration);
    } else {
        fadeOut(element, duration);
    }
}

function debounceResize(callback, delay = 250) {
    let timeout;
    window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    });
}

function throttleResize(callback, limit = 250) {
    let lastTick;
    window.addEventListener('resize', () => {
        const now = Date.now();
        if (!lastTick || now - lastTick >= limit) {
            lastTick = now;
            callback();
        }
    });
}

function getMousePosition(event) {
    return {
        x: event.clientX,
        y: event.clientY
    };
}

function getTouchPosition(event) {
    return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
    };
}

function getScrollDirection() {
    let lastScroll = 0;
    return function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentScroll > lastScroll ? 'down' : 'up';
        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        return direction;
    };
}

function isScrolledToBottom(threshold = 100) {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight - threshold;
}

function isScrolledToTop(threshold = 100) {
    return window.scrollY <= threshold;
}

function scrollToBottom(smooth = true) {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

function scrollToElementCenter(element, smooth = true) {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    
    window.scrollTo({
        top: middle,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
}

function isScrollLocked() {
    return document.body.style.overflow === 'hidden';
}

function getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

function getElementDimensions(element) {
    const rect = element.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
}

function isElementOverflowing(element) {
    return element.scrollHeight > element.clientHeight || 
           element.scrollWidth > element.clientWidth;
}

function isElementFullyVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isElementPartiallyVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return vertInView && horInView;
}

function getVisiblePercentage(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    
    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;
    
    return totalArea > 0 ? Math.round((visibleArea / totalArea) * 100) : 0;
}

function isElementAboveViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.bottom < 0;
}

function isElementBelowViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top > (window.innerHeight || document.documentElement.clientHeight);
}

function isElementLeftOfViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.right < 0;
}

function isElementRightOfViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.left > (window.innerWidth || document.documentElement.clientWidth);
}

function getElementVisibility(element) {
    return {
        isVisible: isElementPartiallyVisible(element),
        percentage: getVisiblePercentage(element),
        position: {
            isAbove: isElementAboveViewport(element),
            isBelow: isElementBelowViewport(element),
            isLeft: isElementLeftOfViewport(element),
            is
