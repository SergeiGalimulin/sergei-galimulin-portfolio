/* Вход владельца. Демо без сервера: любая корректная почта и пароль от 6 символов
   открывают админку в этом браузере. Настоящая проверка появится с бэкендом. */
(function () {
  'use strict';
  var EYE = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>';
  var EYE_OFF = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.7"/><path d="M6.1 6.1C3.8 7.7 2.5 12 2.5 12s3.5 7 9.5 7a9.6 9.6 0 0 0 4.4-1"/></svg>';

  document.addEventListener('DOMContentLoaded', function () {
    try { if (localStorage.getItem('sg.session')) { location.replace('index.html'); return; } } catch (e) {}

    var mode = 'in';
    var tried = false;
    var $ = function (id) { return document.getElementById(id); };
    var email = $('email'), pass = $('password'), eye = $('eye'), notice = $('notice');
    eye.innerHTML = EYE;

    function errors() {
      var v = email.value.trim();
      return {
        email: !v ? 'Enter your email.' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'This doesn’t look like an email address.'),
        pass: !pass.value ? 'Enter your password.' : (pass.value.length < 6 ? 'Password must be at least 6 characters.' : '')
      };
    }

    function show() {
      var er = errors();
      [[email, $('email-err'), er.email], [pass, $('pass-err'), er.pass]].forEach(function (x) {
        var msg = tried ? x[2] : '';
        x[0].classList.toggle('is-error', !!msg);
        x[0].setAttribute('aria-invalid', !!msg);
        x[1].textContent = msg;
        x[1].hidden = !msg;
      });
      return er;
    }

    function setMode(m) {
      mode = m;
      tried = false;
      show();
      $('heading').textContent = m === 'in' ? 'Owner sign in' : 'Create owner account';
      $('submit').textContent = m === 'in' ? 'Sign in' : 'Create account';
      $('mode').textContent = m === 'in' ? 'First time? Create the owner account' : 'Already have an account? Sign in';
      pass.autocomplete = m === 'in' ? 'current-password' : 'new-password';
    }

    eye.addEventListener('click', function () {
      var on = pass.type === 'password';
      pass.type = on ? 'text' : 'password';
      eye.innerHTML = on ? EYE_OFF : EYE;
      eye.setAttribute('aria-label', on ? 'Hide password' : 'Show password');
      eye.setAttribute('aria-pressed', on);
    });
    [email, pass].forEach(function (el) { el.addEventListener('input', function () { notice.hidden = true; if (tried) show(); }); });
    $('mode').addEventListener('click', function () { notice.hidden = true; setMode(mode === 'in' ? 'up' : 'in'); });

    $('form').addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var er = show();
      if (er.email) { email.focus(); return; }
      if (er.pass) { pass.focus(); return; }
      if (mode === 'up') {
        pass.value = '';
        setMode('in');
        notice.textContent = 'Check your email to confirm your account, then sign in.';
        notice.hidden = false;
        return;
      }
      try { localStorage.setItem('sg.session', email.value.trim()); } catch (err) {}
      location.href = 'index.html';
    });
  });
})();
