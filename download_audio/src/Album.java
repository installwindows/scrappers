
package audiotagging;

public class Album {
    public String artwork;
    public String title;
    public String artist;
	public Track[] tracks;
    public String filetype;
    
    public Album(String title, String artist, String artwork, Track[] tracks, String filetype) {
        this.title = title;
        this.artist = artist;
        this.artwork = artwork;
		this.tracks = tracks;
		this.filetype = filetype;
    }
    
    public String artworkExtension(){
        return artwork.substring(artwork.lastIndexOf('.')+1);
    }
}
