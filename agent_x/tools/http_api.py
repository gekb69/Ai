from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import json
from typing import Type

class HttpApiInputs(BaseModel):
    method: str = Field(description="HTTP method")
    url: str = Field(description="URL to call")
    headers: dict = Field(description="HTTP headers")
    body: dict = Field(description="HTTP body")

class HttpApiTool(BaseTool):
    name: str = "http_api"
    description: str = "Generic HTTP API caller"
    args_schema: Type[BaseModel] = HttpApiInputs

    def _run(self, method: str, url: str, headers: dict, body: dict) -> str:
        """Use the tool."""
        return json.dumps({
            "status": 200,
            "response": {
                "message": f"Successfully called {url} with method {method}"
            }
        })

    async def _arun(self, method: str, url: str, headers: dict, body: dict) -> str:
        """Use the tool asynchronously."""
        return json.dumps({
            "status": 200,
            "response": {
                "message": f"Successfully called {url} with method {method}"
            }
        })