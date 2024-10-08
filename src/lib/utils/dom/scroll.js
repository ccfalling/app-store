/* eslint-disable no-plusplus */
import { raf, cancelRaf } from '../raf';
import { isIOS as checkIsIOS } from '../validate/system';
function isWindow(val) {
  return val === window;
}
export function getScrollTop(el) {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset;
  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0);
}
export function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
export function setRootScrollTop(value) {
  setScrollTop(window, value);
  // setScrollTop(document.body, value);
}
// get distance from element top to page top or scroller top
export function getElementTop(el, scroller) {
  if (isWindow(el)) {
    return 0;
  }
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return el.getBoundingClientRect().top + scrollTop;
}
export function getVisibleHeight(el) {
  if (isWindow(el)) {
    return el.innerHeight;
  }
  return el.getBoundingClientRect().height;
}
export function getVisibleTop(el) {
  if (isWindow(el)) {
    return 0;
  }
  return el.getBoundingClientRect().top;
}
export function setScrollTop(el, value) {
  if ('scrollTop' in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
let rafId;
export function scrollLeftTo(scroller, to, duration) {
  cancelRaf(rafId);
  let count = 0;
  const from = scroller.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round(duration / 16);
  function animate() {
    scroller.scrollLeft += (to - from) / frames;
    if (++count < frames) {
      rafId = raf(animate);
    }
  }
  animate();
}
export function scrollTopTo(scroller, to, duration, callback) {
  let current = getScrollTop(scroller);
  const isDown = current < to;
  const frames = duration === 0 ? 1 : Math.round(duration / 16);
  const step = (to - current) / frames;
  function animate() {
    current += step;
    if (isDown && current > to || !isDown && current < to) {
      current = to;
    }
    setScrollTop(scroller, current);
    if (isDown && current < to || !isDown && current > to) {
      raf(animate);
    } else if (callback) {
      raf(callback);
    }
  }
  animate();
}
const isIOS = checkIsIOS();
// hack for iOS12 page scroll
// see: https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800
export function resetScroll() {
  if (isIOS) {
    setRootScrollTop(getRootScrollTop());
  }
}