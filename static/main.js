pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdfjs-dist-2.6.347/package/es5/build/pdf.worker.js';

var pdfDoc = null,
    pageNum = 0,
    numPages = 0,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5,
    canvas = null,
    ctx = null;

function show_pdfDocument(url){
  
  console.log('PDF document new url='+url);
  
  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  console.log(pdfjsLib);

  // Asynchronous download of PDF
  pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    console.log('PDF loaded:' + url);

    document.getElementById('page_count').textContent = pdfDoc.numPages;
    canvas = document.getElementById('the-canvas');
    ctx    = canvas.getContext('2d'); 

    // Fetch the first page
    pageNum = 1;
    
    // Initial/first page rendering
    queueRenderPage(pageNum);
  }, function (reason) {
    // PDF loading error
    console.error(reason);
  });
}

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(pageNumber) {
  pageRendering = true;

  // Using promise to fetch the page
  pdfDoc.getPage(pageNumber).then(function(page) {
    console.log('Page ' + pageNumber + '/' + numPages + ' loaded')

    var viewport = page.getViewport({scale: scale});

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      console.log('Page rendered');
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('page_num').textContent = pageNumber;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(pageNumber) {
  console.log('PDF page ' + pageNumber + ' rendering queued');
  if (pageRendering) {
    pageNumPending = pageNumber;
  } else {
    renderPage(pageNumber);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
