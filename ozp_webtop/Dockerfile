FROM node:6.12.3


# Pre-install

RUN npm install --quiet --progress=false -g bower@1.3.12 grunt-cli > /dev/null

WORKDIR /app/ozp-webtop
RUN npm install --quiet --progress=false node-sass@3.4.2


# Dependencies

WORKDIR /app/lib
COPY lib .

WORKDIR /app/lib/ozp-iwc
RUN npm install --progress=false
RUN bower install --quiet --allow-root
RUN npm run build


# Application

WORKDIR /app/ozp-webtop

COPY ozp-webtop/package.json .
RUN npm install --quiet --progress=false

COPY ozp-webtop/bower.json ozp-webtop/.bowerrc ./
RUN bower install --quiet --allow-root

COPY ozp-webtop .


# Configuration

# Development server
EXPOSE 9000  

# Test server
EXPOSE 9001  

# Docs server
EXPOSE 9010  

# Production server
EXPOSE 9037  

# Data utility
EXPOSE 9600

# Sticky state demo
EXPOSE 9601

# Live reload
EXPOSE 35729

CMD grunt serve --force
