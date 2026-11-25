/* 浮光科技 · 交互脚本 */
(function () {
  'use strict';

  /* 顶部导航滚动状态 */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 移动端菜单 */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mobile-nav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mnav.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* 滚动渐显 */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* 数字/年份 */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* 留言表单（前端演示，提交后引导邮箱确认） */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var msg = form.querySelector('.form__msg');
      var d = new FormData(form);
      var name = (d.get('name') || '').toString().trim();
      var contact = (d.get('contact') || '').toString().trim();
      var company = (d.get('company') || '').toString().trim();
      var need = (d.get('need') || '').toString().trim();

      if (!name || !contact || !need) {
        if (msg) {
          msg.textContent = '请至少填写姓名、联系方式与需求描述。';
          msg.classList.add('is-on');
        }
        return;
      }

      var subject = encodeURIComponent('【官网咨询】' + name + (company ? '（' + company + '）' : ''));
      var body = encodeURIComponent(
        '姓名：' + name + '\n公司：' + (company || '—') + '\n联系方式：' + contact +
        '\n\n需求描述：\n' + need
      );
      window.location.href = 'mailto:769325994@qq.com?subject=' + subject + '&body=' + body;

      if (msg) {
        msg.textContent = '已为你打开邮件客户端，如未跳转，可直接发送至 769325994@qq.com。';
        msg.classList.add('is-on');
      }
    });
  }

  /* 首页品牌入场 */
  var loader = document.querySelector('.home-loader');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (loader) {
    var loaderCount = loader.querySelector('[data-loader-count]');
    if (reducedMotion) {
      loader.classList.add('is-done');
    } else {
      var loaderStart = performance.now();
      var loaderDuration = 720;
      function loaderTick(now) {
        var progress = Math.min((now - loaderStart) / loaderDuration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        if (loaderCount) loaderCount.textContent = ('00' + Math.round(eased * 100)).slice(-3);
        if (progress < 1) requestAnimationFrame(loaderTick);
        else loader.classList.add('is-done');
      }
      requestAnimationFrame(loaderTick);
    }
  }

  /* 全站滚动进度 */
  var progressBar = document.querySelector('[data-site-progress]');
  function updateSiteProgress() {
    if (!progressBar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progressBar.style.width = (ratio * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', updateSiteProgress, { passive: true });
  window.addEventListener('resize', updateSiteProgress);
  updateSiteProgress();

  /* 首页章节编号 */
  var homeSections = document.querySelectorAll('[data-home-section]');
  var currentSection = document.querySelector('[data-current-section]');
  if (homeSections.length && currentSection && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) currentSection.textContent = entry.target.getAttribute('data-home-section');
      });
    }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
    homeSections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* 首屏几何装置跟随鼠标 */
  var tilt = document.querySelector('[data-tilt]');
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  if (tilt && finePointer && !reducedMotion) {
    tilt.addEventListener('pointermove', function (event) {
      var rect = tilt.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    tilt.addEventListener('pointerleave', function () {
      tilt.style.setProperty('--ry', '0deg');
      tilt.style.setProperty('--rx', '0deg');
    });
  }

  /* 合作索引：悬停、点击与键盘切换 */
  var capButtons = Array.prototype.slice.call(document.querySelectorAll('[data-cap-target]'));
  var capPanels = document.querySelectorAll('.capability__panel');
  function activateCapability(id) {
    capPanels.forEach(function (panel) { panel.classList.toggle('is-active', panel.id === id); });
    capButtons.forEach(function (button) {
      var active = button.getAttribute('data-cap-target') === id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }
  capButtons.forEach(function (button, index) {
    var id = button.getAttribute('data-cap-target');
    button.addEventListener('click', function () { activateCapability(id); });
    button.addEventListener('focus', function () { activateCapability(id); });
    if (finePointer) button.addEventListener('mouseenter', function () { activateCapability(id); });
    button.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? (index + 1) % capButtons.length : (index - 1 + capButtons.length) % capButtons.length;
      capButtons[next].focus();
    });
  });

  /* 优势卡片翻面 */
  document.querySelectorAll('[data-flip]').forEach(function (card) {
    card.addEventListener('click', function () {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    });
  });

  /* 作品库分类筛选 */
  var filterButtons = document.querySelectorAll('[data-filter]');
  var workItems = document.querySelectorAll('.work-slot[data-category]');
  var workCount = document.querySelector('[data-work-count]');
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');
      var visible = 0;
      filterButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      workItems.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.hidden = !show;
        if (show) {
          visible += 1;
          item.classList.add('in');
        }
      });
      if (workCount) workCount.textContent = ('0' + visible).slice(-2);
    });
  });

  /* 作品库网格 / 列表切换 */
  var workGrid = document.querySelector('[data-work-grid]');
  var viewButtons = document.querySelectorAll('[data-view]');
  viewButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var list = button.getAttribute('data-view') === 'list';
      if (workGrid) workGrid.classList.toggle('is-list', list);
      viewButtons.forEach(function (item) {
        var active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
  });

  /* 作品详情框架弹窗 */
  var workDialog = document.querySelector('[data-work-dialog]');
  if (workDialog) {
    var dialogTitle = workDialog.querySelector('[data-dialog-title]');
    var dialogType = workDialog.querySelector('[data-dialog-type]');
    document.querySelectorAll('[data-case-open]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (dialogTitle) dialogTitle.textContent = button.getAttribute('data-title') || '作品详情框架';
        if (dialogType) dialogType.textContent = button.getAttribute('data-type') || '';
        workDialog.showModal();
        document.body.style.overflow = 'hidden';
      });
    });
    var dialogClose = workDialog.querySelector('[data-dialog-close]');
    if (dialogClose) dialogClose.addEventListener('click', function () { workDialog.close(); });
    workDialog.addEventListener('close', function () { document.body.style.overflow = ''; });
    workDialog.addEventListener('click', function (event) {
      if (event.target !== workDialog) return;
      var rect = workDialog.getBoundingClientRect();
      var outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) workDialog.close();
    });
  }
  /* 联系页地图：按容器实际尺寸请求同尺寸画布，避免地图内部出现滚动条 */
  var mapFrame = document.querySelector('[data-map-frame]');
  if (mapFrame) {
    var mapBase = mapFrame.getAttribute('data-map-src') || '';
    var mapW = 0;
    var mapTimer = null;
    var sizeMap = function () {
      var w = Math.round(mapFrame.clientWidth);
      var h = Math.round(mapFrame.clientHeight);
      if (!mapBase || !w || !h) return;
      if (mapW && Math.abs(w - mapW) < 32) return;
      mapW = w;
      mapFrame.src = mapBase + '&w=' + w + '&h=' + h;
    };
    sizeMap();
    window.addEventListener('resize', function () {
      clearTimeout(mapTimer);
      mapTimer = setTimeout(sizeMap, 240);
    });
  }
})();
