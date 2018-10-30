package audiotagging;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Downloading {
    public static File downloadFile(URL url, String saveAs){
        try {
            File file = new File(saveAs);
            if (file.exists())
				return file;
            URLConnection connection = url.openConnection();
            InputStream in = connection.getInputStream();
            FileOutputStream fos = new FileOutputStream(new File(saveAs));
            byte[] buf = new byte[512];
            while (true) {
                int len = in.read(buf);
                if (len == -1) {
                    break;
                }
                fos.write(buf, 0, len);
            }
            in.close();
            fos.flush();
            fos.close();
            return new File(saveAs);
        } catch (Exception ex) {
            Logger.getLogger(Downloading.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
}
