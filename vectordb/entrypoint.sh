#!/bin/bash

# 3 seperate commands 
ollama serve & \
ollama run ${OLLAMA_MODEL} & \
python3 maincontrollervectordb.py 
