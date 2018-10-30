package audiotagging;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.images.Artwork;
import org.jaudiotagger.tag.images.ArtworkFactory;

public class AudioTagging {
    public static void main(String[] args) {
        String saveLocation = null;
        try {
            if (args.length < 1)
            {
                System.err.println("java -jar AudioTagging.jar file.json /save/directory/");
                return;
            }
            String line = "";
            for(String l : Files.readAllLines(Paths.get(args[0])))
                line += l;
            Album album = new Gson().fromJson(line, Album.class);
			
			saveLocation = args.length > 1 ? args[1] + "/" : "./" + album.artist + "/" + album.title + "/";
			new File(saveLocation).mkdirs();

			System.out.println(album.title);
			System.out.println(album.artist);
			System.out.println(album.artwork);
			System.out.println();

			File artworkFile = Downloading.downloadFile(new URL(album.artwork), saveLocation + "pd_artwork." + album.artworkExtension());
            Artwork artwork = ArtworkFactory.createArtworkFromFile(artworkFile);
			int i = 0;
			for (Track track : album.tracks) {
				i++;
				System.out.println(track.title);
				System.out.println(track.url);

				File audioFile = Downloading.downloadFile(new URL(track.url), saveLocation + album.artist + " - " + track.title.replaceAll("/", "|") + "." + album.filetype);
				AudioFile fileToTag = AudioFileIO.read(audioFile);
				Tag tag = fileToTag.getTagOrCreateDefault();
				tag.setField(FieldKey.ARTIST, album.artist);
				tag.setField(FieldKey.ALBUM_ARTIST, album.artist);
				tag.setField(FieldKey.ALBUM, album.title);
				tag.setField(FieldKey.TITLE, track.title);
				tag.setField(FieldKey.TRACK, Integer.toString(i));
                tag.setField(artwork);

				fileToTag.commit();
				System.out.println("x---------------------x\n");
			}
			artworkFile.delete();
			

        } catch (Exception ex) {
                System.err.println(new SimpleDateFormat("yyyyMMdd_HHmmss").format(Calendar.getInstance().getTime()) + " " + ex.toString());
        }
    }
}
