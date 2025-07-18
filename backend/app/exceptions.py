# backend/app/exceptions.py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi import FastAPI

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        # Return the HTTPException’s status code and detail
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        # Log the full traceback to console
        import traceback; traceback.print_exc()
        # Return a generic error to the client
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error. Please try again later."},
        )
