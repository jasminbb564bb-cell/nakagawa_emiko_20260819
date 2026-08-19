import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.Executors;

public class App {
  private static final int PORT = 8080;
  private static final Map<String, Asset> ROUTES =
      Map.of(
          "/", new Asset("index.html", "text/html; charset=UTF-8"),
          "/style.css", new Asset("style.css", "text/css; charset=UTF-8"),
          "/app.js", new Asset("app.js", "application/javascript; charset=UTF-8"));

  public static void main(String[] args) throws IOException {
    HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
    server.createContext("/", new StaticFileHandler());
    server.setExecutor(Executors.newCachedThreadPool());
    server.start();

    System.out.println("サーバー起動: http://localhost:8080");
  }

  private static final class StaticFileHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
      try {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
          sendText(exchange, 405, "Method Not Allowed");
          return;
        }

        String path = exchange.getRequestURI().getPath();
        Asset asset = ROUTES.get(path);

        if (asset == null) {
          sendText(exchange, 404, "404 Not Found");
          return;
        }

        Path filePath = Path.of(asset.fileName());
        if (!Files.exists(filePath)) {
          sendText(exchange, 404, "404 Not Found");
          return;
        }

        byte[] body = Files.readAllBytes(filePath);
        Headers headers = exchange.getResponseHeaders();
        headers.set("Content-Type", asset.contentType());
        exchange.sendResponseHeaders(200, body.length);

        try (OutputStream output = exchange.getResponseBody()) {
          output.write(body);
        }
      } finally {
        exchange.close();
      }
    }
  }

  private static void sendText(HttpExchange exchange, int statusCode, String text) throws IOException {
    byte[] body = text.getBytes(StandardCharsets.UTF_8);
    exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
    exchange.sendResponseHeaders(statusCode, body.length);

    try (OutputStream output = exchange.getResponseBody()) {
      output.write(body);
    }
  }

  private record Asset(String fileName, String contentType) {}
}
