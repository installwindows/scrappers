var album = {
	artist: TralbumData.artist,
	title: TralbumData.current.title,
	artwork: document.querySelector("#tralbumArt > a > img").getAttribute('src'),
	tracks: [],
	filetype: "mp3"
};

TralbumData.trackinfo.forEach(function(track) {
	album.tracks.push({title: track.title, url: track.file["mp3-128"]});
});

var json_string = JSON.stringify(album);

var link = document.createElement("a");
link.setAttribute("href", "data:text/html," + json_string);
link.setAttribute("download", "please_read_me_senpai.json");
link.innerHTML = "Steal this album";

document.querySelector("h4.ft:nth-child(2)").appendChild(link);
