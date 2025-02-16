#!/bin/bash

# 3 seperate commands 
ollama serve & \
ollama run ${EMBEDDER} & \
ollama run ${LLM} & \
python3 MainControllerVectorDB.py & \
python3 MainControllerEventsDB.py \
