var channelId;
var channelIconUrl;
var cookieKeyName = "srtjs-channel-icons-output";

$(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyBV-Toqtl1kzXyY1roeQZoeLE3fBTg_3Yw",
    authDomain: "youtube-view-counter-b55c2.firebaseapp.com",
    databaseURL: "https://youtube-view-counter-b55c2.firebaseio.com",
    projectId: "youtube-view-counter-b55c2",
    storageBucket: "youtube-view-counter-b55c2.appspot.com",
    messagingSenderId: "375316669656"
  };
  firebase.initializeApp(firebaseConfig);

  var ref = firebase.database().ref("icons/1/html");
  ref.on("value", function(snapshot) {
    $("#output").html(snapshot.A.B);
  });

  // var htmlFromCookie = $.cookie(cookieKeyName);
  // $("#output").html(htmlFromCookie);

  var videoId = getVideoIdFromUrl();
  var channelIconUrl = searchChannelIconFromVideoId(videoId);

  searchRelatedVideoFromVideoId(videoId);

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

/**
 * 関連動画を検索し、ランダムにひとつ動画IDを返す
 */
function searchRelatedVideoFromVideoId(videoId) {
  const apiKey = "AIzaSyBV-Toqtl1kzXyY1roeQZoeLE3fBTg_3Yw";

  $.get("https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&relatedToVideoId=" + videoId + "&key=" + apiKey, function(data) {
    $("#next-video").html("");

    var items = data["items"];
    for(var i = 0; i < items.length; ++i) {
      console.log(items[i]);
      var relatedVideoTitle = items[i]["snippet"]["title"];
      var relatedVideoId = items[i]["id"]["videoId"];

      $("#next-video").append(
        '<row>\
          <div class="col-sm-12">\
            <a class="btn btn-primary" \
            href="http://localhost:8014/?surl=5seconds.srt&autoplay=1&v=' + relatedVideoId + '">' + relatedVideoTitle + '</a>\
          </div>\
        </row>'
      );
    }
  });
}

function addText() {
  $("#output").append("<img src=\"" + channelIconUrl + "\">");

  $.cookie(cookieKeyName, $("#output").html(), {path: "/"});

  firebase.database().ref("icons/" + "1").set({
    html: $("#output").html()
  });
}

function gotoNextVideo(videoId) {
  location.href = "http://localhost:8014/?surl=5seconds.srt&autoplay=1&v=" + videoId;
}

/**
 * 出力エリアのすべてのアイコンとクッキーを削除
 */
function removeAllIcons() {
  if(confirm("本当に削除してよろしいですか？") === true) {
    $("#output").html("");
    deleteCookie();

    firebase.database().ref("icons/" + "1").remove();
  }
}

/**
 * クッキーの削除
 */
function deleteCookie() {
  $.removeCookie(cookieKeyName, {path: "/"});
}
