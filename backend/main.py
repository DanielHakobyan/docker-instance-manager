from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import CreateContainerRequest
import service

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/containers")
def get_containers():
    return service.list_containers()

@app.post("/containers")
def create_container(req: CreateContainerRequest):
    return {"id": service.create_container(req.name, req.cpu, req.ram)}

@app.post("/containers/{container_id}/start")
def start_container(container_id: str):
    return {"success": service.start_container(container_id)}

@app.post("/containers/{container_id}/stop")
def stop_container(container_id: str):
    return {"success": service.stop_container(container_id)}

@app.delete("/containers/{container_id}")
def delete_container(container_id: str):
    return {"success": service.delete_container(container_id)}
