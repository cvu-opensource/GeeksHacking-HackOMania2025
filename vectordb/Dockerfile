# build VectorDB docker image.
FROM python:3.10

RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

RUN curl -fsSL https://ollama.com/install.sh | sh

RUN pip install chromadb ollama fastapi uvicorn pydantic
RUN mkdir /vectordb
# change copy location later if need be
COPY . /vectordb 

ENV DB_PATH=/data
ENV COLLECTION_NAME=sequence_interest
ENV OLLAMA_MODEL=mxbai-embed-large
ENV DISTANCE_TYPE=ip
EXPOSE 8000
WORKDIR /

# try to pull the relevant iamge here?
# RUN ollama serve & ollama pull 

ENTRYPOINT ["./entrypoint.sh"]