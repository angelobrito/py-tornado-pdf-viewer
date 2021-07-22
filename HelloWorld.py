import config
import os
import re
import tornado.ioloop
import tornado.web
import tornado.options
import tornado.autoreload

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        helloMessage = "PDF.js 'Hello, world!' test"
        files = [f for f in os.listdir('static/files/') if os.path.isfile(os.path.join('static/files/', f))]
        self.render("template.html", message=helloMessage, files=files)

settings = {
    "debug": True,
    "template_path": os.path.join(config.base_dir, "templates"),
    "static_path": os.path.join(config.base_dir, "static")
}

class StopTornado(tornado.web.RequestHandler):
    def get(self):
        tornado.ioloop.IOLoop.instance().stop()

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            # Add more paths here
            (r'/lib/(.*)', tornado.web.StaticFileHandler, {'path': 'lib/'}),
            (r'/static/files/(.*)', tornado.web.StaticFileHandler, {'path': 'static/files/'}),
            (r"/KillTornado/", StopTornado)
        ]
        settings = {
            "debug": True,
            "template_path": os.path.join(config.base_dir, "templates"),
            "static_path": os.path.join(config.base_dir, "static")
        }
        tornado.web.Application.__init__(self, handlers, **settings)


if __name__ == "__main__":
    tornado.options.parse_command_line()
    tornado.autoreload.start()
    app = Application()
    app.listen(config.port)
    for dir, _, files in os.walk('static'):
        [tornado.autoreload.watch(dir + '/' + f) for f in files if not f.startswith('.')]
    print "Starting tornado server on port %d" % (config.port)
    tornado.ioloop.IOLoop.instance().start()
