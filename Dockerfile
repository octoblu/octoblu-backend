FROM node:0.12-onbuild
MAINTAINER Octoblu <docker@octoblu.com>
EXPOSE 80

RUN node_modules/.bin/gulp production
