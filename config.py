import tornado.options

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)
port = options.port

base_dir = ''