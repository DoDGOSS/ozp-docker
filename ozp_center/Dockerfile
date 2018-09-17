FROM node:6.12.3


# Pre-install

WORKDIR /usr/local/share
RUN wget -q https://github.com/medium/phantomjs/releases/download/v1.9.19/phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    tar jxf phantomjs-1.9.8-linux-x86_64.tar.bz2 && \
    ln -s /usr/local/share/phantomjs-1.9.8-linux-x86_64/ /usr/local/share/phantomjs && \
    ln -s /usr/local/share/phantomjs/bin/phantomjs /usr/local/bin/phantomjs


# Configuration

EXPOSE 8000

WORKDIR /app/ozp-center

CMD npm prune && \
    npm install && \
    npm run start
