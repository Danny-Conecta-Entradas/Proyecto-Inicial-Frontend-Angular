from fastapi import FastAPI, Request
from fastapi.responses import Response, FileResponse
import re
import os

app = FastAPI()

@app.get("/{full_path:path}", response_class = Response)
def root(request: Request, full_path: str):
  resource_path_regexp = r'^.*\..+$'

  # Split url parameters to only get the pathname
  path = full_path.split('?')[0]

  if re.match(string=path, pattern=resource_path_regexp) != None:
    resource_path = f'./dist/browser/{path}'

    if not os.path.isfile(resource_path):
      return Response(status_code=404, content='Resource Not Found')

    return FileResponse(resource_path)

  return FileResponse(f'./dist/browser/index.html')
