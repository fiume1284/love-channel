var channelId;
var channelIconUrl;
var cookieKeyName = "srtjs-channel-icons-output";

$(function() {
  var htmlFromCookie = $.cookie(cookieKeyName);
  $("#output").html(htmlFromCookie);

  var videoId = getVideoIdFromUrl();
  var channelIconUrl = searchChannelIconFromVideoId(videoId);

  console.log("channelIconUrl = " + channelIconUrl);
});

/**
 * 動画IDを返す
 */
function getVideoIdFromUrl() {
  var videoId = "jNQXAC9IVRw" // YouTube最古の動画
  var urlQueries = getUrlVars(); // 注意： getUrlVars は subtitle.js のメソッド
  if (urlQueries["v"]) {
    videoId = urlQueries["v"];
  }

  return videoId;
}

/**
 * 動画IDを基にチャンネルアイコンのURLを返す
 */
function searchChannelIconFromVideoId(videoId) {
  const apiKey = "AIzaSyBV-Toqtl1kzXyY1roeQZoeLE3fBTg_3Yw";

  $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + apiKey, function(data) {
    channelId = data["items"][0]["snippet"]["channelId"];
    console.log("channelId = " + channelId);

    return searchChannelIconFromChannelId(channelId);
  });
}

/**
 * チャンネルIDを基にチャンネルアイコンのURLを返す
 */
function searchChannelIconFromChannelId(channelId) {
  const apiKey = "AIzaSyBV-Toqtl1kzXyY1roeQZoeLE3fBTg_3Yw";

  $.get("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + channelId + "&key=" + apiKey, function(data) {
    channelIconUrl = data["items"][0]["snippet"]["thumbnails"]["default"]["url"];
    console.log("channelIconUrl = " + channelIconUrl);

    return channelIconUrl;
  });
}

function addText() {
  $("#output").append("<img src=\"" + channelIconUrl + "\">");

  $.cookie(cookieKeyName, $("#output").html(), {path: "/"});
}

/**
 * 出力エリアのすべてのアイコンとクッキーを削除
 */
function removeAllIcons() {
  if(confirm("本当に削除してよろしいですか？") === true) {
    $("#output").html("");
    deleteCookie();
  }
}

/**
 * クッキーの削除
 */
function deleteCookie() {
  $.removeCookie(cookieKeyName, {path: "/"});
}
