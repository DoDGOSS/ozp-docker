FROM node:6.12.3

# Pre-install
RUN npm install --quiet --progress=false -g bower@1.3.12 > /dev/null

# Dependencies

WORKDIR /app/lib
COPY lib .

WORKDIR /app/lib/ozp-iwc
RUN npm install --progress=false
RUN bower install --quiet --allow-root
RUN npm run build


# Application

WORKDIR /app/ozp-demo-apps

COPY ozp-demo-apps/package.json .
RUN npm install --quiet --progress=false

COPY ozp-demo-apps/bower.json ozp-demo-apps/.bowerrc ./
RUN bower install --quiet --allow-root

COPY ozp-demo-apps .

RUN mv ./app ./demo_apps

# http-server with XSS header added
RUN mv http-server node_modules/http-server/bin/http-server

# Configuration

EXPOSE 8000

CMD npm run start
