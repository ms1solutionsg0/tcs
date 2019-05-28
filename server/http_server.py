from singleton import Singleton
from aiohttp import web
import os
import asyncio

class HTTPserver(metaclass=Singleton):
    def __init__(self):
        self.SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
        self.PROJECT_DIR = os.path.join( os.path.dirname( __file__ ), '..' )
        self.loop = asyncio.get_event_loop()
        self.tasks = []
        self.app = web.Application()
        

    async def index(self, request):
        with open(self.PROJECT_DIR+'/client/dist/index.html') as f:
            return web.Response(text=f.read(), content_type='text/html')

    def add_background_task(self, task):
        self.tasks.append(task)

    async def start_background_tasks(self, app):
        for (name, task) in self.tasks:
            app[name] =app.loop.create_task(task())
    
    async def cleanup_background_tasks(self, app):
        for (name, task) in self.tasks:
            app[name].cancel()
            await app[name]

    async def create_app(self):
        self.app = web.Application()
        self.app.router.add_get('/', self.index)
        self.app.router.add_static('/', self.PROJECT_DIR+'/client/dist', show_index=True)
        return self.app

    def start(self):
        app = self.loop.run_until_complete(self.create_app())
        app.on_startup.append(self.start_background_tasks)
        app.on_cleanup.append(self.cleanup_background_tasks)
        web.run_app(app, port=80)
