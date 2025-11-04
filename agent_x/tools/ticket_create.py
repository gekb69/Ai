from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import json
import random
from typing import Type

class TicketCreateInputs(BaseModel):
    title: str = Field(description="Ticket title")
    description: str = Field(description="Ticket description")
    priority: str = Field(description="Ticket priority")
    metadata: dict = Field(description="Ticket metadata")

class TicketCreateTool(BaseTool):
    name: str = "ticket_create"
    description: str = "Create support ticket in ticketing system"
    args_schema: Type[BaseModel] = TicketCreateInputs

    def _run(self, title: str, description: str, priority: str, metadata: dict) -> str:
        """Use the tool."""
        ticket_id = f"TCK-{random.randint(1000, 9999)}"
        return json.dumps({
            "status": "success",
            "ticket_id": ticket_id
        })

    async def _arun(self, title: str, description: str, priority: str, metadata: dict) -> str:
        """Use the tool asynchronously."""
        ticket_id = f"TCK-{random.randint(1000, 9999)}"
        return json.dumps({
            "status": "success",
            "ticket_id": ticket_id
        })