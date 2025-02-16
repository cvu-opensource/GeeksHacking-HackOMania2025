# build VectorDB docker image.
FROM python:3.10

RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

RUN curl -fsSL https://ollama.com/install.sh | sh
ENV EMBEDDER=mxbai-embed-large
ENV LLM=deepseek-r1:8b
# replace whatever after pull with whatever you want to pull
RUN ollama serve & sleep 5; ollama pull ${EMBEDDER}; ollama pull ${LLM}; echo "kill 'ollama serve' process"; ps -ef | grep 'ollama serve' | grep -v grep | awk '{print $2}' | xargs -r kill -9

ENV OLLAMA_HOST=127.0.0.1:11400
ENV DB_PATH=/vectordb/data
ENV COLLECTION_NAME=sequence_interest
ENV DISTANCE_TYPE=ip
EXPOSE 8000 8001
WORKDIR /vectordb

RUN pip install chromadb ollama fastapi uvicorn pydantic openai langchain-ollama langchain pydantic
# change copy location later if need be
COPY . /vectordb 

ENTRYPOINT ["./entrypoint.sh"]