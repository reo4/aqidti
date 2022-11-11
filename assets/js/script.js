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
  $("#pdf-container").flipBook(
    {
      pdfUrl: btn.data('pdf'),
      backgroundColor: "#EEF3F4",
      layout: 3,
    });
})