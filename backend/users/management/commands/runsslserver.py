from django.core.management.commands.runserver import Command as RunserverCommand
import ssl
from backend.settings import CERT_PATH, KEY_PATH
from django.core.servers.basehttp import WSGIServer, WSGIRequestHandler

class SSLWSGIServer(WSGIServer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(certfile=CERT_PATH, keyfile=KEY_PATH)
        self.socket = context.wrap_socket(self.socket, server_side=True)

class Command(RunserverCommand):
    default_addr = '127.0.0.1'
    default_port = '8000'

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument('--use_ssl', action='store_true', help='Use SSL for the server')

    def run(self, **options):
        if options.get('use_ssl'):
            self.stdout.write("Starting server with SSL...")
            self.server_cls = SSLWSGIServer
        super().run(**options)
