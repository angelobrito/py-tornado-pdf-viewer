pdfjsLib.GlobalWorkerOptions.workerSrc = './static/build/pdf.worker.js';

function show_pdfDocument(url){
  
  console.log('PDF document new url='+url);
  
  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  console.log(pdfjsLib);

  // The workerSrc property shall be specified.

  // Asynchronous download of PDF
  var loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');
    
    // Fetch the first page
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
      console.log('Page loaded');
      
      var scale = 1.5;
      var viewport = page.getViewport({scale: scale});

      // Prepare canvas using PDF page dimensions
      var canvas = document.getElementById('the-canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      renderTask.promise.then(function () {
        console.log('Page rendered');
      });
    });
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
}



function pdfToPlainText(pdfData) {
  PDFJS.disableWorker = true;
  var pdf = PDFJS.getDocument(pdfData);
  pdf.then(getPages);
}

function getPages(pdf) {
  for (var i = 0; i < pdf.numPages; i++) {
    pdf.getPage(i + 1).then(getPageText);
  }
}

function getPageText(page) {
  page.getTextContent().then(function(textContent) {
    textContent.forEach(function(o) {
      $("#pdf").append(o.str + '</br>');
    });
  });
}
