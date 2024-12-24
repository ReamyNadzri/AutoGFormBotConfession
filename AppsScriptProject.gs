var token = "7383790920:AAEvp-QqHJmkKyTvGQyhOAOO0CKEJ4jeP4I";
var telegramUrl = "https://api.telegram.org/bot" + token;
var groupId = "-1002324531744";

function sendMessage(id, text) {
  var textData = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id),
      text: text,
      parse_mode: "HTML",
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', textData);
}

function downloadFile(fileId) {
  var file = DriveApp.getFileById(fileId);
  return file.getBlob();
}

function sendImageDirect(id, fileBlob) {
  var formData = {
    chat_id: id,
    photo: fileBlob,
  };
  var options = {
    method: "post",
    payload: formData,
  };
  try {
    var response = UrlFetchApp.fetch(telegramUrl + "/sendPhoto", options);
    Logger.log("Image sent successfully: " + response.getContentText());
  } catch (e) {
    Logger.log("Error sending image: " + e.message);
  }
}

function myFunction() {
  var form = FormApp.getActiveForm();
  var allResponses = form.getResponses();
  var latestResponse = allResponses[allResponses.length - 1];
  var response = latestResponse.getItemResponses();
  var text = "New Forms Submission:\n";

  for (var i = 0; i < response.length; i++) {
    var question = response[i].getItem().getTitle();
    var answer = response[i].getResponse();
    text += question + "\n" + answer + "\n\n";

    if (response[i].getItem().getType() == FormApp.ItemType.FILE_UPLOAD) {
      var files = response[i].getResponse();
      if (files.length > 0) {
        var fileId = files[0];
        var fileBlob = downloadFile(fileId);
        sendImageDirect(groupId, fileBlob);
      }
    }
  }

  sendMessage(groupId, text);
}
