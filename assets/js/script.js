function download(e, el) {

  el.parentNode.parentNode.style.display = 'none'

  document.querySelector('[js-col-download]').style.display = 'block'

}

function closeDownload(e, el) {
  e.preventDefault();

  document.querySelector('[js-parent-download]').style.display = null

  el.parentNode.parentNode.style.display = 'none'

}

const btn = $('[data-pdf]')

btn.on('click', function () {
  $("body").flipBook(
    {
      pdfUrl: btn.data('pdf'),
      backgroundColor: "#EEF3F4",
      layout: 3,
    });

  $('.flipbook-main-wrapper').css('margin-top', '150px')
  $('#books-section').css('margin-top', '150px')
})