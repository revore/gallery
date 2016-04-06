# Orginally taken from
# https://www.practicingruby.com/articles/implementing-an-http-file-server

require 'socket'
require 'uri'
require 'net/http'

WEB_ROOT = './'

CONTENT_TYPE_MAPPING = {
  'html' => 'text/html',
  'txt' => 'text/plain',
  'png' => 'image/png',
  'jpg' => 'image/jpeg'
}

DEFAULT_CONTENT_TYPE = 'application/octet-stream'

def content_type(path)
  ext = File.extname(path).split(".").last
  CONTENT_TYPE_MAPPING.fetch(ext, DEFAULT_CONTENT_TYPE)
end

def requested_file(request_line = nil)
  request_uri  = request_line.split(" ")[1]
  path         = URI.unescape(URI(request_uri).path)
  File.join(WEB_ROOT, path)
end

def render_not_found(socket)
  message = "File not found\n"

  socket.print "HTTP/1.1 404 Not Found\r\n" +
               "Content-Type: text/plain\r\n" +
               "Content-Length: #{message.size}\r\n" +
               "Connection: close\r\n"

  socket.print "\r\n"

  socket.print message
end

server = TCPServer.new('localhost', 2345)

loop do
  socket       = server.accept
  request_line = socket.gets

  STDERR.puts request_line

  path = requested_file(request_line)
  path = File.join(path, 'index.html') if File.directory?(path)

  puts path.split("/")[1]

  if File.exist?(path) && !File.directory?(path)
    File.open(path, "rb") do |file|
      socket.print "HTTP/1.1 200 OK\r\n" +
                   "Content-Type: #{content_type(file)}\r\n" +
                   "Content-Length: #{file.size}\r\n" +
                   "Connection: close\r\n"

      socket.print "\r\n"

      IO.copy_stream(file, socket)
    end
  elsif path.split("/")[1] == "i"
    path = path[1..path.length]
    message = Net::HTTP.get('hello-paulmckellar.revoreio.dev', path)

    socket.print "HTTP/1.1 200 OK\r\n" +
                 "Content-Type: text/html\r\n" +
                 "Content-Length: #{message.size}\r\n" +
                 "Connection: close\r\n"

    socket.print "\r\n"

    socket.print message
  else
    render_not_found(socket)
  end

  socket.close
end

