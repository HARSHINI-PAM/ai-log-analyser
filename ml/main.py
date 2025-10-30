from http.server import BaseHTTPRequestHandler, HTTPServer

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(b'{"status":"ml service running"}')

if __name__ == '__main__':
    server_address = ('', 9000)
    httpd = HTTPServer(server_address, SimpleHandler)
    print('ML service running on port 9000...')
    httpd.serve_forever()
