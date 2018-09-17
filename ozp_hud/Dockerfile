FROM node:6.12.3


# Pre-install

RUN npm install --quiet --progress=false -g bower@1.3.12 grunt-cli > /dev/null

WORKDIR /usr/local/share
RUN wget -q https://github.com/medium/phantomjs/releases/download/v1.9.19/phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    tar jxf phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    ln -s /usr/local/share/phantomjs-1.9.8-linux-x86_64/ /usr/local/share/phantomjs && \
    ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/local/bin/phantomjs

WORKDIR /app/ozp-hud
RUN npm install --quiet --progress=false node-sass@3.4.2


# Dependencies

WORKDIR /app/lib
COPY lib .


# Application

WORKDIR /app/ozp-hud

COPY ozp-hud/package.json .
RUN npm install --quiet --progress=false

COPY ozp-hud/bower.json .
RUN bower install --quiet --allow-root

COPY ozp-hud .


# Configuration

EXPOSE 8088

CMD npm run start
