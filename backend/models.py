from pydantic import BaseModel

class CreateContainerRequest(BaseModel):
    name: str
    cpu: float
    ram: str
