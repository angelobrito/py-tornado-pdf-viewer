import config
import os.path
import re
import tornado.ioloop
import tornado.web
import tornado.options

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        helloMessage = "PDF.js 'Hello, world!' example"
        self.render("template.html", message=helloMessage)

class EntryHandler(tornado.web.RequestHandler):
    def get(self, entry_id):
        helloMessage = "Hello World!"
        entry = self.dg.get("SELECT * FROM entries WHERE id = %s", entry_id)
        if not entry: raise tornado.web.HTTPError(404)
        self.render("template.html", message=helloMessage, entry=entry)

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
    app = Application()
    app.listen(config.port)
    print "Starting tornado server on port %d" % (config.port)
    tornado.ioloop.IOLoop.instance().start()
