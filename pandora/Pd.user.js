// ==UserScript==
// @name         Pd
// @version      4.20
// @description  Yarrr!
// @author       (You)
// @match        *.pandora.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

const title_selector = "div.Marquee__wrapper__content";
const artist_selector = "a.NowPlayingTopInfo__current__artistName.NowPlayingTopInfo__current__artistName--link";
const album_selector = "a.nowPlayingTopInfo__current__albumName.nowPlayingTopInfo__current__link";
const lyrics_selector = "div.Lyrics__lyrics__wrapper";
const artwork_selector = "div.nowPlayingTopInfo__artContainer__art";

function dw_set_button_audio(current_audio) {
    var button = document.getElementById('dw_button');

    if (button != undefined) {
        button.setAttribute('data-uri', JSON.stringify(current_audio));
    }
	var checkbox = document.getElementById('dw_checkbox');

	if (checkbox != undefined) {
		if (checkbox.checked)
		{
			button.click();
		}
	}
}

function dw_get_button_audio() {
    var button = document.getElementById('dw_button');

    if (button) {
        var data = button.getAttribute('data-uri');

        if (data) {
            return JSON.parse(data);
        }
    }
    return undefined;
}

function check_audio() {
    var audio_tags = document.getElementsByTagName('audio');
    var last_audio = audio_tags[audio_tags.length - 1];
    var current_audio = dw_get_button_audio();
//console.log((current_audio == undefined || current_audio.url != last_audio.getAttribute('src')) && document.querySelector('div.nowPlayingTopInfo__current') != undefined);
    if ((!current_audio || current_audio.tracks[0].url != last_audio.getAttribute('src')) && document.querySelector('div.nowPlayingTopInfo__current'))
    {
        // var lyrics_more = document.querySelector('button.Lyrics__divider__button');
        // if (lyrics_more)
        //     lyrics_more.click();
        //Wait the "click"
        setTimeout(function() {
            var song_title = document.querySelector(title_selector);
            var artist = document.querySelector(artist_selector);
            var album = document.querySelector(album_selector);

            var lyrics = document.querySelector(lyrics_selector);
            var artwork = document.querySelector(artwork_selector);
            var url = last_audio.getAttribute('src');

            var new_audio = {};
	        if (album)
                new_audio.title = album.innerHTML;
            if (artist)
                new_audio.artist = artist.innerHTML;
            if (artwork)
                new_audio.artwork = artwork.style.backgroundImage.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
            if (song_title)
				new_audio.tracks = [{"title": song_title.innerHTML, "url": url}];
            //if (lyrics)
            //    new_audio.lyrics = lyrics.innerHTML.replace(/<p>/g, '').replace(/<\/p>/g, '\n');
            //new_audio.url = url;
			new_audio.filetype = "m4a";
            dw_set_button_audio(new_audio);
            console.log("N: " + new_audio.toString());
        }, 500);
    }
    //console.log('Just checking...' + current_audio);
}

function dw_append_container() {
    var tuner_container = document.querySelector('span.Tuner__Controls');

    var dw_container = document.createElement('div');
    var dw_button = document.createElement('button');

    dw_container.setAttribute('class', 'Tuner__Control');
    dw_container.setAttribute('id', 'dw_container');
    dw_button.setAttribute('class', 'TunerControl Tuner__Control__Button');
    dw_button.setAttribute('id', 'dw_button');
    dw_button.innerHTML = '[Download]';
    dw_button.onclick = function () {
        var link = document.createElement('a');
        link.setAttribute("download", "please_read_me_senpai.json");
        link.setAttribute("href", "data:text/json;charset=utf-8," + (document.getElementById('dw_button').getAttribute('data-uri')));
        link.click();
    };
	var dw_checkbox_container = document.createElement('div');
    dw_checkbox_container.setAttribute('class', 'Tuner__Control');
    dw_checkbox_container.setAttribute('id', 'dw_checkbox_container');
	var dw_checkbox = document.createElement('input');
	dw_checkbox.setAttribute('type', 'checkbox');
	dw_checkbox.setAttribute('id', 'dw_checkbox');

	dw_checkbox_container.innerHTML = "Auto ";
    dw_container.appendChild(dw_button);
	dw_checkbox_container.appendChild(dw_checkbox);
    tuner_container.appendChild(dw_container);
	tuner_container.appendChild(dw_checkbox_container);

}

function the_d() {
    console.log('Is this real life?');
}

(function () {
    'use strict';

    if (typeof GM_info !== undefined)
    {
        if (document.getElementById('pd_script') == undefined)
        {
            var script = document.createElement('script');

            script.setAttribute('id', 'pd_script');
            script.innerHTML = GM_info.scriptSource;
            document.getElementsByTagName('body')[0].appendChild(script);

            var d = document.createElement('button');
            d.setAttribute('style', 'display: none');
            d.setAttribute('onclick', 'setInterval(check_audio, 2000)');
            document.getElementsByTagName('body')[0].appendChild(d);
            d.click();
        }
    }
    var wait_tuner_container = setInterval(function() {
        var tc = document.querySelector('span.Tuner__Controls');
        if (tc != undefined) {
            clearInterval(wait_tuner_container);
            if (document.getElementById('dw_container') == undefined)
                dw_append_container();
        }
    }, 100);
}());

