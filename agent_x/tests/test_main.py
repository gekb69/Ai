from fastapi.testclient import TestClient
from unittest.mock import patch
from agent_x.main import app, MockAgentExecutor

client = TestClient(app)

@patch('agent_x.main.agent_executor', new_callable=MockAgentExecutor)
def test_invoke_agent(mock_agent_executor):
    response = client.post("/invoke", json={"query": "ابحث عن أحدث طلبات التذاكر المتعلقة بخطأ تسجيل الدخول خلال 7 أيام الماضية وأعطني ملخصاً وادخل تذكرة جديدة إذا تجاوز عدد الحوادث 5."})
    assert response.status_code == 200
    data = response.json()
    assert "step_plan" in data
    assert "tool_calls" in data
    assert "result" in data
    assert "audit_log" in data
    assert data["result"] == "هناك 8 حالات فشل تسجيل الدخول خلال 7 أيام الماضية. تم إنشاء تذكرة جديدة (ID: TCK-1234)."
