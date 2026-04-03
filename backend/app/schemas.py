from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ChatMessage(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    response: str
    error: Optional[str] = None


class DietRequest(BaseModel):
    height: int
    weight: int
    age: int
    gender: str
    diseases: Optional[str] = ""
    preferences: List[str]
    week: str
    goal: Optional[str] = ""
    activity_level: Optional[str] = ""


class Food(BaseModel):
    name: str
    veg: bool
    reciepie: str


class DietPlan(BaseModel):
    breakfast: List[Food]
    # morning_lightfood: List[Food]
    lunch: List[Food]
    # evening_lightfood: List[Food]
    dinner: List[Food]
