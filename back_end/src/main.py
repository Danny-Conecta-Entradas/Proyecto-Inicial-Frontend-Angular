from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
import re

app = FastAPI()

@app.get("/{full_path:path}", response_class = FileResponse)
def root(request: Request, full_path: str):
  resource_path_regexp = r'^.+\..+$'

  if re.match(string=full_path, pattern=resource_path_regexp) != None:
    return FileResponse(f'./dist/browser/{full_path}')

  return FileResponse(f'./dist/browser/index.html')
