var CV_URL =
  "https://vision.googleapis.com/v1/images:annotate?key=" + window.apiKey;

$(function() {
  $("#fileform").on("submit", uploadFiles);
});

/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $("#fileform [name=fileField]")[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile(event) {
  var content = event.target.result;
  sendFileToCloudVision(content.replace("data:image/jpeg;base64,", ""));
}

/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision(content) {
  var type = "DOCUMENT_TEXT_DETECTION";

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [
      {
        image: {
          content: content
        },
        features: [
          {
            type: type,
            maxResults: 200
          }
        ]
      }
    ]
  };

  $("#results").text("Loading...");
  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: "application/json"
  })
    .fail(function(jqXHR, textStatus, errorThrown) {
      $("#results").text("ERRORS: " + textStatus + " " + errorThrown);
    })
    .done(displayJSON);
}

/**
 * Displays the results.
 */
//To store extracted data
var extData='';
function displayJSON(data) {
    extData=data;
    uploadIgmur(file);
  //   var contents = JSON.stringify(data, null, 4);
  //   $('#results').text(contents);
  //   var evt = new Event('results-displayed');
  //   evt.results = contents;
  //   document.dispatchEvent(evt);
  console.log(data);
}
function uploadIgmur($files)
{
    if ($files.length) {

        // Reject big files
        if ($files[0].size > $(this).data("max-size") * 1024) {
          console.log("Please select a smaller file");
          return false;
        }
  
        // Begin file upload
        console.log("Uploading file to Imgur..");
  
        // Replace ctrlq with your own API key
        var apiUrl = 'https://api.imgur.com/3/image';
        var apiKey = 'ctrlq';
  
        var settings = {
          async: false,
          crossDomain: true,
          processData: false,
          contentType: false,
          type: 'POST',
          url: apiUrl,
          headers: {
            Authorization: 'Client-ID ' + apiKey,
            Accept: 'application/json'
          },
          mimeType: 'multipart/form-data'
        };
  
        var formData = new FormData();
        formData.append("image", $files[0]);
        settings.data = formData;
  
        // Response contains stringified JSON
        // Image URL available at response.data.link
        $.ajax(settings).done(function(response) {
            if(localStorage.getItem("urls"))
            {
                urls=JSON.parse(localStorage.getItem("urls"));
            }
            else
            {
                urls=[];
            }
            urls.push(response);
            localStorage.setItem("urls", JSON.stringify(urls));
            if(localStorage.getItem("texts"))
            {
                texts=JSON.parse(localStorage.getItem("texts"));
            }
            else
            {
                texts=[];
            }
            texts.push(response);
            localStorage.setItem("texts", JSON.stringify(texts));
          console.log(response);
        });
  
      }
}
//function to get data from localstorage
function historyData()
{

}


