from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates_directory = './dist/browser/'
templates = Jinja2Templates(directory = templates_directory)


entry_point = 'index.html'

@app.get("/", response_class = HTMLResponse)
def root(request: Request):
  return templates.TemplateResponse(
    request = request, name = entry_point, context = {}
  )


# Move the static files declaration at the bottom for it to work at the root ('/') level
static_route = '/'
static_directory = templates_directory

app.mount(static_route, StaticFiles(directory = static_directory), name = "static")
