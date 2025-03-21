const themes = {
  light: {
    bodyBackgroundColor: '#fff',
    formBackgroundColor: '#fff',
    textColor: '#000',
    buttonBackgroundColor: '#69a84f',
    buttonTextColor: '#fff',
    buttonHoverBackgroundColor: '#fff',
    buttonHoverTextColor: '#69a84f',
    fieldBorderColor: '0',
    labelText: '#000',
    termsNotice: '#37761d',
    termsNoticeBorder: '#37761d'
  },
  dark: {
    bodyBackgroundColor: '#121212',
    formBackgroundColor: '#333',
    textColor: '#333',
    buttonBackgroundColor: '#555',
    buttonTextColor: '#fff',
    buttonHoverBackgroundColor: '#fff',
    buttonHoverTextColor: '#333',
    fieldBorderColor: '#000',
    labelText: '#fff',
    termsNotice: '#fff',
    termsNoticeBorder: '#fff'
  },
  custom: {
    bodyBackgroundColor: '#f4f4f4',
    formBackgroundColor: '#a1a4a7',
    textColor: '#333',
    buttonBackgroundColor: '#ffa500',
    buttonTextColor: '#fff',
    buttonHoverBackgroundColor: '#fff',
    buttonHoverTextColor: '#ffa500',
    fieldBorderColor: '#000',
    labelText: '#fff',
    termsNotice: '#fff',
    termsNoticeBorder: '#fff'
  }
};

function applyTheme(theme) {
  const form = document.querySelector('.form-fields');
  const button = document.querySelector('#submit');
  const fields = document.querySelectorAll('input, select, textarea');
  const labels = document.querySelectorAll('h2, h3, label, .consent-text')
  const terms = document.querySelector('.terms-notice');

  document.body.style.backgroundColor = theme.bodyBackgroundColor;

  if (form && theme) {
    form.style.backgroundColor = theme.formBackgroundColor;
    form.style.color = theme.textColor;
    button.style.backgroundColor = theme.buttonBackgroundColor;
    button.style.color = theme.buttonTextColor;

    const buttonHoverBackgroundColor = theme.buttonHoverBackgroundColor;
    const buttonHoverTextColor = theme.buttonHoverTextColor;

    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = buttonHoverBackgroundColor;
      button.style.color = buttonHoverTextColor;
    });

    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = theme.buttonBackgroundColor;
      button.style.color = theme.buttonTextColor;
    });

    fields.forEach(field => {
      field.style.borderColor = theme.fieldBorderColor;
      field.style.color = theme.textColor;

      field.addEventListener('mouseover', () => {
        field.style.borderColor = theme.fieldBorderColor;
      });

      field.addEventListener('mouseout', () => {
        field.style.borderColor = theme.fieldBorderColor;
      });
    });

    labels.forEach(label => {
      label.style.color = theme.labelText;
    });

    if (terms) {
      terms.style.color = theme.termsNotice;
      terms.style.borderColor = theme.termsNoticeBorder;
    }
  }
}

function getQueryParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function applyThemeFromURL() {
  const selectTheme = getQueryParameter('theme');

  const theme = themes[selectTheme] || themes['light'];
  applyTheme(theme);
}