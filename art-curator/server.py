#!/usr/bin/env python3
import argparse
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


SITE_ROOT = Path(__file__).resolve().parent.parent
ANNOTATIONS_PATH = Path(__file__).resolve().parent / 'annotations.json'


class CuratorHandler(SimpleHTTPRequestHandler):
    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/annotations':
            try:
                payload = json.loads(ANNOTATIONS_PATH.read_text(encoding='utf-8'))
            except (FileNotFoundError, json.JSONDecodeError):
                payload = {}
            self.send_json(payload)
            return
        if path == '/api/health':
            self.send_json({'status': 'ok'})
            return
        super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path != '/api/annotations':
            self.send_error(404)
            return

        try:
            length = int(self.headers.get('Content-Length', '0'))
            if length <= 0 or length > 2_000_000:
                raise ValueError('Invalid request size')
            payload = json.loads(self.rfile.read(length).decode('utf-8'))
            if not isinstance(payload, dict):
                raise ValueError('Annotations must be a JSON object')
            for item_id, record in payload.items():
                if not isinstance(item_id, str) or not isinstance(record, dict):
                    raise ValueError('Invalid annotation record')
                for field in ('name', 'category', 'note'):
                    value = record.get(field, '')
                    if not isinstance(value, str) or len(value) > 500:
                        raise ValueError(f'Invalid {field}')
                if not isinstance(record.get('featured', False), bool):
                    raise ValueError('Invalid featured value')
                if not isinstance(record.get('eyeLevel', False), bool):
                    raise ValueError('Invalid eyeLevel value')

            temporary = ANNOTATIONS_PATH.with_suffix('.json.tmp')
            temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
            temporary.replace(ANNOTATIONS_PATH)
            self.send_json({'saved': True, 'count': len(payload)})
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError) as error:
            self.send_json({'saved': False, 'error': str(error)}, status=400)

    def log_message(self, format, *args):
        if urlparse(self.path).path.startswith('/api/'):
            super().log_message(format, *args)


def main():
    parser = argparse.ArgumentParser(description='Serve the private art curator locally.')
    parser.add_argument('--port', type=int, default=8766)
    args = parser.parse_args()
    handler = partial(CuratorHandler, directory=str(SITE_ROOT))
    server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    print(f'Art curator: http://127.0.0.1:{args.port}/art-curator/', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
