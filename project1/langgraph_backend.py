# langgraph_backend.py

from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.tools import tool
from typing_extensions import TypedDict
from typing import Annotated
from dotenv import load_dotenv
import os, yfinance as yf, requests, openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")

# --- Tool Functions ---
def generate_image(prompt: str) -> str:
    """Generates an image using OpenAI DALL·E API and returns the image URL."""
    try:
        response = openai.Image.create(prompt=prompt, n=1, size="512x512")
        return response['data'][0]['url']
    except Exception as e:
        return f"[Image generation error: {str(e)}]"

def summarize_text(text: str) -> str:
    """Summarizes input text using OpenAI GPT."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful summarization assistant."},
                {"role": "user", "content": f"Summarize the following:\n{text}"}
            ],
            temperature=0.5
        )
        return response.choices[0].message["content"]
    except Exception as e:
        return f"[Error during summarization: {str(e)}]"

def chat_human(text: str) -> str:
    """Assist the user with general-purpose human support or reasoning."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": text}
            ],
            temperature=0.5
        )
        return response.choices[0].message["content"]
    except Exception as e:
        return f"[Error: {str(e)}]"

def search_web(query: str) -> str:
    """Performs a web search using Tavily API."""
    try:
        response = requests.post(
            "https://api.tavily.com/search",
            headers={"Authorization": f"Bearer {tavily_api_key}"},
            json={"query": query, "search_depth": "basic", "include_answer": True}
        )
        data = response.json()
        return data.get("answer") or "[No answer found]"
    except Exception as e:
        return f"[Web search error: {str(e)}]"

def stock_update(_: str) -> str:
    """Fetches latest Nifty 50 data using yfinance."""
    try:
        nifty = yf.Ticker("^NSEI")
        hist = nifty.history(period="1d")
        return hist.to_string()
    except Exception as e:
        return f"Failed to fetch stock data: {e}"

tools = [generate_image, summarize_text, search_web, stock_update, chat_human]

# --- LangGraph Setup ---
class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(model="gpt-4o")
llm_with_tools = llm.bind_tools(tools)
memory = MemorySaver()

def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node(chatbot)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "chatbot")
builder.add_conditional_edges("chatbot", tools_condition)
builder.add_edge("tools", "chatbot")
graph = builder.compile(checkpointer=memory)

# --- Callable function ---
def process_message(message: str, thread_id: int = 1):
    config = {'configurable': {'thread_id': thread_id}}
    state = graph.invoke({"messages": [{"role": "user", "content": message}]}, config=config)
    return state["messages"][-1].content
