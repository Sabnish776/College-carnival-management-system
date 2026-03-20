FROM ubuntu:latest
LABEL authors="sabu"

ENTRYPOINT ["top", "-b"]