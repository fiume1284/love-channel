var channelId;
var channelIconUrl;

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

  var ref = firebase.database().ref("channel_icons/html");
  ref.on("value", function(snapshot) {
    $("#output").html(snapshot.A.B);
  });

  var videoId = getVideoIdFromUrl();
  var channelIconUrl = searchChannelIconFromVideoId(videoId);

  searchRelatedVideoFromVideoId(videoId);
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
 * 関連動画を検索し、その一覧をページに出力
 */
function searchRelatedVideoFromVideoId(videoId) {
  const apiKey = "AIzaSyBV-Toqtl1kzXyY1roeQZoeLE3fBTg_3Yw";
  const maxResults = 12; // 検索ヒット数、APIのデフォルトは 5, 最大値は 50

  var requestUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video";
  requestUrl += "&maxResults=" + maxResults;
  requestUrl += "&relatedToVideoId=" + videoId;
  requestUrl += "&key=" + apiKey;

  $.get(requestUrl, function(data) {
    $("#next-video").html("");

    var items = data["items"];
    for(var i = 0; i < items.length; ++i) {
      var relatedVideoTitle = items[i]["snippet"]["title"];
      var relatedVideoId = items[i]["id"]["videoId"];

      $("#next-video").append(
        '<row>\
          <div class="col-sm-12">\
            <a class="btn btn-primary" \
            href="' + getCurrentUrlBase() + '?surl=5seconds.srt&autoplay=1&v=' + relatedVideoId + '">' + relatedVideoTitle + '</a>\
          </div>\
        </row>'
      );
    }
  });
}

/**
 * 現在のページから、クエリ・ハッシュ部分を除いたURLを取得
 * @return String http://a.com/xxx/ のような値が返る
 */
function getCurrentUrlBase() {
  var baseUrl = location.protocol + "//" + location.host + location.pathname;

  return baseUrl;
}

/**
 * 出力部分に、動画のチャンネルアイコンを足す。データベース側も更新
 */
function addIcon() {
  $("#output").append("<img src=\"" + channelIconUrl + "\">");

  firebase.database().ref("channel_icons").set({
    html: $("#output").html()
  });
}

/**
 * 出力エリアのすべてのアイコンとDBデータを削除
 */
function removeAllIcons() {
  if(confirm("本当に削除してよろしいですか？") === true) {
    $("#output").html("");

    firebase.database().ref("channel_icons").remove();
  }
}
