from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import json
from typing import Type

class FileReadInputs(BaseModel):
    path: str = Field(description="Path to the file")

class FileReadTool(BaseTool):
    name: str = "file_read"
    description: str = "Read uploaded files (TXT, CSV, JSON)"
    args_schema: Type[BaseModel] = FileReadInputs

    def _run(self, path: str) -> str:
        """Use the tool."""
        return json.dumps({
            "path": path,
            "content": "This is a dummy file content."
        })

    async def _arun(self, path: str) -> str:
        """Use the tool asynchronously."""
        return json.dumps({
            "path": path,
            "content": "This is a dummy file content."
        })