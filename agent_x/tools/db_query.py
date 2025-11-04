from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import json
from typing import Type

class DbQueryInputs(BaseModel):
    query: str = Field(description="SQL query")
    params: dict = Field(description="Query parameters")

class DbQueryTool(BaseTool):
    name: str = "db_query"
    description: str = "Query internal DB (read-only by default)"
    args_schema: Type[BaseModel] = DbQueryInputs

    def _run(self, query: str, params: dict) -> str:
        """Use the tool."""
        if "login_failed" in query:
            return json.dumps({
                "count": 8,
                "results": [
                    {"id": 1, "created_at": "2025-11-03T10:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 2, "created_at": "2025-11-03T11:00:00Z", "user_id": "user-456", "details": "Failed login attempt"},
                    {"id": 3, "created_at": "2025-11-03T12:00:00Z", "user_id": "user-789", "details": "Failed login attempt"},
                    {"id": 4, "created_at": "2025-11-03T13:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 5, "created_at": "2025-11-03T14:00:00Z", "user_id": "user-456", "details": "Failed login attempt"},
                    {"id": 6, "created_at": "2025-11-03T15:00:00Z", "user_id": "user-789", "details": "Failed login attempt"},
                    {"id": 7, "created_at": "2025-11-03T16:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 8, "created_at": "2025-11-03T17:00:00Z", "user_id": "user-456", "details": "Failed login attempt"}
                ]
            })
        else:
            return json.dumps({"count": 0, "results": []})

    async def _arun(self, query: str, params: dict) -> str:
        """Use the tool asynchronously."""
        if "login_failed" in query:
            return json.dumps({
                "count": 8,
                "results": [
                    {"id": 1, "created_at": "2025-11-03T10:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 2, "created_at": "2025-11-03T11:00:00Z", "user_id": "user-456", "details": "Failed login attempt"},
                    {"id": 3, "created_at": "2025-11-03T12:00:00Z", "user_id": "user-789", "details": "Failed login attempt"},
                    {"id": 4, "created_at": "2025-11-03T13:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 5, "created_at": "2025-11-03T14:00:00Z", "user_id": "user-456", "details": "Failed login attempt"},
                    {"id": 6, "created_at": "2025-11-03T15:00:00Z", "user_id": "user-789", "details": "Failed login attempt"},
                    {"id": 7, "created_at": "2025-11-03T16:00:00Z", "user_id": "user-123", "details": "Failed login attempt"},
                    {"id": 8, "created_at": "2025-11-03T17:00:00Z", "user_id": "user-456", "details": "Failed login attempt"}
                ]
            })
        else:
            return json.dumps({"count": 0, "results": []})