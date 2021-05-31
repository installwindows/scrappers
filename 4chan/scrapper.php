<?php

$MAIN_DIR = "/home/var/projects/scrappers/4chan/pics/";

function get_board_urls($url)
{
	$board = new StdClass();
	$array = explode('/', $url);

	$board->name = $array[3];
	$board->thread_id = $array[5];
	$board->json_url = "http://a.4cdn.org/$board->name/thread/{$board->thread_id}.json";
	$board->img_url = "http://i.4cdn.org/$board->name/";
	return $board;
}

function duplicate_check($md5, $jd)
{
	echo "md5: " . $md5 . "\n";
	for ($i = 0; $i < count($jd->images); $i++)
	{
		if ($jd->images[$i]->md5 == $md5)
			return false;
	}
	return true;
}

function get_images($url)
{
    global $MAIN_DIR;
	$board = get_board_urls($url);
	$json_string = file_get_contents($board->json_url);
	$json = json_decode($json_string);
	$dir = $board->thread_id . "/";
    if ($MAIN_DIR)
        $dir = $MAIN_DIR;
	mkdir($dir);
	file_put_contents($dir . $board->thread_id . ".json", $json_string);
	$n = 0;

	$jd = json_decode(file_get_contents($dir . "db.json"));
	if ($jd == NULL)
	{
		$jd = new stdClass();
		$jd->images = [];
	}
	for ($i = 0; $i < count($json->{'posts'}); $i++)
	{
		echo "Post $i:\n";
		if (isset($json->posts[$i]->filename) && duplicate_check($json->posts[$i]->md5, $jd))
		{
			echo "img: " . ++$n . "\n";
			echo "\t" . $json->posts[$i]->tim . $json->posts[$i]->ext . "\n";
			echo "\t" . $json->posts[$i]->filename . $json->posts[$i]->ext . "\n";
			$img = file_get_contents($board->img_url . $json->posts[$i]->tim . $json->posts[$i]->ext);
			$jd->images[] = (object) array(
				"filename" => $json->posts[$i]->tim . $json->posts[$i]->ext,
				"title" => $json->posts[$i]->filename,
				"md5" => $json->posts[$i]->md5
			);
			file_put_contents($dir . $json->posts[$i]->tim . $json->posts[$i]->ext, $img);
		}
		echo "\n";
	}
	file_put_contents($dir . "db.json", json_encode($jd));
}

function get_json_object($url)
{
	$board = get_board_urls($url);
	$json_string = file_get_contents($board->json_url);
	$json = json_decode($json_string);
	return $json;
}

function get_youtube_links($json)
{
	$links = [];
	$nb_posts = count($json->posts);
	for ($i = 0; $i < $nb_posts; $i++)
	{
		$com = $json->posts[$i]->com;
		$com_length = strlen($com);
		if (isset($com))
		{
			for ($k = 0; $k < $com_length; $k++)
			{
				if ((($pos = strpos($com, "youtu.be/", $k)) !== false) || (($pos = strpos($com, "/watch?v=", $k)) !== false))
				{
					$link = "";
					for ($j = $pos + 9; $j < $com_length; $j++)
					{
						if ($com[$j] == "<")
						{
							$j += 4;
							continue;
						}
						$link .= $com[$j];
						if (strlen($link) == 11)
						{
							$links[] = $link;
							break;
						}
					}
					$k = $j;
				}
			}
		}
	}
	return $links;
}

function download_youtube_links($links, $dir = "./")
{
	foreach ($links as $link)
	{
		echo "downloading\n";
		exec("youtube-dl --output '$dir/%(id)s - %(title)s.%(ext)s' --max-filesize 50m --extract-audio --audio-format mp3 $link");// &> /dev/null && echo $link success || echo $link failure");
	}
}

if (count($argv) < 2)
{
	echo "Please pass a thread url senpai desu\n";
}
else
{
	$url = $argv[1];
	$dir = (count($argv) > 2) ? $argv[2] : "./";
	//print_r(get_board_urls($url));
	get_images($url);
	//echo "check\n";
	//echo duplicate_check("rBMymwpFd1F/Db1pGNL68g==", json_decode(file_get_contents("db.json")));
	//$links = get_youtube_links(get_json_object($url));
	//print_r($links);
	//download_youtube_links($links, $dir);
}
?>
